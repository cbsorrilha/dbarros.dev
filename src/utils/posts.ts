import { getCollection, type CollectionEntry } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import { isLocale, LOCALES, type Locale } from "@/i18n/locales";
import { POSTS_PATH } from "@/content.config";
import { TAG_SLUGS } from "@/content/tags";
import tokensCss from "@/styles/vlad-tokens.css?raw";

export type PostEntry = CollectionEntry<"posts">;

/** Um post: a pasta `<slug>/` com seus arquivos por idioma. */
export type PostGroup = {
  slug: string;
  sourceLang: Locale;
  files: Partial<Record<Locale, PostEntry>>;
};

// Todos os Markdown sob posts/, inclusive os que o loader (`*/*.md`) não pega,
// para acusar arquivos fora do lugar em vez de ignorá-los em silêncio.
const allMarkdown = Object.keys(
  import.meta.glob([
    "/src/content/posts/**/*.md",
    "/src/content/posts/**/*.mdx",
  ])
);
const VALID_FILE = new RegExp(
  `^/${POSTS_PATH}/[^/]+/(${LOCALES.join("|")})\\.md$`
);

function fail(message: string): never {
  throw new Error(`[posts] ${message}`);
}

function parsePath(entry: PostEntry): { slug: string; fileLang: string } {
  const rel = entry.filePath?.replace(`${POSTS_PATH}/`, "") ?? entry.id;
  const [slug, file] = rel.split("/");
  return { slug, fileLang: file.replace(/\.md$/, "") };
}

let groupsPromise: Promise<PostGroup[]> | undefined;

/**
 * Carrega e valida todos os posts, agrupados por slug. Qualquer violação das
 * regras de conteúdo (openspec/specs/content-model) derruba o build com uma
 * mensagem que cita o arquivo.
 */
export function getPostGroups(): Promise<PostGroup[]> {
  groupsPromise ??= loadGroups();
  return groupsPromise;
}

async function loadGroups(): Promise<PostGroup[]> {
  // Toda tag do conjunto precisa do token de cor --tag-<slug>.
  for (const slug of TAG_SLUGS) {
    if (!new RegExp(`--tag-${slug}\\s*:`).test(tokensCss)) {
      fail(
        `tag "${slug}" sem cor: adicione --tag-${slug} em src/styles/vlad-tokens.css`
      );
    }
  }

  const misplaced = allMarkdown.filter(path => !VALID_FILE.test(path));
  if (misplaced.length > 0) {
    fail(
      `arquivos fora do padrão <slug>/{${LOCALES.join(",")}}.md: ${misplaced
        .map(p => p.replace(`/${POSTS_PATH}/`, ""))
        .join(", ")}`
    );
  }

  const bySlug = new Map<string, Partial<Record<Locale, PostEntry>>>();
  for (const entry of await getCollection("posts")) {
    const { slug, fileLang } = parsePath(entry);
    const where = `${slug}/${fileLang}.md`;
    if (!isLocale(fileLang)) fail(`${where}: nome de arquivo não é um idioma`);
    if (entry.data.lang !== fileLang) {
      fail(
        `${where}: lang "${entry.data.lang}" não bate com o nome do arquivo`
      );
    }
    const files = bySlug.get(slug) ?? {};
    files[fileLang] = entry;
    bySlug.set(slug, files);
  }

  return [...bySlug.entries()].map(([slug, files]) => {
    const entries = Object.values(files);
    const sourceLangs = new Set(entries.map(e => e.data.source_lang));
    if (sourceLangs.size > 1) {
      fail(
        `${slug}: arquivos declaram source_lang diferentes (${[...sourceLangs].join(", ")})`
      );
    }
    const sourceLang = entries[0].data.source_lang;
    const source = files[sourceLang];
    if (!source) {
      fail(
        `${slug}: source_lang é "${sourceLang}", mas ${slug}/${sourceLang}.md não existe`
      );
    }
    if (source.data.translation) {
      fail(
        `${slug}/${sourceLang}.md: o arquivo-fonte não pode ter o bloco translation`
      );
    }
    // Traduções repetem as tags do fonte (a ordem não importa).
    const sourceTags = [...source.data.tags].sort().join(",");
    for (const entry of entries) {
      if ([...entry.data.tags].sort().join(",") !== sourceTags) {
        fail(
          `${slug}/${entry.data.lang}.md: tags [${entry.data.tags.join(", ")}] diferentes das do fonte ${slug}/${sourceLang}.md [${source.data.tags.join(", ")}]`
        );
      }
    }
    return { slug, sourceLang, files };
  });
}

function isPublished(group: PostGroup, lang: Locale): boolean {
  const file = group.files[lang];
  const source = group.files[group.sourceLang];
  return !!file && !file.data.draft && !source?.data.draft;
}

/** Idiomas em que o post está publicado. */
export function getPublishedLocales(group: PostGroup): Locale[] {
  return LOCALES.filter(lang => isPublished(group, lang));
}

export type Post = {
  slug: string;
  lang: Locale;
  entry: PostEntry;
  group: PostGroup;
};

/** Posts publicados no idioma, do mais novo para o mais antigo (desempate: slug). */
export async function getPosts(lang: Locale): Promise<Post[]> {
  const groups = await getPostGroups();
  return groups
    .filter(group => isPublished(group, lang))
    .map(group => ({
      slug: group.slug,
      lang,
      entry: group.files[lang] as PostEntry,
      group,
    }))
    .sort(
      (a, b) =>
        b.entry.data.pubDate.getTime() - a.entry.data.pubDate.getTime() ||
        a.slug.localeCompare(b.slug)
    );
}

export function getPostUrl(slug: string, lang: Locale): string {
  return getRelativeLocaleUrl(lang, `posts/${slug}/`);
}

/** URL do feed RSS do idioma (sem a barra final que getRelativeLocaleUrl põe). */
export function getRssUrl(lang: Locale): string {
  return `${getRelativeLocaleUrl(lang, "")}rss.xml`;
}
