"use client";

import { useEffect } from "react";
import type { ArtworkPalette } from "@/lib/artwork-palette";

type Theme = { artwork: string; tokens: ArtworkPalette };
const storageKey = "cine-artwork-theme-v1";
const allowedTokens = [
  "--accent",
  "--on-accent",
  "--accent-hover",
  "--accent-container",
  "--on-accent-container",
  "--bg",
  "--panel",
  "--panel-raised",
  "--text",
  "--muted",
  "--line",
];
let revision = 0;

function apply(theme: Theme) {
  if (
    !theme?.tokens ||
    !allowedTokens.every((key) =>
      /^#[0-9a-f]{6}$/i.test(theme.tokens[key as keyof ArtworkPalette] || ""),
    )
  )
    return;
  const root = document.documentElement;
  for (const key of allowedTokens)
    root.style.setProperty(key, theme.tokens[key as keyof ArtworkPalette]);
  root.dataset.themeArtwork = theme.artwork;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme.tokens["--bg"]);
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(theme));
  } catch {
    /* Storage can be unavailable in private sessions. */
  }
}

/** Preserve the last film palette on support, browse and account pages. */
export default function ArtworkTheme() {
  useEffect(() => {
    if (document.documentElement.dataset.themeArtwork) return;
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) apply(JSON.parse(saved));
    } catch {
      /* Keep the default palette when storage is unavailable. */
    }
  }, []);
  return null;
}

export function useArtworkTheme(filmId: string | undefined, poster = false) {
  useEffect(() => {
    if (!filmId) return;
    const current = ++revision;
    const controller = new AbortController();
    // Debounce poster hover; a late response cannot recolor a different film.
    const timer = setTimeout(
      () => {
        void fetch(
          `/api/theme/${encodeURIComponent(filmId)}${poster ? "?art=poster" : ""}`,
          { signal: controller.signal, cache: "no-store" },
        )
          .then(async (response) => {
            if (!response.ok) return;
            const theme: Theme = await response.json();
            if (!controller.signal.aborted && current === revision)
              apply(theme);
          })
          .catch(() => {
            /* An image error must not interrupt navigation or playback. */
          });
      },
      poster ? 180 : 0,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filmId, poster]);
}
