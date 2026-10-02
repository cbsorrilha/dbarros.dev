## Why

O site está pronto no repo, mas `dbarros.dev` ainda aponta para o Firebase Hosting e
nada publica o build. A fatia 6 da spec coloca o site no ar pela Cloudflare Pages, com
`git push` na `main` como único passo de deploy, e fecha o que hoje é provisório no
roteamento (redirect da raiz fixo em `/pt/` e redirects com meta refresh de 2 s).

## What Changes

- **Redirect da raiz por idioma:** uma Pages Function só em `/` escolhe `pt`, `en` ou
  `es` pelo `Accept-Language`, com `pt` como fallback (302, `Vary: Accept-Language`).
  A página estática atual continua como fallback local e sem Function.
- **Redirects de servidor:** `public/_redirects` troca o meta refresh de
  `/{lang}/posts/` por 301.
- **Saem os posts de exemplo** (`exemplo-vlad`, `so-pt`): o site vai ao ar sem
  conteúdo provisório; as telas vazias já existem. O primeiro post é a fatia 7.
- **Cloudflare Pages:** projeto ligado ao repo privado, build `npm run build` (que já
  roda o `translate:check`), saída `dist/`, Node 24, preview por branch.
- **Domínio:** `dbarros.dev` (apex) é o endereço canônico; `www.dbarros.dev` passa a
  existir e redireciona (301) para o apex.
- **DNS:** inventário completo da zona atual no Google Cloud DNS antes de qualquer
  mudança; zona recriada na Cloudflare; nameservers trocados no registrar; DNSSEC
  desligado antes da troca, se estiver ligado.
- **Analytics sem JavaScript** (**muda a spec do MVP**): o analytics da própria zona
  Cloudflare, medido no servidor, no lugar do Cloudflare Web Analytics, que injeta um
  script em toda página. Decisão do Cesar, pela regra de JavaScript mínimo.
- **Firebase:** site e projeto desligados depois que `dbarros.dev` responder pela
  Cloudflare.
- **Opcional, no fim:** transferir o registro do domínio para o Cloudflare Registrar
  (preço de custo).
- **Runbook** com cada passo externo marcado como do Cesar (dashboards e logins) ou
  do agente (código, verificação), executado um passo por vez.

## Capabilities

### New Capabilities

- `deploy`: onde e como o site é publicado — Cloudflare Pages, build, domínio
  canônico e `www`, redirects de servidor, DNS, analytics sem JavaScript e o que não
  pode ir para produção.

### Modified Capabilities

- `i18n-routing`: o redirect da raiz passa a escolher o idioma pelo `Accept-Language`
  (com `pt` como fallback) em produção.

## Impact

- **Código:** `functions/index.ts` (Pages Function), `public/_redirects`, remoção de
  `src/content/posts/exemplo-vlad/` e `so-pt/`; `docs/SPEC.md` e `AGENTS.md` (analytics
  sem JS, deploy).
- **Dependências:** nenhuma no site; `wrangler` só via `npx`, para testar localmente.
- **Sistemas externos (passos do Cesar):** conta e zona na Cloudflare, Pages ligado
  ao GitHub, registrar do domínio (nameservers), Google Cloud DNS (export), Firebase.
- **Risco de indisponibilidade:** curto, na troca de nameservers; mitigado mantendo
  os registros do Firebase até o domínio estar ativo na Cloudflare.
