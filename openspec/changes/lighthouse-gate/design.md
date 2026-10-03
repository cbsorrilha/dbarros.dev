## Context

Medição de produção (Lighthouse 13, móvel): `/pt/` perf 0,99 (FCP 1,6 s), `/pt/about/` e
`/en/tags/` perf 1,0; acessibilidade, boas práticas e SEO 1,0 em todas. Achados: CSS
externo de ~10 KB bloqueando a renderização, cadeia HTML → CSS → woff2, cache curto em
`/_astro/*`, `label-content-name-mismatch` no logo (`aria-label` "dbarros.dev, página
inicial" com texto visível "d•B dbarros.dev"), e "legacy JavaScript" do beacon do RUM
(fora do nosso controle). O repo já usa Husky (`pre-commit` com `translate:check`). O
Chrome está instalado na máquina do Cesar.

## Goals / Non-Goals

**Goals:** nota estável perto de 100 e regressões barradas antes de chegar à `main`.

**Non-Goals:** rodar Lighthouse na Cloudflare (o build precisa ser determinístico e sem
rede); medir produção a cada push (o RUM já cobre usuários reais); otimizar o beacon.

## Decisions

### 1. CSS inline
`build: { inlineStylesheets: "always" }`. O CSS total é pequeno (~10 KB comprimido) e
cada página passa a pintar só com o HTML. Custo: o CSS não é mais reaproveitado do cache
entre páginas; para um blog de leitura, a primeira visita importa mais.

### 2. Preload de fonte
`import spectral400 from "@fontsource/spectral/files/spectral-latin-400-normal.woff2?url"`
no `Layout` e `<link rel="preload" as="font" type="font/woff2" crossorigin>`. Só a 400
latina (texto corrido e o maior elemento das telas); pré-carregar outros pesos disputaria
banda com o HTML.

### 3. Cache
No `public/_headers`: `/_astro/*` → `public, max-age=31536000, immutable`;
`/fonts/*` → `public, max-age=2592000`. HTML continua com o padrão da Pages (revalida).

### 4. Logo
Sem `aria-label`; marca "d•B" com `aria-hidden="true"`; "dbarros.dev" visível e lido.

### 5. Portão
- `@lhci/cli` com `lighthouserc.cjs`: `collect.staticDistDir: "dist"`, URLs montadas a
  partir de `dist/` (homes, `pt/tags/`, `pt/about/`, `pt/404.html`, até dois posts),
  `numberOfRuns: 1`, preset móvel padrão; `assert` com `categories:performance ≥ 0.95` e
  as demais `= 1` (erro). `upload.target: "filesystem"` em `.lighthouseci/` (ignorado).
- `scripts/lighthouse-gate.sh`: decide se roda (diff entre o upstream e `HEAD` tocando os
  caminhos do site; sem upstream, roda), respeita `SKIP_LIGHTHOUSE=1`, faz `npm run
  build` e `lhci autorun`, e imprime um resumo legível.
- `.husky/pre-push` chama o script.
*Alternativa:* `pre-commit` — lento demais para cada commit.

## Ajustes feitos na implementação

- **`lighthouse` em vez de `@lhci/cli`:** o LHCI trazia dependências transitivas com
  alertas altos no `npm audit` (`tmp`, `extract-zip`, `basic-ftp`). O portão virou um
  script próprio (`scripts/lighthouse-gate.ts`, ~150 linhas) com `lighthouse` e
  `chrome-launcher`: servidor estático local com Brotli, páginas a partir de `dist/`,
  orçamento por categoria e resumo com FCP/LCP/TBT/CLS. Sem `lighthouserc.cjs` nem
  `.lighthouseci/`.
- **404 sem SEO:** o `noindex` intencional derrubava SEO para 66 (`is-crawlable`).
- **Fontes só no subconjunto latino:** o CSS inline carregava 32 `@font-face`, 24 para
  cirílico, vietnamita e latino estendido; pt, en e es cabem no latino. O CSS inline caiu
  de 66 KB para 57 KB.
- **Brotli no servidor do portão:** sem compressão, a medição penalizava o HTML com CSS
  inline (FCP 1,8 s, perf 98). Com Brotli, como a Cloudflare: FCP 1,4 s e 100 em todas as
  categorias e páginas.
- **Resultado:** `/pt/`, `/en/`, `/es/`, `/pt/tags/`, `/pt/about/` e `/pt/404.html` com
  performance, acessibilidade, boas práticas e SEO 100.
- **Fora deste change:** `npm audit` aponta `http-cache-semantics` (alto) vindo do próprio
  Astro, sem versão corrigida ainda.

## Risks / Trade-offs

- [Variação de laboratório] → limite 0,95 na performance e verificação contra arquivos
  locais, sem latência de rede.
- [Servidor estático do LHCI não aplica `_headers`/`_redirects`] → o portão mede
  renderização e acessibilidade; cabeçalhos são cobertos pelos specs de deploy/security.
- [Push mais lento] → só quando o site muda; `SKIP_LIGHTHOUSE=1` para emergências.

## Migration Plan

Commit, push (que já passa pelo portão novo), conferir produção com Lighthouse.
