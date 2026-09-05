import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import { getFilm } from "@/lib/catalog";
import { paletteFromPixels, type ArtworkPalette } from "@/lib/artwork-palette";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const cache = new Map<string, Promise<ArtworkPalette>>();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const film = getFilm((await params).id);
  if (!film) return Response.json({ error: "Film not found" }, { status: 404 });
  const artwork =
    new URL(request.url).searchParams.get("art") === "poster"
      ? film.image
      : film.backdrop;
  // Only catalog-owned local artwork is readable; callers cannot supply file paths.
  if (!artwork.startsWith("/images/"))
    return Response.json({ error: "Artwork unavailable" }, { status: 404 });
  try {
    const file = resolve(process.cwd(), "public", `.${artwork.split("?")[0]}`);
    const info = await stat(file);
    const key = `${file}:${info.mtimeMs}:${info.size}`;
    let palette = cache.get(key);
    if (!palette) {
      if (cache.size >= 128) cache.delete(cache.keys().next().value!);
      palette = sharp(file)
        .rotate()
        .resize(48, 48, { fit: "cover" })
        .removeAlpha()
        .toColourspace("srgb")
        .raw()
        .toBuffer()
        .then(paletteFromPixels);
      cache.set(key, palette);
      palette.catch(() => cache.delete(key));
    }
    return Response.json(
      { artwork, tokens: await palette },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Artwork palette unavailable" },
      { status: 503 },
    );
  }
}
