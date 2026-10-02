// Proteção dos trechos que o modelo não pode tocar: cada um vira um marcador ⟦n⟧
// antes da tradução e volta depois. A restauração falha se algum marcador sumir,
// repetir ou aparecer do nada, ou se a estrutura (títulos) mudar.

export type Protected = { text: string; spans: string[] };

const PATTERNS: RegExp[] = [
  // Blocos de código cercados (``` ou ~~~), inteiros.
  /^(```|~~~)[^\n]*\n[\s\S]*?^\1[ \t]*$/gm,
  // Código inline.
  /`[^`\n]+`/g,
  // Destino de links e imagens: o texto/alt continua traduzível.
  /(?<=\]\()[^)\s]+(?:\s+"[^"]*")?(?=\))/g,
  // Autolinks e URLs soltas.
  /<https?:\/\/[^>\s]+>/g,
  /https?:\/\/[^\s)<>\]]+/g,
  // HTML em linha.
  /<\/?[a-zA-Z][^>\n]*>/g,
];

const TOKEN = /⟦(\d+)⟧/g;

export function protect(markdown: string): Protected {
  const spans: string[] = [];
  let text = markdown;
  for (const pattern of PATTERNS) {
    text = text.replace(pattern, match => {
      // Não reprotege o que já é marcador.
      if (/^⟦\d+⟧$/.test(match)) return match;
      spans.push(match);
      return `⟦${spans.length - 1}⟧`;
    });
  }
  return { text, spans };
}

const headings = (text: string) =>
  text.split("\n").filter(line => /^#{1,6}\s/.test(line)).length;

/** Devolve o texto com os trechos originais, ou um erro descrevendo o problema. */
export function restore(
  translated: string,
  original: Protected
): { ok: true; text: string } | { ok: false; error: string } {
  const counts = new Map<number, number>();
  for (const [, n] of translated.matchAll(TOKEN)) {
    counts.set(Number(n), (counts.get(Number(n)) ?? 0) + 1);
  }
  for (let i = 0; i < original.spans.length; i++) {
    const count = counts.get(i) ?? 0;
    if (count !== 1) {
      return { ok: false, error: `marcador ⟦${i}⟧ aparece ${count} vez(es)` };
    }
  }
  const unknown = [...counts.keys()].filter(n => n >= original.spans.length);
  if (unknown.length > 0) {
    return { ok: false, error: `marcadores inventados: ${unknown.join(", ")}` };
  }
  if (headings(translated) !== headings(original.text)) {
    return { ok: false, error: "número de títulos mudou" };
  }
  return {
    ok: true,
    text: translated.replace(TOKEN, (_, n) => original.spans[Number(n)]),
  };
}

/**
 * Quebra o corpo (já protegido) em partes nos títulos `##`, agrupadas até
 * `maxChars`, para caber no contexto do modelo e dar log de progresso.
 */
export function chunk(text: string, maxChars: number): string[] {
  const sections = text.split(/\n(?=## )/);
  const chunks: string[] = [];
  let current = "";
  for (const section of sections) {
    if (current && current.length + section.length + 1 > maxChars) {
      chunks.push(current);
      current = section;
    } else {
      current = current ? `${current}\n${section}` : section;
    }
  }
  if (current.trim()) chunks.push(current);
  return chunks;
}
