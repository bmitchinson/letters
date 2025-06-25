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

export class Database {
	db: D1Database;

	constructor(db: D1Database) {
		this.db = db;
	}

	async getLettersInMailbox(mailboxName: string): Letter[] {
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
