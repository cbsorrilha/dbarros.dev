## MODIFIED Requirements

### Requirement: Política de conteúdo estrita
Toda resposta HTML SHALL incluir `Content-Security-Policy` que permita carregar
recursos só do próprio site (`default-src 'self'`), com `script-src` restrito a `'self'`,
aos hashes SHA-256 dos scripts inline publicados e a `https://static.cloudflareinsights.com`
(beacon do Cloudflare Web Analytics), `connect-src` restrito a `'self'` e
`https://cloudflareinsights.com`, `object-src 'none'`, `base-uri 'self'`, `form-action
'none'`, `frame-ancestors 'none'` e `upgrade-insecure-requests`. Estilos inline SHALL
ser permitidos. A política MUST NOT conter `'unsafe-inline'` ou `'unsafe-eval'` em
`script-src`, nem outras origens de terceiros. Os hashes SHALL ser calculados no build a
partir de todos os HTML gerados, de modo que um script inline novo seja autorizado sem
edição manual.

#### Scenario: Botão Copiar
- **WHEN** um post com bloco de código é carregado num navegador com a política ativa
- **THEN** o botão Copiar funciona e o console não registra violação de CSP

#### Scenario: Script injetado
- **WHEN** uma página recebe um `<script>` inline que não foi gerado pelo build
- **THEN** o navegador bloqueia a execução

#### Scenario: Embutir em outro site
- **WHEN** outro site tenta carregar uma página do dbarros.dev num `iframe`
- **THEN** o navegador recusa

#### Scenario: Script novo no build
- **WHEN** o build passa a gerar um novo script inline
- **THEN** o hash dele aparece na política publicada, sem mudança manual no `_headers`

#### Scenario: Beacon de analytics
- **WHEN** a Cloudflare injeta o beacon do Web Analytics numa página
- **THEN** o navegador o carrega e envia a medição sem violação de CSP

#### Scenario: Outro terceiro
- **WHEN** uma página tenta carregar script de outra origem de terceiros
- **THEN** o navegador bloqueia
