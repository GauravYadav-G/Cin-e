import "server-only";
import { cookies } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import { initDb, query } from "./db";

export async function viewer() {
  await initDb();
  const jar = await cookies();
  const existing = jar.get("cine_session")?.value;
  if (existing && /^[a-f0-9]{64}$/.test(existing)) {
    const [signedIn] = await query<{ id: string; name: string; email: string }>(
      `SELECT v.id, v.name, a.email FROM auth_sessions s JOIN viewers v ON v.id = s.viewer_id
       JOIN accounts a ON a.viewer_id = v.id WHERE s.token_hash = $1 AND s.expires_at > $2`,
      [createHash("sha256").update(existing).digest("hex"), Date.now()],
    );
    if (signedIn) return signedIn;
    const found = await query<{ id: string; name: string }>(
      "SELECT id, name FROM viewers WHERE id = $1 AND NOT EXISTS (SELECT 1 FROM accounts WHERE viewer_id = viewers.id)",
      [existing],
    );
    if (found[0]) return { ...found[0], email: null };
  }
  const id = randomBytes(32).toString("hex");
  await query("INSERT INTO viewers (id) VALUES ($1)", [id]);
  jar.set("cine_session", id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === "production",
  });
  return { id, name: "Film lover", email: null };
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";
  try {
    const originUrl = new URL(origin);
    // The internal Next.js URL can use 0.0.0.0. Host is the browser's destination.
    const host = request.headers.get("host") || new URL(request.url).host;
    return (
      ["http:", "https:"].includes(originUrl.protocol) &&
      originUrl.host === host
    );
  } catch {
    return false;
  }
}

export function apiError(error: unknown) {
  console.error(
    "CINÉ API:",
    error instanceof Error ? error.message : "Unknown error",
  );
  return Response.json(
    { error: "We couldn’t save your changes. Please try again." },
    { status: 500 },
  );
}
