import type { Page } from "@playwright/test";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { byteRange } from "../scripts/torrent-http.mjs";
/** Test-only HTTP fixture; the application has no sample source fallback. */
export async function mockServerVideo(page: Page, filmId: string) {
  await page.route(`**/api/playback/${filmId}`, (route) =>
    route.fulfill({
      json: {
        title: filmId,
        youtubeId: null,
        stream: {
          url: `/api/stream/${filmId}`,
          statusUrl: `/api/stream/${filmId}?status=1`,
        },
      },
    }),
  );
  await page.route(`**/api/stream/${filmId}?status=1`, (route) =>
    route.fulfill({
      json: {
        state: "ready",
        peers: 1,
        downloadSpeed: 100000,
        fileName: "feature.mp4",
        transcode: false,
      },
    }),
  );
  const video = await readFile(path.resolve("public/media/demo.mp4"));
  await page.route(new RegExp(`/api/stream/${filmId}$`), (route) => {
    const range = byteRange(route.request().headers().range, video.length);
    if (!range)
      return route.fulfill({
        status: 416,
        headers: { "Content-Range": `bytes */${video.length}` },
      });
    return route.fulfill({
      status: range.partial ? 206 : 200,
      contentType: "video/mp4",
      headers: {
        "Accept-Ranges": "bytes",
        ...(range.partial
          ? {
              "Content-Range": `bytes ${range.start}-${range.end}/${video.length}`,
            }
          : {}),
      },
      body: video.subarray(range.start, range.end + 1),
    });
  });
}
