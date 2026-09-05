/**
 * `npm run dev:all` — runs the standalone torrent streamer and the Next.js dev
 * server together, and shuts both down cleanly on exit.
 *
 * Dependency-free: uses node:child_process to spawn both commands.
 */
import { spawn } from "node:child_process";

const children = [];

function run(name, cmd, args, opts = {}) {
  const child = spawn(cmd, args, {
    stdio: "inherit",
    env: { ...process.env, ...(opts.env || {}) },
    shell: false,
  });
  children.push(child);
  child.on("error", (err) => {
    console.error(`[${name}] failed to start:`, err.message);
    shutdown(1);
  });
  child.on("exit", (code) => {
    // Don't double-kill after a normal shutdown.
    if (!shuttingDown) {
      console.error(`[${name}] exited unexpectedly (code=${code}). Stopping all.`);
      shutdown(code ?? 1);
    }
  });
  return child;
}

let shuttingDown = false;
function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (child.exitCode === null) {
      child.kill("SIGTERM");
    }
  }
  // Let children flush, then force.
  setTimeout(() => {
    for (const child of children) {
      if (child.exitCode === null) child.kill("SIGKILL");
    }
    process.exit(code);
  }, 800);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

run("stream", process.execPath, ["scripts/stream-server.mjs"], {
  env: { TORRENT_STREAM_PORT: "8899" },
});
run("next", "npm", ["run", "dev"]);