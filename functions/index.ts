// Cloudflare Pages Function só na raiz `/`: manda o visitante para a home do idioma
// do navegador (Accept-Language), com `pt` como fallback. O resto do site é estático.
import { negotiateLocale } from "../src/i18n/negotiate.ts";

export function onRequestGet({ request }: { request: Request }): Response {
  const lang = negotiateLocale(request.headers.get("accept-language"));
  return new Response(null, {
    status: 302,
    headers: {
      location: `/${lang}/`,
      vary: "Accept-Language",
      "cache-control": "private, no-store",
    },
  });
}
