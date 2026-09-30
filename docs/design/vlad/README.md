# Handoff: tema Vlad (dbarros.dev)

## Visão geral
Tema visual do blog `dbarros.dev` (Astro + AstroPaper), fatia 1 da spec do MVP. Dark-only, baseado na paleta Dracula levada para mais escuro ("Sangue Dracula"). Cobre tokens, logo, listagem, post, tags, Sobre, 404, menu mobile e assets de ícone/compartilhamento.

## Sobre os arquivos
Os arquivos `.dc.html` são **referências de design em HTML**, não código de produção. A tarefa é recriá-los no AstroPaper usando componentes `.astro` e os tokens de `vlad-tokens.css`. Para abrir as referências, abra os `.dc.html` no navegador (precisam do `support.js` na mesma pasta).

## Fidelidade
**Alta fidelidade.** Cores, tipografia, espaçamentos e estados são finais. Os textos são de exemplo (títulos inventados, lorem ipsum); os rótulos de interface são finais em pt e precisam ir para o dicionário de UI por idioma.

## Arquivos
- `vlad-tokens.css` — tokens como variáveis CSS. Substitui a paleta Dracula provisória da spec. Nenhum hex fora deste arquivo.
- `shiki-vlad.md` — tema do Shiki (Dracula + comentário e fundo ajustados).
- `Vlad Tokens.dc.html` — folha de tokens, logo, componentes e checagem de contraste.
- `Vlad Listagem.dc.html` — listagem (use **1a, lista densa**; 1b cards foi descartada).
- `Vlad Post.dc.html` — post, desktop (1a) e celular (1b).
- `Vlad Tags e Sobre.dc.html` — índice de tags, página de tag, Sobre.
- `Vlad Mobile e 404.dc.html` — listagem, menu aberto e tag no celular; 404 celular e desktop.
- `Vlad Logo.dc.html` — exploração do logo. **Escolhido: 2d.**
- `assets/` — favicons, apple-touch-icon e imagem Open Graph.

## Tokens
Ver `vlad-tokens.css`. Resumo:

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#130e12` | fundo da página |
| `--bg-deep` | `#0c080b` | bloco de código, menu mobile aberto, tiles |
| `--surface` | `#241b21` | código inline, botão Copiar, idioma ativo |
| `--border` | `#33262f` | bordas, divisórias de 1px |
| `--text` | `#ece4e6` | texto |
| `--text-muted` | `#a3949b` | datas, resumos, navegação inativa |
| `--link` | `#e8606f` | links, ponto do logo, botão primário, sublinhado do nav ativo |
| `--link-hover` | `#ff79c6` | hover de link |
| `--link-subtle` | `#5a4450` | sublinhado de títulos em listas |
| `--quote` | `#ff79c6` | barra da citação (2px) |
| `--code-inline` | `#8be9fd` | texto do código inline |
| `--code-comment` | `#7a6f85` | comentários no Shiki |
| `--notice` | `#50fa7b` | ponto do aviso de tradução, "Copiado" |
| `--tag-rust` / `--tag-ai` / `--tag-reflections` | `#ffb86c` / `#8be9fd` / `#ff79c6` | chips |

Contraste: todos os pares de texto passam AA sobre `--bg`. `--code-comment` fica abaixo de 4.5:1 e só deve ser usado em código.

**Fontes:** Spectral (Google Fonts; pesos 400, 500, 600, 700 + itálico 400/600) para tudo, inclusive interface. Meslo NF só em código e código inline — não está no Google Fonts; hospedar o woff2 em `/public/fonts/` (ver `@font-face` no CSS). Não há sans-serif.

**Escala (desktop / ≤640px):** display 48/36 · h1 de post 46/32 (700, lh 1.12, tracking −0.015em) · h1 de página 40/32 (700) · h2 28/23 (600) · lead 21/18 · corpo 19/17 (lh 1.75) · título na lista 20/19 (600) · navegação 17 · meta 15/14 · chip 14 (500) · código 15/13 (lh 1.7).

