## 1. Importação do AstroPaper

- [x] 1.1 Baixar o AstroPaper v6.1.0 com `npx degit satnaing/astro-paper#v6.1.0` para um diretório temporário e copiar para a raiz, sem sobrescrever `AGENTS.md`, `CLAUDE.md`, `docs/`, `openspec/`, `.claude/` e `.gitignore` (mesclar o `.gitignore` do upstream no nosso)
- [x] 1.2 Preservar o `LICENSE` MIT do upstream e registrar a origem (AstroPaper v6.1.0, commit `35cfa7f`) no `README.md` do repo, substituindo o README do upstream por um curto do dbarros.dev
- [x] 1.3 Trocar pnpm por npm: apagar `pnpm-lock.yaml` e `pnpm-workspace.yaml`, rodar `npm install`, versionar `package-lock.json`; criar `.nvmrc` com `24`
- [x] 1.3a Atualizar para Astro 7 e sharp 0.35 (alertas do `npm audit` na v6.1.0) e portar as correções do `main` do upstream; `npm audit` sem vulnerabilidades
- [x] 1.4 Confirmar que `npm run dev` e `npm run build` funcionam com o upstream intacto, antes de qualquer poda (linha de base)

## 2. Poda do upstream

- [x] 2.1 Remover busca: `pagefind`, `@pagefind/default-ui`, `src/pages/search.astro`, o passo Pagefind do script `build`, o link de busca no cabeçalho e `features.search`
- [x] 2.2 Remover OG dinâmico: `src/pages/og.png.ts`, `src/pages/posts/[...slug]/index.png.ts`, `satori`, `src/utils/getFontPathByWeight.ts`, `resolveDefaultOgImagePath` se ficar órfão, e `features.dynamicOgImage`
- [x] 2.3 Remover `ShareLinks`, `EditPost`, `shareLinks` e `features.editPost` (config, tipos e uso no post)
- [x] 2.4 Remover `src/pages/archives/` e `features.showArchives`
- [x] 2.5 Remover `Dockerfile`, `compose.yaml`, `.dockerignore`, `cz.yaml`, `.github/`, `AstroPaper-lighthouse-score.svg` e `CHANGELOG.md` do upstream
- [x] 2.6 Remover todo `src/content/posts/**`, as imagens de demonstração de `src/assets/images/`, `public/default-og.jpg` e `public/favicon.svg`
- [x] 2.7 Rodar `grep` pelos nomes removidos (`pagefind`, `satori`, `ShareLinks`, `EditPost`, `archives`, `og.png`) e `npm run build` para garantir que não sobrou referência

## 3. Dark-only

- [x] 3.1 Remover `src/scripts/theme.ts`, o script inline anti-FOUC e o import do script em `Layout.astro`, o botão de tema e os ícones `IconMoon`/`IconSunHigh`
- [x] 3.2 Remover `features.lightAndDarkMode` da config e do tipo, o `@custom-variant dark` e qualquer classe `dark:` restante
- [x] 3.3 Tornar `<meta name="theme-color">` estático com o valor de `--bg` (`#130e12`) e remover o preenchimento em runtime
- [x] 3.4 Verificar no navegador, com `prefers-color-scheme: light` emulado, que a página continua escura e que nada é gravado no `localStorage`

## 4. Tokens e fontes

- [x] 4.1 Copiar `docs/design/vlad/vlad-tokens.css` para `src/styles/vlad-tokens.css` sem alterar valores e importá-lo primeiro em `global.css`
- [x] 4.2 Reescrever `src/styles/theme.css`: apagar os blocos de valores claro/escuro, definir os tokens do AstroPaper como apelidos dos tokens Vlad e expor no `@theme inline` também `bg-deep`, `surface`, `link-hover`, `link-subtle`, `notice`, `code-inline` e `tag-*`, e `--font-app` como `var(--font-serif)`
- [x] 4.3 Instalar `@fontsource/spectral` e importar os pesos 400/500/600/700 e itálicos 400/600; remover a entrada `fonts` do `astro.config.ts` e o `<Font>` do `Layout.astro`
- [x] 4.4 Baixar o Meslo do release mais recente do Nerd Fonts, converter `MesloLGSNerdFont-Regular.ttf` e `-Italic.ttf` para woff2, salvar em `public/fonts/` com o arquivo de licença
- [x] 4.5 Ajustar `typography.css` e estilos base para usar tokens de tamanho, entrelinha (`--fs-body`, `--lh-body`), cor de link/hover, citação (barra `--quote`) e código inline (Meslo 0.85em, `--surface`, `--code-inline`, raio 4)
- [x] 4.6 Rodar `grep -rnE '#[0-9a-fA-F]{3,8}\b' src/` e confirmar que só restam hex em `vlad-tokens.css`, no tema do Shiki e no `theme-color`

