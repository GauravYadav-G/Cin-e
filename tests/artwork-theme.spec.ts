import { expect, test } from "@playwright/test";

function luminance(hex: string) {
  const rgb = hex
    .slice(1)
    .match(/../g)!
    .map((value) => parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("artwork palettes vary by film and maintain readable tonal pairs", async ({
  request,
}) => {
  const themes = [];
  for (const id of ["dune-part-two", "arrival", "interstellar"]) {
    const response = await request.get(`/api/theme/${id}`);
    expect(response.ok()).toBeTruthy();
    const theme = await response.json();
    themes.push(theme);
    for (const [foreground, background] of [
      ["--on-accent", "--accent"],
      ["--text", "--bg"],
      ["--muted", "--panel"],
      ["--on-accent-container", "--accent-container"],
    ]) {
      expect(
        contrast(theme.tokens[foreground], theme.tokens[background]),
      ).toBeGreaterThanOrEqual(4.5);
    }
  }
  expect(
    new Set(themes.map((theme) => theme.tokens["--accent"])).size,
  ).toBeGreaterThan(1);
  expect((await request.get("/api/theme/not-a-film")).status()).toBe(404);
});

test("home and film artwork update the theme, which persists onto support", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("region", { name: "Featured films" }).hover();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-artwork",
    /dune-two/,
  );
  const first = await page
    .locator("html")
    .evaluate((node) => node.style.getPropertyValue("--accent"));
  await page
    .getByRole("button", { name: "Switch to Interstellar", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-artwork",
    /interstellar/,
  );
  await expect
    .poll(() =>
      page
        .locator("html")
        .evaluate((node) => node.style.getPropertyValue("--accent")),
    )
    .not.toBe(first);
  await expect
    .poll(() =>
      page.locator(".home-hero .primary-button").evaluate((node) => {
        const hex = getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim();
        const rgb = hex
          .slice(1)
          .match(/../g)!
          .map((part) => parseInt(part, 16));
        return (
          getComputedStyle(node).backgroundColor === `rgb(${rgb.join(", ")})`
        );
      }),
    )
    .toBeTruthy();
  await expect(page.locator(".home-art-layer.is-visible")).toHaveCSS(
    "opacity",
    "1",
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "test-results/theme-home.png" });
  await page.goto("/collection?film=arrival");
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-artwork",
    /arrival-wide/,
  );
  const accent = await page
    .locator("html")
    .evaluate((node) => node.style.getPropertyValue("--accent"));
  await page.getByRole("link", { name: "Help & support" }).click();
  await expect(page).toHaveURL(/support/);
  expect(
    await page
      .locator("html")
      .evaluate((node) => node.style.getPropertyValue("--accent")),
  ).toBe(accent);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-artwork",
    /arrival-wide/,
  );
});

test("palette request failures preserve the current colors", async ({
  page,
}) => {
  await page.goto("/collection?film=arrival");
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-artwork",
    /arrival-wide/,
  );
  const accent = await page
    .locator("html")
    .evaluate((node) => node.style.getPropertyValue("--accent"));
  await page.route("**/api/theme/**", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  const response = page.waitForResponse((res) =>
    res.url().includes("/api/theme/dune-part-two"),
  );
  await page.goto("/collection?film=dune-part-two");
  await response;
  expect(
    await page
      .locator("html")
      .evaluate((node) => node.style.getPropertyValue("--accent")),
  ).toBe(accent);
  await expect(
    page.getByRole("button", { name: "Play Dune: Part Two", exact: true }),
  ).toBeVisible();
});
