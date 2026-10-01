import { getRelativeLocaleUrl } from "astro:i18n";
import { LOCALES, type Locale } from "@/i18n/locales";

/** Versão de uma página em um idioma: alimenta o seletor de idioma e o hreflang. */
export type Alternate = { lang: Locale; href: string };

/** Alternativos de uma página que existe em `locales`, no mesmo caminho. */
export function alternatesFor(
  path: string,
  locales: readonly Locale[] = LOCALES
): Alternate[] {
  return locales.map(lang => ({
    lang,
    href: getRelativeLocaleUrl(lang, path),
  }));
}
