import { createModuleFederationConfig } from "@module-federation/vite";

export default createModuleFederationConfig({
  name: "remote_a",
  filename: "remoteEntry.js",
  publicPath: "http://localhost:4173/",
  manifest: true,
  dts: false,
  remotes: {
    remote_b: {
      type: "module",
      name: "remote_b",
      entryGlobalName: "remote_b",
      entry: "http://localhost:4174/remoteEntry.js",
      shareScope: "default",
    },
  },
  exposes: {
    "./remote-app": "./src/App.vue",
    "./format-utils": "./src/utils/format.ts",
  },
  shared: {
    vue: {
      singleton: true,
      requiredVersion: "^3.5.29",
    },
  },
});
