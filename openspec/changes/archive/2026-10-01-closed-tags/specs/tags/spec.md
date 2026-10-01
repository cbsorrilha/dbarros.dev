## Purpose

Define o conjunto fechado de tags do dbarros.dev: cada tag tem um slug fixo usado nas
URLs, um rótulo em cada idioma e uma cor do tema, tudo declarado em um único lugar.

## ADDED Requirements

### Requirement: Conjunto fechado de tags
As tags SHALL ser definidas em um único arquivo do repo. Cada tag SHALL ter um slug
fixo (letras minúsculas, números e hífen) e um rótulo para cada idioma suportado. O
conjunto inicial SHALL ser:

| Slug | pt | en | es |
|---|---|---|---|
| `rust` | Rust | Rust | Rust |
| `ai` | IA | AI | IA |
| `reflections` | Reflexões | Reflections | Reflexiones |

A ordem da definição SHALL ser a ordem em que as tags aparecem no filtro da listagem e
no índice de tags. Adicionar uma tag MUST exigir só uma entrada nessa definição e um
token de cor.

#### Scenario: Rótulo faltando
- **WHEN** uma tag da definição não tem rótulo em `es`
- **THEN** o build falha na checagem de tipos

#### Scenario: Ordem
- **WHEN** um idioma tem posts com `reflections` e `rust`
- **THEN** o filtro da listagem mostra "Todos", depois `rust` e depois `reflections`

### Requirement: Cor por tag
Toda tag do conjunto SHALL ter um token de cor `--tag-<slug>` no arquivo de tokens. Uma
tag sem esse token MUST fazer o build falhar com mensagem que cite a tag e o token
esperado.

#### Scenario: Token ausente
- **WHEN** a tag `go` é adicionada à definição sem `--tag-go` nos tokens
- **THEN** o build falha citando `go` e `--tag-go`

### Requirement: Rótulo traduzido
Toda exibição de uma tag (chips, filtros, índice de tags, título e `<title>` da página
de tag) SHALL usar o rótulo do idioma da página. URLs SHALL usar sempre o slug.

#### Scenario: Tag ai em espanhol
- **WHEN** o visitante abre `/es/tags/ai/`
- **THEN** o título da página é "IA" e a URL mantém `ai`

#### Scenario: Tag reflections em inglês
- **WHEN** um post com `reflections` é exibido em `/en/`
- **THEN** o chip mostra "Reflections"
