## Context

`tags` é `z.array(z.string())`; o slug da URL sai de `slugifyStr` (pacotes `slugify` e
`lodash.kebabcase`) e o rótulo exibido é o texto do front matter. As cores vêm de
regras `.tag[data-tag="…"]` copiadas do handoff para `src/styles/vlad-tokens.css`, uma
por tag. Os filtros e o índice ordenam as tags alfabeticamente pelo slug. Requisitos em
`specs/tags`, `specs/content-model` e `specs/pages`.

## Goals / Non-Goals

**Goals:**
- Uma fonte de verdade para tags, tipada, que o schema, as páginas e a validação usam.
- Tag nova = uma entrada + um token, sem tocar componentes.

**Non-Goals:**
- Descrição por tag, ícones ou feed RSS por tag.
- Tradução automática de rótulos: os rótulos são escritos à mão na definição.

## Decisions

### 1. `src/content/tags.ts`
```ts
export const TAGS = {
  rust: { pt: "Rust", en: "Rust", es: "Rust" },
  ai: { pt: "IA", en: "AI", es: "IA" },
  reflections: { pt: "Reflexões", en: "Reflections", es: "Reflexiones" },
} as const satisfies Record<string, Record<Locale, string>>;
```
Mais `TAG_SLUGS` (tupla com as chaves, na ordem da definição), o tipo `TagSlug` e
`tagLabel(slug, lang)`. `Record<Locale, string>` faz faltar rótulo ser erro de tipo.
Fica em `src/content/` porque é conteúdo editorial, ao lado dos posts. A ordem das entradas é a ordem de
exibição, definida livremente pelo autor (reordenar = mover linhas).

### 2. Schema
`tags: z.array(z.enum(TAG_SLUGS, { message })).default([]).refine(unique)`, com a
mensagem listando as tags válidas e apontando `src/content/tags.ts`. O Astro já prefixa
o erro com o arquivo e o campo.

### 3. Validações no carregamento de posts
`getPostGroups()` ganha duas regras, com o mesmo estilo de mensagem das atuais:
- tradução com conjunto de tags diferente do fonte (comparação sem ordem);
- token de cor ausente: lê `src/styles/vlad-tokens.css` uma vez (`node:fs`, só no
  build) e confere `--tag-<slug>:` para cada slug de `TAG_SLUGS`. Roda mesmo sem posts,
  porque `getPostGroups()` é chamado por todas as listagens.
*Alternativa:* teste separado — o projeto não tem suíte de testes e a regra precisa
derrubar o build da Cloudflare.

### 4. Cor no componente, não em regra por tag (decisão do Cesar: "simples vence")
`TagChip` passa `style="--c: var(--tag-<slug>)"`; a regra genérica `.tag` do arquivo de
tokens já desenha texto, fundo e borda a partir de `--c`. As três regras
`.tag[data-tag]` saem da cópia em `src/styles/` (o handoff em `docs/` fica intacto) e o
`data-tag` continua no HTML para estilo e testes. A página de tag usa o mesmo token no
título e na barra. Os apelidos `--color-tag-*` do Tailwind em `theme.css` saem (não são
usados).

### 5. Utilitários de tag
`getUniqueTags(posts)` → `getTagsInUse(posts)`: devolve `TagSlug[]` na ordem de
`TAG_SLUGS`, só as que têm posts. `postHasTag(post, slug)` vira comparação direta.
Componentes recebem `slug` e chamam `tagLabel(slug, lang)`; some o par
`tag`/`tagName`. `src/utils/slugify.ts` e as dependências `slugify`,
`lodash.kebabcase` e `@types/lodash.kebabcase` saem.

## Risks / Trade-offs

- [Ler um CSS no build para validar token é acoplamento a formato de arquivo] → regra
  simples (`--tag-<slug>:`), e a mensagem diz exatamente o que acrescentar.
- [Traduções feitas à mão podem esquecer de atualizar tags] → é exatamente o que a
  checagem de coerência pega; a fatia 5 copia as tags do fonte automaticamente.

## Migration Plan

Os posts de exemplo já usam `rust` e `reflections`. Sem produção; rollback é reverter o
commit.
