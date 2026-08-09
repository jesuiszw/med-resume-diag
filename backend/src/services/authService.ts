/**
 * AuthService — User registration, login, and JWT token management.
 *
 * Uses:
 *   - better-sqlite3 for user storage (file-based, no external DB needed)
 *   - bcryptjs for password hashing (10 salt rounds)
 *   - jsonwebtoken for JWT tokens (7-day expiry)
 *
 * API:
 *   - registerUser(phone, password) → { user, token }
 *   - loginUser(phone, password) → { user, token }
 *   - findUserById(id) → user | null
 *   - generateToken(user) → JWT string
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/setup';

/** JWT secret from environment. */
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

/** JWT expiration: 7 days. */
const JWT_EXPIRES_IN = '7d';

/** Salt rounds for bcrypt password hashing. */
const SALT_ROUNDS = 10;

/** User interface (returned to frontend, never includes password_hash). */
export interface SafeUser {
  id: number;
  phone: string;
  nickname: string | null;
  createdAt: string;
}

/** Row type from SQLite (includes password_hash, never exposed to frontend). */
interface UserRow {
  id: number;
  phone: string;
  password_hash: string;
  nickname: string | null;
  created_at: string;
}

/**
 * Converts a database row to a safe user object (strips password_hash).
 */
function toSafeUser(row: UserRow): SafeUser {
  return {
    id: row.id,
    phone: row.phone,
    nickname: row.nickname,
    createdAt: row.created_at,
  };
}

/**
 * Validates a Chinese mobile phone number (11 digits starting with 1).
 */
function isValidPhoneNumber(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * Validates password strength.
 * Minimum: 6 characters. No maximum (bcrypt handles truncation).
 */
function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Generates a JWT token for the given user.
 *
 * @param user - The user object (id, phone, nickname)
 * @returns JWT token string
 */
export function generateToken(user: SafeUser): string {
  return jwt.sign(
    { userId: user.id, phone: user.phone },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Registers a new user.
 *
 * @param phone - Chinese mobile number (11 digits)
 * @param password - Plain text password (min 6 chars)
 * @returns Object with user (safe) and token, or throws on validation/duplicate
 * @throws Error with Chinese message on validation failure or duplicate phone
 */
export function registerUser(phone: string, password: string): { user: SafeUser; token: string } {
  // Validate inputs
  if (!isValidPhoneNumber(phone)) {
    throw new Error('手机号格式不正确');
  }
  if (!isValidPassword(password)) {
    throw new Error('密码长度不能少于6位');
  }

  // Check if phone is already registered
  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone) as { id: number } | undefined;
  if (existing) {
    throw new Error('该手机号已注册');
  }

  // Hash password
  const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

  // Insert user
  const result = db.prepare(
    'INSERT INTO users (phone, password_hash) VALUES (?, ?)'
  ).run(phone, passwordHash);

  // Fetch the created user
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as UserRow;
  const user = toSafeUser(row);
  const token = generateToken(user);

  console.log(`[Auth] New user registered: ${phone} (id: ${user.id})`);
  return { user, token };
}

/**
 * Logs in a user with phone + password.
 *
 * @param phone - Chinese mobile number
 * @param password - Plain text password
 * @returns Object with user (safe) and token
 * @throws Error with Chinese message on invalid credentials
 */
export function loginUser(phone: string, password: string): { user: SafeUser; token: string } {
  // Find user by phone
  const row = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone) as UserRow | undefined;

  if (!row) {
    throw new Error('手机号或密码不正确');
  }

  // Verify password
  if (!bcrypt.compareSync(password, row.password_hash)) {
    throw new Error('手机号或密码不正确');
  }

  const user = toSafeUser(row);
  const token = generateToken(user);

  console.log(`[Auth] User logged in: ${phone} (id: ${user.id})`);
  return { user, token };
}

/**
 * Finds a user by ID (for JWT middleware to attach to req.user).
 *
 * @param id - User ID
 * @returns Safe user object, or null if not found
 */
export function findUserById(id: number): SafeUser | null {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
  if (!row) {
    return null;
  }
  return toSafeUser(row);
}

/**
 * Verifies a JWT token and returns the decoded payload.
 *
 * @param token - JWT token string
 * @returns Decoded payload { userId, phone } or null if invalid
 */
export function verifyToken(token: string): { userId: number; phone: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; phone: string };
    return decoded;
  } catch {
    return null;
  }
}
