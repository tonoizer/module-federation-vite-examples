#!/usr/bin/env node
/**
 * Full SSR verification: build, preview, and dev for vue-ssr, react-ssr, tanstack, nuxt.
 * Fails on build errors, unreachable URLs, Playwright console errors, or hydration warnings.
 */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Remotes first, then host — matches version-first MF init at host startup. */
function viteSsrStack(name) {
  const prefix = name;
  const mode = (role) => (m) => {
    const script = m === "preview" ? "preview" : "dev";
    return ["pnpm", "--filter", `${prefix}-${role}`, script];
  };
  return {
    name,
    build: ["pnpm", `${name}:build`],
    hostUrl: "http://localhost:5173/",
    remoteUrls: [
      "http://localhost:4173/remoteEntry.js",
      "http://localhost:4174/remoteEntry.js",
      "http://localhost:4175/remoteEntry.js",
    ],
    servers: (m) => [
      { label: "remote-a", cmd: mode("remote-a")(m) },
      { label: "remote-b", cmd: mode("remote-b")(m) },
      { label: "remote-c", cmd: mode("remote-c")(m) },
      { label: "host", cmd: mode("host")(m) },
    ],
    expectText: ["the host app", "the remote app"],
  };
}

const stacks = [
  viteSsrStack("vue-ssr"),
  viteSsrStack("react-ssr"),
  {
    name: "tanstack",
    build: ["pnpm", "tanstack:build"],
    hostUrl: "http://localhost:4173/",
    remoteUrls: ["http://localhost:4174/remoteEntry.js"],
    servers: (m) => {
      const script = m === "preview" ? "preview" : "dev";
      return [
        { label: "remote", cmd: ["pnpm", "--filter", "tanstack-remote", script] },
        { label: "host", cmd: ["pnpm", "--filter", "tanstack-host", script] },
      ];
    },
    expectText: ["the host app", "the remote app"],
  },
  {
    name: "nuxt",
    build: ["pnpm", "nuxt:build"],
    hostUrl: "http://localhost:4173/",
    remoteUrls: ["http://localhost:4174/remoteEntry.js"],
    servers: (m) => {
      const script = m === "preview" ? "preview" : "dev";
      return [
        { label: "remote", cmd: ["pnpm", "--filter", "nuxt-remote", script] },
        { label: "host", cmd: ["pnpm", "--filter", "nuxt-host", script] },
      ];
    },
    expectText: ["the host app", "Host SSR component", "the remote app"],
  },
];

const HYDRATION_RE =
  /hydration|Hydration failed|did not match|Text content does not match|server rendered HTML/i;
const CONSOLE_ERROR_ALLOWLIST = [
  // benign dev-only noise if any
];

function log(msg) {
  console.log(msg);
}

function fail(msg) {
  console.error(`\n✗ ${msg}`);
  process.exitCode = 1;
  throw new Error(msg);
}

