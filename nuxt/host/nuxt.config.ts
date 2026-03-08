import { federation } from "@module-federation/vite";
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// In dev, Nuxt serves Vite assets under /_nuxt/ base.
// In production/preview, remoteEntry.js is at the root (copied by the build hook below).
const isDev = process.env.NODE_ENV !== "production";
const remoteBase = isDev ? "/_nuxt" : "";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  modules: ["@pinia/nuxt"],

  experimental: {
    buildCache: false,
  },

  hooks: {
    // The federation plugin emits remoteEntry.js at the output root so its
    // relative imports ("./_nuxt/chunk.js") resolve correctly.
    // Nuxt only deploys _nuxt/ to .output/public/, so we copy it manually.
    // We also write a copy under _nuxt/ (with adjusted imports) for Nuxt's
    // modulepreload hints which reference /_nuxt/remoteEntry.js.
    "nitro:build:public-assets"(nitro) {
      const src = resolve(nitro.options.buildDir, "dist/client/remoteEntry.js");
      const publicDir = nitro.options.output.publicDir;
      if (!existsSync(src)) return;
      // Root copy (used by dynamic imports with relative paths)
      cpSync(src, resolve(publicDir, "remoteEntry.js"));
      // _nuxt/ copy (for Nuxt's modulepreload hints) — adjust relative imports
      const code = readFileSync(src, "utf-8").replace(/"\.\/_nuxt\//g, '"./');
      writeFileSync(resolve(publicDir, "_nuxt/remoteEntry.js"), code);
    },
  },

  vite: {
    plugins: [
      federation({
        dts: false,
        name: "host",
        remotes: {
          remote: {
            type: "module",
            name: "remote",
            entry: `http://localhost:4174${remoteBase}/remoteEntry.js`,
            entryGlobalName: "remote",
            shareScope: "default",
          },
        },
        exposes: {},
        filename: "remoteEntry.js",
      }) as any,
    ],
  },
});
