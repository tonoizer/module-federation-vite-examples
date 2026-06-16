import { build } from "esbuild";
import { mkdirSync } from "fs";

mkdirSync("dist", { recursive: true });
await build({
  entryPoints: ["theme.ts"],
  outfile: "dist/theme.js",
  bundle: true,
  format: "esm",
  platform: "neutral",
  external: ["vue"],
});
console.log("nitro-vue-shared built");
