import { getFilm } from "@/lib/catalog";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!getFilm(id))
    return Response.json({ error: "Film not found" }, { status: 404 });
  // Replace this provider with signed, entitlement-checked CDN URLs for a paid catalog.
  return Response.json(
    {
      url: process.env.STREAM_URL || "/media/demo.mp4",
      demo: !process.env.STREAM_URL,
      title: process.env.STREAM_URL
        ? getFilm(id)!.title
        : "Big Buck Bunny · Blender Foundation",
      captions: process.env.STREAM_URL ? null : "/media/demo.vtt",
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
