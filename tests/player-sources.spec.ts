import { test, expect } from "@playwright/test";
import path from "node:path";

test("player sources: only YouTube and Stream; missing magnet never falls back", async ({
  page,
}) => {
  await page.route("**/api/playback/arrival", (route) =>
    route.fulfill({
      json: { title: "Arrival", youtubeId: "tFMo3UJ4B4g", stream: null },
    }),
  );
  await page.route("https://www.youtube.com/embed/**", (route) =>
    route.fulfill({
      body: "<html><body>YouTube test frame</body></html>",
      contentType: "text/html",
    }),
  );
  await page.goto("/collection?film=arrival&play=1");
  const modes = page.getByRole("group", { name: "Playback source" });
  await expect(modes.getByRole("button")).toHaveCount(2);
  await expect(page.locator(".youtube-frame")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/tFMo3UJ4B4g/,
  );
  await modes.getByRole("button", { name: "Stream", exact: true }).click();
  await expect(page.locator(".player-dialog").getByRole("alert")).toContainText(
    "No magnet stream is configured for this film",
  );
  await expect(page.locator("video, .video-stage iframe")).toHaveCount(0);
  await expect(page.getByText("Webtor.io", { exact: true })).toHaveCount(0);
  await modes.getByRole("button", { name: "YouTube", exact: true }).click();
  await expect(page.locator(".youtube-frame")).toBeVisible();
});

test("player sources: stream waits for server metadata, plays server bytes, and cleans up on switch", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.route("https://www.youtube.com/embed/**", (route) =>
    route.fulfill({ body: "<html></html>", contentType: "text/html" }),
  );
  await page.route("**/api/playback/arrival", (route) =>
    route.fulfill({
      json: {
        title: "Arrival",
        youtubeId: "tFMo3UJ4B4g",
        stream: {
          url: "/api/stream/arrival",
          statusUrl: "/api/stream/arrival?status=1",
        },
      },
    }),
  );
  let calls = 0;
  await page.route("**/api/stream/arrival?status=1", (route) =>
    route.fulfill({
      json: {
        state: ++calls < 2 ? "connecting" : "ready",
        peers: 1,
        downloadSpeed: 1024,
        fileName: "feature.mp4",
        transcode: false,
      },
    }),
  );
  // Bytes are supplied by a test fixture only; application source resolution never uses it.
  await page.route(/\/api\/stream\/arrival$/, (route) =>
    route.fulfill({
      path: path.resolve("public/media/demo.mp4"),
      contentType: "video/mp4",
    }),
  );
  await page.goto("/collection?film=arrival&play=1");
  await expect(
    page.getByText("Connecting to torrent peers on the server…"),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator("video")
        .evaluate((video: HTMLVideoElement) => video.currentTime),
    )
    .toBeGreaterThan(0);
  await expect(page.locator("video")).toHaveAttribute(
    "src",
    "/api/stream/arrival",
  );
  await page.screenshot({
    path: "test-results/player-two-sources.png",
    fullPage: true,
  });
  await page
    .getByRole("group", { name: "Playback source" })
    .getByRole("button", { name: "YouTube", exact: true })
    .click();
  await expect(page.locator("video")).toHaveCount(0);
  await expect(page.locator(".youtube-frame")).toBeVisible();
  expect(
    requests.some((url) =>
      /\/media\/demo|webtor\.io|webtorrent\.min|nhdapi/.test(url),
    ),
  ).toBe(false);
});

test("player sources: server failure stays an error, never another film", async ({
  page,
}) => {
  await page.route("**/api/playback/arrival", (route) =>
    route.fulfill({
      json: {
        title: "Arrival",
        youtubeId: "tFMo3UJ4B4g",
        stream: {
          url: "/api/stream/arrival",
          statusUrl: "/api/stream/arrival?status=1",
        },
      },
    }),
  );
  await page.route("**/api/stream/arrival?status=1", (route) =>
    route.fulfill({
      status: 503,
      json: { error: "Torrent server unavailable" },
    }),
  );
  await page.goto("/collection?film=arrival&play=1");
  await expect(page.locator(".player-dialog").getByRole("alert")).toHaveText(
    "Torrent server unavailable",
  );
  await expect(page.locator("video")).not.toHaveAttribute("src", /./);
  await expect(
    page.getByRole("button", { name: "Try again", exact: true }),
  ).toBeVisible();
});

test("player sources: API exposes only per-film YouTube and server stream information", async ({
  request,
}) => {
  const response = await request.get("/api/playback/arrival");
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.youtubeId).toBe("tFMo3UJ4B4g");
  expect(data).not.toHaveProperty("url");
  expect(data).not.toHaveProperty("demo");
  expect(data).not.toHaveProperty("magnet");
  expect(JSON.stringify(data)).not.toMatch(/Sintel|Big Buck Bunny|magnet:\?/i);
  expect((await request.get("/api/stream/not-a-film")).status()).toBe(404);
});
