import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node22",
  outfile: "dist/index.cjs",
  format: "cjs",
  banner: {
    js: `#!/usr/bin/env node`,
  },
  minify: false,
  sourcemap: false,
});

console.log("Build complete!");
