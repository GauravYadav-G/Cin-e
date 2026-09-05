import "server-only";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { query } from "./db";

const derive = (password: string, salt: string) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(
      password,
      salt,
      64,
      { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key)),
    ),
  );
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${(await derive(password, salt)).toString("hex")}`;
}
export async function verifyPassword(password: string, stored?: string) {
  const [salt, expected] = (
    stored || `${"0".repeat(32)}:${"0".repeat(128)}`
  ).split(":");
  const actual = await derive(password, salt);
  return (
    expected?.length === 128 &&
    timingSafeEqual(actual, Buffer.from(expected, "hex")) &&
    Boolean(stored)
  );
}
export async function createSession(viewerId: string) {
  const token = randomBytes(32).toString("hex");
  await query(
    "INSERT INTO auth_sessions (token_hash, viewer_id, expires_at) VALUES ($1, $2, $3)",
    [
      createHash("sha256").update(token).digest("hex"),
      viewerId,
      Date.now() + 30 * 86400000,
    ],
  );
  (await cookies()).set("cine_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 86400,
  });
}
export async function revokeSession() {
  const jar = await cookies();
  const token = jar.get("cine_session")?.value;
  if (token)
    await query("DELETE FROM auth_sessions WHERE token_hash = $1", [
      createHash("sha256").update(token).digest("hex"),
    ]);
  jar.delete("cine_session");
}
export async function allowAuthAttempt(email: string) {
  const key = createHash("sha256").update(email).digest("hex");
  const now = Date.now();
  const [row] = await query<{ attempts: number }>(
    `INSERT INTO auth_limits (key, attempts, reset_at) VALUES ($1, 1, $2)
    ON CONFLICT (key) DO UPDATE SET attempts = CASE WHEN auth_limits.reset_at < $3 THEN 1 ELSE auth_limits.attempts + 1 END,
    reset_at = CASE WHEN auth_limits.reset_at < $3 THEN $2 ELSE auth_limits.reset_at END RETURNING attempts`,
    [key, now + 15 * 60000, now],
  );
  return row.attempts <= 8;
}
