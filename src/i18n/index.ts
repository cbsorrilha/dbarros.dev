import type { AstroGlobal } from "astro";
import type { UIStrings } from "./types";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";
import pt from "./lang/pt";
import en from "./lang/en";
import es from "./lang/es";

export { tplStr, countLabel } from "./format";
export { LOCALES, DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

// Record<Locale, …>: falta de dicionário para um idioma é erro de tipo.
const translations: Record<Locale, UIStrings> = { pt, en, es };

export function useTranslations(locale: Locale): UIStrings {
  return translations[locale];
}

/**
 * Idioma da página atual, vindo do prefixo da URL. Páginas fora de `[lang]`
 * (a 404) usam o idioma padrão.
 */
export function getLocale(astro: Pick<AstroGlobal, "currentLocale">): Locale {
  const locale = astro.currentLocale;
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}
