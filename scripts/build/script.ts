// biome-ignore lint/correctness/noNodejsModules: Ignore this as we expect this script to be run server-side
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { stringify } from "userscript-metadata";
import pkg from "##/package.json" with { type: "json" };
import { metadata } from "##/scripts/build/metadata.js";

const fileName = pkg.name.replace(/^userscript-/, "");
const rootDir = resolve(import.meta.dirname, "../../");
const distFilePath = join(rootDir, `dist/${fileName}.user.js`);

await build({
  charset: "utf8",
  target: "esnext",
  platform: "browser",
  bundle: true,
  entryPoints: ["src/index.ts"],
  outfile: distFilePath,
  format: "esm",
  legalComments: "inline",
  banner: {
    js: `
    ${stringify(metadata)}

    // NOTE: This file was built by esbuild

    (async () => {
      "use strict";`,
  },
  footer: {
    js: "})();",
  },
});
