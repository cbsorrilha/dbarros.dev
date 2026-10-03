## Why

O Cesar quer o site o mais perto possível de 100 no Lighthouse e sem regredir. Hoje a
produção já mede performance 0,99–1,0 e 1,0 em acessibilidade, boas práticas e SEO,
mas sobram achados baratos (CSS que bloqueia a primeira pintura, cadeia HTML → CSS →
fonte, cache curto de assets imutáveis, nome acessível do logo) e nada impede que uma
mudança futura derrube a nota sem ninguém ver.

## What Changes

- **CSS inline no HTML** (`build.inlineStylesheets: "always"`): some a requisição que
  bloqueia a renderização. A CSP já permite estilos inline.
- **`preload` da fonte principal** (Spectral 400 latino, woff2) no `<head>`, quebrando a
  cadeia HTML → CSS → fonte.
- **Cache longo para assets com hash:** `/_astro/*` com `Cache-Control: public,
  max-age=31536000, immutable`; fontes de `public/fonts/` com 30 dias.
- **Logo com nome acessível igual ao texto visível** (sem `aria-label` divergente).
- **Portão de Lighthouse no `pre-push`:** Lighthouse CI contra o build local, nas homes
  dos idiomas, tags, Sobre, uma 404 e até dois posts; o push falha se performance < 0,95
  ou se acessibilidade, boas práticas ou SEO < 1,0. Só roda quando o push inclui
  mudanças que afetam o site; `SKIP_LIGHTHOUSE=1` pula.
- **Decisão sobre o limite de performance:** 0,95 e não 1,0, porque a medição de
  laboratório oscila alguns pontos e um limite de 1,0 faria pushes falharem ao acaso
  (proposto pelo agente; o Cesar pode subir o limite depois).

## Capabilities

### New Capabilities

- `performance`: orçamento de Lighthouse por categoria, o portão no `pre-push` e as
  regras de entrega (CSS inline, preload de fonte, cache de assets).

### Modified Capabilities

- `theme`: o logo passa a ter nome acessível que corresponde ao texto visível.

## Impact

- **Código:** `astro.config.ts`, `src/layouts/Layout.astro`, `src/components/Logo.astro`,
  `public/_headers`, `lighthouserc.cjs`, `scripts/lighthouse-gate.sh`, `.husky/pre-push`.
- **Dependências:** `lighthouse` (dev). Usa o Chrome já instalado.
- **Fluxo:** `git push` com mudanças no site passa a levar ~1 min a mais.
