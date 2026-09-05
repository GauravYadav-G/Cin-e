import "server-only";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { Pool } from "pg";

type SqlValue = string | number | null;
type DbGlobals = typeof globalThis & {
  cinePool?: Pool;
  cineSqlite?: DatabaseSync;
  cineInit?: Promise<void>;
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
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_SQLITE_PREVIEW !== "true"
  ) {
    throw new Error(
      "Set DATABASE_URL for production, or ALLOW_SQLITE_PREVIEW=true for a local preview.",
    );
  }
  if (!globals.cineSqlite) {
    mkdirSync(resolve(".data"), { recursive: true });
    globals.cineSqlite = new DatabaseSync(resolve(".data/cine.sqlite"));
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
  globals.cineInit ??= (async () => {
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
  })().catch((error) => {
    globals.cineInit = undefined;
    throw error;
  });
  return globals.cineInit;
}
