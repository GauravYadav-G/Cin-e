import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import WebTorrent from "webtorrent";
import { createTorrentServer } from "../scripts/stream-server.mjs";
import { byteRange, pickVideo } from "../scripts/torrent-http.mjs";
import { getTorrentSource } from "../lib/torrent-source.mjs";

test("single-range parsing handles suffix, open-ended, clamping and invalid requests", () => {
  assert.deepEqual(byteRange("bytes=-10", 100), {
    start: 90,
    end: 99,
    partial: true,
  });
  assert.deepEqual(byteRange("bytes=70-999", 100), {
    start: 70,
    end: 99,
    partial: true,
  });
  assert.deepEqual(byteRange("bytes=40-", 100), {
    start: 40,
    end: 99,
    partial: true,
  });
  for (const range of [
    "bytes=100-",
    "bytes=-0",
    "bytes=80-20",
    "bytes=0-1,3-5",
    "bytes=-",
    "garbage",
  ])
    assert.equal(byteRange(range, 100), null);
  assert.equal(
    pickVideo([
      { name: "sample.mp4", length: 100 },
      { name: "feature.mkv", length: 10000 },
    ]).name,
    "feature.mkv",
  );
});

test("global magnet is scoped to exactly one film and unrelated films have no fallback", () => {
  const old = { ...process.env };
  try {
    process.env.STREAM_SOURCES_FILE = join(
      tmpdir(),
      "cine-missing-config-test.json",
    );
    process.env.STREAM_FILM_ID = "test-feature";
    process.env.STREAM_URL = "magnet:?xt=urn:btih:" + "a".repeat(40);
    process.env.SERVER_STREAM = "sintel";
    assert.ok(getTorrentSource("test-feature"));
    assert.equal(getTorrentSource("test-unrelated"), null);
    process.env.STREAM_URL = "https://example.org/demo.mp4";
    assert.throws(() => getTorrentSource("test-feature"), /magnet/);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in old)) delete process.env[key];
    Object.assign(process.env, old);
  }
});

test(
  "real local magnet transfer: metadata, deduplication, correct file, ranges and transcoding",
  { timeout: 30000 },
  async () => {
    const dir = await mkdtemp(join(tmpdir(), "cine-torrent-test-"));
    const video = join(dir, "feature.mp4");
    execFileSync(process.env.FFMPEG_PATH || "ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-f",
      "lavfi",
      "-i",
      "testsrc2=size=320x180:rate=24",
      "-t",
      "2",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      video,
    ]);
    await writeFile(join(dir, "sample.mp4"), Buffer.alloc(512));
    const expected = await readFile(video);
    const options = {
      dht: false,
      tracker: false,
      lsd: false,
      natUpnp: false,
      natPmp: false,
      utp: false,
    };
    const seeder = new WebTorrent(options);
    seeder.on("error", (error) => {
      throw error;
    });
    let runtime;
    try {
      const torrent = await new Promise((resolve) =>
        seeder.seed(
          [video, join(dir, "sample.mp4")],
          { announce: [] },
          resolve,
        ),
      );
      const magnet = `magnet:?xt=urn:btih:${torrent.infoHash}&x.pe=127.0.0.1:${seeder.torrentPort}`;
      runtime = createTorrentServer({
        clientOptions: options,
        cachePath: join(dir, "download"),
        resolveSource: (id) =>
          id === "fixture" || id === "converted"
            ? { magnet, transcode: id === "converted" }
            : null,
      });
      await new Promise((resolve) =>
        runtime.server.listen(0, "127.0.0.1", resolve),
      );
      const base = `http://127.0.0.1:${runtime.server.address().port}`;
      assert.equal((await fetch(`${base}/stream/unknown`)).status, 404);
      await Promise.all(
        Array.from({ length: 5 }, () => fetch(`${base}/status/fixture`)),
      );
      let status;
      for (let i = 0; i < 80; i++) {
        status = await (await fetch(`${base}/status/fixture`)).json();
        if (status.state === "ready") break;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      assert.equal(status.state, "ready", JSON.stringify(status));
      assert.equal(status.fileName, "feature.mp4");
      assert.equal(runtime.client.torrents.length, 1);
      const response = await fetch(`${base}/stream/fixture`, {
        headers: { Range: "bytes=0-1023" },
      });
      assert.equal(response.status, 206);
      assert.equal(
        response.headers.get("content-range"),
        `bytes 0-1023/${expected.length}`,
      );
      assert.deepEqual(
        Buffer.from(await response.arrayBuffer()),
        expected.subarray(0, 1024),
      );
      const suffix = await fetch(`${base}/stream/fixture`, {
        headers: { Range: "bytes=-123" },
      });
      assert.deepEqual(
        Buffer.from(await suffix.arrayBuffer()),
        expected.subarray(-123),
      );
      assert.equal(
        (
          await fetch(`${base}/stream/fixture`, {
            headers: { Range: `bytes=${expected.length}-` },
          })
        ).status,
        416,
      );
      const converted = await fetch(`${base}/stream/converted`);
      assert.equal(converted.status, 200);
      assert.equal(converted.headers.get("accept-ranges"), "none");
      const convertedBytes = Buffer.from(await converted.arrayBuffer());
      assert.equal(convertedBytes.toString("ascii", 4, 8), "ftyp");
      assert.ok(convertedBytes.length > 1024);
    } finally {
      if (runtime) await runtime.close();
      await new Promise((resolve) => seeder.destroy(resolve));
    }
  },
);
