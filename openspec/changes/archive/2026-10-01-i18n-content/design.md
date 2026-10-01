## Context

Depois do `scaffold-astro`, o site usa o i18n do Astro com um só locale (`pt`, sem
prefixo). As páginas ficam em `src/pages/{index,about,404}.astro`, `posts/`, `tags/` e
`rss.xml.ts`; os posts vêm de `glob("**/[^_]*.{md,mdx}")` com o schema do AstroPaper
(`pubDatetime`, `modDatetime`, `featured`, `author`, `ogImage`, `canonicalURL`…), e o
slug sai do `id` do arquivo. O dicionário (`src/i18n/lang/{pt,en}.ts`) já é tipado por
`UIStrings`, mas é escolhido por `Astro.currentLocale`. A home ainda é o hero de exemplo
do AstroPaper. Requisitos em `specs/i18n-routing`, `specs/content-model` e
`specs/feeds`.

## Goals / Non-Goals

**Goals:**
- Um único lugar que conhece os idiomas e um único lugar que carrega e valida posts;
  páginas só consomem.
- Tradução ausente resolvida por construção (não há página a esconder), não por filtro
  espalhado.

**Non-Goals:**
- Visual final das telas (`vlad-screens`); aqui as páginas do AstroPaper só ficam
  corretas por idioma.
- Paginação: com poucos posts, listas mostram tudo. Volta se um dia fizer falta.

## Decisions

### 1. Idiomas em `src/i18n/locales.ts`
`export const LOCALES = ["pt", "en", "es"] as const`, `DEFAULT_LOCALE = "pt"` e o tipo
`Locale`. `astro.config.ts`, o schema, `getStaticPaths` e o dicionário importam daqui.
Adicionar um idioma = um código aqui + um arquivo em `src/i18n/lang/` (o `Record<Locale,
UIStrings>` faz o build falhar se faltar dicionário).

### 2. Roteamento: segmento `[lang]` + i18n do Astro
Páginas movem para `src/pages/[lang]/…`, cada uma com `getStaticPaths` por idioma.
`astro.config.ts`: `i18n.locales = LOCALES`, `defaultLocale: "pt"`,
`routing: { prefixDefaultLocale: true }`, e uma página `src/pages/index.astro` que
redireciona `/` para `/pt/` no build estático (e no dev). Sem `i18n.fallback`: a spec quer
que o post não exista no idioma, não que redirecione. As páginas usam `params.lang`
(não `Astro.currentLocale`) como fonte do idioma, passado adiante por prop/contexto.
*Alternativa:* pastas `src/pages/pt|en|es/` duplicadas — triplica cada página.

`/{lang}/posts/` vira `src/pages/[lang]/posts/index.astro` com `Astro.redirect` para
`/{lang}/` (em build estático o Astro gera uma página de redirect).

### 3. Carregamento e validação de posts em um módulo
`src/content.config.ts`: loader `glob({ pattern: "*/*.md", base: "src/content/posts" })`
e o schema da spec. Um módulo `src/utils/posts.ts` expõe:
- `getPostGroups()`: agrupa as entradas por pasta (slug), aplica as regras de coerência
  (nome × `lang`, `source_lang` único, fonte presente, fonte sem `translation`, nomes de
  arquivo válidos) e lança `Error` com mensagem citando `slug/arquivo`. Resultado em
  cache por build.
- `getPosts(lang)`: posts publicados no idioma (não rascunho e fonte não rascunho),
  ordenados por `pubDate` desc e slug.
- `getPostLocales(slug)`: idiomas em que o post está publicado (alimenta seletor e
  `hreflang`).
Arquivos com nome inválido ou em subpasta não casam com `*/*.md`; para detectá-los,
um segundo glob barato (`import.meta.glob("/src/content/posts/**/*.md")`) compara os
caminhos e acusa os que ficaram de fora. Substitui `getSortedPosts`, `postFilter`,
`getPostPaths` e `getUniqueTags` (esta passa a receber o idioma).
*Alternativa:* validar dentro do loader customizado — mais código de loader e mensagens
de erro menos claras que um `throw` no carregamento.

### 4. Tradução ausente por construção
`getStaticPaths` das páginas de post itera `LOCALES × getPosts(lang)`; se não há
arquivo, não há rota. Listas, tags e RSS usam `getPosts(lang)`. Tags por idioma: a
página `/{lang}/tags/{tag}/` só é gerada para tags com posts naquele idioma.

### 5. Alternativos: um conceito, dois usos
`Layout` recebe `alternates: { lang, href }[]`. Páginas de post passam os idiomas de
`getPostLocales(slug)`; páginas que existem em todos os idiomas (home, tags, Sobre)
passam os três; página de tag passa os idiomas em que a tag tem posts. O `Layout` emite
os `hreflang` (URL absoluta) e entrega a lista ao `Header`, que desenha o seletor
(PT/EN/ES em pill; estilo final no `vlad-screens`).

