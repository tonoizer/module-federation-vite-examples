import { federation } from "@module-federation/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { nitro } from "nitro/vite";

export default defineConfig(() => ({
  nitro: {
    traceDeps: [
      "vue",
      "vue-router",
      "@module-federation/runtime",
      "@module-federation/runtime-core",
      "@module-federation/sdk",
    ],
  },
  plugins: [
    patchVueExclude(vue(), /\?assets/),
    devtoolsJson(),
    federation({
      dts: false,
      name: "host",
      manifest: true,
      hostInitInjectLocation: "entry",
      remotes: {
        remote: {
          type: "module",
          name: "remote",
          entry: "http://localhost:4174/remoteEntry.js",
        },
      },
      shared: {
        vue: { singleton: true, requiredVersion: "^3.5.0" },
        "vue-router": { singleton: true, requiredVersion: "^5.0.0" },
        "nitro-vue-shared": { singleton: true, requiredVersion: "0.0.0" },
      },
    }),
    nitro(),
  ],
  build: {
    target: "chrome89",
  },
  server: {
    port: 4173,
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
