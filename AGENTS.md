# AGENTS.md — dbarros.dev

Instruções para agentes (Claude Code e afins) trabalhando neste repo. Leia inteiro
antes de mexer em qualquer coisa.

## O que é

Blog pessoal de Cesar de Barros em `dbarros.dev`: diário público trilíngue
(`pt`, `en`, `es`) sobre Rust, carreira e IA/agentes. Astro + AstroPaper, tema
próprio **Vlad** (dark-only), hospedado no Cloudflare Pages, traduzido por LLM
local (Ollama).

## Fontes da verdade

Em ordem de precedência, da mais forte para a mais fraca:

1. `openspec/specs/` — specs vivas por capacidade, geradas ao arquivar changes.
   Quando uma capacidade existe aqui, ela manda.
2. `docs/design/vlad/` — handoff do design do tema Vlad (fatia 1, **concluída**).
   `vlad-tokens.css` e `README.md` dali são a fonte da verdade visual e
   **substituem a paleta Dracula provisória** da spec do MVP.
3. `docs/SPEC.md` — spec original do MVP. Vale para tudo que ainda não virou spec
   no OpenSpec. Não edite para "atualizar": mudanças de requisito entram como change
   do OpenSpec.

Se duas fontes conflitarem, siga a de maior precedência e aponte o conflito para o
Cesar em vez de resolver em silêncio.

## Princípios (inegociáveis)

1. **Custo zero.** Nada de serviço pago, API paga ou dependência que exija conta paga.
2. **Deploy = `git push` na `main`.** Nenhum passo manual extra.
3. **Zero mecânica para o autor.** Escrever Markdown e commitar deve bastar.
4. **Build determinístico.** O build (local, CI ou Cloudflare) **nunca** chama LLM,
   Ollama ou rede externa.
5. **Menos estado vence.** Na dúvida, escolha a opção mais simples de manter.
6. **O mínimo de JavaScript.** O site tem que ser muito rápido: JS no navegador só
   quando não houver alternativa em HTML/CSS (Popover API, `<details>`, âncoras, páginas
   estáticas). Hoje o único script é o botão Copiar, e só em páginas com código.

## Fluxo de trabalho: OpenSpec

Todo trabalho não trivial passa pelo OpenSpec (`openspec/`, schema `spec-driven`,
artefatos em pt-BR).

- **Propor:** `/openspec-propose <descrição>` cria `openspec/changes/<nome>/` com
  `proposal.md`, `design.md`, `specs/<capacidade>/spec.md` (delta) e `tasks.md`.
  Propor é só planejamento: não escreva código no mesmo passo.
- **Explorar sem compromisso:** `/openspec-explore`.
- **Implementar:** `/openspec-apply-change <nome>`, marcando as tasks conforme avança.
- **Ajustar um change em andamento:** `/openspec-update-change`.
- **Arquivar:** `/openspec-archive-change <nome>` quando o aceite passar; isso
  consolida o delta em `openspec/specs/`.
- Valide sempre com `openspec validate <nome>` antes de pedir revisão.

Um change por fatia de implementação (ver abaixo). Nome em kebab-case, em inglês
(ex.: `scaffold-astro`, `i18n-content`). Correções pequenas (typo, ajuste de CSS
pontual, bump de dependência) dispensam change.

Capacidades sugeridas para `openspec/specs/`: `theme`, `i18n-routing`,
`content-model`, `tags`, `translation-pipeline`, `deploy`.

## Fatias do MVP

| # | Fatia | Status | Aceite |
|---|---|---|---|
| 1 | Design system Vlad | **feito** (`docs/design/vlad/`) | — |
| 2 | Scaffold | **feito** (`scaffold-astro`) | `npm run dev` e `npm run build` funcionam; sem alternador de tema |
| 3 | i18n e conteúdo | **feito** (`i18n-content` + `vlad-screens`) | post nos 3 idiomas navega certo; post só em PT some de EN/ES sem quebrar |
| 4 | Tags | **feito** (`closed-tags`) | tag fora do conjunto falha o build |
| 5 | Tradução | **feito** (`translation-pipeline`) | editar o fonte faz o check falhar; `translate` corrige; `locked: true` não é sobrescrito |
| 6 | Deploy e DNS | **feito** (`deploy-cloudflare`) | `https://dbarros.dev` via Cloudflare; `/` redireciona por idioma |
| 7 | Primeiro post | a fazer | making-of do blog, 3 idiomas, tag `ai` |

Cada fatia termina com build verde e algo verificável. Atualize esta tabela ao
arquivar o change correspondente.

## Stack

- **Astro 7**, partindo do **AstroPaper v6.1.0** atualizado para Astro 7 (importado por
  cópia; o código agora é nosso). Scripts em **TypeScript/Node** no mesmo repo. Node 24
  (`.nvmrc`).