### 6. Dicionário
Criar `es.ts`, completar `pt.ts`/`en.ts` e mover para o dicionário os textos que hoje
estão na config (descrição do site) e os títulos/descrições de RSS. `useTranslations`
passa a receber `Locale` e deixa de ter fallback (tipagem garante completude).
Datas: `Datetime` usa `Intl.DateTimeFormat(lang, { day, month: "short", year })`,
mantendo a regra de data sem hora em UTC. O formato exato do design ("1 out. 2026")
fica para o `vlad-screens`.

### 7. Home e listagem
`/{lang}/` usa a lista de posts do AstroPaper (`Card`), sem hero, sem destaques, sem
paginação; some `featured`. `posts/[...page].astro` e `tags/[tag]/[...page].astro`
viram páginas sem paginação.

### 8. Sobre por idioma
`src/content/pages/about/{pt,en,es}.md` (coleção `pages` com `glob("about/*.md")`).
Texto provisório curto, baseado no rascunho do design, nos três idiomas; os links
(GitHub, LinkedIn, RSS do idioma) vêm da config e do dicionário, renderizados pela
página. O texto definitivo é do Cesar.

### 9. RSS por idioma
`src/pages/[lang]/rss.xml.ts` com `getPosts(lang)`, `language` no canal e título
"dbarros.dev" + nome do idioma vindo do dicionário. O `Layout` aponta o `<link
rel="alternate" type="application/rss+xml">` para o feed do idioma. Sai o
`/rss.xml` sem prefixo.

### 10. 404
Continua um único `404.astro` (Cloudflare Pages serve `/404.html` para qualquer rota).
Neste change ele fica no idioma padrão (`pt`) com links para as três homes; a versão
que detecta o idioma pela URL e oferece "Ler em …" é do `vlad-screens`.

### 11. Conteúdo de exemplo
`exemplo-vlad/{pt,en,es}.md` (fonte `pt`, traduções à mão sem bloco `translation`) e
`so-pt/pt.md`. São conteúdo provisório para o aceite; a fatia 6 não pode publicar o
site com eles (registrar em `AGENTS.md`).

## Ajustes feitos na implementação

- **Idioma via `getLocale(Astro)`** em vez de passar `params.lang` por props: com
  prefixo em todas as rotas, `Astro.currentLocale` vem da URL; o helper valida e
  estreita para `Locale` e cai no idioma padrão fora de `[lang]` (a 404). As páginas
  continuam usando `params.lang` nos seus próprios cálculos.
- **Raiz com página própria:** `redirectToDefaultLocale` do Astro exige um
  `src/pages/index.astro`; ele mesmo faz o redirect, e a opção saiu.
- **Redirects estáticos têm 2 s de espera** (meta refresh padrão do Astro) em `/` e
  `/{lang}/posts/`; no dev são 302. Em produção, a fatia 6 troca por redirect do
  Cloudflare (Pages Function na raiz, `_redirects` para `/{lang}/posts/`).
- **`getRssUrl(lang)`**: `getRelativeLocaleUrl(lang, "rss.xml")` põe barra no fim
  (`rss.xml/`); o helper evita isso no `<head>`, no rodapé e no Sobre.
- **`dayjs` saiu**: datas com `Intl.DateTimeFormat` no idioma da página.
- **Paginação, `Pagination.astro` e as chaves `home`/`pagination`** do dicionário saíram.
- **Respiro do cabeçalho:** a home não tem breadcrumb e o título colava na borda do
  cabeçalho. O cabeçalho ganhou `margin-bottom` de 64px (28px no celular), como no
  design, e saíram os `mt-8` do breadcrumb, do "Voltar" e do post. "Posts" no menu
  aponta direto para `/{lang}/` e fica ativo na home.
- `getStaticPaths` roda isolado do resto do frontmatter; o filtro de tag por post foi
  para `getUniqueTags.ts` (`postHasTag`).

## Risks / Trade-offs

- [Muitos arquivos movem de lugar em `src/pages/`] → mover primeiro, fazer build, só
  então mudar comportamento; `astro check` pega imports quebrados.
- [`Astro.redirect` em build estático gera página com meta refresh, não 301] → aceito;
  Cloudflare (fatia 6) pode trocar por redirect de servidor se valer a pena.
- [Traduções de exemplo sem `translation` vão falhar no `translate:check` da fatia 5] →
  esperado; a fatia 5 trata o exemplo (retraduz ou remove).
- [Sem paginação, uma lista muito longa pesa] → irrelevante na escala do blog.

## Migration Plan

Não há produção. Rollback é reverter o commit.

## Open Questions

- Texto definitivo do Sobre nos três idiomas (Cesar), pode entrar depois sem mudar
  specs.
