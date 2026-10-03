## REMOVED Requirements

### Requirement: Analytics sem JavaScript
**Reason**: o Cesar decidiu manter o Cloudflare Web Analytics (RUM) para ter métricas de
usuários reais; o beacon é um script de terceiro.
**Migration**: substituído pelo requisito "Analytics" (zona + RUM, sem cookies).

## ADDED Requirements

### Requirement: Analytics
A audiência SHALL ser medida pelo analytics da zona na Cloudflare (no servidor) e pelo
Cloudflare Web Analytics (RUM), cujo beacon é injetado pela borda da Cloudflare nas
respostas HTML a navegadores. O build MUST NOT incluir script de analytics. O site MUST
NOT usar cookies nem carregar outro script, pixel ou beacon de rastreamento.

#### Scenario: Beacon funcionando
- **WHEN** um navegador carrega uma página publicada
- **THEN** o beacon de `static.cloudflareinsights.com` carrega e envia a medição a `cloudflareinsights.com` sem violação de CSP

#### Scenario: Sem cookies
- **WHEN** qualquer página é carregada
- **THEN** nenhuma resposta define cookie

#### Scenario: Build sem rastreador
- **WHEN** se procura `cloudflareinsights` nos arquivos de `dist/`
- **THEN** não há ocorrência (o beacon só existe na resposta servida pela Cloudflare)
