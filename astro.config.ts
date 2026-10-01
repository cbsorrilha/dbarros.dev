import { readdir, rename, rmdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { defineConfig, envField, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerCodeBlock } from "./src/utils/transformers/codeBlock";
import { vlad } from "./src/utils/shiki-vlad";
import { rehypeFigure } from "./src/utils/rehype/figure";
import config from "./astro-paper.config";
import { DEFAULT_LOCALE, LOCALES } from "./src/i18n/locales";

/**
 * O Cloudflare Pages serve o 404.html mais próximo do caminho pedido. O Astro gera
 * as 404 de idioma e de tradução ausente como `…/404/index.html`; esta integração
 * as move para `…/404.html`.
 */
const flatten404: AstroIntegration = {
  name: "dbarros:flatten-404",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      const walk = async (path: string): Promise<void> => {
        for (const entry of await readdir(path, { withFileTypes: true })) {
          if (!entry.isDirectory()) continue;
          const child = join(path, entry.name);
          if (entry.name === "404") {
            await rename(join(child, "index.html"), `${child}.html`);
            await rmdir(child);
          } else {
            await walk(child);
          }
        }
      };
      await walk(fileURLToPath(dir));
    },
  },
};

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({ filter: page => !/\/404\/?$/.test(new URL(page).pathname) }),
    flatten404,
  ],
  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: {
      prefixDefaultLocale: true,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts, rehypeFigure],
    }),
    shikiConfig: {
      theme: vlad,
      wrap: false,
      transformers: [
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
        transformerCodeBlock(),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
