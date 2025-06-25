import { Database } from '$lib/database';

export async function load({ params, platform }) {
	const db = new Database(platform.env.DB);

	return {
		mailboxName: params.mailboxName,
		mailboxContents: await db.getLettersInMailbox(params.mailboxName)
	};
}
