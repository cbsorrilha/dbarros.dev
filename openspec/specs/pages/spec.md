# pages Specification

## Purpose
Define o que cada tela do dbarros.dev mostra e como se organiza — listagem, post,
tags, Sobre e 404 — conforme o handoff de design do tema Vlad em
`docs/design/vlad/`, que é a referência visual de medidas e cores.

## Requirements

### Requirement: Listagem de posts
A home do idioma (`/{lang}/`) SHALL mostrar o título "Posts", uma fila de chips de
filtro ("Todos", ativo, e um chip por tag usada no idioma, cada um levando à página da
tag) e os posts do idioma agrupados por ano de publicação, do mais recente para o mais
antigo. Cada grupo SHALL ter o ano como rótulo. Cada linha SHALL mostrar a data curta
(dia e mês abreviado, no idioma da página), o título como link para o post, o resumo
(`description`) e os chips das tags do post. No desktop a data fica numa coluna à
esquerda; em telas de até 640px ela fica acima do título.

#### Scenario: Agrupamento por ano
- **WHEN** um idioma tem posts publicados em 2025 e 2026
- **THEN** a listagem mostra o grupo 2026 antes do grupo 2025, cada post no grupo do seu ano

#### Scenario: Linha de post
- **WHEN** a listagem em `/pt/` mostra um post de 18/09/2026 com a tag `rust`
- **THEN** a linha tem "18 set", o título com link para `/pt/posts/{slug}/`, o resumo e o chip `rust`

#### Scenario: Idioma sem posts
- **WHEN** um idioma não tem posts publicados
- **THEN** a listagem mostra uma mensagem de lista vazia no idioma, sem grupos nem filtros de tag

### Requirement: Página de post
A página de post SHALL mostrar, nesta ordem: link "← Posts" para a home do idioma; a
data de publicação e o tempo estimado de leitura; o título; o lead (a `description`);
os chips de tags; quando o post existir em outros idiomas, "Também em" com links para
cada tradução publicada, pelo nome do idioma; o corpo; e a navegação para o post
anterior (mais antigo) e o próximo (mais novo) no mesmo idioma, quando existirem. A
data do post SHALL ser numérica no formato `DD/MM/AAAA` em todos os idiomas. O
tempo de leitura SHALL ser calculado a 200 palavras por minuto, arredondado para cima,
com mínimo de 1 minuto. Imagens com texto alternativo SHALL ter legenda com esse texto.

#### Scenario: Meta do post
- **WHEN** um post publicado em 01/10/2026 tem 1.500 palavras e é aberto em `/pt/`
- **THEN** a meta mostra "01/10/2026 · 8 min de leitura"

#### Scenario: Post sem traduções
- **WHEN** o post existe só no idioma atual
- **THEN** a linha "Também em" não aparece

#### Scenario: Primeiro post
- **WHEN** o post é o mais antigo do idioma
- **THEN** só a caixa "Próximo →" aparece

#### Scenario: Imagem com legenda
- **WHEN** o corpo tem `![Diagrama do fluxo](./diagrama.png)`
- **THEN** a imagem aparece com a legenda "Diagrama do fluxo" abaixo dela

### Requirement: Chip de tag
Toda tag exibida SHALL ser um chip em formato de pílula, com o rótulo da tag no idioma
da página, e SHALL ser link para `/{lang}/tags/{slug}/`. O chip SHALL usar a cor da tag
(texto na cor, fundo a 10% e borda a 30%), vinda do token `--tag-<slug>`. Chips não
mostram `#`.

#### Scenario: Tag com cor
- **WHEN** um post tem a tag `rust`
- **THEN** o chip aparece em `--tag-rust` e leva a `/{lang}/tags/rust/`

#### Scenario: Tag sem token
- **WHEN** uma tag do conjunto não tem token de cor
- **THEN** o build falha antes de gerar qualquer chip (ver `tags`), então nenhuma página exibe chip sem cor

#### Scenario: Rótulo no idioma da página
- **WHEN** um post com a tag `ai` é exibido em `/pt/`
- **THEN** o chip mostra "IA" e leva a `/pt/tags/ai/`

### Requirement: Índice de tags
`/{lang}/tags/` SHALL listar cada tag usada no idioma com o chip, a contagem de posts
("3 posts", no idioma) e o título do post mais recente com essa tag, como link para ele.

#### Scenario: Linha do índice
- **WHEN** a tag `rust` tem 3 posts em `pt`
- **THEN** a linha mostra o chip `rust`, "3 posts", "Mais recente" e o título do post mais novo com `rust`

### Requirement: Página de tag
`/{lang}/tags/{tag}/` SHALL mostrar o link "← Tags", o rótulo da tag como título na cor
da tag, a contagem de posts, uma barra curta na cor da tag e as linhas de post da
listagem, com a data incluindo o ano.

#### Scenario: Página da tag
- **WHEN** o visitante abre `/pt/tags/rust/`
- **THEN** vê "← Tags", o título "rust" na cor da tag, a contagem e as linhas dos posts com datas como "18 set 2026"

### Requirement: Página Sobre
`/{lang}/about/` SHALL mostrar, na coluna de leitura, o nome do autor como título, um
lead, o texto da página e uma lista de links em duas colunas (rótulo e valor): GitHub,
LinkedIn e o RSS do idioma.

#### Scenario: Links do Sobre
- **WHEN** o visitante abre `/es/about/`
- **THEN** a lista tem GitHub, LinkedIn e RSS, este apontando para `/es/rss.xml`

### Requirement: Sem extras do AstroPaper
As páginas MUST NOT ter breadcrumb, barra de progresso de leitura, botão "voltar ao
topo", links `#` ao lado dos títulos do corpo nem ampliação de imagem (lightbox).

#### Scenario: Post limpo
- **WHEN** um post é exibido e rolado até o fim
- **THEN** não aparece barra de progresso, botão de voltar ao topo, breadcrumb nem `#` ao lado dos subtítulos

### Requirement: Aviso de tradução
Todo post exibido a partir de um arquivo traduzido (com o bloco `translation`) SHALL
mostrar, entre os chips e o corpo, um aviso discreto no idioma da página: "Traduzido
do {idioma de origem} por IA local e revisado pelo autor." seguido do link "Ler o
original" para o post no idioma do fonte. O aviso SHALL seguir o design (borda 1px
`--border`, raio 8, texto 15px `--text-muted`, ponto de 7px em `--notice` com brilho) e
MUST NOT aparecer no arquivo-fonte.

#### Scenario: Post traduzido
- **WHEN** o visitante abre `/en/posts/meu-post/`, traduzido de `pt`
- **THEN** vê "Translated from Portuguese by a local AI and reviewed by the author." e "Read the original", que leva a `/pt/posts/meu-post/`

#### Scenario: Original
- **WHEN** o visitante abre `/pt/posts/meu-post/`, que é o fonte
- **THEN** não há aviso de tradução
