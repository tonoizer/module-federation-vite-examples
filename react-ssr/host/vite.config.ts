import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import type { SSROptions } from "vite";
import { defineConfig } from "vite";
import moduleFederationConfig from "./module-federation.config";

const reactSsrPackages = ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"];
// Keep react external so Node loads real CJS packages; do not share react via MF (see module-federation.config).
const ssr: SSROptions = { external: reactSsrPackages };

export default defineConfig({
  appType: "custom",
  plugins: [
    ...federation({
      ...moduleFederationConfig,
    }),
    react({ jsxRuntime: "automatic" }),
  ],
  server: {
    fs: { allow: [".", "..", "../../react/shared-ui"] },
    port: 5173,
    strictPort: true,
    origin: "http://localhost:5173",
  },
  ssr,
  environments: {
    client: {
      build: { target: "chrome89", outDir: "dist/client", manifest: true },
    },
    ssr: {
      build: {
        outDir: "dist/server",
        rollupOptions: {
          input: { "entry-server": "/src/entry-server.tsx" },
        },
      },
    },
  },
  builder: {
    async buildApp(builder) {
      await builder.build(builder.environments.client);
      await builder.build(builder.environments.ssr);
    },
  },
});
