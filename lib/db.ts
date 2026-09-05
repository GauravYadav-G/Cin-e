import "server-only";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { Pool } from "pg";

type SqlValue = string | number | null;
type DbGlobals = typeof globalThis & {
  cinePool?: Pool;
  cineSqlite?: DatabaseSync;
  cineInitV3?: Promise<void>;
};
const globals = globalThis as DbGlobals;

export async function query<T extends Record<string, unknown>>(
  sql: string,
  values: SqlValue[] = [],
): Promise<T[]> {
  if (process.env.DATABASE_URL) {
    globals.cinePool ??= new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      connectionTimeoutMillis: 5000,
    });
    return (await globals.cinePool.query(sql, values)).rows as T[];
  }
  if (!globals.cineSqlite) {
    const isVercel = Boolean(process.env.VERCEL);
    const dbDir = isVercel ? "/tmp" : resolve(".data");
    mkdirSync(dbDir, { recursive: true });
    globals.cineSqlite = new DatabaseSync(`${dbDir}/cine.sqlite`);
    globals.cineSqlite.exec(
      "PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;",
    );
  }
  // Positional SQLite placeholders must follow SQL occurrence order.
  const ordered: SqlValue[] = [];
  const sqliteSql = sql.replace(/\$(\d+)/g, (_, index) => {
    ordered.push(values[Number(index) - 1]);
    return "?";
  });
  const statement = globals.cineSqlite.prepare(sqliteSql);
  if (/^\s*(SELECT|WITH)\b/i.test(sql) || /\bRETURNING\b/i.test(sql))
    return statement.all(...ordered) as T[];
  statement.run(...ordered);
  return [];
}

export async function initDb() {
  globals.cineInitV3 ??= (async () => {
    await query(`CREATE TABLE IF NOT EXISTS viewers (
      id TEXT PRIMARY KEY, name TEXT NOT NULL DEFAULT 'Film lover',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
    await query(`CREATE TABLE IF NOT EXISTS watchlist (
      viewer_id TEXT NOT NULL REFERENCES viewers(id) ON DELETE CASCADE,
      film_id TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (viewer_id, film_id)
    )`);
    await query(`CREATE TABLE IF NOT EXISTS progress (
      viewer_id TEXT NOT NULL REFERENCES viewers(id) ON DELETE CASCADE,
      film_id TEXT NOT NULL, seconds REAL NOT NULL DEFAULT 0 CHECK (seconds >= 0),
      duration REAL NOT NULL DEFAULT 0 CHECK (duration >= 0),
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (viewer_id, film_id)
    )`);
    await query(`CREATE TABLE IF NOT EXISTS profile_preferences (
      viewer_id TEXT PRIMARY KEY REFERENCES viewers(id) ON DELETE CASCADE,
      bio TEXT NOT NULL DEFAULT '', favorite_genres TEXT NOT NULL DEFAULT '[]',
      avatar TEXT NOT NULL DEFAULT 'amber'
    )`);
    await query(`CREATE TABLE IF NOT EXISTS accounts (
      email TEXT PRIMARY KEY, viewer_id TEXT NOT NULL UNIQUE REFERENCES viewers(id) ON DELETE CASCADE,
      password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
    await query(`CREATE TABLE IF NOT EXISTS auth_sessions (
      token_hash TEXT PRIMARY KEY, viewer_id TEXT NOT NULL REFERENCES viewers(id) ON DELETE CASCADE,
      expires_at BIGINT NOT NULL
    )`);
    await query(`CREATE TABLE IF NOT EXISTS auth_limits (
      key TEXT PRIMARY KEY, attempts INTEGER NOT NULL, reset_at BIGINT NOT NULL
    )`);
  })().catch((error) => {
    globals.cineInitV3 = undefined;
    throw error;
  });
  return globals.cineInitV3;
}
