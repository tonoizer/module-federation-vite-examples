import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

// Copy MF SSR assets into `public/` during the SSR build phase. Nitro registers
// `public/` at init (keep `public/.gitkeep` so the dir exists), then copies
// `public/` → `.output/public` during the build.
export function copyMfSsrToPublic() {
  return {
    name: "mf-copy-ssr-to-public",
    apply: "build",
    enforce: "post",
    writeBundle(outputOptions) {
      const ssrDir = outputOptions.dir;
      if (!ssrDir) return;

      const ssrEntry = resolve(ssrDir, "remoteEntry.ssr.js");
      if (!existsSync(ssrEntry)) return;

      const publicDir = resolve("public");
      mkdirSync(publicDir, { recursive: true });

      for (const file of ["remoteEntry.ssr.js", "mf-manifest.json"]) {
        const src = resolve(ssrDir, file);
        if (existsSync(src)) {
          copyFileSync(src, resolve(publicDir, file));
          console.log(`[mf-copy-ssr-to-public] copied ${file}`);
        }
      }

      const ssrAssets = resolve(ssrDir, "assets");
      if (existsSync(ssrAssets)) {
        const destAssets = resolve(publicDir, "assets");
        mkdirSync(destAssets, { recursive: true });
        cpSync(ssrAssets, destAssets, { recursive: true });
        console.log("[mf-copy-ssr-to-public] copied SSR assets/");
      }
    },
  };
}
