import { createModuleFederationConfig } from "@module-federation/vite";

export default createModuleFederationConfig({
  name: "remote_b",
  filename: "remoteEntry.js",
  publicPath: "http://localhost:4174/",
  manifest: true,
  dts: false,
  dev: { remoteHmr: true },
  exposes: {
    "./remote-app": "./src/App.vue",
  },
  shared: {
    vue: {
      singleton: true,
      requiredVersion: "^3.5.29",
    },
  },
});
