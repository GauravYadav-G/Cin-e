import { randomUUID } from "node:crypto";
import { viewer, sameOrigin, apiError } from "@/lib/session";
import { query } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const categories = ["Playback", "My library", "My profile", "Something else"];
async function initSupport() {
  await query(`CREATE TABLE IF NOT EXISTS support_requests (
    id TEXT PRIMARY KEY, viewer_id TEXT NOT NULL REFERENCES viewers(id) ON DELETE CASCADE,
    category TEXT NOT NULL, subject TEXT NOT NULL, message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'saved', created_at TEXT NOT NULL
  )`);
}
export async function GET() {
  try {
    const user = await viewer();
    await initSupport();
    const requests = await query(
      "SELECT id, category, subject, message, status, created_at FROM support_requests WHERE viewer_id = $1 ORDER BY created_at DESC",
      [user.id],
    );
    return Response.json(
      { requests },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return apiError(error);
  }
}
async function body(request: Request) {
  const raw = await request.text();
  if (raw.length > 15000) throw new Error("Request too large");
  return JSON.parse(raw);
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  let data;
  try {
    data = await body(request);
  } catch {
    return Response.json(
      { error: "Please submit a valid request." },
      { status: 400 },
    );
  }
  if (
    !data ||
    typeof data.category !== "string" ||
    !categories.includes(data.category) ||
    typeof data.subject !== "string" ||
    data.subject.trim().length < 5 ||
    data.subject.trim().length > 120 ||
    typeof data.message !== "string" ||
    data.message.trim().length < 20 ||
    data.message.trim().length > 3000
  )
    return Response.json(
      {
        error:
          "Choose a topic, a subject of 5–120 characters, and a description of 20–3,000 characters.",
      },
      { status: 400 },
    );
  try {
    const user = await viewer();
    await initSupport();
    const count = await query<{ total: number | string }>(
      "SELECT COUNT(*) AS total FROM support_requests WHERE viewer_id = $1 AND created_at >= $2",
      [user.id, new Date(Date.now() - 3600000).toISOString()],
    );
    if (Number(count[0].total) >= 10)
      return Response.json(
        {
          error:
            "You’ve saved several requests recently. Please try again in an hour.",
        },
        { status: 429 },
      );
    const id = randomUUID();
    await query(
      "INSERT INTO support_requests (id, viewer_id, category, subject, message, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        id,
        user.id,
        data.category,
        data.subject.trim(),
        data.message.trim(),
        new Date().toISOString(),
      ],
    );
    return Response.json({ id }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
export async function PATCH(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  let data;
  try {
    data = await body(request);
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (
    !data ||
    typeof data.id !== "string" ||
    data.id.length !== 36 ||
    !["closed", "saved"].includes(data.status)
  )
    return Response.json({ error: "Invalid request status." }, { status: 400 });
  try {
    const user = await viewer();
    await initSupport();
    const updated = await query(
      "UPDATE support_requests SET status = $1 WHERE id = $2 AND viewer_id = $3 RETURNING id",
      [data.status, data.id, user.id],
    );
    if (!updated.length)
      return Response.json({ error: "Request not found." }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
