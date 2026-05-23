import { createModuleFederationConfig } from "@module-federation/vite";

export default createModuleFederationConfig({
  name: "remote_c",
  filename: "remoteEntry.js",
  publicPath: "http://localhost:4175/",
  manifest: true,
  dts: false,
  dev: { remoteHmr: true },
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
