export type Library = {
  name: string;
  email: string | null;
  saved: string[];
  progress: { film_id: string; seconds: number; duration: number }[];
  preferences: { bio: string; favoriteGenres: string[]; avatar: string };
};
