import type { Locale } from "@/i18n/locales";

/**
 * Conjunto fechado de tags. A chave é o slug (usado nas URLs e no front matter);
 * o valor é o rótulo em cada idioma. A ordem das entradas é a ordem de exibição.
 *
 * Tag nova: uma entrada aqui + o token `--tag-<slug>` em src/styles/vlad-tokens.css.
 */
export const TAGS = {
  rust: { pt: "Rust", en: "Rust", es: "Rust" },
  ai: { pt: "IA", en: "AI", es: "IA" },
  reflections: { pt: "Reflexões", en: "Reflections", es: "Reflexiones" },
} as const satisfies Record<string, Record<Locale, string>>;

export type TagSlug = keyof typeof TAGS;

export const TAG_SLUGS = Object.keys(TAGS) as [TagSlug, ...TagSlug[]];

export function tagLabel(slug: TagSlug, lang: Locale): string {
  return TAGS[slug][lang];
}
