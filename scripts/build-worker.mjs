// Builds the Cloudflare Worker with OpenNext WITHOUT baking local secrets into the bundle.
// Next.js and OpenNext both read .env* files at build time; we move them aside for the
// duration of the build and always restore them afterwards. Runtime config comes from
// Cloudflare secrets (DATABASE_URL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET).
import { spawnSync } from "node:child_process";
import fs from "node:fs";

const FILES = [".env", ".env.local", ".env.production", ".env.production.local", ".dev.vars"];
const moved = [];

const restore = () => {
  for (const f of moved.splice(0)) {
    if (fs.existsSync(`${f}.deploy-hidden`)) fs.renameSync(`${f}.deploy-hidden`, f);
  }
};
process.on("SIGINT", () => { restore(); process.exit(130); });

let status = 1;
try {
  for (const f of FILES) {
    if (fs.existsSync(f)) {
      fs.renameSync(f, `${f}.deploy-hidden`);
      moved.push(f);
    }
  }
  if (moved.length) console.log(`[build-worker] hid ${moved.join(", ")} during build`);
  status = spawnSync("npx", ["opennextjs-cloudflare", "build"], { stdio: "inherit", shell: true }).status ?? 1;
} finally {
  restore();
}
process.exit(status);
