import "server-only";
import { query } from "./db";

export async function profilePreferences(viewerId: string) {
  const [row] = await query<{
    bio: string;
    favorite_genres: string;
    avatar: string;
  }>(
    "SELECT bio, favorite_genres, avatar FROM profile_preferences WHERE viewer_id = $1",
    [viewerId],
  );
  return {
    bio: row?.bio || "",
    favoriteGenres: row ? (JSON.parse(row.favorite_genres) as string[]) : [],
    avatar: row?.avatar || "amber",
  };
}
