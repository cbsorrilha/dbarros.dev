## Why

O site hoje fala um idioma só (`pt`, sem prefixo), usa o schema de front matter do
AstroPaper e trata cada arquivo como um post. A spec do MVP pede um blog trilíngue com
o mesmo slug em todos os idiomas e posts em pasta com um arquivo por idioma. Este
change monta essa base de i18n e conteúdo para que tags (fatia 4), tradução (fatia 5)
e as telas finais (`vlad-screens`) só acrescentem comportamento.

## What Changes

- **Rotas com prefixo de idioma** para todas as páginas: `/pt/`, `/en/`, `/es/`.
  A raiz `/` redireciona para `/pt/` (a detecção por `Accept-Language` fica para a
  fatia 6). `pt` é o idioma padrão do site.
- **Posts por pasta:** `src/content/posts/<slug>/{pt,en,es}.md` com imagens ao lado;
  o slug é o nome da pasta e é o mesmo em todos os idiomas.
- **Schema de front matter da spec** (`title`, `description`, `pubDate`,
  `updatedDate`, `tags`, `lang`, `source_lang`, `draft`, `translation`), no lugar do
  schema do AstroPaper (**BREAKING** para o post de exemplo, que é migrado), com
  checagens entre arquivos de um mesmo post que quebram o build.
- **Tradução ausente:** o post simplesmente não existe no idioma que não tem arquivo;
  listagens, tags, RSS, seletor e `hreflang` o ignoram, sem erro de build.
- **Dicionário de UI em `pt`, `en` e `es`**, escolhido pela rota; datas no formato do
  idioma.
- **Seletor de idioma** no cabeçalho, levando à mesma página no outro idioma e
  escondendo idiomas em que a página não existe; `<link rel="alternate" hreflang>`
  pelas mesmas regras.
- **Home do idioma** (`/{lang}/`) passa a ser a lista de posts daquele idioma, sem
  paginação; `/{lang}/posts/` redireciona para ela. Sai o hero de exemplo do
  AstroPaper, que ainda estava publicado.
- **Sobre por idioma** (`/{lang}/about/`), com texto provisório e os links do Cesar.
- **RSS por idioma** (`/{lang}/rss.xml`) só com os posts daquele idioma.
- Posts de exemplo para o aceite: um nos três idiomas e um só em `pt`.

Fora deste change: tags fechadas e rótulos traduzidos (fatia 4); marcação explícita
da válvula de escape, `translate`/`translate:check` e aviso de tradução (fatia 5);
detecção de idioma na raiz (fatia 6); layout final de listagem, post, Sobre, 404 e
menu mobile, incluindo "Também em …" no post (`vlad-screens`).

## Capabilities

### New Capabilities

- `i18n-routing`: idiomas suportados, rotas com prefixo, redirect da raiz, dicionário
  de UI, seletor de idioma, `hreflang` e comportamento de tradução ausente.
- `content-model`: como um post é organizado em disco, o schema do front matter, as
  regras entre os arquivos de um post, rascunhos e a ordem dos posts.
- `feeds`: um feed RSS por idioma.

### Modified Capabilities

(nenhuma: `theme` e `build` não mudam de requisito)

## Impact

- **Rotas:** todas as URLs ganham prefixo de idioma; `src/pages/` passa a ter um
  segmento `[lang]`. Não há site em produção, então não há URLs antigas a preservar.
- **Código:** `astro.config.ts` (i18n), `src/content.config.ts`, utilitários de posts
  (`getPostPaths`, `getSortedPosts`, `postFilter`, `getUniqueTags`), `Layout`,
  `PostLayout`, `Header`, `Datetime`, páginas de posts, tags, Sobre, RSS e 404,
  dicionário em `src/i18n/`.
- **Conteúdo:** `src/content/posts/exemplo-vlad.md` vira pasta com três idiomas;
  `src/content/pages/about.md` vira um arquivo por idioma.
- **Dependências:** nenhuma nova.
