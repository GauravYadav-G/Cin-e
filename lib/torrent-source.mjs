import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
/** @param {string} magnet */
export function magnetHash(magnet) {
  const url = new URL(magnet);
  if (url.protocol !== "magnet:")
    throw new Error("The source must be a magnet link.");
  const hash = url.searchParams
    .getAll("xt")
    .find((value) => /^urn:btih:([a-f0-9]{40}|[a-z2-7]{32})$/i.test(value));
  if (!hash) throw new Error("The magnet has no valid BitTorrent info hash.");
  return hash.slice(9).toLowerCase();
}
/** @param {string} id @returns {{magnet: string, fileIndex?: number, transcode: boolean} | null} */
export function getTorrentSource(id) {
  if (!/^[a-z0-9-]+$/.test(id)) return null;
  const file = resolve(
    /* turbopackIgnore: true */
    process.env.STREAM_SOURCES_FILE || ".data/stream-sources.json",
  );
  // Private runtime configuration is mounted on the server, never bundled.
  const sources = existsSync(/* turbopackIgnore: true */ file)
    ? JSON.parse(readFileSync(/* turbopackIgnore: true */ file, "utf8"))
    : {};
  const envMagnet =
    process.env[`MAGNET_${id.toUpperCase().replaceAll("-", "_")}`];
  const scopedMagnet =
    process.env.STREAM_FILM_ID === id ? process.env.STREAM_URL : undefined;
  const source = Object.hasOwn(sources, id)
    ? sources[id]
    : envMagnet || scopedMagnet;
  if (!source) return null;
  const entry =
    typeof source === "string"
      ? {
          magnet: source,
          transcode:
            process.env.STREAM_FILM_ID === id &&
            process.env.STREAM_TRANSCODE === "true",
        }
      : source;
  if (!entry || typeof entry.magnet !== "string")
    throw new Error("Invalid film magnet configuration.");
  magnetHash(entry.magnet);
  if (
    entry.fileIndex !== undefined &&
    (!Number.isSafeInteger(entry.fileIndex) || entry.fileIndex < 0)
  )
    throw new Error("Invalid video file index.");
  return {
    magnet: entry.magnet,
    fileIndex: entry.fileIndex,
    transcode: entry.transcode === true,
  };
}
