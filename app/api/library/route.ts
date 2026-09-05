import { viewer, sameOrigin, apiError } from "@/lib/session";
import { query } from "@/lib/db";
import { getFilm } from "@/lib/catalog";
import { profilePreferences } from "@/lib/profile";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const user = await viewer();
    const [saved, progress, preferences] = await Promise.all([
      query<{ film_id: string }>(
        "SELECT film_id FROM watchlist WHERE viewer_id = $1 ORDER BY created_at DESC",
        [user.id],
      ),
      query<{ film_id: string; seconds: number; duration: number }>(
        "SELECT film_id, seconds, duration FROM progress WHERE viewer_id = $1 ORDER BY updated_at DESC",
        [user.id],
      ),
      profilePreferences(user.id),
    ]);
    return Response.json(
      {
        name: user.name,
        email: user.email,
        saved: saved.map((row) => row.film_id),
        progress,
        preferences,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return apiError(error);
  }
}
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
    typeof body.saved !== "boolean"
  ) {
    return Response.json(
      { error: "Choose a valid film and saved state." },
      { status: 400 },
    );
  }
  try {
    const user = await viewer();
    if (body.saved)
      await query(
        "INSERT INTO watchlist (viewer_id, film_id) VALUES ($1, $2) ON CONFLICT (viewer_id, film_id) DO NOTHING",
        [user.id, body.filmId],
      );
    else
      await query(
        "DELETE FROM watchlist WHERE viewer_id = $1 AND film_id = $2",
        [user.id, body.filmId],
      );
    return Response.json({ saved: body.saved });
  } catch (error) {
    return apiError(error);
  }
}
