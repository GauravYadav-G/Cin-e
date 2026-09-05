import { readFile } from "node:fs/promises";
import pg from "pg";
try {
  process.loadEnvFile(".env.local");
} catch {
  /* Environment can also be supplied by the host. */
}
if (!process.env.DATABASE_URL)
  throw new Error(
    "Set DATABASE_URL in .env.local before running the PostgreSQL migration.",
  );
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
  await pool.query(
    await readFile(new URL("../database/schema.sql", import.meta.url), "utf8"),
  );
  console.log("CINÉ PostgreSQL schema is ready.");
} finally {
  await pool.end();
}
