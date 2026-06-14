# Vue SSR + Module Federation

This mirrors the React SSR demo with Vue 3 components. It follows the plain Vite SSR pattern: custom `server.js`, Vite middleware plus `ssrLoadModule` in dev, and separate client/server builds in production.

Host and nested remotes use **`mf-manifest.json` entries** (remotes set `manifest: true`), aligned with react-ssr and the [Module Federation Chrome DevTools](https://module-federation.io/guide/debug/chrome-devtool). You can still use `remoteEntry.js` entries interchangeably per remote.

| App      | Port | Role                                                               |
| -------- | ---: | ------------------------------------------------------------------ |
| host     | 5173 | Host shell loading `remote_a/remote-app` and `remote_c/remote-app` |
| remote-a | 4173 | Remote card that nests `remote_b/remote-app`                       |
| remote-b | 4174 | Nested remote card                                                 |
| remote-c | 4175 | Second remote card                                                 |

## Run

From the repo root (after `pnpm install`):

```bash
pnpm vue-ssr:build
pnpm vue-ssr:preview   # all apps in parallel
pnpm vue-ssr:dev
```

Open **http://localhost:5173/** after remotes are up. Refresh once if the first SSR request races startup.

**Ordered start (optional):** `preview:remote-b` → `preview:remote-c` → `preview:remote-a` → `preview:host` in separate terminals.

## Why This Example Exists

TanStack and Nuxt already work on `main` because their framework integrations own the SSR serving model and provide the runtime shape the federation plugin can hook into.

This example covers lower-level custom SSR: host and remotes are separate Vite apps, each app is built twice (`vite build` and `vite build --ssr`), and the host imports remotes through normal federation imports instead of local file paths. The plugin changes make that dual-build setup emit and load SSR remote entries consistently while leaving framework paths unchanged.
