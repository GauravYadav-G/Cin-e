# CINÉ

A working streaming-platform MVP built from the supplied 12-second video reference. The design recreates its dark gallery, seven narrow movie posters, grayscale-to-color hover, oversized director name, floating navigation, and cinematic film detail pages.

## Run locally

Requires Node.js 22.13 or newer. Developed and checked with Node.js 24.

```bash
npm install
npm run dev
```

Open the URL printed by Next.js, normally **http://localhost:3000**. No external credentials are needed. Guest profiles, watchlists, and viewing progress persist in `.data/cine.sqlite`. Keep this directory to retain local data.

## Included

- A cinematic Home page with featured films, curated picks, genre discovery, and Continue watching.
- Dedicated film catalog, library, profile, About, and helpful 404 pages with shared navigation.
- A support center with searchable guides, FAQ accordions, support request creation, confirmation, and request history with close/reopen controls.
- Responsive director collection with staggered entrance and expanding, full-color hover states.
- Seven film detail pages, shareable film URLs, browser back/forward navigation, cast, story, and metadata.
- Search by title, actor, genre, or year, with genre filters and sorting.
- Database-backed watchlist, guest profile, and playback progress.
- A working HTML5 player, seeking, volume, fullscreen, optional captions, playback resume, loading and retry states.
- Native HLS support in compatible browsers, with `hls.js` for other supported browsers.
- Keyboard-accessible controls, focus-trapped dialogs, Escape to dismiss, `/` to search, reduced-motion support.
- Local movie artwork, local fonts, and a local open-licensed sample trailer. No third-party requests are required to use the default preview.

## Stack

**Next.js 16 App Router + React 19 + TypeScript** handles rendering and the server API. Motion handles page and entrance transitions; CSS handles the reference's flexible poster strip. The app uses `next/image` and self-hosted DM Sans.

**PostgreSQL** is the intended deployed database for viewer state. The application uses parameterized queries and a connection pool through `pg`. A built-in **SQLite** adapter makes the local preview usable without provisioning infrastructure. The production path does not silently fall back to SQLite if a database connection fails.

The film catalog is currently curated in `lib/catalog.ts`. That keeps this seven-film editorial collection simple to edit. Film metadata and stream entitlements should move into a database/CMS when building catalog administration.

Primary documentation: [Next.js App Router](https://nextjs.org/docs/app/getting-started), [node-postgres](https://node-postgres.com/features/queries), [Node SQLite](https://nodejs.org/api/sqlite.html), [HLS.js](https://github.com/video-dev/hls.js).

## PostgreSQL setup

Set your managed PostgreSQL connection string in `.env.local` or the hosting environment:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/cine?sslmode=require
```

Then initialize the schema:

```bash
npm run db:migrate
```

For a local PostgreSQL instance, a Docker Compose definition is included. Supply `POSTGRES_PASSWORD`, run `docker compose up -d`, and use a matching local `DATABASE_URL`. The database port is bound to localhost. Migrations are idempotent; the MVP also initializes missing tables when first used.

Do not set `ALLOW_SQLITE_PREVIEW=true` for an ephemeral or multi-instance deployment: SQLite state would not be shared or durable there. This flag is only for intentionally running a local production preview.

## Production build / local preview

```bash
npm run build
ALLOW_SQLITE_PREVIEW=true npm start
```

For an actual deployment, provide `DATABASE_URL`, run migrations, and use `npm start` without the SQLite preview flag. Use HTTPS. The connection pool is capped at ten connections per process; tune the limit and use a managed pooler for serverless hosting.

## Playback

The included video is the **Big Buck Bunny trailer**, created by Blender Foundation, distributed under **CC BY 3.0**, and served here unmodified. The player explicitly distinguishes the sample from the selected commercial film.

`app/api/playback/[id]/route.ts` is the playback-provider boundary. An optional `STREAM_URL` environment variable supplies one MP4 or HLS stream for testing a licensed source. It applies to every film in this MVP; it is not per-film catalog management. A cross-origin stream must permit the necessary CORS requests.

Before operating a paid streaming service, implement per-film licensed sources, authenticated accounts, subscription/entitlement checks, signed playback URLs, and the required video infrastructure. Store video in object storage and deliver through a video CDN, rather than in PostgreSQL. The included guest profile is browser-specific and does not provide account sign-in or cross-device sync. No payment, DRM, upload/transcoding pipeline, admin CMS, or deployment is included.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
# With the app running, and Google Chrome installed:
npm test
# For another running port:
TEST_BASE_URL=http://localhost:3001 npm test
```

End-to-end tests cover reference interactions and browser history, the Home-to-film flow, search/filtering, watchlist persistence/removal, profile persistence, actual sample playback/seeking/resume, mobile overflow, support guides and request creation/persistence/status changes, helpful 404s, and API validation/session isolation. The default test runner uses installed Google Chrome. Change the Playwright channel if you prefer its bundled Chromium.

The browser tests exercise the SQLite preview. A live PostgreSQL instance was not available during implementation; validate the PostgreSQL connection and migration in your deployment environment.

## Routes and connected flows

| Route                            | Purpose                                                    |
| -------------------------------- | ---------------------------------------------------------- |
| `/`                              | Home, featured films, curated picks, and Continue watching |
| `/browse`                        | Full catalog with search, genre filtering, and sorting     |
| `/collection`                    | Original reference-inspired director collection            |
| `/collection?film=dune-part-two` | Film detail; add `&play=1` for resume playback             |
| `/library`                       | Saved films and viewing history                            |
| `/account`                       | Persistent guest display name and profile information      |
| `/support`                       | Searchable help center and FAQs                            |
| `/support/[slug]`                | Six detailed help guides                                   |
| `/support/contact`               | Save a support request                                     |
| `/support/requests`              | Request history, details, close, and reopen                |
| `/about`                         | CINÉ’s story                                               |

Legacy `/?film=...` links redirect to the collection’s film page. `/home` redirects to `/`.

Support requests use a separate database table, scoped to the current guest session. The API validates input, rejects cross-origin writes, and allows up to ten new requests per profile per hour. **Saving a request does not send email or contact a support team.** The form and confirmation make this clear. Connect an actual support workflow before offering staffed support.

## Files

```text
app/                       Page shell, styles, API routes
components/cinema.tsx      Gallery, details, catalog, dialogs, profile
components/player.tsx     MP4/HLS player and progress persistence
components/portal.tsx     Home, film catalog, library, and account pages
components/site-shell.tsx Shared header, footer, and navigation
components/help-center.tsx Searchable help center and FAQ
components/support-requests.tsx Support form, confirmation, and request history
lib/help.ts               Help guide and FAQ content
lib/catalog.ts            Film metadata and artwork mapping
lib/db.ts                 PostgreSQL and local SQLite adapters
lib/session.ts            Guest sessions and request validation
database/schema.sql       PostgreSQL schema
scripts/migrate.mjs        PostgreSQL migration runner
public/                   Local artwork, fonts, sample video
reference/                Frames extracted from your supplied video
tests/                    Playwright end-to-end tests
```

See [DESIGN.md](DESIGN.md) for reference analysis and [CREDITS.md](CREDITS.md) for asset attribution.
