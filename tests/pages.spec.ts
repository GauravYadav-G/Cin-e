import { mockServerVideo } from "./stream-fixture";
import { films } from "../lib/catalog";
import { saveReferenceFilms } from "./focus-fixture";
import { test, expect } from "@playwright/test";

test("home connects the full discovery flow and preserves old film URLs", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await saveReferenceFilms(page);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Some stories stay with you." }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".home-art")
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
    )
    .toBeTruthy();
  await page.screenshot({ path: "test-results/home-page.png", fullPage: true });
  await page
    .getByRole("button", { name: "Switch to Dune: Part Two", exact: true })
    .click();
  await page.getByRole("link", { name: "Discover Dune: Part Two" }).click();
  await expect(page).toHaveURL(/collection\?film=dune-part-two/);
  await expect(
    page.getByRole("button", { name: "Play Dune: Part Two", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "CINÉ home", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Some stories stay with you." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Enter your collection", exact: true })
    .click();
  await expect(page.locator(".film-strip")).toHaveCount(7);
  await page.goto("/?film=arrival");
  await expect(page).toHaveURL(/collection\?film=arrival/);
  expect(errors).toEqual([]);
});

test("browse filters, empty state, saved library and account stay connected", async ({
  page,
}) => {
  await page.goto("/browse?genre=Sci-fi");
  await expect(page.locator(".portal-film-card")).toHaveCount(
    films.filter((film) => film.genres.includes("Sci-fi")).length,
  );
  await page.getByRole("button", { name: "All films", exact: true }).click();
  await expect(page.locator(".portal-film-card")).toHaveCount(films.length);
  await page.getByLabel("Search the film library").fill("Amy Adams");
  await expect(page.locator(".portal-film-card")).toHaveCount(1);
  await page.getByLabel("Search the film library").fill("no matching film");
  await expect(
    page.getByRole("heading", { name: "No films in this frame." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(
    page.getByRole("button", { name: "Save Arrival", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Save Arrival", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Arrival added");
  await page.goto("/library");
  await expect(page.locator(".portal-film-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Remove Arrival", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "A great film is worth saving." }),
  ).toBeVisible();
  await page.goto("/account");
  await expect(page.getByLabel("What should we call you?")).toBeEnabled();
  await page.getByLabel("What should we call you?").fill("Cinema fan");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("updated");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Cinema fan", exact: true }),
  ).toBeVisible();
});

test("support search, categories, FAQs and guide links work", async ({
  page,
}) => {
  await page.goto("/support");
  await expect(
    page.getByRole("heading", {
      name: "A little help. Then back to the story.",
    }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/support-page.png",
    fullPage: true,
  });
  await page.getByLabel("Search help articles").fill("unfindable phrase");
  await expect(
    page.getByRole("heading", { name: "No answers in this frame." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all guides" }).click();
  await expect(page.locator(".help-article-grid > a")).toHaveCount(6);
  await page
    .locator(".genre-tabs")
    .getByRole("button", { name: "Playback", exact: true })
    .click();
  await expect(page.locator(".help-article-grid > a")).toHaveCount(2);
  await page.getByRole("link", { name: /When a preview won’t play/ }).click();
  await expect(page).toHaveURL(/support\/playback-help/);
  await expect(
    page.getByRole("heading", { name: "Try the play control" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "All help articles", exact: true })
    .click();
  await page
    .getByText("Do I need an account to get started?", { exact: true })
    .click();
  await expect(
    page
      .getByText("No. A guest profile is created for this browser.", {
        exact: false,
      })
      .first(),
  ).toBeVisible();
});

test("support request creates a persisted record and can be closed and reopened", async ({
  page,
}) => {
  await page.goto("/support/contact");
  await page.getByLabel("What do you need help with?").selectOption("Playback");
  await page
    .getByLabel("Give your request a title")
    .fill("The preview paused unexpectedly");
  await page
    .getByLabel("Tell us a little more")
    .fill(
      "On my laptop in Chrome, the Arrival sample preview stopped when I changed tabs.",
    );
  await expect(
    page.getByText("This preview saves requests to your profile.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save request", exact: true }).click();
  await expect(page).toHaveURL(/support\/requests\?new=/);
  await expect(
    page.getByRole("heading", { name: "Your request is saved." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "The preview paused unexpectedly" }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/support-request.png",
    fullPage: true,
  });
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Close request" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close request" }).click();
  await expect(page.locator(".ticket-status")).toHaveText("closed");
  await page.getByRole("button", { name: "Reopen request" }).click();
  await expect(page.locator(".ticket-status")).toHaveText("saved");
});

test("support API validates input and prevents access to another viewer’s request", async ({
  request,
  playwright,
}) => {
  expect(
    (
      await request.post("/api/support", {
        data: { category: "Playback", subject: "Short", message: "too short" },
      })
    ).status(),
  ).toBe(400);
  expect((await request.post("/api/support", { data: null })).status()).toBe(
    400,
  );
  const response = await request.post("/api/support", {
    data: {
      category: "Playback",
      subject: "My sample playback question",
      message: "A valid support message for testing session isolation.",
    },
  });
  expect(response.status()).toBe(201);
  const { id } = await response.json();
  const second = await playwright.request.newContext({
    baseURL: process.env.TEST_BASE_URL || "http://localhost:3000",
  });
  expect((await (await second.get("/api/support")).json()).requests).toEqual(
    [],
  );
  expect(
    (
      await second.patch("/api/support", { data: { id, status: "closed" } })
    ).status(),
  ).toBe(404);
  expect(
    (
      await request.patch("/api/support", {
        data: { id, status: "closed" },
        headers: { origin: "https://untrusted.example" },
      })
    ).status(),
  ).toBe(403);
  await second.dispose();
});

test("new pages fit mobile screens and navigation is reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    "/",
    "/browse",
    "/library",
    "/account",
    "/support",
    "/support/contact",
    "/support/requests",
    "/support/your-profile",
    "/about",
  ]) {
    await page.goto(path);
    await expect(
      page.getByRole("navigation", { name: "Quick navigation" }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      path,
    ).toBeLessThanOrEqual(390);
  }
  await page.goto("/support");
  await page.screenshot({
    path: "test-results/support-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("navigation", { name: "Quick navigation" })
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Some stories stay with you." }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
});

test("missing guide gives a useful 404 with a route home", async ({ page }) => {
  const response = await page.goto("/support/missing-guide");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This story took a different turn." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to home", exact: true }).click();
  await expect(page).toHaveURL("/");
});

test("Home resumes saved playback and closing removes the autoplay URL", async ({
  page,
}) => {
  await mockServerVideo(page, "arrival");
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Save Arrival", exact: true }),
  ).toBeEnabled();
  await page.request.post("/api/progress", {
    data: { filmId: "arrival", seconds: 12, duration: 33 },
  });
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Stay in the story." }),
  ).toBeVisible();
  await page.locator(".resume-card").click();
  await expect(page).toHaveURL(/film=arrival&play=1/);
  await expect
    .poll(() =>
      page
        .locator("video")
        .evaluate((node: HTMLVideoElement) => node.currentTime),
    )
    .toBeGreaterThanOrEqual(12);
  await page.getByRole("button", { name: "Back to film" }).click();
  await expect(page.locator(".player-dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/collection\?film=arrival$/);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Continue watching", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".player-dialog")).toHaveCount(0);
});
