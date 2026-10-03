# Inventário de DNS — dbarros.dev

Levantado em 2026-10-02, antes da migração para a Cloudflare. Fonte: painel de DNS do
Squarespace (registrar; os nameservers `ns-cloud-e1..e4.googledomains.com` são o DNS
herdado do Google Domains) e consultas `dig` públicas.

## Registros

| Tipo | Nome | TTL | Dados | Destino | Motivo |
|---|---|---|---|---|---|
| A | `@` | 4 h | `151.101.1.195` | **descartar** depois do domínio no Pages | Firebase Hosting (site antigo) |
| A | `@` | 4 h | `151.101.65.195` | **descartar** depois do domínio no Pages | Firebase Hosting (site antigo) |
| CNAME | `wishlist` | 4 h | `ec2-3-84-29-169.compute-1.amazonaws.com` | **descartar** | projeto antigo fora de uso (confirmado pelo Cesar); a EC2 não responde |
| CNAME | `_domainconnect` | 1 h | `_domainconnect.domains.squarespace.com` | **descartar** | predefinição do Squarespace para conectar serviços; não se aplica fora do DNS deles |

Não há `MX`, `TXT`, `CAA` nem `AAAA`: o domínio não recebe e-mail e não tem
verificações de serviços.

## DNSSEC

**Ligado.** O registro `.dev` publica `DS 59737 8 2 FD9D8B4E…` (TTL 1800 s) e a zona é
assinada pelo Google Cloud DNS. Precisa ser desligado no Squarespace (DNS → DNSSEC)
**antes** da troca de nameservers, e só se troca depois que o `DS` sumir do registro
(`dig DS dbarros.dev @ns-tld1.charlestonroadregistry.com` vazio) e passarem mais 30 min.
**Status:** desligado pelo Cesar em 2026-10-02; às 20:55 o `DS` já não estava no
registro `.dev`, a zona antiga não tinha mais `DNSKEY` e os resolvedores validadores
(8.8.8.8, 9.9.9.9, 208.67.222.222) respondiam `NOERROR`.

Depois da migração, o DNSSEC pode ser religado pela Cloudflare (gera um novo `DS` para
cadastrar no registrar).

## Zona na Cloudflare (alvo)

Nameservers atribuídos: `brit.ns.cloudflare.com` e `rory.ns.cloudflare.com`.


| Tipo | Nome | Dados | Proxy |
|---|---|---|---|
| (gerido pelo Pages) | `@` | projeto `dbarros-dev` | ligado |
| CNAME | `www` | `dbarros.dev` | ligado (Redirect Rule `www` → apex) |

## Estado final (2026-10-02)

- Nameservers no registro `.dev`: `brit.ns.cloudflare.com`, `rory.ns.cloudflare.com`.
- `@` → projeto Pages `dbarros-dev` (proxy, IPv4 e IPv6 da Cloudflare); `www` → proxy +
  Redirect Rule 301 para o apex, preservando caminho e query.
- Sem `TXT`, `MX`, `CAA`; `wishlist` e `_domainconnect` descartados; nenhum IP do
  Firebase (`151.101.*`) respondido pelos resolvedores públicos.
- Firebase: projeto já não existe.
- DNSSEC: religado em 2026-10-02 (change `security-hardening`): zona assinada pela
  Cloudflare (algoritmo 13), `DS 2371 13 2` publicado no registro `.dev` pelo Squarespace;
  resolvedores validadores respondem com a flag `ad`.
