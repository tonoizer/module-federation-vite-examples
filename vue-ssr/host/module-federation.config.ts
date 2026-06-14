import { createModuleFederationConfig } from "@module-federation/vite";

export default createModuleFederationConfig({
  name: "host",
  hostInitInjectLocation: "entry",
  remotes: {
    remote_a: {
      type: "module",
      name: "remote_a",
      entryGlobalName: "remote_a",
      entry: "http://localhost:4173/mf-manifest.json",
      shareScope: "default",
    },
    remote_b: {
      type: "module",
      name: "remote_b",
      entryGlobalName: "remote_b",
      entry: "http://localhost:4174/mf-manifest.json",
      shareScope: "default",
    },
    remote_c: {
      type: "module",
      name: "remote_c",
      entryGlobalName: "remote_c",
      entry: "http://localhost:4175/mf-manifest.json",
      shareScope: "default",
    },
  },
  filename: "remoteEntry.js",
  manifest: true,
  dts: false,
  dev: { remoteHmr: true },
  shared: {
    vue: {
      singleton: true,
      requiredVersion: "^3.5.29",
    },
  },
});
