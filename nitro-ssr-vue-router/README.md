# Nitro + Vue + Module Federation SSR

Full-stack SSR demo with Nitro v3, Vite, Vue 3, Vue Router, and Module Federation.

Based on the official [vite-ssr-vue-router](https://github.com/nitrojs/nitro/tree/main/examples/vite-ssr-vue-router) Nitro example, extended with Module Federation (host + remote).

Host and remote are both full Nitro SSR apps with their own `vite.config.mjs`. The only difference is federation: the host loads remotes, the remote exposes modules.

## Getting started

```bash
pnpm build
pnpm preview
```

Open http://localhost:4173/ (host) and http://localhost:4174/ (remote standalone).

## Nitro configuration

Each app follows the Nitro Vite plugin layout from the upstream template:

- `patchVueExclude(vue(), /\?assets/)` — workaround for [vite-plugin-vue#677](https://github.com/vitejs/vite-plugin-vue/issues/677)
- `environments.client` / `environments.ssr` — browser and SSR entries
- `environments.nitro` — server bundle with `moduleSideEffects: false` treeshake
- Route `meta.assets` with `?assets` imports for per-route CSS/JS (see `app/routes.ts`)
- `unhead` for injecting stylesheets and modulepreload links in `entry-server.ts`

Module Federation adds `traceDeps`, federation plugin config, host `mf-init.ts` (awaits `initHost()` before hydration), and remote CORS.

## Nitro + Module Federation caveats

When the remote exposes modules, Nitro may write the wrong `serverEntry` in `.output/nitro.json` (pointing at an MF expose chunk instead of `server/index.mjs`). The remote build runs `scripts/fix-nitro-json.mjs` as a workaround until [nitrojs/nitro#4352](https://github.com/nitrojs/nitro/pull/4352) lands.

Preview uses `node .output/server/index.mjs` (not `vite preview`) so both host and remote run as Nitro servers.

The remote uses `plugins/copy-mf-ssr-public.mjs` to copy `remoteEntry.ssr.js`, `mf-manifest.json`, and SSR expose chunks into `public/` during the SSR build. Nitro registers `public/` at init time (see `public/.gitkeep`), then copies it to `.output/public` during the build. Without this, Nitro serves HTML for those URLs and host SSR cannot load remote modules in preview.

The host client entry awaits `initHost()` via `app/mf-init.ts` so shared modules (including `nitro-vue-shared`) are ready before hydration.

The remote uses `plugins/dev-cors.mjs` so the host can fetch `remoteEntry.js` cross-origin in dev.

## UI

- **Host app card** — blue card with a star icon and a host-only counter (client-only).
- **Host SSR card** — blue card with copy that appears before hydration, then shows a clickable counter and a status badge.
- **Remote app card** — dark card with a cloud icon, the host theme label/colour, and a remote counter.
- **Remote SSR card** — dark card with pre-hydration copy, the host theme label/colour, a counter after hydration, and a status badge.
- **Status badges** — cards start as `SSR`, then switch to `Hydrated` after the page becomes interactive.
