## Context

Posts são pastas `src/content/posts/<slug>/{pt,en,es}.md`; o schema já aceita o bloco
`translation` (`source_hash`, `model`, `translated_at`, `locked`) e o build já valida a
coerência entre arquivos em `src/utils/posts.ts`. As traduções de `exemplo-vlad` foram
escritas à mão, sem `translation`. O Ollama 0.35 com `qwen3:14b` está instalado na
máquina do autor (o servidor usa contexto padrão de 4096 tokens), e o
`scripts/setup-ollama.sh` já roda no `postinstall`. Não há suíte de testes nem scripts
Node no repo. Requisitos em `specs/translation-pipeline`, `specs/content-model` e
`specs/pages`.

## Goals / Non-Goals

**Goals:**
- Um único código de leitura de posts e cálculo de hash, usado por `translate` e
  `translate:check`, para os dois nunca discordarem.
- Falhar fechado: tradução duvidosa não é gravada.

**Non-Goals:**
- Paralelismo, cache de chamadas ou tradução incremental por parágrafo.
- Revisão automática da qualidade da tradução (o autor revisa e pode marcar `locked`).
- Traduzir a página Sobre (texto do autor, escrito à mão nos três idiomas).

## Decisions

### 1. Scripts em TypeScript rodando direto no Node 24
`scripts/translate/` com `config.ts`, `posts.ts` (leitura de disco e front matter),
`hash.ts`, `protect.ts` (proteção de trechos), `ollama.ts`, `translate.ts` (CLI) e
`check.ts` (CLI). Rodam com `node scripts/translate/translate.ts`: o Node 24 remove
tipos nativamente, sem `tsx` nem build. Os imports usam extensão `.ts` e caminho
relativo; o único import de `src/` é `src/i18n/locales.ts`, que não tem dependências.
`tsconfig.json` ganha `allowImportingTsExtensions` para o `astro check` aceitar.
*Alternativa:* scripts como endpoints do Astro — misturaria tradução com build.

### 2. Front matter com `yaml`
Leitura e escrita com o pacote `yaml` (dev). A tradução é gravada com chaves em ordem
fixa (`title`, `description`, `pubDate`, `updatedDate`, `tags`, `lang`, `source_lang`,
`draft`, `translation`) e datas `AAAA-MM-DD`, para diffs previsíveis. O fonte nunca é
reescrito.

### 3. Hash
`sha256:` + SHA-256 de `JSON.stringify({ title, description, body })`, com o corpo
normalizado (`\r\n` → `\n`, sem espaços no fim). Só o que é traduzido entra no hash:
mudar data ou tags não força retradução (os metadados são copiados do fonte a cada
tradução, e a coerência de tags já é checada no build).

### 4. Proteção de trechos
Antes de mandar ao modelo, `protect.ts` troca por marcadores `⟦0⟧`, `⟦1⟧`…: blocos de
código cercados, código inline, destinos de links e imagens (`](…)`, mantendo o texto
do link e o `alt` para traduzir), autolinks e URLs soltas, e HTML em linha. Depois da
resposta, confere que cada marcador aparece exatamente uma vez e que não surgiu
marcador novo; senão, tenta mais uma vez e, se falhar de novo, a tradução do arquivo
falha. A estrutura Markdown (`#`, `-`, `>`, `1.`) vai no texto e é pedida no prompt;
a checagem confere também o número de títulos e de blocos de código.

### 5. Chamada ao Ollama
`POST /api/chat` com `stream: false`, `think: false` (o Qwen3 não "pensa" em voz
alta), `temperature: 0.2` e `num_ctx: 8192`. Prompt de sistema por idioma-alvo: traduzir
do idioma do fonte, manter Markdown e marcadores, não comentar, devolver só o texto.
`title` e `description` vão numa chamada com `format` JSON (`{ title, description }`);
o corpo vai em partes, quebrado nos títulos `##` e agrupado até ~3.000 caracteres, para
caber no contexto e dar log de progresso. Timeout de 5 min por chamada; a primeira
chamada pode demorar ~1–2 min carregando o modelo, e o log avisa.

### 6. Configuração
`scripts/translate/config.ts` exporta `{ host: "http://localhost:11434", model:
"qwen3:14b" }`; `OLLAMA_HOST` e `OLLAMA_MODEL` sobrescrevem. Antes de traduzir, o
comando consulta `/api/version` e `/api/tags`: servidor parado ou modelo ausente falham
logo, com a instrução (`brew services start ollama`, `ollama pull qwen3:14b`).

### 7. Check
`check.ts` usa os mesmos `posts.ts` e `hash.ts`, lê só o disco e imprime uma tabela
`post · idioma · motivo` (`ausente`, `desatualizada`, `sem bloco translation`, e avisos
`bloqueada e desatualizada`). Tradução sem bloco `translation` conta como
desatualizada: escrita à mão deve ser marcada `locked: true` com o `source_hash` atual.
Sai com código 1 se houver erro.

### 8. Onde o check roda
- `package.json`: `"build": "npm run translate:check && astro check && astro build"` —
  roda no build local e no da Cloudflare (não depende do Ollama).
- Husky: `"prepare": "husky"` e `.husky/pre-commit` com `npm run translate:check`.

### 9. Válvula de escape e coerência
Schema: `translations: z.array(locale).optional()`. `getPostGroups()` passa a falhar
quando uma tradução declara `translations` ou quando a lista não inclui o
`source_lang`. Idiomas esperados = `translations ?? LOCALES`. O site não muda: idioma
sem arquivo continua simplesmente sem o post.

### 10. Aviso de tradução
Componente `TranslationNotice.astro`, renderizado na página de post quando o arquivo
tem `translation`. Texto do dicionário da página: `notice.translated` com
`{{from}}`, e `notice.from[<idioma de origem>]` com a forma gramatical certa ("do
português", "from Portuguese", "del portugués"); link `notice.readOriginal` para o post
no `source_lang`. Estilo do design (`--border`, raio 8, 15px muted, ponto 7px
`--notice` com `--glow-notice`). Sem script.

### 11. Conteúdo de exemplo
`so-pt/pt.md` ganha `translations: [pt]` (válvula). `exemplo-vlad/en.md` e `es.md` são
apagados e regerados pelo `npm run translate` real, o que também serve de teste de
ponta a ponta.

## Ajustes feitos na implementação

- **Rascunhos:** `translate` sem `--post` pula posts cujo fonte é rascunho (o check não
  os cobra); com `--post <slug>`, traduz mesmo rascunho, para prévia.
- **ESLint:** `no-console` desligado só em `scripts/**`, que são CLIs.
- **Datas** lidas como texto (`yaml` com schema `core`) e copiadas sem reinterpretar.
- **Tempo real** com `qwen3:14b` no M3 Pro: ~20 s por idioma para o post de exemplo,
  depois do modelo carregado.

## Risks / Trade-offs

- [Modelo local pode traduzir mal ou quebrar o Markdown] → proteção com marcadores,
  checagem estrutural, retry único e falha fechada; o autor revisa e pode marcar
  `locked`.
- [Lentidão: minutos por post] → aceitável pela spec; logs por parte; `--post` para
  focar.
- [Hook de `pre-commit` atrapalha commits que não mexem em posts] → o check lê só
  arquivos de posts e roda em menos de 1 s.
- [O aviso diz "revisado pelo autor" mesmo antes da revisão] → é o texto da spec; a
  responsabilidade de revisar antes do commit é do autor (registrar em `AGENTS.md`).

## Migration Plan

Sem produção. As traduções à mão de `exemplo-vlad` são substituídas pelas geradas.
Rollback é reverter o commit.
