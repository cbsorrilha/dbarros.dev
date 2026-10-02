import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales.ts";

/**
 * Escolhe o idioma a partir do cabeçalho Accept-Language: o primeiro suportado em
 * ordem de preferência (pesos `q`, padrão 1), usando só a língua principal
 * (`pt-BR` → `pt`). Sem cabeçalho ou sem idioma suportado, o idioma padrão.
 */
export function negotiateLocale(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map(p => p.trim()).find(p => p.startsWith("q="));
      const weight = q ? Number(q.slice(2)) : 1;
      return {
        lang: tag.trim().toLowerCase().split("-")[0],
        weight: Number.isFinite(weight) ? weight : 0,
        index,
      };
    })
    .filter(item => item.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index);
  return ranked.map(item => item.lang).find(isLocale) ?? DEFAULT_LOCALE;
}
