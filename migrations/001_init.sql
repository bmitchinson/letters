-- npx wrangler d1 migrations apply letters_db
  -- (to erase local: rm -f .wrangler/state/v3/d1/miniflare-D1DatabaseObject)
-- npx wrangler d1 migrations apply letters_db --remote

/*
npx wrangler d1 execute letters_db --command \
"INSERT INTO mailboxes (name, password) VALUES ('maeve', 'exampleexample') ON CONFLICT(name) DO UPDATE SET password=excluded.password;" \
--remote
*/

CREATE TABLE mailboxes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE letters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mailbox_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  `to` TEXT,
  `from` TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mailbox_id) REFERENCES mailboxes(id)
);

INSERT INTO mailboxes (name, password) VALUES ('public', 'demo');

INSERT INTO letters (mailbox_id, content, `to`, `from`) VALUES 
  ((SELECT id FROM mailboxes WHERE name = 'public'), 'Hello Bob! Hope you are doing well. Looking forward to our meeting next week.', 'Bob', 'Alice'),
  ((SELECT id FROM mailboxes WHERE name = 'public'), 'Hi Alice! Thanks for your message. I am excited about our upcoming collaboration.', 'Alice', 'Bob');