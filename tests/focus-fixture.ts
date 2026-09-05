import type { Page } from "@playwright/test";
import { films } from "../lib/catalog";
/** The reference shelf is now personal; seed this viewer's list explicitly. */
export async function saveReferenceFilms(page: Page) {
  await page.request.get("/api/library");
  for (const film of films.slice(0, 7)) {
    const response = await page.request.post("/api/library", {
      data: { filmId: film.id, saved: true },
    });
    if (!response.ok()) throw new Error("Could not prepare saved films");
  }
}
