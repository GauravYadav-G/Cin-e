import { mockServerVideo } from "./stream-fixture";
import { films } from "../lib/catalog";
import { test, expect } from "@playwright/test";

test("reduced motion keeps gallery and film detail immediately usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/collection");
  const poster = page.getByRole("button", {
    name: "Explore Dune: Part Two",
    exact: true,
  });
  await expect(poster).toHaveCSS("opacity", "1");
  await poster.click();
  await expect(page.locator(".detail-heading h1")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(page.locator(".film-detail")).toHaveCSS(
    "clip-path",
    "inset(0px)",
  );
  await page
    .getByRole("button", { name: "The collection", exact: true })
    .click();
  await expect(poster).toBeVisible();
});

test("reference gallery, hover, detail navigation and history", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/collection");
  await expect(
    page.getByRole("heading", { name: "A mind. An entire universe." }),
  ).toBeVisible();
  await expect(page.locator(".film-strip")).toHaveCount(7);
  const dune = page.getByRole("button", {
    name: "Explore Dune: Part Two",
    exact: true,
  });
  await dune.hover();
  await expect(dune).toHaveClass(/is-active/);
  await expect(dune.locator("img")).toHaveCSS(
    "filter",
    "grayscale(0) brightness(1)",
  );
  await page.screenshot({
    path: "test-results/gallery-desktop.png",
    fullPage: true,
  });
  await dune.click();
  await expect(page).toHaveURL(/film=dune-part-two/);
  await expect(
    page.getByRole("button", { name: "Play Dune: Part Two", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".detail-backdrop")
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    )
    .toBeTruthy();
  await expect(page.locator(".film-detail")).toHaveCSS("opacity", "1");
  await page.screenshot({
    path: "test-results/dune-detail.png",
    fullPage: true,
  });
  await page.goBack();
  await expect(page.locator(".film-shelf")).toBeVisible();
  expect(errors).toEqual([]);
});

test("search supports actors, genres and an empty state", async ({ page }) => {
  await page.goto("/collection");
  await page.getByRole("button", { name: "Search films", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search films and actors" })
    .fill("Zendaya");
  await expect(page.locator(".catalog-card")).toHaveCount(
    films.filter((film) =>
      film.cast.some((actor) => actor.name.includes("Zendaya")),
    ).length,
  );
  await page
    .getByRole("textbox", { name: "Search films and actors" })
    .fill("not-a-film");
  await expect(
    page.getByRole("heading", { name: "No films in this frame." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await page.getByRole("button", { name: "Thriller", exact: true }).click();
  await expect(page.locator(".catalog-card")).toHaveCount(
    films.filter((film) => film.genres.includes("Thriller")).length,
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("watchlist persists after reload and can be removed", async ({ page }) => {
  await page.goto("/collection?film=arrival");
  const add = page.getByRole("button", { name: "Add to my list", exact: true });
  await expect(add).toBeEnabled();
  await add.click();
  await expect(
    page.getByRole("button", { name: "In your list", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "In your list", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "My list", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Open Arrival", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Unsave Arrival", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "A great film is worth saving." }),
  ).toBeVisible();
});

test("guest profile name is saved in the database", async ({ page }) => {
  await page.goto("/collection");
  await page.getByRole("button", { name: "Your profile" }).click();
  await page.getByLabel("What should we call you?").fill("Shyam");
  await expect(
    page.getByRole("button", { name: "Save profile" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(
    page.getByRole("heading", { name: "Hello, Shyam." }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Your profile" }).click();
  await expect(
    page.getByRole("heading", { name: "Hello, Shyam." }),
  ).toBeVisible();
});

test("server stream video loads, plays, seeks and saves progress", async ({
  page,
}) => {
  await mockServerVideo(page, "dune-part-two");
  await page.goto("/collection?film=dune-part-two");
  await expect(
    page.getByRole("button", { name: "Add to my list" }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Play Dune: Part Two", exact: true })
    .click();
  const video = page.locator("video");
  await expect
    .poll(() => video.evaluate((node: HTMLVideoElement) => node.readyState))
    .toBeGreaterThanOrEqual(2);
  await expect
    .poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime))
    .toBeGreaterThan(0);
  await expect(video).toHaveAttribute("src", "/api/stream/dune-part-two");
  await video.evaluate((node: HTMLVideoElement) => {
    node.currentTime = 20;
    node.pause();
  });
  await page.getByRole("button", { name: "Back to film" }).click();
  await expect
    .poll(async () => {
      const response = await page.request.get("/api/library");
      const library = await response.json();
      return (
        library.progress.find(
          (entry: { film_id: string }) => entry.film_id === "dune-part-two",
        )?.seconds || 0
      );
    })
    .toBeGreaterThanOrEqual(20);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Continue watching" }),
  ).toBeVisible();
});

test("mobile gallery, detail and search do not overflow the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/collection");
  await expect(
    page.getByRole("button", { name: "Search films", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.screenshot({
    path: "test-results/gallery-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Explore Dune: Part Two", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Watch preview", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.screenshot({
    path: "test-results/detail-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Search films", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search films and actors" })
    .fill("Arrival");
  await expect(page.locator(".catalog-card")).toHaveCount(1);
});

test("API validates input and isolates guest libraries", async ({
  playwright,
  request,
}) => {
  expect(
    (
      await request.post("/api/library", {
        data: { filmId: "missing", saved: true },
      })
    ).status(),
  ).toBe(400);
  expect((await request.post("/api/library", { data: null })).status()).toBe(
    400,
  );
  expect(
    (
      await request.post("/api/library", {
        data: { filmId: "arrival", saved: true },
        headers: { origin: "https://untrusted.example" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/progress", {
        data: { filmId: "arrival", seconds: -1, duration: 60 },
      })
    ).status(),
  ).toBe(400);
  expect((await request.get("/api/playback/not-a-film")).status()).toBe(404);
  await request.get("/api/library");
  expect(
    (
      await request.post("/api/library", {
        data: { filmId: "arrival", saved: true },
      })
    ).ok(),
  ).toBeTruthy();
  const second = await playwright.request.newContext({
    baseURL: process.env.TEST_BASE_URL || "http://localhost:3000",
  });
  const library = await (await second.get("/api/library")).json();
  expect(library.saved).toEqual([]);
  await second.dispose();
});