- Gerenciador de pacotes: **npm** (os comandos da spec são `npm run ...`). Mantenha
  `npm audit` limpo.
- **Husky** para git hooks.
- **Cloudflare Pages** (build `npm run build`, output `dist/`), Pages Functions só
  para o redirect da raiz. **Analytics da zona Cloudflare** (no servidor, sem JS; o
  "Web Analytics" do Pages fica desligado porque injeta script).
- **Ollama** local (`qwen3:14b` padrão) só no script de tradução. O `postinstall`
  (`scripts/setup-ollama.sh`) instala via Homebrew e sobe o servidor se preciso; volta
  em milissegundos se já estiver rodando, pula em CI (`CI=true`) ou com
  `SKIP_OLLAMA_SETUP=1`, e nunca quebra o `npm install`. Ele não baixa o modelo
  (~9 GB): `ollama pull qwen3:14b` é manual, uma vez.

## Regras de implementação

### Tema Vlad

- Dark-only. Remova o alternador de tema e todo CSS/JS de modo claro do AstroPaper.
- **Nenhum hex fora de `src/styles/vlad-tokens.css`** (cópia do handoff). Componentes
  usam `var(--token)`. Exceções documentadas: `THEME_COLOR` no `Layout.astro` e o tema
  do Shiki em `src/utils/shiki-vlad.ts`, sempre iguais aos tokens.
- Fontes: **Spectral** para todo texto e interface; **Meslo NF** (woff2 em
  `public/fonts/`) **somente** em código. Não existe sans-serif.
- Shiki com o tema `vlad` descrito em `docs/design/vlad/shiki-vlad.md`.
- Bloco de código: rótulo da linguagem, botão Copiar ("Copiado" por 1.6s), rolagem
  horizontal sem quebra, padding preservado ao rolar.
- Listagem: variante **1a (lista densa)**. Logo: variante **2d**, em HTML/CSS.
- Telas montadas com `PageShell` (`list`/`reading`/`center`), `PageHeading`,
  `PostRow`, `TagChip`, `PostNav`, `BackLink` e `NotFound`, com CSS de escopo e tokens.
- Datas: meta do post `DD/MM/AAAA` em todos os idiomas; listagem "18 set"; página de
  tag "18 set 2026" (`src/utils/dates.ts`).
- 404: estáticas, uma por idioma e uma por tradução ausente; o Cloudflare serve a mais
  próxima do caminho. A integração `flatten404` em `astro.config.ts` move
  `…/404/index.html` para `…/404.html`.
- Menu do celular: Popover API, sem script.
- Animações: só transições de cor (~120ms ease-out). Foco: outline 2px `--link`,
  offset 2px.
- Os `.dc.html` são referência visual (abrir no navegador), não código a copiar.

### i18n e rotas

- Todos os idiomas com prefixo: `/pt/`, `/en/`, `/es/`. Mesmo slug entre idiomas.
  Idiomas só em `src/i18n/locales.ts`; páginas ficam em `src/pages/[lang]/` e obtêm o
  idioma com `getLocale(Astro)`. Cada página passa `alternates` (idiomas em que existe)
  ao `Layout` e ao `Header`: é o que gera `hreflang` e o seletor.
- `/` redireciona por `Accept-Language` (Pages Function, fatia 6), fallback `pt`. Hoje, e
  em dev, redireciona sempre para `/pt/`. **O idioma padrão é `pt`.**
- `<link rel="alternate" hreflang>` só para idiomas em que a página existe.
- **Nenhuma string de interface hardcoded em componente**: tudo vem do dicionário
  por idioma (inclusive os rótulos pt do design).
- Seletor de idioma esconde idiomas sem tradução do post atual.
- Francês está fora de escopo **para sempre**.

### Conteúdo

- O Prettier não formata `src/content/`: o texto dos posts é do autor.
- Não há publicação agendada: só `draft: true` esconde um post (build determinístico).
- Um post = uma pasta em `src/content/posts/<slug>/` com `pt.md`, `en.md`, `es.md`
  e imagens ao lado. Carregue posts só por `src/utils/posts.ts` (`getPosts(lang)`),
  que valida as regras entre arquivos e derruba o build com mensagem clara.
- Não há post de exemplo no repo: tudo em `src/content/posts/` vai para produção.
- Links Markdown padrão, **nunca `[[wikilinks]]`**; imagens relativas; front matter
  YAML compatível com Obsidian.
- O schema da content collection valida o front matter; erro de schema quebra o
  build (é intencional).
- `draft: true` nunca é publicado.
- Tradução ausente: o post some daquele idioma, sem link quebrado nem erro de build.
  A válvula de escape explícita é uma decisão em aberto (proposta: `translations:`
  no fonte) — defina no change da fatia 3 ou 5.

