import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { LOCALES } from "@/i18n/locales";
import { TAG_SLUGS } from "@/content/tags";

export const POSTS_PATH = "src/content/posts";

const locale = z.enum(LOCALES);

/**
 * Um post é uma pasta `src/content/posts/<slug>/` com um arquivo por idioma
 * (`pt.md`, `en.md`, `es.md`). O id da entrada é `<slug>/<lang>`.
 * Regras entre arquivos de um mesmo post: src/utils/posts.ts.
 */
const posts = defineCollection({
  loader: glob({ pattern: "*/*.md", base: `./${POSTS_PATH}` }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z
      .array(
        z.enum(TAG_SLUGS, {
          error: issue =>
            `tag "${String(issue.input)}" desconhecida; use uma de: ${TAG_SLUGS.join(", ")} (definidas em src/content/tags.ts)`,
        })
      )
      .default([])
      .refine(tags => new Set(tags).size === tags.length, {
        message: "tag repetida",
      }),
    lang: locale,
    source_lang: locale,
    draft: z.boolean().default(false),
    translation: z
      .object({
        source_hash: z.string().regex(/^sha256:[0-9a-f]+$/),
        model: z.string(),
        translated_at: z.coerce.date(),
        locked: z.boolean().default(false),
      })
      .optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { posts, pages };
