# Reference analysis

Source: `original-e7360f593c644da311390f8e23e345c3.mp4`, 3456 × 2160, 60 fps, 11.98 seconds, no audio track.

The contact sheet and two detailed frames are retained in `reference/`.

## What the video shows

- 0–2 seconds: posters enter a black canvas in a staggered sequence.
- 2–6 seconds: seven tall film strips centered above enormous, dark-gray “Villeneuve” typography. Hovered posters rise and become full-color. The unselected collection remains monochrome.
- Film order: Arrival, Dune: Part Two, Dune, Prisoners, Enemy, Blade Runner 2049, Sicario.
- A small centered breadcrumb sits at the top. Navigation floats in a compact dark dock with a bright yellow brand tile at the bottom.
- 7–12 seconds: Dune: Part Two expands into a full-screen orange film-art composition. A large light-weight title occupies the upper left, synopsis and rating sit upper right, film facts sit lower left, and a circular play target is centered. The dock persists.

## Implementation decisions

The app preserves the reference's composition and visual hierarchy. CINÉ provides an independent brand, with a pale acid-yellow accent, local DM Sans typography, restrained labels, and a seven-film editorial collection.

The desktop film shelf uses flexible widths and a 650ms eased hover transition. The active film expands to 1.33× its share and 112% of the shelf height; its grayscale filter fades out. Motion handles the staggered entrance and page changes. Reduced-motion preferences remove these animations.

On mobile, the seven-strip composition becomes a horizontally scrollable, snap-aligned shelf. Film titles remain visible without requiring hover. Detail text stacks below the principal artwork, and the persistent dock stays within a 390px viewport.

Search, genre filters, sorting, cast/story dialogs, a saved list, guest profile, and a sample video player extend the short reference into a usable platform MVP. They use the same typography, palette, spacing, and understated controls.

Posters are independently sourced rather than embedding UI screenshots. The Enemy strip was extracted from the supplied reference. The Dune detail background uses the same poster artwork, with responsive cropping. Commercial film images are for the design preview; they do not indicate streaming rights.