### Tags

- Conjunto **fechado** em `src/content/tags.ts`: slug (URL e front matter) → rótulo
  em pt/en/es. A ordem das entradas é a ordem de exibição.
- **Tag nova = uma entrada em `tags.ts` + o token `--tag-<slug>` em
  `src/styles/vlad-tokens.css`.** O build falha se faltar o token, se um post usar
  tag fora do conjunto (o front matter usa o slug, ex.: `rust`, não `Rust`) ou se uma
  tradução tiver tags diferentes do fonte.
- O chip pega a cor do token direto (`--c: var(--tag-<slug>)`); não há regra CSS por tag.
- Atuais: `rust`, `ai`, `reflections`.

### Tradução

- **Fluxo de escrita:** escrever o fonte (`<slug>/pt.md`) → `npm run translate` →
  revisar `en.md`/`es.md` → se editar uma tradução à mão, marcar `locked: true` → commit.
  O aviso no post diz "revisado pelo autor": revisar antes do commit é obrigatório.
- `npm run translate` (`scripts/translate/`): Ollama local, sob comando, post a post.
  Traduz o que falta ou mudou (hash de `title` + `description` + corpo do fonte), copia
  os metadados do fonte e nunca toca tradução `locked: true`. `--post <slug>` (inclui
  rascunhos) e `--dry-run`. Código, URLs, caminhos e HTML são protegidos por marcadores;
  resposta que perde algum é descartada (falha fechada).
- `npm run translate:check`: sem LLM e sem rede. Roda no `pre-commit` (Husky) e no início
  do `npm run build` (inclusive na Cloudflare).
- Válvula de escape: `translations: [pt, en]` no fonte dispensa os idiomas fora da lista.
- Host/modelo em `scripts/translate/config.ts`, com override por `OLLAMA_HOST` e
  `OLLAMA_MODEL`.

### Deploy

- `git push` na `main` publica pela Cloudflare Pages (`npm run build`, saída `dist/`,
  `NODE_VERSION=24`); outras branches geram preview `*.pages.dev`.
- `functions/index.ts` é a única Function: escolhe o idioma da raiz por
  `Accept-Language` (`src/i18n/negotiate.ts`, fallback `pt`). Não crie `_middleware`:
  rodaria em toda requisição.
- Redirects fixos em `public/_redirects` (têm precedência sobre arquivos estáticos).
- Produção: `https://dbarros.dev` (Cloudflare Pages, projeto `dbarros-dev`); `www` e
  `http` redirecionam (301). DNS na Cloudflare (`brit`/`rory.ns.cloudflare.com`);
  registro do domínio no Squarespace. Inventário e histórico em
  `docs/deploy/dns-inventory.md`.
- Analytics: dashboard da Cloudflare → zona `dbarros.dev` → Analytics & Logs → Traffic.
- Cabeçalhos de segurança em `public/_headers` (HSTS, CSP, etc.). A CSP só aceita
  recursos do próprio site e scripts inline cujo hash o build calcula (integração
  `dbarros:csp-hashes`). **Não adicione script, fonte, imagem ou iframe de terceiros**
  sem mudar a CSP num change do OpenSpec. Contas: `docs/deploy/security-checklist.md`.
- Teste local fiel à produção: `npm run build && npx wrangler pages dev dist` (na raiz
  do repo, para pegar `functions/`).

## Verificação

Antes de declarar uma tarefa concluída:

- `npm run build` verde (e `npm run translate:check`, a partir da fatia 5);
- `openspec validate <change>` sem erros;
- para mudanças visuais, compare com o `.dc.html` correspondente no navegador.

Relate falhas com a saída real; não marque task como feita sem verificar.

## Não faça

- Não chame LLM ou serviço pago no build, na CI ou em testes.
- Não adicione modo claro, busca, comentários ou idiomas novos sem change aprovado
  (estão fora do MVP; Giscus exige repo público e este é privado).
- Não crie dependência do repositório `diario-estudos`.
- Não mexa em DNS, Cloudflare ou Firebase sem confirmação explícita do Cesar: são
  ações externas e difíceis de reverter. Inventarie todos os registros DNS antes de
  qualquer migração.
- Não faça commit/push sem pedido explícito.

## Decisões em aberto

| Decisão | Dono | Estado |
|---|---|---|
| Fonte do texto | Cesar | **Resolvida:** Spectral (serifa) |
| Fonte de código | Cesar | **Resolvida:** Meslo NF |
| Marcação da válvula de escape de tradução | Implementação | Proposta: `translations: [pt, en]` no fonte |
| `www` ↔ apex | Implementação | Sugestão: apex canônico, `www` redireciona |
| Editor (Obsidian ou VS Code) | Cesar | Aberta; convenções servem aos dois |
