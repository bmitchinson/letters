import { Database } from '$lib/database';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ params, platform, cookies }) {
	const db = new Database(platform.env.DB);
	const sessionKey = `mailbox_auth_${params.mailboxName}`;
	const isAuthenticated = cookies.get(sessionKey) === 'true';

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

		// Set authentication cookie
		const sessionKey = `mailbox_auth_${params.mailboxName}`;
		cookies.set(sessionKey, 'true', {
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
		const isAuthenticated = cookies.get(sessionKey) === 'true';

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
