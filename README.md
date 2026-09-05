# CINÉ

A working streaming-platform MVP built from the supplied 12-second video reference. The design recreates its dark gallery, seven narrow movie posters, grayscale-to-color hover, oversized director name, floating navigation, and cinematic film detail pages.

## Run

```bash
npm install
npm run dev:all
```

This starts Next.js and the loopback torrent server together. For separate processes, run `npm run dev` and `npm run stream`. Production requires a persistent Node server with TCP/UDP network access and writable torrent cache storage; an ephemeral serverless function is not sufficient.

## Playback: YouTube and Stream only

- **YouTube** embeds the selected film’s `youtubeId` from `lib/catalog.ts`.
- **Stream** resolves that film’s magnet on the Node server, then proxies its video through `/api/stream/<film-id>`.
- There is no demo fallback, global-film override, Webtor, browser-side WebTorrent, NHD, or direct external MP4/HLS source mode.
- Missing magnets produce an explicit unavailable state; the player never substitutes another film.

Create `.data/stream-sources.json` using `config/stream-sources.example.json` as a template:

```json
{
  "your-film-id": {
    "magnet": "magnet:?xt=urn:btih:YOUR_INFO_HASH",
    "transcode": false
  }
}
```

Map each film to its own magnet. The server selects the largest video to avoid accidentally choosing a sample. Set optional `fileIndex` to select a particular file (zero-based torrent file index).

Alternatively, use `MAGNET_YOUR_FILM_ID` (replace hyphens with underscores), or the scoped legacy pair `STREAM_FILM_ID=your-film-id` and `STREAM_URL=magnet:?...`. An unscoped `STREAM_URL` and the old `SERVER_STREAM` option are ignored. `STREAM_TRANSCODE=true` enables conversion for the scoped legacy source. Magnets stay server-side and are not returned in playback responses.

The cache is stored under `.data/torrents`, with up to four active torrents and cleanup after fifteen idle minutes. Metadata loading is deduplicated and times out with an explicit error if no peer provides it. A magnet’s availability still depends on reachable seeds.

Compatible MP4/WebM video streams support HTTP byte-range seeking. MKV/AVI/MOV/TS files are converted to H.264/AAC fragmented MP4 using FFmpeg. Set `transcode: true` for other incompatible codecs such as HEVC in an MP4 container. Install FFmpeg on the torrent server or set `FFMPEG_PATH`. Conversion is capped at 1080p and is sequential: seeking/resume is supported for compatible direct files, not live-converted streams. Video-only torrents remain video-only.

`TORRENT_STREAM_PORT` defaults to `8899`; Next uses `TORRENT_STREAM_URL=http://127.0.0.1:8899`. Configure both consistently if changing the port. The internal service binds only to loopback and accepts film IDs configured on the server, not arbitrary browser-supplied magnets. Connect account entitlements before exposing a paid service. YouTube embedding remains subject to each video’s embedding settings.

## Database

Without `DATABASE_URL`, local development uses SQLite in `.data/cine.sqlite`. Set a PostgreSQL connection string in production and run `npm run db:migrate`. For an intentional local production preview, use `ALLOW_SQLITE_PREVIEW=true npm start` after `npm run build`. Guest profiles, watchlists, progress, and support requests remain connected to the browser’s session cookie.

## Pages

Home (`/`), catalog (`/browse`), director collection (`/collection`), library (`/library`), profile (`/account`), About (`/about`), and support (`/support`) are connected. Film links use `/collection?film=<id>`; legacy `/?film=<id>` links redirect there. The support center includes guides, FAQs, saved requests, and close/reopen controls. Requests are stored locally; no support email integration is connected.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
npm run test:stream
# App running, Google Chrome installed:
npm test -- --grep "player sources"
```

The server tests generate their own video and seed it over a local TCP torrent connection. They verify metadata acquisition, concurrent request deduplication, selecting the correct video, byte-exact range/suffix streaming, invalid-range handling, and FFmpeg conversion. They do not download commercial films or depend on public seeds. Browser playback tests use a test-only HTTP fixture; no application endpoint uses a sample fallback.

Implementation references: [WebTorrent server API](https://webtorrent.io/docs), [YouTube embeds](https://developers.google.com/youtube/player_parameters).

See `DESIGN.md` for the original UI reference and `CREDITS.md` for asset credits.
