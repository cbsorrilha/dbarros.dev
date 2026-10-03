## Why

Depois do lançamento, a Cloudflare passou a injetar o beacon do Web Analytics (RUM) no
HTML entregue a navegadores. A CSP do site o bloqueia, e as specs proíbem script de
analytics. O Cesar decidiu manter o beacon: métricas de usuários reais (Core Web Vitals,
visitas por página) valem esse único script de terceiro, que não usa cookies. Este change
torna a decisão explícita e faz o beacon funcionar.

## What Changes

- **Analytics:** além do analytics da zona (servidor), o site passa a ter o Cloudflare
  Web Analytics (RUM), cujo beacon é injetado pela borda da Cloudflare — não pelo build.
  Continua sem cookies e sem outros rastreadores. **Reverte** a decisão "analytics sem
  JavaScript".
- **CSP:** `script-src` passa a aceitar `https://static.cloudflareinsights.com` e
  `connect-src` passa a aceitar `https://cloudflareinsights.com`. Nada mais de terceiros.
- **JavaScript mínimo:** a regra continua, com uma exceção nomeada — o beacon do RUM.
- **Documentação:** `docs/SPEC.md` e `AGENTS.md` refletem a exceção.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `deploy`: o requisito de analytics sem JavaScript é trocado por analytics da zona +
  RUM da Cloudflare.
- `theme`: "JavaScript mínimo" passa a listar o beacon do RUM como exceção permitida.
- `security`: a CSP autoriza os dois domínios do beacon.

## Impact

- **Código:** `public/_headers` (CSP).
- **Dashboard:** nada a mudar; o RUM já está ligado na zona.
- **Performance:** um script de ~6 KB, carregado de forma assíncrona; não bloqueia
  renderização.
