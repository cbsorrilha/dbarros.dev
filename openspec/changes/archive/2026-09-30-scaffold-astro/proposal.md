## Why

O repo hoje só tem a spec, o handoff do tema Vlad e o OpenSpec: não existe site. As
fatias 3 a 7 (i18n, tags, tradução, deploy e primeiro post) precisam de uma base
Astro que já compile, seja dark-only e use os tokens definitivos do Vlad, para que
cada fatia seguinte só acrescente comportamento em vez de brigar com o tema de
exemplo do AstroPaper.

## What Changes

- Importar o AstroPaper **v6.1.0** para a raiz do repo e atualizar para **Astro 7**
  (como o `main` do upstream já faz, sem release), trocando pnpm por **npm**
  (`package-lock.json`).
- Tornar o site **dark-only**: remover o alternador de tema, o script de tema, o
  script anti-FOUC e todos os valores de modo claro.
- Adotar os **tokens do Vlad** (`docs/design/vlad/vlad-tokens.css`) como única fonte
  de cor, tipografia, espaço e raio; os tokens semânticos do AstroPaper passam a
  apontar para eles. Nenhum hex fora do arquivo de tokens.
- Fontes **self-hosted**: Spectral para todo texto e interface, Meslo NF somente em
  código. O build não baixa fontes da rede.
- **Shiki com o tema `vlad`** (Dracula com fundo e comentário ajustados) e o
  **bloco de código** do design: rótulo da linguagem, botão Copiar/Copiado,
  rolagem horizontal sem quebra.
- **Casca comum** do layout segundo o design: logo 2d em HTML/CSS, cabeçalho com
  navegação (sem seletor de idioma ainda), rodapé, foco acessível; favicons e imagem
  Open Graph padrão do handoff.
- **Remover o que está fora do MVP ou fere os princípios:** busca (Pagefind), OG
  dinâmico (Satori), links de compartilhamento, "editar post", página de arquivo,
  Docker, CI do GitHub e o conteúdo de exemplo do AstroPaper.
- Configurar o site: `https://dbarros.dev`, autor Cesar de Barros, fuso
  `America/Sao_Paulo`; um post de exemplo provisório com blocos de código para
  verificação visual.

Fora deste change (ficam para as fatias seguintes): rotas `/pt|en|es/`, seletor de
idioma, dicionário pt/es, layout de posts por pasta, telas de listagem/post/Sobre/404
no design final e menu mobile (fatia 3); chips e páginas de tag (fatia 4); aviso de
tradução (fatia 5); Pages Function e Cloudflare (fatia 6).

## Capabilities

### New Capabilities

- `theme`: identidade visual Vlad no site — dark-only, tokens centralizados,
  fontes, tema do Shiki, bloco de código, logo, cabeçalho, rodapé e ícones.
- `build`: como o site é construído — comandos `npm run dev`/`build`, build
  determinístico e sem rede, e ausência dos recursos do AstroPaper fora do MVP.

### Modified Capabilities

(nenhuma; não há specs vivas ainda)

## Impact

- **Código:** cria toda a árvore Astro (`astro.config.ts`, `astro-paper.config.ts`,
  `src/`, `public/`, `package.json`, `tsconfig.json`, configs de lint/format).
- **Dependências:** Astro 7, sharp 0.35, Tailwind 4, MDX, RSS, sitemap, Shiki transformers,
  `@fontsource/spectral`; saem `pagefind`, `@pagefind/default-ui`, `satori`.
- **Assets:** `public/fonts/` (Meslo NF woff2 + licença), favicons e
  `og-default.png` do handoff.
- **Documentação:** `AGENTS.md` (status da fatia 2 e licença do AstroPaper
  preservada em `LICENSE`).
- **Sistemas externos:** nenhum. Cloudflare e DNS ficam para a fatia 6.
