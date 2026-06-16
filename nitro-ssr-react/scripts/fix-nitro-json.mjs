// Workaround for a Nitro build bug when Vite Module Federation marks expose chunks
// as Rollup entry points: writeBuildInfo may pick an expose chunk (e.g.
// server/_chunks/Counter.mjs) instead of server/index.mjs in .output/nitro.json.
//
// Upstream fix (open PR): https://github.com/nitrojs/nitro/pull/4352
// Remove this script once that PR is released in Nitro.
import { readFile, writeFile } from "node:fs/promises";

const UPSTREAM_FIX_PR = "https://github.com/nitrojs/nitro/pull/4352";
const path = ".output/nitro.json";
const correctEntry = "server/index.mjs";

let buildInfo;
try {
  buildInfo = JSON.parse(await readFile(path, "utf8"));
} catch {
  console.error(`Missing ${path}. Run vite build first.`);
  process.exit(1);
}

if (buildInfo.serverEntry !== correctEntry) {
  console.log(`Fixing nitro.json serverEntry: ${buildInfo.serverEntry} → ${correctEntry}`);
  console.log(`(Nitro upstream fix pending: ${UPSTREAM_FIX_PR})`);
  buildInfo.serverEntry = correctEntry;
  await writeFile(path, `${JSON.stringify(buildInfo, null, 2)}\n`);
} else {
  console.log(`nitro.json serverEntry is already ${correctEntry}`);
}
