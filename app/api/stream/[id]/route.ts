import { getFilm } from "@/lib/catalog";
import { getTorrentSource } from "@/lib/torrent-source.mjs";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!getFilm(id))
    return Response.json({ error: "Film not found" }, { status: 404 });
  try {
    if (!getTorrentSource(id))
      return Response.json(
        { error: "No magnet stream is configured for this film." },
        { status: 404 },
      );
  } catch {
    return Response.json(
      { error: "Invalid server-side magnet configuration." },
      { status: 422 },
    );
  }
  const origin = (
    process.env.TORRENT_STREAM_URL || "http://127.0.0.1:8899"
  ).replace(/\/+$/, "");
  const status = new URL(request.url).searchParams.has("status");
  const headers = new Headers();
  if (request.headers.has("range"))
    headers.set("Range", request.headers.get("range")!);
  try {
    const upstream = await fetch(
      `${origin}/${status ? "status" : "stream"}/${encodeURIComponent(id)}`,
      { headers, cache: "no-store", signal: request.signal },
    );
    const out = new Headers({
      "Cache-Control": "private, no-store",
      "X-Accel-Buffering": "no",
    });
    for (const key of [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
    ]) {
      const value = upstream.headers.get(key);
      if (value) out.set(key, value);
    }
    return new Response(upstream.body, {
      status: upstream.status,
      headers: out,
    });
  } catch {
    return Response.json(
      {
        error:
          "The torrent server is unavailable. Start the app with npm run dev:all.",
      },
      { status: 503 },
    );
  }
}
