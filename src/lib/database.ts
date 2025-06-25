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

	// async createMailbox(name: string, password: string) {
	// 	return await this.db
	// 		.prepare('INSERT INTO mailboxes (name, password) VALUES (?, ?)')
	// 		.bind(name, password)
	// 		.run();
	// }
}
