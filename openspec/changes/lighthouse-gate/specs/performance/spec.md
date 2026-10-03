## Purpose

Define o desempenho exigido do dbarros.dev e como ele é garantido: notas mínimas de
Lighthouse por categoria, verificadas antes de cada push, e as regras de entrega que as
sustentam.

## ADDED Requirements

### Requirement: Orçamento de Lighthouse
Cada página verificada SHALL ter, no Lighthouse em modo móvel padrão contra o build
local, performance de pelo menos 0,95 e nota 1,0 em acessibilidade, boas práticas e SEO.
As páginas verificadas SHALL ser: a home de cada idioma, o índice de tags e o Sobre de um
idioma, uma página 404 e até dois posts publicados, quando existirem. Na 404, SEO não é
avaliado: ela tem `noindex` de propósito. A medição SHALL servir o build com compressão
Brotli, como a Cloudflare, para medir o que o visitante recebe.

#### Scenario: Site dentro do orçamento
- **WHEN** o portão roda sobre o build atual
- **THEN** todas as páginas passam

#### Scenario: Regressão de acessibilidade
- **WHEN** uma mudança cria um link sem nome acessível
- **THEN** o portão falha apontando a página e a auditoria

### Requirement: Portão no pre-push
O hook de `pre-push` SHALL construir o site e rodar o orçamento de Lighthouse quando o
push incluir mudanças em `src/`, `public/`, `astro.config.ts`, `package.json` ou
`package-lock.json`, e SHALL bloquear o push se alguma página ficar abaixo do orçamento,
mostrando página, categoria e nota. Pushes só com outras mudanças MUST NOT rodar o
portão. `SKIP_LIGHTHOUSE=1` SHALL pular o portão.

#### Scenario: Push com mudança no site
- **WHEN** o autor faz push de um commit que altera `src/`
- **THEN** o portão roda antes do envio

#### Scenario: Push só de documentação
- **WHEN** o push só altera `docs/` ou `openspec/`
- **THEN** o portão não roda

#### Scenario: Abaixo do orçamento
- **WHEN** uma página fica com performance 0,90
- **THEN** o push é bloqueado com a página, a categoria e a nota

### Requirement: Entrega sem bloqueio de renderização
O HTML SHALL trazer o CSS inline, sem folha de estilo externa que bloqueie a primeira
pintura, e SHALL pré-carregar a fonte de texto principal. Assets com hash no nome SHALL
ser servidos com `Cache-Control: public, max-age=31536000, immutable`.

#### Scenario: Primeira pintura
- **WHEN** uma página é carregada
- **THEN** não há requisição de CSS bloqueante e a fonte Spectral 400 é pedida junto com o HTML

#### Scenario: Asset imutável
- **WHEN** se pede um arquivo de `/_astro/`
- **THEN** a resposta tem `Cache-Control: public, max-age=31536000, immutable`
