# SvelteKit host and remote

This example uses SvelteKit's server rendering for the host shell, then mounts a federated Svelte remote on the client. It keeps the remote mount client-side because the current Vite federation integration does not provide a single, hydratable Svelte component contract across the server and browser.

## Getting started

From this directory execute:

```bash
pnpm build
pnpm preview
```

Open http://localhost:4173/.

## Validation

```bash
PLAYWRIGHT_TEST_COMMAND="pnpm svelte:preview" pnpm exec playwright test
```

The tests verify host SSR markup, then verify the federated remote loads and both counters are interactive in the browser.

![screenshot](docs/screenshot.png)
