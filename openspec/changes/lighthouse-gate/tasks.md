## 1. Desempenho e acessibilidade

- [x] 1.1 `build.inlineStylesheets: "always"`; conferir que nenhum HTML tem `<link rel="stylesheet">`
- [x] 1.2 Preload da Spectral 400 latina no `Layout`
- [x] 1.3 `public/_headers`: cache imutável em `/_astro/*` e 30 dias em `/fonts/*`
- [x] 1.4 Logo sem `aria-label`, marca `aria-hidden`; nome acessível "dbarros.dev"

## 2. Portão

- [x] 2.1 Portão com `lighthouse` (dev) em `scripts/lighthouse-gate.ts` — trocado o `@lhci/cli` por alertas no `npm audit` (ver design)
- [x] 2.2 `scripts/lighthouse-gate.sh` (decide se roda pelo diff com o upstream, `SKIP_LIGHTHOUSE`, build, `lhci autorun`, resumo) e script `npm run lighthouse`
- [x] 2.3 `.husky/pre-push` chamando o script

## 3. Verificação

- [x] 3.1 Rodar o portão: todas as páginas passam; registrar as notas
- [x] 3.2 Falha proposital (cópia temporária com link sem nome acessível) bloqueia com mensagem clara
- [x] 3.3 Decisão de rodar ou pular conforme o diff; `SKIP_LIGHTHOUSE=1` pula
- [x] 3.4 Build, lint, format; `AGENTS.md` (portão no push, como pular); commit
- [ ] 3.5 [Cesar] Push (passa pelo portão); [agente] Lighthouse em produção nas mesmas páginas
