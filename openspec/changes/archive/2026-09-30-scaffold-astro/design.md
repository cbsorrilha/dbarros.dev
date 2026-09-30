## Context

O repo não tem código. O AstroPaper upstream está na **v6.1.0** (set/2026): na tag,
Astro 6 e Tailwind 4; o `main` já migrou para Astro 7, sem release com tokens semânticos em
`src/styles/theme.css` (`--background`, `--foreground`, `--accent`, `--muted`,
`--border`), config central em `astro-paper.config.ts`, dicionário de UI em
`src/i18n/lang/en.ts`, pnpm, e um build que roda `astro check`, `astro build` e
Pagefind. Ele traz modo claro/escuro (`src/scripts/theme.ts` + script inline
anti-FOUC no `Layout.astro`), fonte via Astro Fonts API com provedor Google, OG
dinâmico com Satori, Shiki com temas duplos (`min-light`/`night-owl`) e transformers
(nome de arquivo, highlight, diff).

O handoff do Vlad (`docs/design/vlad/`) define tokens finais, fontes, tema do Shiki,
logo e telas. Requisitos em `specs/theme` e `specs/build`.

## Goals / Non-Goals

**Goals:**
- Base compilando com a menor distância possível do upstream, para que as fatias
  seguintes reutilizem as páginas do AstroPaper em vez de reescrevê-las.
- Todo valor visual vindo dos tokens Vlad desde o primeiro commit de código.

**Non-Goals:**
- Reproduzir as telas finais (listagem 1a, post, tags, Sobre, 404, menu mobile).
  Neste change as páginas do AstroPaper só herdam tokens e fontes; cada tela é
  refeita na fatia que a reconstrói (3 e 4).
- Rotas por idioma e dicionários `en`/`es` (fatia 3).
- Manter compatibilidade com atualizações futuras do AstroPaper: depois da
  importação o código é nosso.

## Decisions

### 1. Importar o AstroPaper v6.1.0 por cópia, fixado na tag
`npx degit satnaing/astro-paper#v6.1.0` para um diretório temporário e cópia para a
raiz, preservando o `LICENSE` (MIT) com o crédito ao autor. Sem fork nem submódulo.
*Alternativas:* `npm create astro -- --template` (não fixa versão de forma óbvia);
fork (mantém um vínculo com upstream que não queremos acompanhar).

### 2. npm no lugar de pnpm
Apagar `pnpm-lock.yaml` e `pnpm-workspace.yaml`, gerar `package-lock.json` com
`npm install`. A spec e o Cloudflare Pages usam `npm run`. `.nvmrc` com `24` e
`engines.node` `>=22.12.0`.

### 3. Dark-only removendo, não desligando
O AstroPaper tem `features.lightAndDarkMode`, mas desligar a flag ainda deixa o
script anti-FOUC, o `theme.ts` e os valores claros no CSS. Remover os três, o ícone
de sol/lua, o botão e a flag do tipo de config. `<html>` recebe `color-scheme: dark`
via tokens; `<meta name="theme-color">` fica estático com o valor de `--bg` (exceção
documentada na spec).

### 4. Tokens: Vlad como fonte, AstroPaper como apelido
Copiar `docs/design/vlad/vlad-tokens.css` para `src/styles/vlad-tokens.css` (sem
alterar valores; o `@font-face` do Meslo já vem nele). Em `theme.css`, os tokens
semânticos do AstroPaper viram apelidos: `--background: var(--bg)`,
`--foreground: var(--text)`, `--accent: var(--link)`, `--muted: var(--surface)`,
`--muted-foreground: var(--text-muted)`, `--border` já coincide. O `@theme inline` do
Tailwind expõe também os tokens Vlad que as telas vão precisar (`bg-deep`, `link-hover`,
`link-subtle`, `notice`, `tag-*`). Assim os utilitários do upstream continuam
funcionando e nenhum hex fica fora do arquivo de tokens.
*Alternativa:* substituir todos os nomes do AstroPaper pelos do Vlad — reescreve
dezenas de componentes que as fatias 3 e 4 vão refazer de qualquer forma.

