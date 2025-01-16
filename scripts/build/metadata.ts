import type { Metadata } from "userscript-metadata";
import pkg from "##/package.json" with { type: "json" };
import languageEn from "#src/i18n/languages/en.json" with { type: "json" };
import languageJa from "#src/i18n/languages/ja.json" with { type: "json" };

const url = pkg.repository.url.replaceAll(/^git\+|\.git$/g, "");

export const metadata: Metadata = {
  name: languageEn.translation["userscript.metadata.name"],
  "name:ja": languageJa.translation["userscript.metadata.name"],
  description: languageEn.translation["userscript.metadata.description"],
  "description:ja": languageJa.translation["userscript.metadata.description"],
  version: pkg.version,
  icon: "https://www.google.com/s2/favicons?sz=64&domain=www.youtube.com",
  match: "https://www.youtube.com/*",
  namespace: url,
  author: pkg.author,
  license: pkg.license,
  grant: "none",
};
