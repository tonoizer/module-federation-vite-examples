import { build } from "esbuild";
import { mkdirSync } from "fs";

mkdirSync("dist", { recursive: true });
await build({
  entryPoints: ["shared.ts"],
  outfile: "dist/shared.js",
  bundle: true,
  format: "esm",
  platform: "neutral",
  external: ["react"],
});
console.log("nitro-react-shared built");
