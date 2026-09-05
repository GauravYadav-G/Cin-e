import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { resolve, extname } from "node:path";
import { mkdirSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import WebTorrent from "webtorrent";
import { getTorrentSource, magnetHash } from "../lib/torrent-source.mjs";
import { byteRange, pickVideo } from "./torrent-http.mjs";

export function createTorrentServer({
  resolveSource = getTorrentSource,
  clientOptions = {},
  cachePath = resolve(".data/torrents"),
  metadataTimeout = 60000,
} = {}) {
  mkdirSync(cachePath, { recursive: true });
  const client = new WebTorrent({
    natUpnp: false,
    natPmp: false,
    ...clientOptions,
  });
  const entries = new Map();
  const jobs = new Set();
  client.on("error", (error) => {
    for (const entry of entries.values()) entry.error = error.message;
    console.error("[torrent-server]", error.message);
  });
  function json(res, status, value) {
    if (!res.destroyed && !res.headersSent)
      res
        .writeHead(status, {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        })
        .end(JSON.stringify(value));
  }
  function getEntry(source) {
    const hash = magnetHash(source.magnet);
    let entry = entries.get(hash);
    if (entry?.error && entry.active === 0) {
      entry.torrent?.destroy();
      entries.delete(hash);
      entry = undefined;
    }
    if (entry) {
      entry.touched = Date.now();
      return entry;
    }
    if (entries.size >= 4)
      throw new Error(
        "The torrent server is busy. Try again after another stream finishes.",
      );
    entry = {
      torrent: null,
      ready: false,
      error: null,
      touched: Date.now(),
      created: Date.now(),
      active: 0,
    };
    entries.set(hash, entry);
    try {
      const torrent = client.add(source.magnet, {
        path: cachePath,
        addUID: true,
        deselect: true,
        strategy: "sequential",
        destroyStoreOnDestroy: true,
      });
      entry.torrent = torrent;
      torrent.on("error", (error) => {
        entry.error = error.message;
      });
      torrent.once("ready", () => {
        entry.ready = true;
      });
    } catch (error) {
      entries.delete(hash);
      throw error;
    }
    return entry;
  }
  function snapshot(entry, source) {
    const torrent = entry.torrent;
    if (!entry.ready && Date.now() - entry.created > metadataTimeout)
      entry.error =
        "No torrent metadata received. The magnet may have no reachable peers. Retry when a seed is available.";
    if (entry.error) return { state: "error", error: entry.error };
    let file;
    if (entry.ready) file = pickVideo(torrent.files, source.fileIndex);
    return {
      state: entry.ready ? "ready" : "connecting",
      peers: torrent.numPeers,
      downloadSpeed: torrent.downloadSpeed,
      downloaded: torrent.downloaded,
      progress: torrent.progress,
      fileName: file?.name || null,
      transcode: file
        ? source.transcode || !/\.(mp4|webm|m4v|ogv)$/i.test(file.name)
        : false,
    };
  }
  const server = createServer(async (req, res) => {
    try {
      if (req.headers.origin)
        return json(res, 403, {
          error: "Use the application’s streaming endpoint.",
        });
      if (req.method !== "GET")
        return json(res, 405, { error: "Method not allowed" });
      const url = new URL(req.url, "http://127.0.0.1");
      if (url.pathname === "/health")
        return json(res, 200, { ok: !client.destroyed });
      const match = /^\/(status|stream)\/([a-z0-9-]+)$/.exec(url.pathname);
      if (!match) return json(res, 404, { error: "Stream not found" });
      const source = resolveSource(match[2]);
      if (!source)
        return json(res, 404, { error: "No magnet configured for this film." });
      const entry = getEntry(source);
      const state = snapshot(entry, source);
      if (match[1] === "status")
        return json(res, state.state === "error" ? 502 : 200, state);
      if (state.state === "error") return json(res, 502, state);
      if (!entry.ready)
        return json(res, 425, {
          error:
            "The torrent is still connecting. Wait for metadata before starting playback.",
        });
      const file = pickVideo(entry.torrent.files, source.fileIndex);
      entry.active++;
      let released = false;
      const release = () => {
        if (!released) {
          released = true;
          entry.active--;
          entry.touched = Date.now();
        }
      };
      res.once("close", release);
      if (state.transcode) {
        const ffmpeg = spawn(
          process.env.FFMPEG_PATH || "ffmpeg",
          [
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            "pipe:0",
            "-map",
            "0:v:0",
            "-map",
            "0:a:0?",
            "-sn",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "23",
            "-vf",
            "scale=w='min(1920,iw)':h=-2",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "160k",
            "-movflags",
            "frag_keyframe+empty_moov+default_base_moof",
            "-f",
            "mp4",
            "pipe:1",
          ],
          { stdio: ["pipe", "pipe", "pipe"] },
        );
        jobs.add(ffmpeg);
        let diagnostic = "";
        ffmpeg.stderr.on("data", (chunk) => {
          diagnostic = (diagnostic + chunk.toString()).slice(-1500);
        });
        ffmpeg.on("error", () => {
          json(res, 503, {
            error:
              "This video requires FFmpeg. Install FFmpeg on the torrent server.",
          });
        });
        ffmpeg.once("spawn", () => {
          if (res.destroyed) {
            ffmpeg.kill("SIGTERM");
            return;
          }
          res.writeHead(200, {
            "Content-Type": "video/mp4",
            "Accept-Ranges": "none",
            "Cache-Control": "no-store",
          });
          const input = file.createReadStream();
          res.once("close", () => {
            input.destroy();
            ffmpeg.kill("SIGTERM");
          });
          void pipeline(input, ffmpeg.stdin).catch(() =>
            ffmpeg.kill("SIGTERM"),
          );
          void pipeline(ffmpeg.stdout, res).catch(() => ffmpeg.kill("SIGTERM"));
        });
        ffmpeg.once("close", (code) => {
          jobs.delete(ffmpeg);
          release();
          if (code && !res.destroyed) {
            console.error("[torrent-server] conversion:", diagnostic);
            res.destroy();
          }
        });
        return;
      }
      const range = byteRange(req.headers.range, file.length);
      if (!range) {
        res.writeHead(416, { "Content-Range": `bytes */${file.length}` }).end();
        return;
      }
      const mime = {
        ".mp4": "video/mp4",
        ".m4v": "video/mp4",
        ".webm": "video/webm",
        ".ogv": "video/ogg",
      }[extname(file.name).toLowerCase()];
      res.writeHead(range.partial ? 206 : 200, {
        "Content-Type": mime,
        "Content-Length": range.end - range.start + 1,
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-store",
        ...(range.partial
          ? {
              "Content-Range": `bytes ${range.start}-${range.end}/${file.length}`,
            }
          : {}),
      });
      const input = file.createReadStream({
        start: range.start,
        end: range.end,
      });
      res.once("close", () => input.destroy());
      try {
        await pipeline(input, res);
      } catch {
        if (!res.destroyed) res.destroy();
      }
    } catch (error) {
      json(res, 422, {
        error: error.message || "Could not prepare this magnet stream.",
      });
    }
  });
  const cleanup = setInterval(() => {
    for (const [hash, entry] of entries)
      if (entry.active === 0 && Date.now() - entry.touched > 15 * 60 * 1000) {
        entry.torrent?.destroy();
        entries.delete(hash);
      }
  }, 60000);
  cleanup.unref();
  const close = async () => {
    clearInterval(cleanup);
    for (const job of jobs) job.kill("SIGTERM");
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await new Promise((resolve) => client.destroy(resolve));
  };
  return { server, client, close };
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  for (const file of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(file);
    } catch {
      /* optional */
    }
  }
  const runtime = createTorrentServer();
  const port = Number(process.env.TORRENT_STREAM_PORT || 8899);
  runtime.server.listen(port, "127.0.0.1", () =>
    console.log(`[torrent-server] ready on http://127.0.0.1:${port}`),
  );
  runtime.server.on("error", (error) => {
    console.error("[torrent-server]", error.message);
    process.exit(1);
  });
  let closing = false;
  for (const signal of ["SIGINT", "SIGTERM"])
    process.on(signal, async () => {
      if (closing) return;
      closing = true;
      await runtime.close();
      process.exit(0);
    });
}
