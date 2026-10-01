## Purpose

Define como o autor escreve um post no dbarros.dev: a organização em pastas com um
arquivo por idioma, o front matter validado e as regras que ligam os arquivos de um
mesmo post, de forma que erros de conteúdo apareçam no build e não no site.

## ADDED Requirements

### Requirement: Post como pasta
Cada post SHALL ser uma pasta direta em `src/content/posts/`, cujo nome é o slug do
post, contendo um arquivo Markdown por idioma, nomeado pelo código do idioma
(`pt.md`, `en.md`, `es.md`), e suas imagens. Imagens SHALL ser referenciadas por caminho
relativo à pasta do post e SHALL funcionar em todos os idiomas. Arquivos Markdown com
outro nome ou em subpastas de um post MUST fazer o build falhar com mensagem que
indique o arquivo.

#### Scenario: Post trilíngue com imagem
- **WHEN** a pasta `meu-post/` tem `pt.md`, `en.md`, `es.md` e `diagrama.png`, e os três referenciam `./diagrama.png`
- **THEN** as três páginas do post exibem a imagem

#### Scenario: Arquivo com nome inválido
- **WHEN** a pasta de um post contém `rascunho.md`
- **THEN** o build falha citando `rascunho.md`

### Requirement: Front matter validado
O front matter de cada arquivo de post SHALL seguir o schema: `title` (texto,
obrigatório), `description` (texto, obrigatório), `pubDate` (data, obrigatória),
`updatedDate` (data, opcional), `tags` (lista de textos, padrão vazia), `lang` (idioma
suportado, obrigatório), `source_lang` (idioma suportado, obrigatório), `draft`
(booleano, padrão `false`) e `translation` (opcional, com `source_hash` no formato
`sha256:<hex>`, `model`, `translated_at` e `locked`, padrão `false`). Um arquivo fora
do schema MUST fazer o build falhar indicando o arquivo e o campo.

#### Scenario: Campo obrigatório ausente
- **WHEN** um arquivo de post não tem `description`
- **THEN** o build falha citando o arquivo e o campo `description`

#### Scenario: Idioma não suportado
- **WHEN** um arquivo tem `lang: fr`
- **THEN** o build falha

### Requirement: Coerência entre os arquivos de um post
O build MUST falhar, com mensagem que cite o post e o arquivo, quando: o `lang` de um
arquivo difere do nome do arquivo; os arquivos de um post declaram `source_lang`
diferentes; o arquivo do `source_lang` não existe na pasta; ou o arquivo-fonte tem o
bloco `translation`.

#### Scenario: lang não bate com o arquivo
- **WHEN** `meu-post/en.md` declara `lang: pt`
- **THEN** o build falha citando `meu-post/en.md`

#### Scenario: Fonte ausente
- **WHEN** `meu-post/` tem só `en.md`, com `source_lang: pt`
- **THEN** o build falha dizendo que `meu-post/pt.md` não existe

#### Scenario: Post escrito direto em outro idioma
- **WHEN** `outro-post/` tem só `es.md`, com `lang: es` e `source_lang: es`
- **THEN** o build termina com sucesso e o post existe só em `/es/`

#### Scenario: Fonte com bloco de tradução
- **WHEN** o arquivo-fonte de um post tem `translation`
- **THEN** o build falha citando o arquivo

### Requirement: Rascunhos
Um arquivo com `draft: true` MUST NOT ser publicado. Um arquivo-fonte com `draft: true`
SHALL esconder o post em todos os idiomas, mesmo que as traduções não sejam rascunho.

#### Scenario: Fonte em rascunho
- **WHEN** `meu-post/pt.md` é a fonte e tem `draft: true`, e `en.md` tem `draft: false`
- **THEN** o post não é publicado em nenhum idioma

#### Scenario: Tradução em rascunho
- **WHEN** só `meu-post/es.md` tem `draft: true`
- **THEN** o post é publicado em `pt` e `en` e não existe em `es`

### Requirement: Ordem dos posts
Listas de posts SHALL ser ordenadas por `pubDate` decrescente, com o slug em ordem
alfabética como desempate. `updatedDate` MUST NOT alterar a ordem.

#### Scenario: Post atualizado
- **WHEN** um post antigo ganha `updatedDate` recente
- **THEN** ele mantém a posição definida pelo `pubDate`
