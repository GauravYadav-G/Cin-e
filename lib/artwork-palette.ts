import {
  argbFromRgb,
  hexFromArgb,
  QuantizerCelebi,
  Score,
  themeFromSourceColor,
} from "@material/material-color-utilities";

export function paletteFromPixels(rgb: Uint8Array) {
  const pixels: number[] = [];
  for (let i = 0; i < rgb.length; i += 3)
    pixels.push(argbFromRgb(rgb[i], rgb[i + 1], rgb[i + 2]));
  const [seed] = Score.score(QuantizerCelebi.quantize(pixels, 32));
  const theme = themeFromSourceColor(seed);
  const dark = theme.schemes.dark;
  return {
    "--accent": hexFromArgb(dark.primary),
    "--on-accent": hexFromArgb(dark.onPrimary),
    "--accent-hover": hexFromArgb(theme.palettes.primary.tone(90)),
    "--accent-container": hexFromArgb(dark.primaryContainer),
    "--on-accent-container": hexFromArgb(dark.onPrimaryContainer),
    "--bg": hexFromArgb(theme.palettes.neutral.tone(6)),
    "--panel": hexFromArgb(theme.palettes.neutral.tone(12)),
    "--panel-raised": hexFromArgb(theme.palettes.neutral.tone(17)),
    "--text": hexFromArgb(dark.onSurface),
    "--muted": hexFromArgb(theme.palettes.neutralVariant.tone(72)),
    "--line": hexFromArgb(theme.palettes.neutralVariant.tone(28)),
  };
}

export type ArtworkPalette = ReturnType<typeof paletteFromPixels>;
