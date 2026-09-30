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
| 2 | Scaffold | a fazer | `npm run dev` e `npm run build` funcionam; sem alternador de tema |
| 3 | i18n e conteúdo | a fazer | post nos 3 idiomas navega certo; post só em PT some de EN/ES sem quebrar |
| 4 | Tags | a fazer | tag fora do conjunto falha o build |
| 5 | Tradução | a fazer | editar o fonte faz o check falhar; `translate` corrige; `locked: true` não é sobrescrito |
| 6 | Deploy e DNS | a fazer | `https://dbarros.dev` via Cloudflare; `/` redireciona por idioma |
| 7 | Primeiro post | a fazer | making-of do blog, 3 idiomas, tag `ai` |

Cada fatia termina com build verde e algo verificável. Atualize esta tabela ao
arquivar o change correspondente.

## Stack

- **Astro**, partindo do **AstroPaper**. Scripts em **TypeScript/Node** no mesmo repo.
- Gerenciador de pacotes: **npm** (os comandos da spec são `npm run ...`).
- **Husky** para git hooks.
- **Cloudflare Pages** (build `npm run build`, output `dist/`), Pages Functions só
  para o redirect da raiz. **Cloudflare Web Analytics.**
- **Ollama** local (`qwen3:14b` padrão) só no script de tradução.

## Regras de implementação

### Tema Vlad

- Dark-only. Remova o alternador de tema e todo CSS/JS de modo claro do AstroPaper.
- **Nenhum hex fora de `vlad-tokens.css`** (copiado para `src/styles/`). Componentes
  usam `var(--token)`.
- Fontes: **Spectral** para todo texto e interface; **Meslo NF** (woff2 em
  `public/fonts/`) **somente** em código. Não existe sans-serif.
- Shiki com o tema `vlad` descrito em `docs/design/vlad/shiki-vlad.md`.
- Bloco de código: rótulo da linguagem, botão Copiar ("Copiado" por 1.6s), rolagem
  horizontal sem quebra, padding preservado ao rolar.
- Listagem: variante **1a (lista densa)**. Logo: variante **2d**, em HTML/CSS.
- Animações: só transições de cor (~120ms ease-out). Foco: outline 2px `--link`,
  offset 2px.
- Os `.dc.html` são referência visual (abrir no navegador), não código a copiar.

### i18n e rotas

- Todos os idiomas com prefixo: `/pt/`, `/en/`, `/es/`. Mesmo slug entre idiomas.
- `/` redireciona por `Accept-Language` (Pages Function), fallback `en`. Em dev, redirect
  simples para `/en/`.
- `<link rel="alternate" hreflang>` só para idiomas em que a página existe.
- **Nenhuma string de interface hardcoded em componente**: tudo vem do dicionário
  por idioma (inclusive os rótulos pt do design).
- Seletor de idioma esconde idiomas sem tradução do post atual.
- Francês está fora de escopo **para sempre**.

### Conteúdo

- Um post = uma pasta em `src/content/posts/<slug>/` com `pt.md`, `en.md`, `es.md`
  e imagens ao lado.
- Links Markdown padrão, **nunca `[[wikilinks]]`**; imagens relativas; front matter
  YAML compatível com Obsidian.
- O schema da content collection valida o front matter; erro de schema quebra o
  build (é intencional).
- `draft: true` nunca é publicado.
- Tradução ausente: o post some daquele idioma, sem link quebrado nem erro de build.
  A válvula de escape explícita é uma decisão em aberto (proposta: `translations:`
  no fonte) — defina no change da fatia 3 ou 5.

### Tags

- Conjunto **fechado**, definido em um único arquivo, usado como `enum` no schema.
- Slug fixo (URL) + rótulo por idioma + cor (`--tag-<slug>`). Tag nova = uma entrada
  nessa definição + um token de cor.
- Atuais: `rust`, `ai`, `reflections`.

### Tradução

- `npm run translate`: local, explícito, post a post, com logs. Nunca no build/CI.
  Respeita `source_hash` e `locked`. Preserva código, código inline, URLs, caminhos
  de imagem, chaves de front matter e slugs de tag. Traduz `title`, `description`
  e corpo.
- `npm run translate:check`: sem LLM, determinístico. Roda no `pre-commit` (Husky) e
  no build da Cloudflare.
- Host/modelo do Ollama vêm de config com override por env (`OLLAMA_HOST`,
  modelo configurável).
- Posts traduzidos exibem o aviso de tradução no idioma da página.

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
