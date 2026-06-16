# Nitro + React + Module Federation SSR

Full-stack SSR demo with Nitro v3, Vite, React 19, and Module Federation.

Based on the official [vite-ssr-react](https://github.com/nitrojs/nitro/tree/main/examples/vite-ssr-react) Nitro example, extended with Module Federation (host + remote).

Host and remote are both full Nitro SSR apps with their own `vite.config.mjs`. The only difference is federation: the host loads remotes, the remote exposes modules.

## Getting started

```bash
pnpm build
pnpm preview
```

Open http://localhost:4173/ (host) and http://localhost:4174/ (remote standalone).

## Nitro configuration

Each app follows the Nitro Vite plugin layout from the upstream template:

- `environments.client` — browser entry (`entry-client.tsx`)
- `environments.ssr` — SSR entry (`entry-server.tsx`)
- `environments.nitro` — server bundle with `moduleSideEffects: false` treeshake
- `entry-server` uses `?assets=client` / `?assets=ssr` and `clientAssets.merge(serverAssets)` for asset manifests

Module Federation adds `traceDeps` (keep React external in the Nitro bundle), federation plugin config, and remote CORS `routeRules` in preview.

## Nitro + Module Federation caveats

When the remote exposes modules, Nitro may write the wrong `serverEntry` in `.output/nitro.json` (pointing at an MF expose chunk instead of `server/index.mjs`). The remote build runs `scripts/fix-nitro-json.mjs` as a workaround until [nitrojs/nitro#4352](https://github.com/nitrojs/nitro/pull/4352) lands.

Preview uses `node .output/server/index.mjs` (not `vite preview`) so both host and remote run as Nitro servers.

The remote uses `plugins/copy-mf-ssr-public.mjs` to copy `remoteEntry.ssr.js`, `mf-manifest.json`, and SSR expose chunks into `public/` during the SSR build. Nitro registers `public/` at init time (see `public/.gitkeep`), then copies it to `.output/public` during the build. Without this, Nitro serves HTML for those URLs and host SSR cannot load remote modules in preview.

The remote uses `plugins/dev-cors.mjs` so the host can fetch `remoteEntry.js` cross-origin in dev (preview uses `routeRules` headers instead).

## UI

- **Host app card** — blue card with a star icon and a host-only counter (client-only).
- **Host SSR card** — blue card with copy that appears before hydration, then shows a clickable counter and a status badge.
- **Remote app card** — dark card with a cloud icon, the host theme label/colour, and a remote counter.
- **Remote SSR card** — dark card with pre-hydration copy, the host theme label/colour, a counter after hydration, and a status badge.
- **Status badges** — cards start as `SSR`, then switch to `Hydrated` after the page becomes interactive.
