import type { SSROptions } from "vite";
import { defineConfig } from "vite";
import path from "node:path";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";
import moduleFederationConfig from "./module-federation.config";

const vueSsrPackages = ["vue", "@vue/server-renderer", "@vue/compiler-ssr"];

export default defineConfig(({ isSsrBuild, command }) => {
  const isDev = command === "serve";
  // Keep vue external so Node loads real packages; do not share vue via MF (see module-federation.config).
  const ssr: SSROptions = isSsrBuild || isDev ? { external: vueSsrPackages } : {};

  return {
    plugins: [
      ...federation({
        ...moduleFederationConfig,
        ...(isSsrBuild ? { target: "node" as const } : {}),
      }),
      vue(),
    ],
    server: {
      port: 5173,
      strictPort: true,
      cors: false,
      origin: "http://localhost:5173",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    build: {
      target: "chrome89",
      outDir: "dist/client",
      ...(!isSsrBuild ? { manifest: true } : {}),
    },
    ssr,
  };
});
