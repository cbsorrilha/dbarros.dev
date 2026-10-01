## MODIFIED Requirements

### Requirement: Front matter validado
O front matter de cada arquivo de post SHALL seguir o schema: `title` (texto,
obrigatório), `description` (texto, obrigatório), `pubDate` (data, obrigatória),
`updatedDate` (data, opcional), `tags` (lista de slugs do conjunto fechado de tags, sem
repetição, padrão vazia), `lang` (idioma suportado, obrigatório), `source_lang` (idioma
suportado, obrigatório), `draft` (booleano, padrão `false`) e `translation` (opcional,
com `source_hash` no formato `sha256:<hex>`, `model`, `translated_at` e `locked`,
padrão `false`). Um arquivo fora do schema MUST fazer o build falhar indicando o
arquivo e o campo; para uma tag desconhecida, a mensagem MUST citar também a tag e as
tags válidas.

#### Scenario: Campo obrigatório ausente
- **WHEN** um arquivo de post não tem `description`
- **THEN** o build falha citando o arquivo e o campo `description`

#### Scenario: Idioma não suportado
- **WHEN** um arquivo tem `lang: fr`
- **THEN** o build falha

#### Scenario: Tag fora do conjunto
- **WHEN** um arquivo de post tem `tags: [rust, golang]`
- **THEN** o build falha citando o arquivo, `golang` e as tags válidas

#### Scenario: Tag escrita como rótulo
- **WHEN** um arquivo de post tem `tags: [Rust]`
- **THEN** o build falha, porque o front matter usa o slug `rust`

#### Scenario: Tag repetida
- **WHEN** um arquivo de post tem `tags: [ai, ai]`
- **THEN** o build falha citando o arquivo

### Requirement: Coerência entre os arquivos de um post
O build MUST falhar, com mensagem que cite o post e o arquivo, quando: o `lang` de um
arquivo difere do nome do arquivo; os arquivos de um post declaram `source_lang`
diferentes; o arquivo do `source_lang` não existe na pasta; o arquivo-fonte tem o
bloco `translation`; ou uma tradução tem tags diferentes das do arquivo-fonte (a ordem
não importa).

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

#### Scenario: Tradução com tags diferentes
- **WHEN** `meu-post/pt.md` (fonte) tem `tags: [rust]` e `meu-post/en.md` tem `tags: [rust, ai]`
- **THEN** o build falha citando `meu-post/en.md`
