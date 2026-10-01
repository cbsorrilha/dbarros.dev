## 1. Definição e schema

- [x] 1.1 Criar `src/content/tags.ts` com `TAGS` (rust, ai, reflections e rótulos pt/en/es), `TAG_SLUGS`, `TagSlug` e `tagLabel(slug, lang)`
- [x] 1.2 `src/content.config.ts`: `tags` como lista de `z.enum(TAG_SLUGS)` sem repetição, com mensagem que lista as tags válidas e aponta `src/content/tags.ts`

## 2. Validações

- [x] 2.1 `getPostGroups()`: tradução com tags diferentes do fonte falha citando `slug/lang.md`
- [x] 2.2 `getPostGroups()`: cada slug de `TAG_SLUGS` precisa de `--tag-<slug>:` em `src/styles/vlad-tokens.css`; senão falha citando a tag e o token

## 3. Exibição

- [x] 3.1 `getUniqueTags` → `getTagsInUse(posts)` (slugs na ordem da definição) e `postHasTag` por comparação direta
- [x] 3.2 `TagChip` recebe só `slug`, mostra `tagLabel(slug, lang)` e define `--c: var(--tag-<slug>)`; remover as regras `.tag[data-tag]` e os `--color-tag-*` sem uso
- [x] 3.3 `PostRow`, `TagFilters`, post, listagem, índice e página de tag usando slug + rótulo traduzido (título, `<title>`, cor do título e da barra)
- [x] 3.4 Remover `src/utils/slugify.ts` e as dependências `slugify`, `lodash.kebabcase`, `@types/lodash.kebabcase`

## 4. Verificação

- [x] 4.1 `npm run build`, `npm run lint`, `npm run format:check` e `npm audit` verdes
- [x] 4.2 Em `dist/`: chips com rótulo traduzido (`/en/` "Reflections", `/pt/` "Reflexões"), títulos das páginas de tag traduzidos, URLs com slug, ordem `rust` antes de `reflections` no filtro
- [x] 4.3 Casos de erro em cópia temporária: `tags: [golang]`, `tags: [Rust]`, `tags: [ai, ai]`, tradução com tag a mais, tag nova sem token — todos falham com mensagem que cita arquivo/tag/token; tag nova com token passa e gera página
- [x] 4.4 Atualizar `AGENTS.md` (fatia 4 feita; como adicionar uma tag)