async function run(cmd, label) {
  log(`\n▶ ${label}: ${cmd.join(" ")}`);
  await new Promise((resolve, reject) => {
    const child = spawn(cmd[0], cmd.slice(1), {
      cwd: root,
      stdio: "inherit",
      shell: false,
      env: { ...process.env, FORCE_COLOR: "0" },
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${label} exited with ${code}`));
    });
  });
  log(`✓ ${label}`);
}

async function waitForUrls(urls, timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs;
  const pending = new Set(urls);
  while (pending.size > 0) {
    if (Date.now() > deadline) {
      fail(`Timeout waiting for: ${[...pending].join(", ")}`);
    }
    for (const url of [...pending]) {
      try {
        const res = await fetch(url, { redirect: "follow" });
        if (res.ok || (url.includes("remoteEntry") && res.status < 500)) {
          pending.delete(url);
        }
      } catch {
        /* retry */
      }
    }
    if (pending.size > 0) await delay(500);
  }
}

function spawnServers(cmd, env = {}) {
  const tag = cmd.slice(2, 4).join("/") || cmd.join(" ");
  const child = spawn(cmd[0], cmd.slice(1), {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
    detached: true,
    env: { ...process.env, ...env, FORCE_COLOR: "0" },
  });
  const logs = { out: "", err: "" };
  child.stdout?.on("data", (d) => {
    logs.out += d.toString();
    process.stdout.write(`[${tag}] ${d}`);
  });
  child.stderr?.on("data", (d) => {
    logs.err += d.toString();
    process.stderr.write(`[${tag}] ${d}`);
  });
  return {
    child,
    logs,
    kill: () => {
      try {
        process.kill(-child.pid, "SIGTERM");
      } catch {
        child.kill("SIGTERM");
      }
    },
  };
}

async function browserCheck(hostUrl, expectText, label, waitUntil = "networkidle") {
  const consoleIssues = [];
  const pageErrors = [];
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.on("console", (msg) => {
      const text = msg.text();
      const type = msg.type();
      if (type === "error" && !CONSOLE_ERROR_ALLOWLIST.some((a) => text.includes(a))) {
        consoleIssues.push(`[console.${type}] ${text}`);
      }
      if (HYDRATION_RE.test(text)) {
        consoleIssues.push(`[hydration] ${text}`);
      }
    });
    page.on("pageerror", (err) => pageErrors.push(String(err)));

    const res = await page.goto(hostUrl, { waitUntil, timeout: 90_000 });
    if (!res || !res.ok()) {
      fail(`${label}: host returned ${res?.status()}`);
    }

    for (const t of expectText) {
      await page.getByText(t, { exact: false }).first().waitFor({ timeout: 15_000 });
    }

    // nuxt/tanstack: wait for hydration signals where applicable
    await delay(2000);

    if (pageErrors.length) {
      fail(`${label} page errors:\n${pageErrors.join("\n")}`);
    }
    if (consoleIssues.length) {
      fail(`${label} console issues:\n${consoleIssues.join("\n")}`);
    }
    log(`✓ ${label} browser (SSR HTML + no hydration/console errors)`);
  } finally {
    await browser.close();
  }
}

async function verifyMode(stack, mode, extraEnv = {}) {
  const label = `${stack.name} ${mode}`;
  const serverDefs = stack.servers(mode);
  const children = [];
  const logs = { out: "", err: "" };

  const killAll = () => {
    for (const { kill } of children) kill();
  };

  try {
    const remoteDefs = serverDefs.slice(0, -1);
    const hostDef = serverDefs.at(-1);

    for (const def of remoteDefs) {
      const spawned = spawnServers(def.cmd, extraEnv);
      children.push(spawned);
      logs.out += spawned.logs.out;
      logs.err += spawned.logs.err;
    }
    await waitForUrls(stack.remoteUrls, mode === "dev" ? 180_000 : 120_000);
    log(`✓ ${label} remotes up`);

    const hostSpawn = spawnServers(hostDef.cmd, extraEnv);
    children.push(hostSpawn);
    logs.out += hostSpawn.logs.out;
    logs.err += hostSpawn.logs.err;

    await waitForUrls([stack.hostUrl], mode === "dev" ? 180_000 : 120_000);
    await delay(2000);
    log(`✓ ${label} host up`);

    const htmlRes = await fetch(stack.hostUrl);
    const html = await htmlRes.text();
    for (const t of stack.expectText) {
      if (!html.includes(t)) {
        fail(`${label}: SSR HTML missing "${t}"`);
      }
    }
    log(`✓ ${label} SSR HTML contains expected markers`);

    const waitUntil = mode === "dev" || stack.name === "nuxt" ? "load" : "networkidle";
    await browserCheck(stack.hostUrl, stack.expectText, label, waitUntil);

    const combined = logs.out + logs.err;
    const badLogLines = combined.split("\n").filter((l) => {
      if (/Federation Runtime.*Failed to load/i.test(l)) return true;
      if (/\bUnhandled\b|ECONNREFUSED/i.test(l)) return true;
      if (/\bERROR\b/.test(l) && !/ELIFECYCLE/.test(l)) return true;
      return false;
    });
    if (badLogLines.length) {
      fail(`${label} server log errors:\n${badLogLines.slice(0, 15).join("\n")}`);
    }
  } finally {
    killAll();
    await delay(1500);
  }
}

async function main() {
  const modes = process.argv.includes("--skip-dev")
    ? ["preview"]
    : process.argv.includes("--dev-only")
      ? ["dev"]
      : ["preview", "dev"];
  const skipBuild = process.argv.includes("--skip-build");
  const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];

  log("=== SSR full verification ===\n");

  for (const stack of stacks) {
    if (only && stack.name !== only) continue;

    if (!skipBuild) {
      await run(stack.build, `${stack.name} build`);
    }

    for (const mode of modes) {
      const env = mode === "preview" ? { NODE_ENV: "production" } : { NODE_ENV: "development" };
      if (stack.name === "tanstack" && mode === "dev") {
        await run(["pnpm", "--filter", "tanstack-shared", "build"], "tanstack-shared build");
      }
      await verifyMode(stack, mode, env);
    }
  }

  if (process.exitCode) {
    fail("Verification failed (see above)");
  }
  log("\n=== All SSR stacks passed build + runtime checks ===\n");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
