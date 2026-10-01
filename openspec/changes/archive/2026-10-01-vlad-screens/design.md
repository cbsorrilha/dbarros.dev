## Context

Depois do `i18n-content`, as páginas por idioma existem e os dados estão certos
(`getPosts(lang)`, `getPublishedLocales`, `alternates`), mas a apresentação ainda é do
AstroPaper: `Card`, `Main`, `Breadcrumb`, `Tag` com `#`, `BackButton`,
`BackToTopButton`, barra de progresso e links `#` injetados por script no post, prosa
do `@tailwindcss/typography`. O cabeçalho já segue o design no desktop; no celular o
menu é uma lista simples. As medidas de cada tela estão em `docs/design/vlad/README.md`
e nos `.dc.html` (abrir no navegador). Requisitos em `specs/pages`, `specs/theme` e
`specs/i18n-routing`.

## Goals / Non-Goals

**Goals:**
- Fidelidade ao handoff em desktop e 375px, com estilos em tokens.
- Poucos componentes reutilizados entre telas: a linha de post serve à listagem e à
  página de tag; o chip serve a todas.

**Non-Goals:**
- Rótulos traduzidos e conjunto fechado de tags (fatia 4): o chip mostra a tag como
  escrita no front matter.
- Aviso de tradução por IA (fatia 5).
- Variante 1b (cards) da listagem, descartada no design.

## Decisions

### 1. Componentes de tela, CSS com escopo e tokens
Novos componentes em `src/components/`: `PageHeading` (título + subtítulo/contagem),
`PostRow` (linha da listagem; prop `withYear` para a página de tag), `TagChip`,
`TagFilters`, `PostNav` (anterior/próximo), `BackLink` ("← Posts", "← Tags"). Estilo em
`<style>` de cada componente com `var(--token)`; Tailwind fica só onde já está e não
atrapalha. Nenhum componente novo tem `<script>`. Saem `Card`, `Main`, `Breadcrumb`, `Tag`, `Socials`, `LinkButton`,
`BackButton`, `BackToTopButton`, `ResponsiveTable` (sem uso) e `AdjacentPostNav`.
*Alternativa:* adaptar os componentes do AstroPaper — carregam classes e estrutura
que o design não usa.

### 2. Layouts de página
Duas larguras do design: lista (padding lateral 64px, máx. 760px, alinhada à
esquerda) e leitura (coluna de 680px centrada, post e Sobre). Um componente
`PageShell` recebe `width="list" | "reading"` e envolve `<main id="main-content">`;
o respiro do cabeçalho continua no `Header`.

### 3. Datas
`src/utils/dates.ts` com:
- `formatDate(date)` → `DD/MM/AAAA` em todos os idiomas (decisão do Cesar: data
  brasileira), usada na meta do post;
- `formatShortDate(date, lang)` → "18 set" (dia + mês abreviado do idioma, sem ponto),
  na listagem;
- `formatShortDateWithYear(date, lang)` → "18 set 2026", na página de tag, que não
  agrupa por ano.
Montadas com `Intl.DateTimeFormat(...).formatToParts`. A regra de data sem hora em UTC
vai para esse módulo e o `Datetime.astro` sai.

### 4. Tempo de leitura
`readingTime(body)` conta palavras do Markdown bruto (`entry.body`) sem blocos de
código cercados, a 200 palavras/min, arredondando para cima, mínimo 1. Código fica de
fora porque não se lê no mesmo ritmo; o arredondamento segue a spec.

### 5. Corpo do post
`typography.css` deixa o plugin `prose` só como base e ajusta ao design: 19/17px,
lh 1.75, 22px entre blocos, `h2` com 16px extras acima, listas com padding 22px e gap
8px, imagem sangrando 24px no desktop como o código. Um plugin rehype pequeno
(`src/utils/rehype/figure.ts`) transforma parágrafos que só contêm uma imagem com
`alt` em `<figure><img><figcaption>`, para a legenda funcionar em Markdown puro. O
script inline do post sai inteiro: barra de progresso, links `#` dos títulos e o
lightbox de imagem (~250 linhas, fora do design).

### 6. Chip
`TagChip` renderiza `<a class="tag" data-tag={slug}>`: a regra `.tag[data-tag=…]` do
`vlad-tokens.css` já dá cor às tags com token; sem token, cai em `--text`. Tamanhos do
design: 14px/500 nos posts, 15px no filtro, 16px no índice.

### 7. 404 estáticas, uma por idioma e por tradução ausente
O Cloudflare Pages serve, para um caminho sem arquivo, o `404.html` mais próximo
subindo pelas pastas (`/en/posts/so-pt/404.html`, depois `/en/posts/404.html`,
`/en/404.html`, `/404.html`). Então o build gera:
- `/404.html` (idioma padrão) — o `src/pages/404.astro` do Astro;
- `/{lang}/404.html` — página `src/pages/[lang]/404.astro`;
- `/{lang}/posts/{slug}/404.html` para cada post publicado em outro idioma mas não em
  `lang`, com "Ler em {idioma}" — página `src/pages/[lang]/posts/[slug]/404.astro`.
