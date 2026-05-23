import type { SSROptions } from "vite";
import { defineConfig } from "vite";
import path from "node:path";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";
import moduleFederationConfig from "./module-federation.config";

const vueSsrPackages = ["vue", "@vue/server-renderer", "@vue/compiler-ssr"];

export default defineConfig(({ isSsrBuild, command }) => {
  const isDev = command === "serve";
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
      port: 4174,
      strictPort: true,
      cors: true,
      origin: "http://localhost:4174",
    },
    preview: {
      port: 4174,
      strictPort: true,
      cors: true,
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
