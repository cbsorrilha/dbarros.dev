# security Specification

## Purpose
Define as proteções do dbarros.dev do lado do navegador e do DNS: cabeçalhos de
segurança em todas as respostas, uma política de conteúdo que só aceita recursos do
próprio site e a assinatura DNSSEC da zona.

## Requirements

### Requirement: Cabeçalhos de segurança
Toda resposta do site SHALL incluir: `Strict-Transport-Security: max-age=63072000;
includeSubDomains; preload`; `X-Content-Type-Options: nosniff`; `Referrer-Policy:
strict-origin-when-cross-origin`; `Permissions-Policy` desligando ao menos câmera,
microfone, geolocalização, pagamento, USB e `browsing-topics`; `X-Frame-Options: DENY`;
e `Cross-Origin-Opener-Policy: same-origin`.

#### Scenario: Página HTML
- **WHEN** alguém pede `https://dbarros.dev/pt/`
- **THEN** a resposta traz todos esses cabeçalhos com esses valores

#### Scenario: Arquivo estático e 404
- **WHEN** alguém pede `/pt/rss.xml` ou uma URL inexistente
- **THEN** a resposta também traz os cabeçalhos

### Requirement: Política de conteúdo estrita
Toda resposta HTML SHALL incluir `Content-Security-Policy` que permita carregar
recursos só do próprio site (`default-src 'self'`), com `script-src` restrito a `'self'`
e aos hashes SHA-256 dos scripts inline publicados, `object-src 'none'`, `base-uri
'self'`, `form-action 'none'`, `frame-ancestors 'none'` e `upgrade-insecure-requests`.
Estilos inline SHALL ser permitidos. A política MUST NOT conter `'unsafe-inline'` ou
`'unsafe-eval'` em `script-src`. Os hashes SHALL ser calculados no build a partir de
todos os HTML gerados, de modo que um script inline novo seja autorizado sem edição
manual.

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

### Requirement: DNSSEC
A zona `dbarros.dev` SHALL ser assinada com DNSSEC pela Cloudflare, com o `DS`
correspondente publicado no registro `.dev` pelo registrar, e resolvedores validadores
SHALL responder com dados autenticados.

#### Scenario: Validação
- **WHEN** se consulta `dig +dnssec A dbarros.dev @8.8.8.8`
- **THEN** a resposta tem status `NOERROR` e a flag `ad`
