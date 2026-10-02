import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import { LOCALES, isLocale, type Locale } from "../../src/i18n/locales.ts";
import { sourceHash } from "./hash.ts";

export const POSTS_DIR = "src/content/posts";

export type Translation = {
  source_hash: string;
  model: string;
  translated_at: string;
  locked: boolean;
};

export type PostFile = {
  path: string;
  lang: Locale;
  data: Record<string, unknown> & {
    title: string;
    description: string;
    source_lang: Locale;
    draft?: boolean;
    translations?: Locale[];
    translation?: Translation;
  };
  body: string;
};

export type Post = {
  slug: string;
  dir: string;
  source: PostFile;
  hash: string;
  /** Idiomas em que o post deve existir (`translations` do fonte ou todos). */
  expected: Locale[];
  files: Partial<Record<Locale, PostFile>>;
};

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function parseMarkdown(text: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const match = FRONT_MATTER.exec(text);
  if (!match) throw new Error("front matter ausente");
  // Datas ficam como texto (AAAA-MM-DD): são copiadas, não interpretadas.
  const data = parse(match[1], { schema: "core" }) ?? {};
  return { data, body: match[2] };
}

async function readPostFile(path: string, lang: Locale): Promise<PostFile> {
  const { data, body } = parseMarkdown(await readFile(path, "utf8"));
  return { path, lang, data: data as PostFile["data"], body };
}

/**
 * Lê todos os posts do disco. As regras de coerência entre arquivos são do build
 * (src/utils/posts.ts); aqui só o necessário para traduzir e checar.
 */
export async function readPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  const slugs = (await readdir(POSTS_DIR, { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();

  for (const slug of slugs) {
    const dir = join(POSTS_DIR, slug);
    const files: Partial<Record<Locale, PostFile>> = {};
    for (const name of await readdir(dir)) {
      const lang = name.replace(/\.md$/, "");
      if (name.endsWith(".md") && isLocale(lang)) {
        files[lang] = await readPostFile(join(dir, name), lang);
      }
    }
    const any = Object.values(files)[0];
    if (!any) continue;
    const source = files[any.data.source_lang];
    if (!source) {
      throw new Error(`${slug}: arquivo-fonte ${any.data.source_lang}.md não existe`);
    }
    posts.push({
      slug,
      dir,
      source,
      hash: sourceHash({
        title: source.data.title,
        description: source.data.description,
        body: source.body,
      }),
      expected: source.data.translations ?? [...LOCALES],
      files,
    });
  }
  return posts;
}