`docs/design/vlad/vlad-tokens.css` continua sendo a referência do design;
`src/styles/vlad-tokens.css` é a cópia usada pelo código. Se o design mudar, copia-se
de novo.

### 5. Fontes self-hosted, sem rede no build
- **Spectral:** pacote `@fontsource/spectral` (pesos 400/500/600/700 e itálicos
  400/600, subsets latin e latin-ext para acentos de pt/es), importado no CSS global.
  *Alternativa:* Astro Fonts API com `fontProviders.google()` — baixa do Google no
  build, violando o build sem rede; `fontProviders.local()` exigiria versionar os
  woff2 à mão.
- **Meslo NF:** baixar `Meslo.zip` do release mais recente do Nerd Fonts, extrair
  `MesloLGSNerdFont-Regular.ttf` e `-Italic.ttf`, converter para woff2
  (`fonttools`/`woff2_compress`, só no momento da implementação) e versionar em
  `public/fonts/` com a licença Apache 2.0 ao lado. É o caminho que o `@font-face`
  do handoff já espera.
- Remover a entrada `fonts` do `astro.config.ts` e o `<Font>` do layout.

### 6. Shiki com o tema `vlad`, tema único
Criar o tema como no `shiki-vlad.md`, em arquivo próprio
(`src/utils/shiki-vlad.ts`) importado pelo `astro.config.ts`. Trocar `themes` +
`defaultColor: false` por `theme: vlad`, o que elimina as variáveis CSS de tema duplo.
Manter `transformerNotationHighlight`, `WordHighlight` e `Diff` (custam nada e servem
a posts técnicos); remover o `transformerFileName`, cuja barra conflita com a barra
do design.

### 7. Bloco de código: transformer no build + script pequeno no cliente
Um transformer Shiki próprio envolve o `<pre>` em um `<figure class="code-block">` com
a barra superior (linguagem em `data-lang`, botão Copiar) e põe o conteúdo em um
wrapper `inline-block; min-width: 100%` que preserva o padding ao rolar. Um script
de ~20 linhas, carregado no layout, liga os botões (`navigator.clipboard.writeText`,
troca de rótulo por 1,6 s). Os rótulos vêm do dicionário de UI e são injetados como
atributos `data-*` no layout, para o transformer não depender de idioma.
*Alternativa:* componente `.astro` via MDX — só funcionaria em `.mdx`, e os posts são
`.md`.

### 8. Dicionário `pt` como idioma provisório
O handoff tem os rótulos finais em pt. Adicionar `src/i18n/lang/pt.ts` com as chaves
que este change usa (navegação, rodapé, Copiar/Copiado) e configurar `site.lang: "pt"`.
O `en.ts` do upstream fica, com as mesmas chaves traduzidas. A fatia 3 adiciona `es`,
as rotas prefixadas e a escolha do dicionário pela rota.

### 9. Casca comum agora, telas depois
Refazer neste change `Header.astro` (logo 2d, navegação Posts/Tags/Sobre com o estado
ativo do design, sem seletor de idioma, sem busca, sem tema) e `Footer.astro`
(crédito, RSS, Sobre), o foco acessível e as transições de 120ms. O menu mobile do
upstream continua funcionando, apenas com os tokens; a tela cheia do design fica para
a fatia 3.

### 10. Poda do upstream
| Sai | Motivo |
|---|---|
| `pagefind`, `@pagefind/default-ui`, `search.astro`, passo do build | busca fora do MVP |
| `og.png.ts`, `posts/[...slug]/index.png.ts`, `satori`, `getFontPathByWeight` | OG dinâmico; usar `og-default.png` |
| `ShareLinks`, `EditPost`, `shareLinks`, `features.editPost` | fora do MVP; repo privado |
| `archives/` e `features.showArchives` | a listagem já agrupa por ano |
| `Dockerfile`, `compose.yaml`, `.dockerignore`, `cz.yaml`, `.github/` | deploy é Cloudflare; menos estado |
| `src/content/posts/**`, imagens de demonstração, `default-og.jpg`, `favicon.svg` | conteúdo e marca do upstream |

