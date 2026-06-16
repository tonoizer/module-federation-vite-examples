import { federation } from "@module-federation/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { nitro } from "nitro/vite";
import { copyMfSsrToPublic } from "./plugins/copy-mf-ssr-public.mjs";
import { devCors } from "./plugins/dev-cors.mjs";

export default defineConfig(() => ({
  nitro: {
    traceDeps: [
      "vue",
      "vue-router",
      "@module-federation/runtime",
      "@module-federation/runtime-core",
      "@module-federation/sdk",
    ],
    routeRules: {
      "/**": {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    },
  },
  plugins: [
    patchVueExclude(vue(), /\?assets/),
    devtoolsJson(),
    federation({
      dts: false,
      name: "remote",
      filename: "remoteEntry.js",
      manifest: true,
      exposes: {
        "./Widget": "./app/components/Widget.vue",
        "./Counter": "./app/components/Counter.vue",
      },
      shared: {
        vue: { singleton: true, requiredVersion: "^3.5.0" },
        "vue-router": { singleton: true, requiredVersion: "^5.0.0" },
        "nitro-vue-shared": { singleton: true, requiredVersion: "0.0.0" },
      },
    }),
    nitro(),
    copyMfSsrToPublic(),
    devCors(),
  ],
  build: {
    target: "chrome89",
  },
  server: {
    port: 4174,
    cors: true,
    origin: "http://localhost:4174",
  },
  environments: {
    client: { build: { rollupOptions: { input: "./app/entry-client.ts" } } },
    ssr: { build: { rollupOptions: { input: "./app/entry-server.ts" } } },
    nitro: { build: { rollupOptions: { treeshake: { moduleSideEffects: () => false } } } },
  },
}));

function patchVueExclude(plugin, exclude) {
  const original = plugin.transform.handler;
  plugin.transform.handler = function (...args) {
    if (exclude.test(args[1])) return;
    return original.call(this, ...args);
  };
  return plugin;
}