O Astro gera essas duas últimas como `…/404/index.html`; uma integração mínima no
`astro.config.ts` (`astro:build:done`) renomeia `**/404/index.html` para `**/404.html`
e apaga a pasta. Tudo HTML estático, sem script, e com status 404 servido pelo
Cloudflare. Os 404 não entram no sitemap.
*Alternativas:* script na 404 lendo a URL (descartado: JavaScript a mais na página
de erro, e o Cesar quer o site o mais rápido possível); Pages Function (estado no
Cloudflare, depende da fatia 6). A resolução da 404 mais próxima é comportamento do
Cloudflare: a verificação local usa `npx wrangler pages dev dist`, sem conta nem deploy.

### 8. Menu de tela cheia sem JavaScript (Popover API)
`<button popovertarget="site-menu">` + `<div id="site-menu" popover>`: o navegador
abre e fecha, fecha com Esc, mantém `aria-expanded` no botão e devolve o foco a ele.
CSS faz o resto: o popover ocupa a tela (`inset: 0`, `--bg-deep`), o ícone vira X com
`:has(#site-menu:popover-open)` e `html:has(#site-menu:popover-open)` trava a rolagem.
Um segundo botão "fechar" dentro do menu usa `popovertargetaction="hide"`, sobreposto
ao botão de abrir. Conteúdo: itens 30px/600 com divisórias e ponto 6px no ativo,
seletor de idioma em 3 colunas com nomes completos (só os de `alternates`) e rodapé
com crédito e RSS. O script atual do menu sai.
*Alternativa:* `<dialog>` com `showModal()` — exige JavaScript.

### 9. Sobre
O front matter de `about/{lang}.md` passa a ter `title` = "Cesar de Barros" e
`description` = lead; o corpo traz os parágrafos e o `## Sobre este blog`. A lista de
links (GitHub, LinkedIn, RSS do idioma) é gerada pela página em grade `140px | 1fr`.

### 10. Dicionário
Chaves novas: `post.readingTime` ("{{min}} min de leitura"), `post.alsoIn`
("Também em"), `post.and` (conjunção para a lista de idiomas), `post.backToPosts`,
`pages.all` ("Todos"), `pages.latest` ("Mais recente"), `pages.postCount` (singular e
plural), `pages.backToTags`, `pages.emptyList`, `notFound.readIn` ("Ler em {{lang}}").
Saem as chaves que só os componentes removidos usavam.

### 11. JavaScript mínimo
Regra do Cesar: o site tem que ser o mais rápido possível, com o mínimo de JS. Inventário
depois deste change:
- **Botão Copiar** — único script; não há como copiar para a área de transferência sem
  JS. O `import "@/scripts/codeCopy"` sai do `Layout` e vai para a página de post, só
  quando o post tem bloco de código (`entry.body` com cerca de código), para o Astro
  não incluir o módulo nas outras páginas.
- **Pular para o conteúdo** — o script de foco sai; `<main id="main-content"
  tabindex="-1">` recebe o foco nativamente ao seguir a âncora.
- **Menu** — Popover API (decisão 8). **404** — estáticas (decisão 7).
- **"Voltar" com `sessionStorage`** — sai com `BackButton`/`Main`; "← Posts" é link fixo.
- **Lightbox** — sai (decisão 5).
A verificação conta `<script>` executáveis por página em `dist/` (JSON-LD não conta).

## Ajustes e desvios do design

- **Respiro acima do conteúdo:** 64px (28px no celular) em todas as telas, vindo do
  cabeçalho; o design do post pede 56px. Mantido uniforme.
- **X do menu:** fica na barra superior do popover, no mesmo lugar do botão de abrir
  (o popover cobre o cabeçalho), em vez de o próprio botão virar X.
- **`aria-expanded`:** o navegador expõe o estado na árvore de acessibilidade a partir
  de `popovertarget`, não como atributo no DOM (verificado via CDP: false → true).
- **Mês abreviado em espanhol:** o `Intl` usa "sept" (padrão do idioma).
- **Chaves do dicionário removidas:** as do AstroPaper que nenhuma tela usa mais
  (`publishedAt`, `updatedAt`, `tagLabel`, `backToTop`, `goBack`, `tagTitle`,
  `tagDesc`, `tagsDesc`, `postsDesc`, `about.linksTitle`, `closeImagePreview`).
- **Script restante:** o do botão Copiar, 499 bytes, inline pelo Astro, só em posts com
  código.

## Risks / Trade-offs

- [Fidelidade visual é subjetiva] → comparar com os `.dc.html` lado a lado no
  navegador em 1280 e 375px e registrar desvios conscientes neste documento.
- [O mapa de slugs na 404 cresce com o blog] → uma linha por post; irrelevante na
  escala do MVP.
- [`<dialog>` em navegadores antigos] → suporte amplo desde 2022; sem ele, os links
  continuam acessíveis pelas outras páginas.
- [Plugin rehype de figura pode pegar imagens decorativas] → só age em parágrafos com
  uma única imagem com `alt` não vazio.

## Migration Plan

Não há produção. Rollback é reverter o commit.
