import { federation } from "@module-federation/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [
      federation({
        dts: false,
        filename: "remoteEntry.js",
        name: "remote",
        exposes: {
          "./remote-app": "./src/remote-app.ts",
        },
        remotes: {},
        shared: {
          alpinejs: { singleton: true },
        },
      }),
    ],
  };
});
