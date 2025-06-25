import { Database } from '$lib/database';
import { fail, redirect } from '@sveltejs/kit';

// Utility functions for signing and verifying cookies
async function signCookieValue(value: string, secret: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);

	const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
	const signatureHex = Array.from(new Uint8Array(signature))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	return `${value}.${signatureHex}`;
}

async function verifyCookieValue(signedValue: string, secret: string): Promise<string | null> {
	const parts = signedValue.split('.');
	if (parts.length !== 2) return null;

	const [value, signatureHex] = parts;

	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['verify']
	);

	const signature = new Uint8Array(
		signatureHex.match(/.{2}/g)?.map((byte) => parseInt(byte, 16)) || []
	);

	const isValid = await crypto.subtle.verify(
		'HMAC',
		key,
		signature,
		new TextEncoder().encode(value)
	);

	return isValid ? value : null;
}

export async function load({ params, platform, cookies }) {
	const db = new Database(platform.env.DB);
	const sessionKey = `mailbox_auth_${params.mailboxName}`;
	const signedCookieValue = cookies.get(sessionKey);

	let isAuthenticated = false;
	if (signedCookieValue) {
		const verifiedValue = await verifyCookieValue(signedCookieValue, platform.env.COOKIE_SECRET);
		isAuthenticated = verifiedValue === 'true';
	}

	if (!isAuthenticated) {
		return {
			mailboxName: params.mailboxName,
			authMissing: true,
			mailboxContents: []
		};
	}

	return {
		mailboxName: params.mailboxName,
		authMissing: false,
		mailboxContents: await db.getLettersInMailbox(params.mailboxName)
	};
}

export const actions = {
	authenticate: async ({ request, params, platform, cookies }) => {
		const data = await request.formData();
		const password = data.get('password');

		if (!password) {
			return fail(400, { error: 'Password is required' });
		}

		const db = new Database(platform.env.DB);
		const isValid = await db.verifyMailboxPassword(params.mailboxName, password.toString());

		if (!isValid) {
			return fail(401, { error: 'invalid password' });
		}

		// Set signed authentication cookie
		const sessionKey = `mailbox_auth_${params.mailboxName}`;
		const signedValue = await signCookieValue('true', platform.env.COOKIE_SECRET);
		cookies.set(sessionKey, signedValue, {
			path: `/mailbox/${params.mailboxName}`,
			maxAge: 60 * 60 * 1, // 1 hours
			httpOnly: true,
			secure: true,
			sameSite: 'strict'
		});

		// Redirect to show the authenticated page
		return redirect(303, `/mailbox/${params.mailboxName}`);
	},

	logout: async ({ params, cookies }) => {
		const sessionKey = `mailbox_auth_${params.mailboxName}`;
		cookies.delete(sessionKey, { path: `/mailbox/${params.mailboxName}` });

		// Redirect to show the login prompt
		return redirect(303, `/mailbox/${params.mailboxName}`);
	},

	submitLetter: async ({ request, params, platform, cookies }) => {
		// Check authentication first
		const sessionKey = `mailbox_auth_${params.mailboxName}`;
		const signedCookieValue = cookies.get(sessionKey);

		let isAuthenticated = false;
		if (signedCookieValue) {
			const verifiedValue = await verifyCookieValue(signedCookieValue, platform.env.COOKIE_SECRET);
			isAuthenticated = verifiedValue === 'true';
		}

		if (!isAuthenticated) {
			return fail(401, { error: 'Authentication required' });
		}

		const data = await request.formData();
		const content = data.get('content');
		const to = data.get('to');
		const from = data.get('from');

		if (!content || !to || !from) {
			return fail(400, { missing: true });
		}

		const db = new Database(platform.env.DB);

		try {
			await db.insertLetter(params.mailboxName, content.toString(), to.toString(), from.toString());
		} catch {
			return fail(500, { error: 'Failed to submit letter' });
		}

		// Redirect to the same page to show the new letter
		return redirect(303, `/mailbox/${params.mailboxName}`);
	}
};
