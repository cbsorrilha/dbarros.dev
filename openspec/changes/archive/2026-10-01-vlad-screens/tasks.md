## 1. Base

- [x] 1.1 `src/utils/dates.ts` (`formatDate` `DD/MM/AAAA`, `formatShortDate` "18 set", `formatShortDateWithYear` "18 set 2026", regra de data sem hora em UTC) e `readingTime(body)` (200 palavras/min, sem blocos de código, arredondado para cima, mínimo 1); remover `Datetime.astro`
- [x] 1.2 Chaves novas nos três dicionários (`readingTime`, `alsoIn`, `and`, `backToPosts`, `all`, `latest`, `postCount`, `backToTags`, `emptyList`, `readIn`) e remoção das chaves sem uso
- [x] 1.3 `PageShell` (larguras `list` e `reading`, `<main id="main-content">`) e `PageHeading`, `BackLink`

## 2. Chip e linha de post

- [x] 2.1 `TagChip` (pílula, `.tag[data-tag]` com cor do token ou `--text`, tamanhos 14/15/16px, link para a página da tag)
- [x] 2.2 `TagFilters` ("Todos" ativo + chips das tags do idioma)
- [x] 2.3 `PostRow` (grade `72px | 1fr`, data curta tabular, título sublinhado `--link-subtle` → `--link`, resumo, chips; `withYear` com coluna de 96px; celular com data acima)

## 3. Telas

- [x] 3.1 Listagem `/{lang}/`: título, filtros, grupos por ano com rótulo, linhas; estado vazio
- [x] 3.2 Post: "← Posts", meta (data · tempo de leitura), título em `--text`, lead, chips, "Também em", corpo, `PostNav` anterior/próximo
- [x] 3.3 Corpo do post em `typography.css` conforme o design e plugin rehype de `<figure>`/`<figcaption>`; imagem sangrando como o código no desktop
- [x] 3.4 Remover o script inline do post inteiro (barra de progresso, links `#`, lightbox)
- [x] 3.5 Índice de tags: linhas `180px | 1fr` com chip, contagem, "Mais recente" e título
- [x] 3.6 Página de tag: "← Tags", título na cor da tag, contagem, barra 48×2, linhas com ano
- [x] 3.7 Sobre: front matter com nome e lead nos três idiomas, coluna de leitura, h2 "Sobre este blog" no corpo, grade de links
- [x] 3.8 Componente `NotFound` com o layout do design (128/88px em `--link` com brilho, título, texto, botão primário e secundário "Ler em", empilhados no celular), sem script
- [x] 3.9 Páginas 404: `src/pages/404.astro` (idioma padrão), `src/pages/[lang]/404.astro` e `src/pages/[lang]/posts/[slug]/404.astro` (só para posts publicados em outro idioma e não neste, com "Ler em" no idioma padrão primeiro)
- [x] 3.10 Integração `astro:build:done` que renomeia `**/404/index.html` → `**/404.html`; excluir 404s do sitemap

## 4. Menu no celular

- [x] 4.1 Popover em tela cheia no `Header` (`<div popover>` + `<button popovertarget>`): itens 30px/600 com divisórias e ponto no ativo, seletor com nomes completos em 3 colunas, rodapé com crédito e RSS
- [x] 4.2 Botão 44×44 que vira X via `:has(:popover-open)`, botão de fechar com `popovertargetaction="hide"`, rolagem travada via `html:has(...)`; remover o script do menu
- [x] 4.3 "Pular para o conteúdo" sem script: remover o handler e pôr `tabindex="-1"` no `<main>`
- [x] 4.4 Script do botão Copiar fora do `Layout`: carregar só na página de post quando o post tem bloco de código

## 5. Limpeza

- [x] 5.1 Remover `Card`, `Main`, `Breadcrumb`, `Tag`, `Socials`, `LinkButton`, `BackButton`, `BackToTopButton`, `AdjacentPostNav`, `ResponsiveTable`, ícones sem uso e `stripLocale`/`stripBase` se ficarem órfãos
- [x] 5.2 `grep` por `active-nav`, `app-layout`, `text-accent`, `breadcrumb`, `progress` e classes do AstroPaper que sobrarem; build, lint e format verdes

## 6. Verificação

- [x] 6.1 Navegador, 1280 e 375px, lado a lado com `Vlad Listagem`, `Vlad Post`, `Vlad Tags e Sobre` e `Vlad Mobile e 404`: listagem, post, índice de tags, página de tag, Sobre, 404 e menu aberto
- [x] 6.2 Post: meta com data e tempo de leitura corretos; "Também em" em `exemplo-vlad` (2 idiomas) e ausente em `so-pt`; anterior/próximo corretos; legenda da imagem
- [x] 6.3 404: arquivos gerados em `dist/` (`404.html`, `{lang}/404.html`, `en|es/posts/so-pt/404.html`), sem `<script>`, fora do sitemap; com `npx wrangler pages dev dist` (local, sem conta): `/en/posts/so-pt/` em inglês com "Read in Português", `/es/xyz/` em espanhol sem "Ler em", `/foo` no idioma padrão, todos com status 404
- [x] 6.4 Menu com JavaScript desativado: abre, fecha com Esc e com o X, foco volta ao botão, página não rola com ele aberto, seletor só com idiomas da página
- [x] 6.5 Nenhum breadcrumb, barra de progresso, "voltar ao topo", lightbox ou `#` nos títulos em nenhuma página de `dist/`
- [x] 6.6 Contar `<script>` executáveis em cada HTML de `dist/` (ignorando JSON-LD): zero em todas as páginas, exceto posts com código, que têm só o do botão Copiar; "pular para o conteúdo" leva o foco ao `<main>` com JS desativado
- [x] 6.7 Atualizar `AGENTS.md` (fatia 3 feita) e registrar desvios do design em `design.md`
