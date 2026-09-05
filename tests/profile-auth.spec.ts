import { test, expect, request as apiRequest } from "@playwright/test";
import { films } from "../lib/catalog";
const password = "A-long-test-passphrase-42!";
const email = (label: string) =>
  `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`;

test("accounts sync their saved films and preferences across devices and stay isolated", async ({
  request,
  baseURL,
}) => {
  const address = email("sync");
  await request.get("/api/library");
  const oldGuest = await request.storageState();
  await request.post("/api/library", {
    data: { filmId: "arrival", saved: true },
  });
  await request.post("/api/progress", {
    data: { filmId: "arrival", seconds: 12, duration: 100 },
  });
  expect(
    (
      await request.post("/api/auth/register", {
        data: { email: address, password, name: "Mira" },
      })
    ).status(),
  ).toBe(201);
  expect(
    (
      await request.patch("/api/profile", {
        data: {
          name: "Mira",
          bio: "Science fiction evenings",
          favoriteGenres: ["Sci-fi"],
          avatar: "ocean",
        },
      })
    ).ok(),
  ).toBeTruthy();
  const second = await apiRequest.newContext({ baseURL });
  const unrelated = await apiRequest.newContext({ baseURL });
  const staleGuest = await apiRequest.newContext({
    baseURL,
    storageState: oldGuest,
  });
  try {
    expect(
      (
        await second.post("/api/auth/login", {
          data: { email: address, password },
        })
      ).ok(),
    ).toBeTruthy();
    const state = await (await second.get("/api/library")).json();
    expect(state).toMatchObject({
      name: "Mira",
      email: address,
      saved: ["arrival"],
      preferences: { avatar: "ocean", favoriteGenres: ["Sci-fi"] },
    });
    expect(state.progress[0].seconds).toBe(12);
    expect(JSON.stringify(state)).not.toContain("password_hash");
    expect((await (await staleGuest.get("/api/library")).json()).saved).toEqual(
      [],
    );
    await unrelated.post("/api/auth/register", {
      data: { email: email("other"), password, name: "Noah" },
    });
    await unrelated.post("/api/library", {
      data: {
        filmId: "dune",
        saved: true,
        viewerId: oldGuest.cookies[0].value,
      },
    });
    expect((await (await unrelated.get("/api/library")).json()).saved).toEqual([
      "dune",
    ]);
    expect((await (await second.get("/api/library")).json()).saved).toEqual([
      "arrival",
    ]);
    const token = await second.storageState();
    expect((await second.post("/api/auth/logout")).ok()).toBeTruthy();
    const replay = await apiRequest.newContext({
      baseURL,
      storageState: token,
    });
    expect((await (await replay.get("/api/library")).json()).email).toBeNull();
    await replay.dispose();
  } finally {
    await Promise.all([
      second.dispose(),
      unrelated.dispose(),
      staleGuest.dispose(),
    ]);
  }
});

test("password changes revoke other devices and authentication rejects invalid attempts", async ({
  request,
  baseURL,
}) => {
  const address = email("password");
  expect(
    (
      await request.post("/api/auth/register", {
        data: { email: address, password: "short", name: "Mira" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/auth/register", {
        data: { email: address, password, name: "Mira" },
        headers: { Origin: "https://other.example" },
      })
    ).status(),
  ).toBe(403);
  await request.post("/api/auth/register", {
    data: { email: address, password, name: "Mira" },
  });
  const second = await apiRequest.newContext({ baseURL });
  try {
    expect(
      (
        await second.post("/api/auth/login", {
          data: { email: address, password: "incorrect-password" },
        })
      ).status(),
    ).toBe(401);
    await second.post("/api/auth/login", {
      data: { email: address, password },
    });
    const nextPassword = "A-different-safe-passphrase-43!";
    expect(
      (
        await request.post("/api/auth/password", {
          data: { currentPassword: password, password: nextPassword },
        })
      ).ok(),
    ).toBeTruthy();
    expect((await (await second.get("/api/library")).json()).email).toBeNull();
    expect(
      (
        await second.post("/api/auth/login", {
          data: { email: address, password },
        })
      ).status(),
    ).toBe(401);
    expect(
      (
        await second.post("/api/auth/login", {
          data: { email: address, password: nextPassword },
        })
      ).ok(),
    ).toBeTruthy();
    expect(
      (
        await request.patch("/api/profile", {
          data: { name: "Mira", favoriteGenres: ["not-a-genre"] },
        })
      ).status(),
    ).toBe(400);
  } finally {
    await second.dispose();
  }
});

test("sign-in attempts are throttled", async ({ request }) => {
  const address = email("limit");
  for (let i = 0; i < 8; i++)
    expect(
      (
        await request.post("/api/auth/login", {
          data: { email: address, password },
        })
      ).status(),
    ).toBe(401);
  expect(
    (
      await request.post("/api/auth/login", {
        data: { email: address, password },
      })
    ).status(),
  ).toBe(429);
});

test("profile forms lead to a personal dashboard and only saved films appear in focus", async ({
  page,
}) => {
  await page.goto("/account");
  await page.getByLabel("Display name", { exact: true }).fill("Mira");
  await page.getByLabel("Email address", { exact: true }).fill(email("ui"));
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page
    .getByRole("button", { name: "Create my account", exact: true })
    .click();
  await expect(page).toHaveURL(/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Mira’s cinema." }),
  ).toBeVisible();
  await page.goto("/collection");
  await expect(
    page.getByRole("heading", {
      name: "Your collection starts with one film.",
    }),
  ).toBeVisible();
  await expect(page.locator(".film-strip")).toHaveCount(0);
  for (const film of films.slice(0, 8))
    await page.request.post("/api/library", {
      data: { filmId: film.id, saved: true },
    });
  await page.reload();
  await expect(page.locator(".film-strip")).toHaveCount(8);
  await expect(
    page.getByRole("heading", { name: "Mira’s In Focus." }),
  ).toBeVisible();
  await page.goto("/account");
  await page.getByLabel("What should we call you?").fill("Mira Rose");
  await page
    .getByLabel("A little about your film taste")
    .fill("Worlds beyond our own.");
  await page.getByRole("button", { name: "Sci-fi", exact: true }).click();
  await page.getByRole("button", { name: "ocean profile color" }).click();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("status").first()).toContainText("updated");
  await page.reload();
  await expect(page.getByLabel("A little about your film taste")).toHaveValue(
    "Worlds beyond our own.",
  );
  await expect(
    page.getByRole("button", { name: "Sci-fi", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({
    path: "test-results/profile-complete.png",
    fullPage: true,
  });
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Mira Rose’s cinema." }),
  ).toBeVisible();
  await expect(page.locator(".dashboard-saved > a")).toHaveCount(8);
  await page.request.post("/api/library", {
    data: { filmId: "arrival", saved: false },
  });
  await page.goto("/collection");
  await expect(page.locator(".film-strip")).toHaveCount(7);
  await expect(
    page.getByRole("button", { name: "Explore Arrival", exact: true }),
  ).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.goto("/account");
  await expect(
    page.getByRole("button", { name: "Sign out", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Create my account", exact: true }),
  ).toBeVisible();
});
