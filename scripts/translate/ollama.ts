import { config } from "./config.ts";
import type { Locale } from "../../src/i18n/locales.ts";

/** Nome do idioma para o prompt (em inglês, que o modelo segue melhor). */
export const LANGUAGE_NAMES: Record<Locale, string> = {
  pt: "Brazilian Portuguese",
  en: "English",
  es: "Spanish",
};

export class OllamaError extends Error {}

async function call(path: string, body?: unknown): Promise<unknown> {
  const response = await fetch(`${config.host}${path}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(config.timeoutMs),
  });
  if (!response.ok) {
    throw new OllamaError(`${path}: HTTP ${response.status} ${await response.text()}`);
  }
  return response.json();
}

/** Falha logo, com instrução, se o servidor não responde ou o modelo não existe. */
export async function assertReady(): Promise<void> {
  try {
    await call("/api/version");
  } catch {
    throw new OllamaError(
      `o Ollama não responde em ${config.host}. Suba com \`brew services start ollama\` (ou \`ollama serve\`).`
    );
  }
  const tags = (await call("/api/tags")) as { models: { name: string }[] };
  if (!tags.models.some(m => m.name === config.model)) {
    throw new OllamaError(
      `modelo ${config.model} não encontrado em ${config.host}. Baixe com \`ollama pull ${config.model}\`.`
    );
  }
}

async function chat(system: string, user: string, format?: object): Promise<string> {
  const result = (await call("/api/chat", {
    model: config.model,
    stream: false,
    think: false,
    format,
    options: { temperature: config.temperature, num_ctx: config.numCtx },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  })) as { message: { content: string } };
  return result.message.content;
}

const RULES = (from: Locale, to: Locale) =>
  [
    `You are a professional translator. Translate from ${LANGUAGE_NAMES[from]} to ${LANGUAGE_NAMES[to]}.`,
    "The text is a personal technical blog post written in Markdown.",
    "Keep every placeholder like ⟦0⟧, ⟦1⟧ exactly as written, once each, in the matching position.",
    "Keep the Markdown structure: headings (#), lists, numbering, blockquotes, emphasis and line breaks.",
    "Keep technical terms that are usually left in English (e.g. closure, borrow checker).",
    "Do not add notes, explanations, quotes or code fences around the answer.",
  ].join("\n");

/** Remove uma cerca ```markdown que o modelo às vezes põe em volta da resposta. */
function unwrap(text: string): string {
  const fenced = /^```(?:markdown|md)?\n([\s\S]*?)\n```\s*$/.exec(text.trim());
  return fenced ? fenced[1] : text.trim();
}

export async function translateMarkdown(
  text: string,
  from: Locale,
  to: Locale
): Promise<string> {
  return unwrap(
    await chat(
      `${RULES(from, to)}\nOutput only the translated Markdown.`,
      text
    )
  );
}

export async function translateMeta(
  meta: { title: string; description: string },
  from: Locale,
  to: Locale
): Promise<{ title: string; description: string }> {
  const schema = {
    type: "object",
    properties: { title: { type: "string" }, description: { type: "string" } },
    required: ["title", "description"],
  };
  const answer = await chat(
    `${RULES(from, to)}\nTranslate the values of "title" and "description" and answer with JSON with the same keys.`,
    JSON.stringify(meta),
    schema
  );
  const parsed = JSON.parse(answer) as { title?: unknown; description?: unknown };
  if (typeof parsed.title !== "string" || typeof parsed.description !== "string") {
    throw new OllamaError(`resposta inválida para título/descrição: ${answer}`);
  }
  return { title: parsed.title.trim(), description: parsed.description.trim() };
}
