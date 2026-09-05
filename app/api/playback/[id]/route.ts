import { getFilm } from "@/lib/catalog";
import { getTorrentSource } from "@/lib/torrent-source.mjs";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const film = getFilm(id);
  if (!film) return Response.json({ error: "Film not found" }, { status: 404 });
  let stream = null;
  let streamError = null;
  try {
    if (getTorrentSource(id))
      stream = {
        url: `/api/stream/${id}`,
        statusUrl: `/api/stream/${id}?status=1`,
      };
  } catch {
    streamError =
      "This film’s magnet configuration is invalid. Update its server-side source.";
  }
  return Response.json(
    {
      title: film.title,
      youtubeId:
        film.youtubeId && /^[A-Za-z0-9_-]{11}$/.test(film.youtubeId)
          ? film.youtubeId
          : null,
      stream,
      streamError,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