**Espaço:** 4, 8, 12, 16, 24, 32, 48, 64. **Raio:** 4 (código inline), 8 (blocos, botões, aviso), 12 (cards maiores), pill (chips, seletor de idioma).

## Logo (2d)
- `d` + ponto + `B`, Spectral 400 **itálico**, tracking −0.02em, line-height 1.
- Ponto: círculo de 0.14em em `--link`, na linha de base, margem 0.04em de cada lado, `box-shadow: 0 0 0.18em rgba(232,96,111,.7)`.
- Cabeçalho: marca a 28px (24px no celular) + `dbarros.dev` a 17px (15px) em `--text-muted`, peso 500, gap 12px. O conjunto é link para a home do idioma.
- Construir como HTML/CSS (texto + span do ponto), não imagem, para herdar a fonte.

## Telas

### Layout comum
- **Cabeçalho:** padding 28px 64px (celular 14px 20px), borda inferior `--border`. Esquerda: logo. Direita (desktop): Posts, Tags, Sobre em 17px, gap 32px; ativo em `--text` com borda inferior 1px `--link` e padding-bottom 2px; inativos `--text-muted`, hover `--text`. Depois, o seletor de idioma.
- **Seletor de idioma:** pill com fundo `--bg-deep`, borda interna 1px `--border`, padding 3px, gap 4px; itens PT/EN/ES 14px/600, padding 3px 10px; ativo com fundo `--surface` e `--text`. Leva ao mesmo slug no outro idioma. Idioma sem tradução do post atual: esconder o item.
- **Celular:** Tags/Sobre saem do cabeçalho; aparece o botão de menu (44×44, três linhas de 20×1.5px).
- **Rodapé:** padding igual ao do cabeçalho, borda superior, 15px `--text-muted`: "© 2026 Cesar de Barros" à esquerda; RSS e Sobre como links à direita.

### Listagem (Listagem 1a; Mobile 1a)
- Conteúdo com padding 64px, largura máx. 760px, alinhado à esquerda.
- h1 "Posts", depois filtro de chips: "Todos" ativo (fundo `--text`, texto `--bg`) e um chip por tag (link para a página da tag).
- Grupos por ano: rótulo 15px/600, tracking 0.08em, `--text-muted`, borda inferior.
- Linha: grid `72px | 1fr`, gap 24px, padding 20px 0, borda inferior. Coluna 1: data curta ("18 set", tabular-nums). Coluna 2: título (20px/600, sublinhado 1px `--link-subtle`, offset 5px; hover: texto e sublinhado `--link`), resumo (17px, lh 1.6, `--text-muted`), chips.
- Celular: sem grid; data acima do título; padding 18px 0.

### Chip de tag
14px/500, padding 1px 10px, pill; cor da tag no texto, 10% no fundo, 30% na borda. Filtros no topo: 15px, padding 2px 12px. Sempre link para `/{lang}/tags/{slug}/`. Rótulo vem do dicionário de tags por idioma.

