import config from "@/config";
import type { Locale } from "@/i18n/locales";

// Datas sem hora no front matter (ex.: 2026-10-01) chegam como meia-noite UTC e
// representam um dia do calendário: formatar em UTC, senão viram o dia anterior.
function timeZoneFor(date: Date): string {
  const isDateOnly =
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0;
  return isDateOnly ? "UTC" : config.site.timezone;
}

function parts(date: Date, lang: Locale, withYear: boolean) {
  const formatter = new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: timeZoneFor(date),
  });
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    formatter.formatToParts(date).find(p => p.type === type)?.value ?? "";
  return {
    day: get("day"),
    month: get("month").replace(/\.$/, ""),
    year: get("year"),
  };
}

/** "01/10/2026" — data brasileira em todos os idiomas (meta do post). */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: timeZoneFor(date),
  }).format(date);
}

/** "18 set" — dia e mês abreviado do idioma (listagem, agrupada por ano). */
export function formatShortDate(date: Date, lang: Locale): string {
  const { day, month } = parts(date, lang, false);
  return `${day} ${month}`;
}

/** "18 set 2026" — como a curta, com o ano (página de tag). */
export function formatShortDateWithYear(date: Date, lang: Locale): string {
  const { day, month, year } = parts(date, lang, true);
  return `${day} ${month} ${year}`;
}

/** Ano usado para agrupar a listagem. */
export function yearOf(date: Date): number {
  return Number(
    new Intl.DateTimeFormat("en", {
      year: "numeric",
      timeZone: timeZoneFor(date),
    }).format(date)
  );
}

/** Minutos de leitura: 200 palavras/min, sem blocos de código, mínimo 1. */
export function readingTime(markdown: string): number {
  const prose = markdown.replace(/^(```|~~~)[\s\S]*?^\1/gm, "");
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
