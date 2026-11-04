import { readFile } from "node:fs/promises";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import { defineConfig, type Plugin } from "vite";
import userscript from "vite-userscript-plugin";
import pkg from "./package.json" with { type: "json" };

const toTemplateLiteral = (value: string): string =>
    `\`${value
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`")
        .replace(/\$\{/g, "\\${")}\``;

const USERSCRIPT_CSS_MODULES_SUFFIX = ".userscript-css-modules.js";

const userscriptCssModules = (): Plugin => ({
    name: "css-module",
    enforce: "pre",

    async resolveId(source, importer, options) {
        if (!source.endsWith(".css?module")) {
            return;
        }

        const resolved = await this.resolve(
            source.replace(/\?module$/, ""),
            importer,
            { ...options, skipSelf: true },
        );

        if (!resolved) {
            return;
        }

        return `${resolved.id}${USERSCRIPT_CSS_MODULES_SUFFIX}`;
    },

    async load(id) {
        if (!id.endsWith(USERSCRIPT_CSS_MODULES_SUFFIX)) {
            return;
        }

        const file = id.slice(0, -USERSCRIPT_CSS_MODULES_SUFFIX.length);
        const source = await readFile(file, "utf-8");

        let style: Record<string, string> = {};
        const result = await postcss([
            postcssModules({
                generateScopedName:
                    "userscript_[name]__[local]___[hash:base64:5]",
                getJSON(_filename, json) {
                    style = json;
                },
            }),
        ]).process(source, { from: file });

        return `
            export const style = ${JSON.stringify(style)};
            export const css = ${toTemplateLiteral(result.css)};
        `;
    },
});

export default defineConfig({
    build: {
        rolldownOptions: {
            output: {
                banner: '"use strict";',
            },
        },
        watch:
            process.env.NODE_ENV === "development"
                ? {
                      include: ["src/**"],
                      clearScreen: true,
                  }
                : undefined,
    },
    plugins: [
        userscriptCssModules(),
        userscript({
            entry: "src/index.ts",
            header: {
                name: pkg.name,
                "name:ja": "YouTube - サムネイルといっしょ",
                description: pkg.description,
                "description:ja":
                    "YouTubeのサムネイルに関するちょっとした機能を追加するユーザースクリプトです。",
                icon: "https://www.google.com/s2/favicons?sz=64&domain=www.youtube.com",
                version: pkg.version,
                author: pkg.author,
                license: pkg.license,
                match: "https://www.youtube.com/*",
                namespace: "https://github.com/sqrtox/yt-thumbnail-anywhere",
                grant: "none",
            },
        }),
    ],
});
