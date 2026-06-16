import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { copyMfSsrToPublic } from "./plugins/copy-mf-ssr-public.mjs";
import { devCors } from "./plugins/dev-cors.mjs";

export default defineConfig({
  nitro: {
    traceDeps: [
      "react",
      "react-dom",
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
    federation({
      dts: false,
      name: "remote",
      filename: "remoteEntry.js",
      manifest: true,
      exposes: {
        "./Widget": "./src/components/Widget.tsx",
        "./Counter": "./src/components/Counter.tsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        "nitro-react-shared": { singleton: true, requiredVersion: "0.0.0" },
      },
    }),
    react(),
    nitro(),
    copyMfSsrToPublic(),
    devCors(),
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
    port: 4174,
    cors: true,
    origin: "http://localhost:4174",
  },
  environments: {
    client: {
      build: { rollupOptions: { input: "./src/entry-client.tsx" } },
    },
    ssr: { build: { rollupOptions: { input: "./src/entry-server.tsx" } } },
    nitro: { build: { rollupOptions: { treeshake: { moduleSideEffects: () => false } } } },
  },
});
