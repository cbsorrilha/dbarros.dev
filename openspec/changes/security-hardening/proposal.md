## Why

Com o site no ar, a varredura automática começou (sondagens em 443 e 8443, comuns a
todo domínio que ganha certificado novo). O site é estático na Cloudflare Pages, sem
servidor próprio, banco ou login, então o risco técnico é baixo; o que falta é o básico
barato: cabeçalhos de segurança que limitem o que um navegador aceita das páginas, e
proteção das contas que controlam site e domínio, que são o alvo real.

## What Changes

- **Cabeçalhos de segurança** em todas as respostas, via `_headers` da Cloudflare Pages:
  `Strict-Transport-Security` (2 anos, subdomínios, preload), `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` (desliga câmera, microfone, localização etc.),
  `X-Frame-Options: DENY` e `Cross-Origin-Opener-Policy`.
- **Content-Security-Policy estrita:** só recursos do próprio domínio; scripts só os
  inline cujo hash SHA-256 o build calcula (hoje, só o do botão Copiar); sem `eval`, sem
  plugins, sem ser embutido em `iframe` de terceiros, formulários desligados. Estilos
  inline continuam permitidos (o Astro inlina CSS de escopo e os chips usam `style`).
- **Geração no build:** uma integração lê os scripts inline de todo `dist/**/*.html`,
  calcula os hashes e grava o `_headers` final; um script inline novo entra sozinho na
  política, sem edição manual.
- **DNSSEC religado** pela Cloudflare, com o novo `DS` cadastrado no Squarespace.
- **Checklist de contas do Cesar** (fora do código): 2FA em GitHub, Cloudflare e
  Squarespace; trava de transferência do domínio no Squarespace.
- **Fora de escopo, de propósito:** regras de WAF, rate limiting, bloqueio de portas e
  Bot Fight Mode — complexidade sem ganho para site estático, com risco de bloquear
  robôs legítimos.

## Capabilities

### New Capabilities

- `security`: cabeçalhos de segurança, política de conteúdo (CSP) gerada no build e
  DNSSEC da zona.

### Modified Capabilities

(nenhuma)

## Impact

- **Código:** `public/_headers` (modelo), integração no `astro.config.ts` que completa o
  `_headers` em `dist/`.
- **Dependências:** nenhuma.
- **Sistemas externos (passos do Cesar):** Cloudflare (DNSSEC), Squarespace (DS, trava,
  2FA), GitHub (2FA).
- **Risco:** uma CSP errada quebra o botão Copiar ou estilos; mitigado por verificação
  no navegador local (`wrangler pages dev`) e no preview antes da `main`.
