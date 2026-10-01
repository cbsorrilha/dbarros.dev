## Why

O site já é trilíngue e tem o tema Vlad nos tokens, mas as páginas ainda são as do
AstroPaper: título do post em `--link`, breadcrumb, chips com `#`, barra de progresso,
botão "voltar ao topo", lista de cards sem agrupamento e 404 só no idioma padrão. O
handoff de design (`docs/design/vlad/`) define essas telas em alta fidelidade; este
change as implementa e fecha a fatia 3.

## What Changes

- **Listagem (1a):** `/{lang}/` como lista densa agrupada por ano, com data curta,
  título sublinhado, resumo e chips; filtro de chips no topo ("Todos" + uma por tag).
- **Post (1a/1b):** "← Posts", meta com data (`DD/MM/AAAA`) e tempo de leitura, título, lead (a
  `description`), chips e "Também em …" com links para as traduções existentes, corpo
  com as medidas do design (imagem com legenda, citação, listas, código), anterior e
  próximo em caixas.
- **Tags:** índice com chip, contagem e post mais recente por tag; página de tag com
  "← Tags", título, contagem, barra e as linhas da listagem com o ano na data. As cores
  por tag já funcionam para as tags com token; rótulos traduzidos e conjunto fechado
  ficam na fatia 4.
- **Chip de tag** genérico (pill, cor da tag com fundo 10% e borda 30%, cor neutra para
  tags sem token), sempre link para a página da tag.
- **Sobre:** coluna de leitura com nome, lead, texto e lista de links em grade.
- **404 estática por idioma** (`/{lang}/404.html`) e por tradução ausente
  (`/{lang}/posts/{slug}/404.html`, com "Ler em {idioma}"), sem JavaScript: o
  Cloudflare Pages serve a 404 mais próxima do caminho pedido.
- **Menu no celular** sem JavaScript (Popover API): tela cheia com itens grandes, item
  ativo marcado, seletor de idioma com nomes completos e rodapé com crédito e RSS.
- **JavaScript mínimo:** sai todo script que tem alternativa em HTML/CSS (menu,
  "pular para o conteúdo", `sessionStorage` do "Voltar", lightbox de imagem); fica só o
  botão Copiar, carregado apenas em páginas com código.
- **Remoções:** breadcrumb, barra de progresso, "voltar ao topo", links `#` nos
  títulos, lightbox, `Card`, `Main`, `Socials`, `LinkButton`, `BackButton` e demais sobras do
  AstroPaper que as telas novas substituem.

Fora deste change: conjunto fechado de tags e rótulos traduzidos (fatia 4); aviso de
tradução por IA no post (fatia 5); feed RSS por tag (opcional no design, fora do MVP).

## Capabilities

### New Capabilities

- `pages`: estrutura e conteúdo de cada tela — listagem, post, índice de tags, página
  de tag, Sobre e 404 — e o chip de tag.

### Modified Capabilities

- `theme`: a casca comum ganha o menu de tela cheia no celular, e o site passa a ter
  a regra de JavaScript mínimo.
- `i18n-routing`: o post mostra links para as traduções existentes ("Também em") e a
  404 passa a falar o idioma da URL e a oferecer a leitura em outro idioma.

## Impact

- **Código:** páginas em `src/pages/[lang]/` e `404.astro`; novos componentes de tela
  (linha de post, chip, cabeçalho de página, anterior/próximo); `Header` (menu mobile);
  `typography.css` (corpo do post); remoção de componentes do AstroPaper.
- **Conteúdo:** `src/content/pages/about/*.md` passa a ter o nome do autor como título
  e o lead como descrição.
- **Dicionário:** novas chaves (tempo de leitura, "Também em", "Todos", "Mais recente",
  contagem de posts, 404).
- **Dependências:** nenhuma nova.
