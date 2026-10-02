import { createHash } from "node:crypto";

/** Normaliza o corpo: quebras de linha `\n` e sem espaços/linhas em branco no fim. */
export function normalizeBody(body: string): string {
  return body.replace(/\r\n?/g, "\n").replace(/\s+$/, "");
}

/**
 * Hash do conteúdo traduzível do arquivo-fonte (title, description e corpo). Mudar
 * outros campos do front matter não altera o hash.
 */
export function sourceHash(source: {
  title: string;
  description: string;
  body: string;
}): string {
  const payload = JSON.stringify({
    title: source.title,
    description: source.description,
    body: normalizeBody(source.body),
  });
  return `sha256:${createHash("sha256").update(payload).digest("hex")}`;
}
