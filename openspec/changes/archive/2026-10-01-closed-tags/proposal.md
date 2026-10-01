## Why

Hoje `tags` aceita qualquer texto: um erro de digitação (`Rust`, `rusts`) cria uma tag
nova em silêncio, e o chip mostra o texto como foi escrito, sem tradução. A spec do MVP
pede um conjunto fechado, definido em um lugar só, com slug fixo na URL e rótulo
traduzido por idioma, e que uma tag fora do conjunto quebre o build (aceite da fatia 4).

## What Changes

- **Definição única das tags** em `src/content/tags.ts`: para cada tag, o slug e o
  rótulo em `pt`, `en` e `es`. Conjunto inicial: `rust` (Rust/Rust/Rust), `ai`
  (IA/AI/IA) e `reflections` (Reflexões/Reflections/Reflexiones). A ordem da
  definição é a ordem em que as tags aparecem.
- **Schema:** `tags` passa a ser lista de slugs desse conjunto, sem repetição
  (**BREAKING** para conteúdo com tag livre). Tag desconhecida falha o build citando o
  arquivo, a tag e as tags válidas.
- **Coerência:** as traduções de um post devem ter as mesmas tags do arquivo-fonte.
- **Cor obrigatória:** toda tag do conjunto precisa do token `--tag-<slug>`; faltar o
  token falha o build. O chip pega a cor direto do token, sem regra CSS por tag.
- **Rótulo traduzido** em todo lugar: chips do post e da listagem, filtros, índice de
  tags, título e `<title>` da página de tag.
- **Limpeza:** saem `slugify`, `lodash.kebabcase` e o utilitário de slug; tags não são
  mais derivadas de texto livre.

Uma tag nova passa a custar uma entrada em `tags.ts` e um token em
`src/styles/vlad-tokens.css`.

## Capabilities

### New Capabilities

- `tags`: o conjunto fechado de tags, seus slugs, rótulos por idioma, cores e ordem.

### Modified Capabilities

- `content-model`: o campo `tags` do front matter passa a aceitar só slugs do conjunto,
  sem repetição, e as traduções devem repetir as tags do fonte.
- `pages`: o chip mostra o rótulo traduzido e sempre tem cor de tag (deixa de existir
  "tag sem token").

## Impact

- **Código:** `src/content.config.ts`, `src/utils/posts.ts`, `getUniqueTags.ts`,
  `TagChip`, `PostRow`, `TagFilters`, páginas de post, listagem e tags;
  `src/styles/vlad-tokens.css` (regras `.tag[data-tag]` substituídas pelo token no
  componente).
- **Dependências:** saem `slugify`, `lodash.kebabcase` e `@types/lodash.kebabcase`.
- **Conteúdo:** os posts de exemplo já usam slugs válidos (`rust`, `reflections`).
