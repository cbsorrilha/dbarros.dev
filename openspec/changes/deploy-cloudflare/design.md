## Context

O build já é estático (`dist/`), determinístico e começa pelo `translate:check`. Hoje a
raiz `/` e `/{lang}/posts/` são páginas de redirect geradas pelo Astro, com meta
refresh de 2 s; as 404 são estáticas e dependem da regra da Cloudflare Pages de servir o
`404.html` mais próximo (já verificada com `wrangler pages dev`). O DNS público mostra só
os nameservers do Google Cloud DNS e dois `A` do Firebase (`151.101.1.195`,
`151.101.65.195`); não há `MX`, `TXT`, `CAA`, `AAAA` nem `www` visíveis, mas o
inventário completo só sai do export da zona. O `gcloud` local está logado na conta de
trabalho do Cesar e não deve ser usado para a zona pessoal. Requisitos em `specs/deploy`
e `specs/i18n-routing`.

## Goals / Non-Goals

**Goals:**
- Deploy por `git push`, sem segredo nem configuração no repo além do código.
- Migração sem perder registro de DNS e com o mínimo de indisponibilidade.
- Cada passo externo pequeno, verificável e executado pelo Cesar com o agente
  conferindo antes do próximo.

**Non-Goals:**
- Infra como código (Terraform, `wrangler.toml` com recursos): um projeto, uma zona,
  configuração feita uma vez no dashboard.
- E-mail no domínio, CDN de imagens, cache customizado.

## Decisions

### 1. Pages Function só na raiz
`functions/index.ts` exporta `onRequestGet`: lê `Accept-Language`, ordena as línguas
por `q` (padrão 1), reduz cada uma à língua principal (`pt-BR` → `pt`), escolhe a
primeira em `LOCALES` (importado de `src/i18n/locales.ts`) ou `DEFAULT_LOCALE`, e
responde `302` com `Location: /{lang}/`, `Vary: Accept-Language` e `Cache-Control:
private, no-store`. Como só existe `functions/index.ts`, a Pages gera um `_routes.json`
que invoca a Function apenas em `/`; todo o resto é estático (cota grátis de 100 mil
invocações/dia sobra). A página `src/pages/index.astro` continua: atende o dev e o
preview local.
*Alternativa:* `_middleware.ts` — rodaria em toda requisição.

### 2. `_redirects`
`public/_redirects` com `/:lang/posts/ /:lang/ 301` e a variante sem barra. Na Pages,
regras de `_redirects` valem mesmo quando existe um arquivo estático no caminho; isso
é verificado no `wrangler pages dev`. As páginas do Astro em `/{lang}/posts/` ficam
como fallback do dev.

### 3. `www` → apex por Redirect Rule
O redirect de host não cabe no `_redirects` (que só vê caminho). Usa-se uma Redirect
Rule da zona ("Redirect from WWW to root", 301, preservando caminho e query) mais um
registro `www` com proxy ligado. Fica no dashboard, sem código.

### 4. Ordem da migração (menor indisponibilidade)
1. Pages ligado ao GitHub e funcionando em `*.pages.dev` (site ainda no Firebase).
2. Inventário da zona no Google Cloud DNS (export).
3. Zona criada na Cloudflare **com os mesmos registros** (inclusive os `A` do
   Firebase): ao trocar os nameservers, nada muda para o visitante.
4. DNSSEC desligado no registrar e no Cloud DNS, se estiver ligado (senão a troca de
   nameservers quebra a resolução).
5. Troca de nameservers no registrar; espera a zona ficar "Active" na Cloudflare.
6. Domínio customizado `dbarros.dev` no projeto Pages (a Cloudflare troca os `A` do
   Firebase pelo registro do Pages e emite o certificado), registro `www` e Redirect
   Rule. `.dev` exige HTTPS (HSTS preload): a janela entre trocar o registro e o
   certificado ficar pronto é de minutos e é o único momento de indisponibilidade.
7. Verificação; só então o Firebase é desligado.

### 5. Inventário sem a conta de trabalho
O export é feito pelo Cesar, de um destes jeitos: console do Google Cloud (Cloud DNS →
zona → exportar) ou `gcloud` logado na conta pessoal (`gcloud auth login`, depois
`gcloud dns record-sets export dbarros.zone --zone=<zona> --project=<projeto>
--zone-file-format`). O arquivo vai para `docs/deploy/dns-inventory.md` (registro e
destino de cada um: recriar ou descartar), sem segredos.

### 6. Analytics da zona
Nada a configurar no código: o analytics da zona (Analytics & Logs → Traffic) é
automático com proxy ligado. No projeto Pages, a opção "Web Analytics" fica
**desligada**, porque ela injeta o beacon em todas as páginas. `docs/SPEC.md` e
`AGENTS.md` passam a registrar a decisão.

### 7. Sem posts no lançamento
`exemplo-vlad` e `so-pt` saem; `src/content/posts/.gitkeep` mantém a pasta (o loader e
o `translate` leem o diretório). Todas as telas já têm estado vazio e o `translate:check`
passa sem posts. O primeiro post (fatia 7) pode entrar antes ou depois da troca de DNS;
ver Open Questions.

### 8. Configuração do build na Pages
Framework preset "Astro" (ou nenhum), comando `npm run build`, saída `dist`, variável
`NODE_VERSION=24` (o `.nvmrc` também é lido). O `postinstall` do Ollama já pula com
`CI=true`, que a Pages define; o `prepare` do Husky não instala hooks fora de um clone
com `.git` gravável e não quebra o build.

### 9. Registro no Cloudflare Registrar (opcional)
Depois da zona ativa e do site verificado: desbloquear o domínio no registrar atual,
pegar o código de autorização e iniciar a transferência na Cloudflare (paga 1 ano,
somado à validade atual). Não muda DNS nem disponibilidade.

## Risks / Trade-offs

- [Registro esquecido no inventário] → export completo da zona, não `dig`; diff entre
  export e zona da Cloudflare antes de trocar nameservers.
- [DNSSEC ligado durante a troca derruba o domínio] → passo explícito de checar e
  desligar antes; verificação com `dig +dnssec`.
- [Certificado ainda não emitido com HSTS do `.dev`] → domínio customizado adicionado
  logo após a zona ativa; checar status "Active" do certificado antes de anunciar.
- [`_redirects` não ter precedência sobre o arquivo estático] → verificar no
  `wrangler pages dev`; se não tiver, remover as páginas de redirect do Astro para
  `/{lang}/posts/`.
- [Conta de trabalho no `gcloud`] → o agente não executa nada no `gcloud`; o export é
  do Cesar.

## Migration Plan

Seguir a ordem da decisão 4, um passo por vez, com o agente verificando por `dig` e
`curl` antes do próximo. Rollback até o passo 6: voltar os nameservers do registrar
para os do Google (a zona antiga continua intacta). Depois do Firebase desligado, o
rollback é reverter o commit e o deploy na Pages.

## Open Questions

- Trocar o DNS antes ou depois do primeiro post? Sem post, `dbarros.dev` mostra a lista
  vazia por alguns dias; com o post antes, o lançamento já tem conteúdo. Não muda specs
  nem tarefas, só a ordem — decidir na hora do passo de DNS.
