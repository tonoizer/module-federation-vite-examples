import { createModuleFederationConfig } from "@module-federation/vite";

export default createModuleFederationConfig({
  name: "remote_a",
  filename: "remoteEntry.js",
  publicPath: "http://localhost:4173/",
  manifest: true,
  dts: false,
  dev: { remoteHmr: true },
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
    "./remote-app": "./src/App.tsx",
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: "^19.2.4",
    },
    "react-dom": {
      singleton: true,
      requiredVersion: "^19.2.4",
    },
  },
});
