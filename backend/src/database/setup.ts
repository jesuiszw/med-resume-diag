/**
 * SQLite database setup for user management.
 *
 * Uses better-sqlite3 (synchronous, fast, file-based — perfect for MVP).
 * Database file: backend/data/users.db
 *
 * Tables:
 *   users — id, phone, password_hash, nickname, created_at
 */

import Database, { Database as DBType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

/** Ensure the data directory exists. */
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/** Database file path. */
const dbPath = path.join(dataDir, 'users.db');

/** Database instance (singleton). */
const db: DBType = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

/**
 * Initialize the users table if it doesn't exist.
 */
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    nickname TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// Create index on phone for fast lookups
db.exec(`CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)`);

console.log(`[Database] SQLite initialized at ${dbPath}`);

export default db;
