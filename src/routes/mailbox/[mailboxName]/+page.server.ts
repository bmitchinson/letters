import { Database } from '$lib/database';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ params, platform }) {
	const db = new Database(platform.env.DB);

	return {
		mailboxName: params.mailboxName,
		mailboxContents: await db.getLettersInMailbox(params.mailboxName)
	};
}

export const actions = {
	default: async ({ request, params, platform }) => {
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
		throw redirect(303, `/mailbox/${params.mailboxName}`);
	}
};