## 5. Shiki e bloco de código

- [x] 5.1 Criar `src/utils/shiki-vlad.ts` com o tema do `docs/design/vlad/shiki-vlad.md` e usá-lo em `astro.config.ts` com `theme: vlad`, sem `themes`/`defaultColor`; remover `transformerFileName` e seu arquivo
- [x] 5.2 Criar o transformer do bloco de código: `<figure class="code-block">` com barra superior (linguagem, botão Copiar) e wrapper interno que preserva o padding ao rolar
- [x] 5.3 Estilizar o bloco conforme o design: `--bg-deep`, borda interna `--border`, raio 8, barra em Meslo 13px `--text-muted`, botão mín. 72×32 em `--surface`, código 15/13px lh 1.7, sangria de 24px só acima de 640px
- [x] 5.4 Criar o script de copiar (clipboard, "Copiado" em `--notice` por 1,6 s) carregado no layout, com rótulos lidos de atributos `data-*` preenchidos pelo dicionário

## 6. Dicionário e casca comum

- [x] 6.1 Criar `src/i18n/lang/pt.ts` com as chaves usadas pela casca e pelo bloco de código (Posts, Tags, Sobre, RSS, Copiar, Copiado, crédito do rodapé) e completar as mesmas chaves em `en.ts`
- [x] 6.2 Configurar `astro-paper.config.ts`: URL `https://dbarros.dev/`, título `dbarros.dev`, autor "Cesar de Barros", `lang: "pt"`, fuso `America/Sao_Paulo`, `ogImage: "og-default.png"`, redes do Cesar (GitHub e LinkedIn `cbsorrilha`; e-mail fica de fora por decisão do Cesar), sem busca, OG dinâmico, edição ou compartilhamento
- [x] 6.3 Refazer `Header.astro` com o logo 2d em HTML/CSS e a navegação Posts/Tags/Sobre com o estado ativo do design (padding 28px 64px; 14px 20px no celular)
- [x] 6.4 Refazer `Footer.astro` com "© {ano} Cesar de Barros" e links RSS e Sobre
- [x] 6.5 Aplicar foco `outline: 2px solid var(--link); outline-offset: 2px` e transições de cor de 120ms ease-out; remover animações e View Transitions que não sejam de cor, se houver
- [x] 6.6 Copiar os favicons, `apple-touch-icon.png`, `icon-512.png` e `og-default.png` do handoff para `public/` e referenciá-los no `Layout.astro`

## 7. Conteúdo provisório e verificação

- [x] 7.1 Criar `src/content/posts/exemplo-vlad.md` com parágrafos, h2, citação, lista, código inline e blocos Rust, TypeScript e sem linguagem (um com linha longa), com `pubDate: 2026-10-01`
- [x] 7.2 Rodar `npm ci && npm run build` em uma cópia limpa e confirmar código 0
- [x] 7.3 Rodar `npm run build` com a rede desligada e confirmar sucesso
- [x] 7.4 Verificar em `dist/`: sem `/search`, sem `pagefind/`, sem posts do AstroPaper, `canonical` em `https://dbarros.dev/`, data do post exemplo como 1º de outubro de 2026
- [x] 7.5 Verificar no navegador (desktop e 375px), comparando com `Vlad Post.dc.html` e `Vlad Tokens.dc.html`: fontes Spectral/Meslo, cores de sintaxe, Copiar/Copiado, rolagem da linha longa, bloco sem sangria no celular, logo, navegação ativa, foco por teclado, favicon, nenhuma fonte de terceiros na aba de rede
- [x] 7.6 Rodar `npm run lint` e `npm run format:check`
- [x] 7.7 Atualizar a tabela de fatias em `AGENTS.md` (fatia 2 feita) e, se algo da implementação divergir do design, registrar em `design.md`
