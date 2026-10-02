## Why

Hoje as traduções são escritas à mão e nada garante que acompanhem o original: editar
o `pt.md` de um post deixa o `en.md` e o `es.md` desatualizados em silêncio. A spec do
MVP pede tradução local por LLM, sob comando explícito, e um check determinístico que
impeça publicar tradução ausente ou velha (aceite da fatia 5: editar o PT faz o check
falhar; `translate` corrige; tradução `locked` não é sobrescrita).

## What Changes

- **`npm run translate`:** para cada post, compara o hash do arquivo-fonte com o
  `source_hash` de cada tradução e traduz pelo Ollama local só o que falta ou mudou;
  traduções `locked: true` desatualizadas não são tocadas, só geram aviso. Logs por
  post, aceitável ser lento. Opções para um post só (`--post <slug>`) e simulação
  (`--dry-run`).
- **Chamada ao modelo:** API HTTP do Ollama, host e modelo num arquivo de config
  (`http://localhost:11434`, `qwen3:14b`) com override por `OLLAMA_HOST` e
  `OLLAMA_MODEL`. Traduz `title`, `description` e o corpo; preserva blocos de código,
  código inline, URLs, caminhos de imagem, chaves do front matter e slugs de tag.
- **`npm run translate:check`:** sem LLM e sem rede; falha com lista legível quando
  um post publicado não tem tradução esperada ou tem tradução não bloqueada com hash
  divergente. Roda no `pre-commit` (Husky) e no início do `npm run build`, então
  também no build da Cloudflare.
- **Válvula de escape:** o arquivo-fonte pode declarar `translations: [pt, en]`, a
  lista de idiomas em que o post deve existir (padrão: todos). Idioma fora da lista não
  é cobrado pelo check nem gerado pelo `translate`.
- **Aviso de tradução por IA** no topo de todo post traduzido, no idioma da página,
  com link para o original.
- **Setup do Ollama** (`scripts/setup-ollama.sh` no `postinstall`), já adicionado ao
  repo: instala via Homebrew e sobe o servidor se preciso, volta em milissegundos se
  já estiver rodando, pula em CI.
- **Conteúdo de exemplo:** `exemplo-vlad` passa a ter traduções geradas pelo pipeline;
  `so-pt` usa a válvula (`translations: [pt]`).

## Capabilities

### New Capabilities

- `translation-pipeline`: o comando `translate`, o `translate:check`, o hash de origem,
  o bloqueio de traduções editadas à mão, a válvula de escape, a configuração do
  Ollama e onde o check roda.

### Modified Capabilities

- `content-model`: o front matter ganha `translations` (só no fonte); a coerência
  entre arquivos passa a exigir que a lista inclua o idioma do fonte e que traduções
  tenham o bloco `translation`.
- `pages`: o post traduzido mostra o aviso de tradução por IA.

## Impact

- **Código novo:** `scripts/translate/` (TypeScript rodando direto no Node 24, sem
  build), `.husky/pre-commit`.
- **Código alterado:** `src/content.config.ts`, `src/utils/posts.ts`, página de post,
  dicionários, `package.json` (scripts `translate`, `translate:check`, `prepare`,
  `build`).
- **Dependências:** `husky` e `yaml` (dev).
- **Ambiente do autor:** Ollama com `qwen3:14b` (~9 GB), já instalado.
- **Build da Cloudflare:** passa a rodar `translate:check` antes do `astro build`; não
  depende do Ollama.
