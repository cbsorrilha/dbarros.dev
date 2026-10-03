import { createHash } from "node:crypto";
import { readdir, readFile, rename, rmdir, writeFile } from "node:fs/promises";
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

/**
 * Completa a Content-Security-Policy do `_headers` com os hashes SHA-256 dos
 * scripts inline executáveis de todo HTML gerado (hoje, só o botão Copiar). Assim
 * `script-src` fica sem 'unsafe-inline' e um script novo entra sozinho na política.
 */
const SCRIPT_HASHES = "{{SCRIPT_HASHES}}";
const INLINE_SCRIPT = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi;
const EXECUTABLE_TYPE = /\btype\s*=\s*["']?(module|text\/javascript)["']?/i;

const cspHashes: AstroIntegration = {
  name: "dbarros:csp-hashes",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      const root = fileURLToPath(dir);
      const hashes = new Set<string>();
      const walk = async (path: string): Promise<void> => {
        for (const entry of await readdir(path, { withFileTypes: true })) {
          const child = join(path, entry.name);
          if (entry.isDirectory()) await walk(child);
          else if (entry.name.endsWith(".html")) {
            const html = await readFile(child, "utf8");
            for (const [, attrs = "", body] of html.matchAll(INLINE_SCRIPT)) {
              const external = /\bsrc\s*=/i.test(attrs);
              const typed = /\btype\s*=/i.test(attrs);
              if (
                external ||
                (typed && !EXECUTABLE_TYPE.test(attrs)) ||
                !body.trim()
              ) {
                continue;
              }
              hashes.add(
                `'sha256-${createHash("sha256").update(body).digest("base64")}'`
              );
            }
          }
        }
      };
      await walk(root);

      const headersPath = join(root, "_headers");
      const template = await readFile(headersPath, "utf8");
      if (template.split(SCRIPT_HASHES).length !== 2) {
        throw new Error(
          `[csp] public/_headers precisa ter ${SCRIPT_HASHES} exatamente uma vez, na CSP`
        );
      }
      const list = [...hashes].sort().join(" ");
      await writeFile(
        headersPath,
        template.replace(SCRIPT_HASHES, list).replace(/'self' ;/, "'self';")
      );
    },
  },
};

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({ filter: page => !/\/404\/?$/.test(new URL(page).pathname) }),
    flatten404,
    cspHashes,
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