### Post (Post 1a/1b)
- Coluna de 680px centralizada; padding 56px 0 72px (celular 28px 20px 48px); gap 24px.
- Ordem: "← Posts" (16px, muted) · meta "1 out. 2026 · 8 min de leitura" (15px) · h1 · lead (21px, muted) · chips + "Também em English e Español" (links para as traduções existentes) · aviso de tradução (só em arquivos traduzidos) · corpo.
- **Aviso de tradução:** borda 1px `--border`, raio 8, padding 12px 16px, 15px `--text-muted`; ponto 7px `--notice` com `--glow-notice`. Texto do dicionário: "Traduzido do {idioma de origem} por IA local e revisado pelo autor." + link "Ler o original".
- **Corpo:** 19px, lh 1.75, gap entre blocos 22px; h2 com 16px extra acima. Links sublinhados em `--link`. Código inline: Meslo 0.85em, fundo `--surface`, texto `--code-inline`, padding 2px 6px, raio 4. Citação: itálico 22px, barra esquerda 2px `--quote`, padding-left 22px. Listas com padding-left 22px e gap 8px.
- **Bloco de código:** fundo `--bg-deep`, borda interna 1px `--border`, raio 8. Desktop: sangra 24px para cada lado da coluna; celular: **não sangra**, fica dentro da margem de 20px. Barra superior: nome da linguagem à esquerda e botão "Copiar" à direita, em Meslo 13px `--text-muted`; botão com mín. 72×32, fundo `--surface`, raio 4. Código com padding 20px em todos os lados, **inclusive ao rolar** (conteúdo em wrapper `inline-block; min-width:100%`), rolagem horizontal, sem quebra de linha.
- **Imagem:** sangra como o código no desktop; legenda 15px itálico muted.
- **Anterior / próximo:** borda superior, margin-top 40px; grid 2 colunas (1 no celular), gap 16px; cada item com borda interna 1px `--border`, raio 8, padding 18px 20px, rótulo 14px muted ("← Anterior", "Próximo →") e título 18px/600; hover: borda `--link`. "Próximo" alinhado à direita no desktop.

### Índice de tags (Tags e Sobre 1a)
Linhas com grid `180px | 1fr`: chip (16px) + contagem ("3 posts") | "Mais recente" (15px muted) + título do post mais recente (19px/600, mesmo sublinhado da lista).

### Página de tag (Tags e Sobre 1b; Mobile 1c)
"← Tags"; h1 com o rótulo da tag **na cor da tag**; contagem ao lado (17px muted); barra de 48×2px na cor da tag; depois as mesmas linhas da listagem (com ano na data: "18 set 2026", coluna de 96px). Final: "Feed desta tag: RSS" (opcional, fora da spec do MVP).

### Sobre (Tags e Sobre 1c)
Coluna de 680px como o post. h1 com o nome (46px), lead, parágrafos, h2 "Sobre este blog", e lista de links em grid `140px | 1fr`: rótulo muted, valor como link (GitHub, LinkedIn, E-mail, RSS).

### Menu aberto no celular (Mobile 1b)
Tela cheia com fundo `--bg-deep`; ícone vira X. Itens em 30px/600 com divisórias; item ativo com ponto 6px `--link` à esquerda. Seletor de idioma com nomes completos (Português, English, Español) em 3 colunas, 16px. No rodapé do menu: crédito e RSS.

### 404 (Mobile 1d; desktop 1e)
"404" em 128px/700 (88px no celular), `--link`, `text-shadow: 0 0 32px rgba(232,96,111,.35)`. Título "Esta página não existe." (36/28px, 600). Texto: "O endereço pode ter mudado, ou o post não existe neste idioma." Botões: primário "Ver todos os posts" (fundo `--link`, texto `--bg`, hover `--link-hover`) e secundário "Ler em {idioma}" (borda `--border`, hover borda `--link`) — só mostrar o secundário quando o slug existir em outro idioma. No celular, botões empilhados com altura mín. 48px.

## Interações
- Hover de links: `--link` → `--link-hover`. Títulos em listas: sublinhado `--link-subtle` → texto e sublinhado `--link`.
- Botão Copiar: copia o texto do bloco; troca o rótulo para "Copiado" em `--notice` por 1.6s.
- Nenhuma animação além de transições de cor (sugestão: 120ms ease-out).
- Estados de foco: usar outline 2px `--link` com offset 2px (não desenhado; manter acessível).

## Assets
- `assets/favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` (180), `icon-512.png`: marca d•B sobre `--bg`. Em 16px a marca fica ilegível e o favicon usa só o ponto vermelho.
- `assets/og-default.png` (1200×630): imagem padrão de compartilhamento.
- Fontes: Spectral via Google Fonts (ou self-host); Meslo NF a ser baixada do repositório Nerd Fonts e convertida para woff2.
