/** Idiomas do site. Adicionar um idioma = um código aqui + um dicionário em ./lang/. */
export const LOCALES = ["pt", "en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

/** Idioma da raiz (`/` → `/pt/`) e da página 404. */
export const DEFAULT_LOCALE: Locale = "pt";

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}
