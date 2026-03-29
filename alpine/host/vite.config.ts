import { federation } from "@module-federation/vite";
import { defineConfig } from "vite";

export default defineConfig(() => ({
  plugins: [
    federation({
      dts: false,
      name: "host",
      remotes: {
        remote: {
          type: "module",
          name: "remote",
          entry: "http://localhost:4174/remoteEntry.js",
          entryGlobalName: "remote",
          shareScope: "default",
        },
      },
      exposes: {},
      filename: "remoteEntry.js",
      shared: {
        alpinejs: { singleton: true },
      },
    }),
  ],
}));
