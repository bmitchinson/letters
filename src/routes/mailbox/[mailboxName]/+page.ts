export async function load({ params }) {
	// if params.password, use to access mailbox contents, otherwise contents == null + page prompts for password

	return {
		mailboxName: params.mailboxName,
		mailboxContents: null
	};
}
