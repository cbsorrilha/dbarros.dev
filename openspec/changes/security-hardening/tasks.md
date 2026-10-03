Legenda: **[agente]** no repo; **[Cesar]** nos dashboards; **[juntos]** você executa e eu verifico.

## 1. Cabeçalhos

- [x] 1.1 [agente] `public/_headers` com os cabeçalhos fixos para `/*` e a CSP com o marcador `{{SCRIPT_HASHES}}`
- [x] 1.2 [agente] Integração `astro:build:done`: extrai scripts inline executáveis de `dist/**/*.html`, calcula `sha256-…`, substitui o marcador em `dist/_headers`; falha se o marcador faltar
- [x] 1.3 [agente] Build, lint e format verdes; `dist/_headers` com a CSP completa e sem `'unsafe-inline'` em `script-src`

## 2. Verificação local

- [x] 2.1 [agente] Numa cópia temporária com um post de teste com código: `wrangler pages dev` + Chrome headless — cabeçalhos presentes em HTML, RSS e 404; botão Copiar funciona; nenhuma violação de CSP no console; script inline injetado é bloqueado; `iframe` de outra origem é recusado
- [x] 2.2 [agente] Conferir que as telas não mudam (listagem, post, tags, Sobre, 404, menu do celular) em 1280 e 375px

## 3. Preview e produção

- [x] 3.1 [Cesar] Push da branch `security-hardening`; [agente] verificar os cabeçalhos e a CSP no preview
- [ ] 3.2 [Cesar] Merge/push na `main`; [agente] verificar em `https://dbarros.dev`

## 4. DNSSEC

- [ ] 4.1 [Cesar] Cloudflare → DNS → Settings → DNSSEC → Enable; me passar os dados do DS
- [ ] 4.2 [Cesar] Squarespace → DNS → DNSSEC → adicionar o registro DS com esses dados
- [ ] 4.3 [agente] Verificar `DS` no registro `.dev` e flag `ad` em resolvedores validadores; atualizar `docs/deploy/dns-inventory.md`

## 5. Contas

- [x] 5.1 [agente] `docs/deploy/security-checklist.md` com os itens de conta
- [ ] 5.2 [Cesar] 2FA em GitHub, Cloudflare e Squarespace (app ou chave física, não SMS), códigos de recuperação guardados
- [ ] 5.3 [Cesar] Trava de transferência ligada no Squarespace

## 6. Fechamento

- [x] 6.1 [agente] `AGENTS.md`: regra de não adicionar script/recurso de terceiros sem ajustar a CSP; onde ficam os cabeçalhos
