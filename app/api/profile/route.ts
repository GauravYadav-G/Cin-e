import { viewer, sameOrigin, apiError } from "@/lib/session";
import { query } from "@/lib/db";
import { films } from "@/lib/catalog";
import { profilePreferences } from "@/lib/profile";
export const runtime = "nodejs";
export async function PATCH(request: Request) {
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
    typeof body.name !== "string" ||
    body.name.trim().length < 1 ||
    body.name.trim().length > 40
  ) {
    return Response.json(
      { error: "Please use a name between 1 and 40 characters." },
      { status: 400 },
    );
  }
  const genres = new Set(films.flatMap((film) => film.genres));
  if (
    (body.bio !== undefined &&
      (typeof body.bio !== "string" || body.bio.trim().length > 160)) ||
    (body.favoriteGenres !== undefined &&
      (!Array.isArray(body.favoriteGenres) ||
        body.favoriteGenres.length > 5 ||
        body.favoriteGenres.some(
          (genre: unknown) => typeof genre !== "string" || !genres.has(genre),
        ))) ||
    (body.avatar !== undefined &&
      !["amber", "sage", "ocean", "rose", "violet"].includes(body.avatar))
  ) {
    return Response.json(
      {
        error:
          "Use a bio of up to 160 characters, up to five valid genres, and a valid avatar color.",
      },
      { status: 400 },
    );
  }
  try {
    const user = await viewer();
    const previous = await profilePreferences(user.id);
    const preferences = {
      bio: body.bio?.trim() ?? previous.bio,
      favoriteGenres: body.favoriteGenres
        ? [...new Set(body.favoriteGenres)]
        : previous.favoriteGenres,
      avatar: body.avatar ?? previous.avatar,
    };
    await query("UPDATE viewers SET name = $1 WHERE id = $2", [
      body.name.trim(),
      user.id,
    ]);
    await query(
      `INSERT INTO profile_preferences (viewer_id, bio, favorite_genres, avatar) VALUES ($1, $2, $3, $4)
      ON CONFLICT (viewer_id) DO UPDATE SET bio = $2, favorite_genres = $3, avatar = $4`,
      [
        user.id,
        preferences.bio,
        JSON.stringify(preferences.favoriteGenres),
        preferences.avatar,
      ],
    );
    return Response.json({ name: body.name.trim(), preferences });
  } catch (error) {
    return apiError(error);
  }
}
