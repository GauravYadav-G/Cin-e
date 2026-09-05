import { viewer, sameOrigin, apiError } from "@/lib/session";
import { query } from "@/lib/db";
import { getFilm } from "@/lib/catalog";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (
    !body ||
    typeof body.filmId !== "string" ||
    !getFilm(body.filmId) ||
    typeof body.seconds !== "number" ||
    !Number.isFinite(body.seconds) ||
    body.seconds < 0 ||
    typeof body.duration !== "number" ||
    !Number.isFinite(body.duration) ||
    body.duration <= 0 ||
    body.seconds > body.duration ||
    body.duration > 86400
  ) {
    return Response.json(
      { error: "Invalid playback progress." },
      { status: 400 },
    );
  }
  try {
    const user = await viewer();
    await query(
      `INSERT INTO progress (viewer_id, film_id, seconds, duration) VALUES ($1, $2, $3, $4)
      ON CONFLICT (viewer_id, film_id) DO UPDATE SET seconds = $3, duration = $4, updated_at = CURRENT_TIMESTAMP`,
      [user.id, body.filmId, body.seconds, body.duration],
    );
    return Response.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
