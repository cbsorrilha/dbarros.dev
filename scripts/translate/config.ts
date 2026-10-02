// Configuração do Ollama usada por `npm run translate`. Variáveis de ambiente
// sobrescrevem os padrões: OLLAMA_HOST (ex.: http://acer-server:11434) e OLLAMA_MODEL.
const DEFAULTS = {
  host: "http://localhost:11434",
  model: "qwen3:14b",
};

function normalizeHost(host: string): string {
  const withScheme = /^https?:\/\//.test(host) ? host : `http://${host}`;
  return withScheme.replace(/\/+$/, "");
}

export const config = {
  host: normalizeHost(process.env.OLLAMA_HOST || DEFAULTS.host),
  model: process.env.OLLAMA_MODEL || DEFAULTS.model,
  /** Contexto pedido ao modelo; o padrão do servidor (4096) é pequeno demais. */
  numCtx: 8192,
  temperature: 0.2,
  /** Tamanho máximo, em caracteres, de cada parte do corpo enviada ao modelo. */
  chunkChars: 3000,
  timeoutMs: 5 * 60 * 1000,
};
