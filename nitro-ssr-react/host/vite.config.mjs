import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  nitro: {
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
        "nitro-react-shared": { singleton: true, requiredVersion: "0.0.0" },
      },
    }),
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
  environments: {
    client: {
      build: { rollupOptions: { input: "./src/entry-client.tsx" } },
    },
    ssr: { build: { rollupOptions: { input: "./src/entry-server.tsx" } } },
    nitro: { build: { rollupOptions: { treeshake: { moduleSideEffects: () => false } } } },
  },
});
