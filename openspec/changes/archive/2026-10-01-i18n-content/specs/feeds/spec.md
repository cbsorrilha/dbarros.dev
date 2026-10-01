## Purpose

Define os feeds RSS do dbarros.dev: um por idioma, para que leitores assinem só o
idioma que leem, sem itens duplicados em outros idiomas.

## ADDED Requirements

### Requirement: RSS por idioma
O site SHALL gerar um feed RSS 2.0 em `/{lang}/rss.xml` para cada idioma suportado,
contendo só os posts publicados naquele idioma, com título, descrição, link absoluto
para a página do post naquele idioma e data de publicação. O título e a descrição do
feed SHALL vir do dicionário do idioma, e o feed SHALL declarar o idioma. Cada página
SHALL anunciar no `<head>` o feed do seu idioma.

#### Scenario: Feed em espanhol
- **WHEN** o leitor abre `/es/rss.xml`
- **THEN** o feed lista só posts que existem em `es`, com links para `https://dbarros.dev/es/posts/{slug}/`

#### Scenario: Post ausente no idioma
- **WHEN** um post não existe em `en`
- **THEN** ele não aparece em `/en/rss.xml`

#### Scenario: Descoberta do feed
- **WHEN** uma página em `/pt/` é carregada
- **THEN** o `<head>` tem `<link rel="alternate" type="application/rss+xml">` apontando para `/pt/rss.xml`

#### Scenario: Idioma sem posts
- **WHEN** nenhum post existe em um idioma
- **THEN** o feed desse idioma é gerado, válido e sem itens
