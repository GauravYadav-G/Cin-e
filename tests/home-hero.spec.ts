import { expect, test } from "@playwright/test";

test("hero changes only after incoming artwork loads and keeps two layers", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.getByRole("region", { name: "Featured films" });
  await hero.getByRole("button", { name: "Pause slideshow" }).click();
  await hero
    .getByRole("button", { name: "Switch to Oppenheimer", exact: true })
    .click();
  await expect(
    hero.getByRole("link", { name: "Discover Oppenheimer", exact: true }),
  ).toBeVisible();
  await expect(hero.locator(".home-art-layer")).toHaveCount(2);
  await expect
    .poll(() =>
      hero
        .locator(".home-art-layer.is-visible img")
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    )
    .toBeTruthy();
  await hero
    .getByRole("button", { name: "Switch to Interstellar", exact: true })
    .click();
  await expect(
    hero.getByRole("link", { name: "Discover Interstellar", exact: true }),
  ).toBeVisible();
  await expect(hero.locator(".home-art-layer")).toHaveCount(2);
  await page.screenshot({
    path: "test-results/home-refined.png",
    fullPage: true,
  });
});

test("failed artwork preserves the visible film and reduced motion stops autoplay", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/_next/image?*oppenheimer-wide*", (route) =>
    route.abort(),
  );
  await page.goto("/");
  const hero = page.getByRole("region", { name: "Featured films" });
  await expect(
    hero.getByRole("button", { name: "Pause slideshow" }),
  ).toHaveCount(0);
  await hero
    .getByRole("button", { name: "Switch to Oppenheimer", exact: true })
    .click();
  await expect(hero.getByRole("status")).toContainText(
    "Artwork could not load",
  );
  await expect(
    hero.getByRole("link", { name: "Discover Dune: Part Two", exact: true }),
  ).toBeVisible();
  expect(
    await hero
      .locator(".home-art-layer.is-visible")
      .evaluate((node) =>
        parseFloat(getComputedStyle(node).transitionDuration),
      ),
  ).toBeLessThanOrEqual(0.00001);
});
