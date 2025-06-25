// src/lib/database.ts
import type { D1Database } from '@cloudflare/workers-types';

export interface Letter {
	id: number;
	mailbox_id: number;
	content: string;
	to: string;
	from: string;
	created_at: Date;
}

export interface Mailbox {
	id: number;
	name: string;
	password: string;
}

export class Database {
	db: D1Database;

	constructor(db: D1Database) {
		this.db = db;
	}

	async verifyMailboxPassword(mailboxName: string, password: string): Promise<boolean> {
		const result = await this.db
			.prepare('SELECT password FROM mailboxes WHERE name = ?')
			.bind(mailboxName)
			.first();

		if (!result) {
			return false; // Mailbox doesn't exist
		}

		return result.password === password;
	}

	async getLettersInMailbox(mailboxName: string): Promise<Letter[]> {
		return await this.db
			.prepare(
				'SELECT * FROM letters WHERE mailbox_id = (SELECT id FROM mailboxes WHERE name = ?) ORDER BY created_at DESC'
			)
			.bind(mailboxName)
			.all()
			.then((data) =>
				data.results.map((r) => ({ ...r, created_at: new Date(r.created_at + 'Z') }))
			);
	}

	async insertLetter(
		mailboxName: string,
		content: string,
		to: string,
		from: string
	): Promise<void> {
		await this.db
			.prepare(
				'INSERT INTO letters (mailbox_id, content, `to`, `from`) VALUES ((SELECT id FROM mailboxes WHERE name = ?), ?, ?, ?)'
			)
			.bind(mailboxName, content, to, from)
			.run();
	}
}
