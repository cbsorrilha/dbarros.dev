## Context

Produção (`https://dbarros.dev`) hoje responde com `x-content-type-options: nosniff`,
`referrer-policy: strict-origin-when-cross-origin` e `access-control-allow-origin: *`,
padrões da Cloudflare Pages; não há HSTS, CSP nem proteção contra `iframe`. O build
gera um `<style>` inline por página (CSS de escopo do Astro), atributos `style` nos
chips e no título da página de tag (`--c: var(--tag-…)`), JSON-LD em
`<script type="application/ld+json">` nos posts e, só em posts com código, o script
inline do botão Copiar. Não há recursos de terceiros. O DNSSEC foi desligado para a
migração. Requisitos em `specs/security`.

## Goals / Non-Goals

**Goals:**
- Política estrita para scripts sem manutenção manual de hashes.
- Nada muda visualmente nem no comportamento do site.

**Non-Goals:**
- WAF, rate limiting, bloqueio de portas, Bot Fight Mode (ver proposta).
- CSP estrita para estilos: o ganho é pequeno (injeção de CSS) e exigiria hashes de
  cada `<style>` e `'unsafe-hashes'` para atributos.
- Relatórios de violação (`report-to`): exigiria um endpoint para receber.

## Decisions

### 1. `_headers` com modelo e integração no build
`public/_headers` traz os cabeçalhos fixos para `/*` e uma linha
`Content-Security-Policy` com o marcador `{{SCRIPT_HASHES}}`. Uma integração
`astro:build:done` (ao lado da `flatten404`) percorre `dist/**/*.html`, extrai o
conteúdo dos `<script>` inline executáveis (sem `src`, e sem `type` ou com
`type="module"`/`text/javascript`; JSON-LD fica de fora porque não é executado), calcula
`sha256-<base64>` de cada um, ordena e deduplica, e substitui o marcador em
`dist/_headers`. Se não houver script inline, o marcador vira vazio. O build falha se o
marcador não estiver no modelo, para a política nunca sair sem a lista.
*Alternativa:* hash fixo escrito à mão — quebra em qualquer mudança no script.

### 2. Valores
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()
X-Frame-Options: DENY
Cross-Origin-Opener-Policy: same-origin
Content-Security-Policy: default-src 'self'; script-src 'self' {{SCRIPT_HASHES}};
  style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';
  connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none';
  frame-ancestors 'none'; upgrade-insecure-requests
```
O `.dev` já é HSTS-preload no nível do TLD; o cabeçalho deixa explícito e cobre
navegadores sem a lista. `access-control-allow-origin: *` da Pages fica: o conteúdo é
público e leitores de RSS web podem precisar.

### 3. Preview e `pages.dev`
O `_headers` vale para todos os deploys, inclusive previews e `*.pages.dev`; não há
diferença de política entre ambientes.

### 4. Verificação no navegador
Com `wrangler pages dev`, um post de teste com bloco de código (criado só numa cópia
temporária) é aberto no Chrome headless; confere-se que o botão Copiar funciona, que o
console não tem violação de CSP e que um script inline injetado via DevTools Protocol é
bloqueado. Depois, a mesma checagem no preview da Cloudflare antes da `main`.

### 5. DNSSEC
Cloudflare → DNS → Settings → DNSSEC → Enable: a Cloudflare mostra os dados do `DS`
(key tag, algoritmo 13, digest type 2, digest). O Cesar cadastra no Squarespace (DNS →
DNSSEC → adicionar registro DS). Verificação com `dig DS` no registro `.dev` e `dig
+dnssec` num resolvedor validador (flag `ad`).

### 6. Checklist de contas
Fica em `docs/deploy/security-checklist.md`, sem segredos: 2FA (app autenticador ou
chave física, não SMS) em GitHub, Cloudflare e Squarespace; códigos de recuperação
guardados; trava de transferência ligada no Squarespace. O agente não verifica essas
contas; o Cesar marca o que fez.

## Risks / Trade-offs

- [CSP bloqueia algo legítimo e quebra uma página] → verificação local e no preview
  antes da `main`; rollback é reverter o commit.
- [Hash muda a cada build e o cache serve HTML antigo com cabeçalho novo] → o script
  é estável entre builds; e a Pages invalida o cache a cada deploy.
- [HSTS com `preload` é difícil de desfazer] → o TLD `.dev` já força HTTPS de qualquer
  forma; não há perda.
- [Errar o `DS` derruba a resolução para validadores] → copiar os valores exatos da
  Cloudflare e verificar com `dig` logo após; se falhar, remover o `DS` no Squarespace.

## Migration Plan

Commit numa branch → preview na Cloudflare → verificação → merge na `main`. DNSSEC
depois, com verificação imediata.