`sharp` fica (otimização de imagens do Astro). ESLint e Prettier ficam, com os scripts
`lint` e `format`.

### 11. Post de exemplo provisório
Um único post `src/content/posts/exemplo-vlad.md` com parágrafos, citação, lista,
código inline e blocos Rust/TypeScript/sem linguagem, incluindo uma linha longa, para
verificar o tema. Ele será removido ou migrado para o layout de pastas na fatia 3.

## Ajustes feitos na implementação

- **Astro 7 e sharp 0.35:** a tag v6.1.0 ainda usa Astro 6.4 e sharp 0.34, com alertas
  do `npm audit` (Astro crítico: XSS e RCE; sharp alto: libvips). Atualizamos para Astro
  7.3.5, `@astrojs/mdx` 8 e sharp 0.35.5, como o `main` do upstream (commit `4fe3aca`), e
  trouxemos três correções do `main`: direção de anterior/próximo, alinhamento de
  colunas de tabela e foco no "pular para o conteúdo". `npm audit`: 0 vulnerabilidades.
  Com Astro 7 e Tailwind no mesmo Vite 8, o `overrides.vite` que a v6 exigia saiu.
- **`allowScripts`** para `esbuild` (npm 11 bloqueia scripts de instalação).
- **Meslo NF subsetada** (latim, pontuação, setas, matemática, box drawing,
  powerline): os woff2 completos tinham ~1,1 MB cada por causa dos ícones Nerd Font;
  subsetados ficam em 100 KB e 73 KB. Glifos fora do subset caem no próximo mono da pilha.
- **Sem publicação agendada:** o `postFilter` do upstream escondia posts com data
  futura comparando com `Date.now()`, o que torna o build dependente da hora em que roda.
  Agora só `draft` esconde um post.
- **Datas sem hora** no front matter são exibidas como o dia do calendário, sem
  conversão de fuso (antes, `2026-10-01` aparecia como 30/09 em `America/Sao_Paulo`).
- **Sem `ClientRouter`** (View Transitions): animava a troca de página, e a spec só
  permite transições de cor. Os scripts que dependiam de `astro:page-load` rodam direto.
- O botão Copiar do upstream (`attachCopyButtons` no post) foi removido em favor do
  bloco de código do design; o lightbox de imagem perdeu a animação de opacidade e passou
  a usar tokens e o dicionário.
- **Prettier ignora `src/content/`**: ele reformatava o código dentro dos posts.
- Continuam do upstream, visualmente fora do design, até a fatia 3: título do post em
  `--link`, barra de progresso de leitura, botão "voltar ao topo", breadcrumb, chips de
  tag e formato de data em inglês.

## Risks / Trade-offs

- [Astro 7 é recente e o AstroPaper ainda não lançou versão com ele; pode haver arestas] → fixar versões pelo
  `package-lock.json` e rodar `npm run build` a cada passo das tasks.
- [Remover recursos do upstream pode deixar imports órfãos] → `astro check` no build
  pega referências quebradas; checar também `grep` pelos nomes removidos.
- [Download do Meslo depende do GitHub] → acontece uma vez, na implementação; os woff2
  ficam versionados e o build não depende disso.
- [Os `.dc.html` e a spec divergem em detalhe] → o handoff vence para visual, conforme
  `AGENTS.md`; divergências relevantes são apontadas ao Cesar.
- [Páginas do AstroPaper ficam "no meio do caminho" visualmente até a fatia 3] →
  aceito; o aceite deste change é build, dark-only, tokens, fontes e código.

## Migration Plan

Não há site em produção nem deploy nesta fatia. Rollback é reverter o commit.
