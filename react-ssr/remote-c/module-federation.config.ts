import { createModuleFederationConfig } from "@module-federation/vite";

export default createModuleFederationConfig({
  name: "remote_c",
  filename: "remoteEntry.js",
  publicPath: "http://localhost:4175/",
  manifest: true,
  dts: false,
  bundleAllCSS: true,
  dev: { remoteHmr: true },
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
