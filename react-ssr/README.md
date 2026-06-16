# React SSR + Module Federation

Custom SSR with Vite 8's Environment API: each app has a `server.js`, uses `createServerModuleRunner` in dev, and a single `vite build` that produces both client and server outputs.

Host and nested remotes use **`mf-manifest.json` entries** (remotes set `manifest: true`), which is the recommended way to resolve SSR remote chunks on the server. You can still use `remoteEntry.js` entries interchangeably per remote.

| App      | Port | Role                                                               |
| -------- | ---: | ------------------------------------------------------------------ |
| host     | 5173 | Host shell loading `remote_a/remote-app` and `remote_c/remote-app` |
| remote-a | 4173 | Remote card that nests `remote_b/remote-app`                       |
| remote-b | 4174 | Nested remote card                                                 |
| remote-c | 4175 | Second remote card                                                 |

## Run

From the repo root (after `pnpm install`):

```bash
pnpm react-ssr:build
pnpm react-ssr:preview   # all apps in parallel
pnpm react-ssr:dev
```

Open **http://localhost:5173/** after remotes are up (~few seconds). If the host errors on first load, refresh once remotes finish starting.

**Ordered start (optional):** four terminals — `preview:remote-b` → `preview:remote-c` → `preview:remote-a` → `preview:host`. `build` uses `&&` because each command exits; `dev`/`preview` use `--parallel` because servers keep running.

**Port clash:** Nuxt uses **4173** — do not run Nuxt and react-ssr dev together.

## Build

Each app runs one command:

```bash
vite build
```

Vite builds two environments in sequence (`client` → `ssr`), writing to `dist/client` and `dist/server` respectively. The MF plugin auto-selects `target: 'node'` for the SSR environment via `config.build.ssr`.

## Dev

`server.js` uses Vite middleware mode plus `createServerModuleRunner(vite.environments.ssr)` to load the server entry (replacing legacy `ssrLoadModule`). Add `import.meta.hot.accept()` in `entry-server.tsx` for optimal HMR.

## Why This Example Exists

TanStack and Nuxt already work on `main` because their framework integrations own the SSR serving model and provide the runtime shape the federation plugin can hook into.

This example covers lower-level custom SSR: host and remotes are separate Vite apps, each uses the Environment API for a unified build, and the host imports remotes through normal federation imports instead of local file paths.
