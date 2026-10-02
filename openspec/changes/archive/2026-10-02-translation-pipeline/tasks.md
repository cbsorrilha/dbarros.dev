## 1. Base

- [x] 1.1 Adicionar `yaml` e `husky` (dev); `tsconfig.json` com `allowImportingTsExtensions`; confirmar que `astro check` aceita `scripts/`
- [x] 1.2 `scripts/translate/config.ts` (host e modelo padrão + `OLLAMA_HOST`/`OLLAMA_MODEL`)
- [x] 1.3 `scripts/translate/posts.ts`: ler posts do disco (front matter com `yaml`, corpo), agrupar por slug, identificar fonte, idiomas esperados (`translations ?? LOCALES`) e rascunho
- [x] 1.4 `scripts/translate/hash.ts` (`sha256:` de `{ title, description, body }` normalizado)

## 2. Modelo de conteúdo

- [x] 2.1 Schema: `translations` opcional (lista de idiomas)
- [x] 2.2 `getPostGroups()`: falhar se tradução declara `translations` ou se a lista não inclui o `source_lang`

## 3. translate:check

- [x] 3.1 `scripts/translate/check.ts`: ausente, desatualizada, sem bloco `translation` (erro) e bloqueada desatualizada (aviso); tabela legível; código 1 em erro
- [x] 3.2 `package.json`: `translate:check`, e `build` = `npm run translate:check && astro check && astro build`
- [x] 3.3 Husky: `prepare: "husky"` e `.husky/pre-commit` com `npm run translate:check`

## 4. translate

- [x] 4.1 `scripts/translate/protect.ts`: marcadores para código cercado, código inline, destinos de links/imagens, autolinks/URLs e HTML; restauração com checagem de marcadores, títulos e blocos de código
- [x] 4.2 `scripts/translate/ollama.ts`: checagem de servidor e modelo; chat com `think: false`, `temperature: 0.2`, `num_ctx: 8192`, timeout; chamada JSON para título e descrição; corpo em partes por `##` até ~3.000 caracteres
- [x] 4.3 `scripts/translate/translate.ts`: decide por post e idioma (criar, retraduzir, pular, avisar `locked`), grava com chaves em ordem fixa e bloco `translation`, logs de progresso, `--post`, `--dry-run`, código de saída
- [x] 4.4 `package.json`: script `translate`

## 5. Aviso no post

- [x] 5.1 Dicionários: `notice.translated` (`{{from}}`), `notice.from` por idioma de origem, `notice.readOriginal`
- [x] 5.2 `TranslationNotice.astro` no post traduzido, conforme o design, com link para o original

## 6. Conteúdo de exemplo

- [x] 6.1 `so-pt/pt.md` com `translations: [pt]`
- [x] 6.2 Apagar `exemplo-vlad/en.md` e `es.md` e regerar com `npm run translate` (Ollama real); revisar o resultado

## 7. Verificação

- [x] 7.1 Aceite da fatia: editar `exemplo-vlad/pt.md` → `translate:check` falha listando en/es; `translate` corrige; check passa; com `locked: true` em `en.md` e nova edição, `en.md` não muda e o comando avisa
- [x] 7.2 Fidelidade: blocos de código, código inline, URLs e caminho de imagem idênticos ao fonte nas traduções geradas (comparação automática)
- [x] 7.3 Falha fechada: servidor falso local que devolve resposta sem um marcador → arquivo não é gravado e o comando sai com erro (`OLLAMA_HOST` apontando para o falso)
- [x] 7.4 Ollama parado ou modelo ausente → erro imediato com instrução; `--dry-run` não chama o modelo nem grava
- [x] 7.5 Check: rascunho sem traduções passa; válvula `translations: [pt]` passa; `translations` em tradução e lista sem o `source_lang` falham no build
- [x] 7.6 Hook: commit com tradução desatualizada é bloqueado; `npm run build` falha no check antes do `astro build`
- [x] 7.7 Aviso: aparece em `/en/` e `/es/` de `exemplo-vlad` com o idioma de origem certo e link para `/pt/`; não aparece em `/pt/`; sem script novo na página
- [x] 7.8 `npm run build`, `lint`, `format:check` e `npm audit` verdes
- [x] 7.9 Atualizar `AGENTS.md` (fatia 5 feita; fluxo de escrita: escrever, `npm run translate`, revisar, `locked` se editar à mão, commit)
