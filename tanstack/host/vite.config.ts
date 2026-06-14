import { federation } from "@module-federation/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  nitro: {
    // Keep react/react-dom as Node externals in the Nitro SSR bundle so all
    // server-side code shares the same require() module instance via Node's
    // CJS module cache. Without this, Nitro bundles React inline and the
    // remote's react instance diverges, breaking hooks and context.
    traceDeps: [
      "react",
      "react-dom",
      "@module-federation/runtime",
      "@module-federation/runtime-core",
      "@module-federation/sdk",
    ],
  },
  plugins: [
    federation({
      dts: false,
      name: "host",
      filename: "remoteEntry.js",
      manifest: true,
      hostInitInjectLocation: "entry",
      remotes: {
        remote: {
          type: "module",
          name: "remote",
          entry: "http://localhost:4174/mf-manifest.json",
        },
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        "tanstack-shared": { singleton: true, requiredVersion: "0.0.0" },
      },
    }),
    tanstackStart(),
    react(),
    nitro(),
  ],
  ssr: {
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  },
  build: {
    target: "chrome89",
  },
  server: {
    port: 4173,
  },
  preview: {
    port: 4173,
  },
});
