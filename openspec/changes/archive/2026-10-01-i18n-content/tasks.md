## 1. Idiomas e dicionário

- [x] 1.1 Criar `src/i18n/locales.ts` com `LOCALES = ["pt", "en", "es"]`, `DEFAULT_LOCALE = "en"`, tipo `Locale` e nomes dos idiomas (PT/EN/ES e nome completo)
- [x] 1.2 Tipar o registro de dicionários como `Record<Locale, UIStrings>`, remover o fallback de `useTranslations` e fazê-lo receber `Locale`
- [x] 1.3 Adicionar ao `UIStrings` as chaves novas (descrição do site, título/descrição do RSS, seletor de idioma, textos do Sobre gerados pela página, links da 404) e criar `src/i18n/lang/es.ts`; completar `pt.ts` e `en.ts`
- [x] 1.4 Configurar `astro.config.ts`: `i18n.locales` e `defaultLocale` vindos de `locales.ts`, `prefixDefaultLocale: true`, `redirectToDefaultLocale: true`, sem `fallback`; `site.lang` da config passa a `en`

## 2. Modelo de conteúdo

- [x] 2.1 Reescrever `src/content.config.ts`: loader `glob("*/*.md")` em `src/content/posts`, schema da spec (`title`, `description`, `pubDate`, `updatedDate`, `tags`, `lang`, `source_lang`, `draft`, `translation`); coleção `pages` com `about/*.md`
- [x] 2.2 Criar `src/utils/posts.ts` com `getPostGroups()` (agrupa por slug e valida: nome × `lang`, `source_lang` único, fonte presente, fonte sem `translation`, arquivos fora de `*/*.md`), `getPosts(lang)` (publicados, ordem `pubDate` desc + slug) e `getPostLocales(slug)`, com mensagens de erro citando `slug/arquivo`
- [x] 2.3 Remover `getSortedPosts`, `postFilter`, `getPostPaths` e adaptar `getUniqueTags` para receber o idioma; atualizar `PostLayout` e `Datetime` para `pubDate`/`updatedDate`
- [x] 2.4 `Datetime` com `Intl.DateTimeFormat(lang, …)`, mantendo datas sem hora em UTC
- [x] 2.5 Migrar `exemplo-vlad.md` para `exemplo-vlad/{pt,en,es}.md` (fonte `pt`; en/es traduzidos à mão) e criar `so-pt/pt.md`; incluir uma imagem relativa em `exemplo-vlad/` usada pelos três idiomas

## 3. Rotas por idioma

- [x] 3.1 Mover as páginas para `src/pages/[lang]/` (`index`, `about`, `posts/[slug]`, `tags/index`, `tags/[tag]`, `rss.xml.ts`) com `getStaticPaths` por idioma e `params.lang` como fonte do idioma; remover paginação
- [x] 3.2 Criar `src/pages/[lang]/posts/index.astro` redirecionando para `/{lang}/`
- [x] 3.3 Reescrever a home `/{lang}/` como lista de posts do idioma (sem hero, destaques ou `featured`)
- [x] 3.4 Páginas de tag por idioma: só tags com posts publicados naquele idioma
- [x] 3.5 Trocar todos os usos de `Astro.currentLocale`/`config.site.lang` nos componentes pelo idioma recebido da página (Header, Footer, Breadcrumb, Main, BackButton, Card, Tag, AdjacentPostNav, Layout)
- [x] 3.6 404: textos do idioma padrão e links para as três homes

## 4. Alternativos e seletor

- [x] 4.1 `Layout` recebe `lang` e `alternates`, emite `<html lang>`, `hreflang` absolutos e o RSS do idioma
- [x] 4.2 Cada página calcula `alternates`: post → `getPostLocales(slug)`; tag → idiomas com posts na tag; home, tags, Sobre → todos
- [x] 4.3 Seletor de idioma no `Header` (pill PT/EN/ES com o atual marcado, só idiomas de `alternates`), visível também no celular, com tokens Vlad

## 5. Sobre e RSS

- [x] 5.1 Criar `src/content/pages/about/{pt,en,es}.md` com texto provisório e renderizar os links (GitHub, LinkedIn, RSS do idioma) pela página
- [x] 5.2 `src/pages/[lang]/rss.xml.ts` com `getPosts(lang)`, `language`, título e descrição do dicionário e links absolutos; remover o `/rss.xml` antigo

## 6. Verificação

- [x] 6.1 `npm run build`, `npm run lint` e `npm run format:check` verdes
- [x] 6.2 Em `dist/`: `/` redireciona para `/en/`; existem `/pt/`, `/en/`, `/es/`; `/en/posts/` redireciona; `exemplo-vlad` nos três idiomas; `so-pt` só em `/pt/` e ausente de `/en/`, `/es/`, dos feeds `en`/`es` e das tags `en`/`es`
- [x] 6.3 `grep` em `dist/` confirmando que nenhum HTML aponta para `/en/posts/so-pt/` ou `/es/posts/so-pt/`
- [x] 6.4 Conferir `hreflang` e seletor em `exemplo-vlad` (3 idiomas) e `so-pt` (só PT); `<html lang>` por idioma; datas com mês localizado
- [x] 6.5 Casos de erro, cada um em cópia temporária do conteúdo: `lang` ≠ nome do arquivo, fonte ausente, fonte com `translation`, `rascunho.md` na pasta, `lang: fr`, campo obrigatório ausente — todos falham o build com mensagem que cita o arquivo; post só em `es` com `source_lang: es` passa
- [x] 6.6 Rascunho: fonte com `draft: true` some dos três idiomas; tradução com `draft: true` some só do seu idioma
- [x] 6.7 Validar os três feeds (XML bem formado, `language`, itens por idioma)
- [x] 6.8 Navegador (desktop e 375px): troca de idioma pelo seletor em post, tags e Sobre; interface em `es` ao abrir `/es/`
- [x] 6.9 Atualizar `AGENTS.md`: fatia 3 parcial (i18n feito, telas no `vlad-screens`), estrutura de posts e aviso de que os posts de exemplo não podem ir para produção
