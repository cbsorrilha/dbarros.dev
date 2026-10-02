Legenda: **[agente]** feito por mim no repo; **[Cesar]** feito por você nos dashboards,
com o passo a passo que eu passo na hora; **[juntos]** você executa e eu verifico.

## 1. Código (local)

- [x] 1.1 [agente] `functions/index.ts`: escolha por `Accept-Language` (pesos `q`, língua principal, fallback `pt`), 302, `Vary: Accept-Language`, `Cache-Control: private, no-store`
- [x] 1.2 [agente] `public/_redirects`: `/:lang/posts/` e `/:lang/posts` → `/:lang/` (301)
- [x] 1.3 [agente] Remover `exemplo-vlad` e `so-pt`; `src/content/posts/.gitkeep`; confirmar build, `translate:check` e estados vazios sem posts
- [x] 1.4 [agente] Verificar com `npx wrangler pages dev dist`: `/` com vários `Accept-Language` (en-US, `fr,es;q=0.8`, de-DE, sem cabeçalho), `/es/posts/` → 301, 404s por idioma, `_routes.json` invocando a Function só em `/`
- [x] 1.5 [agente] `docs/SPEC.md` e `AGENTS.md`: analytics da zona sem JS no lugar do Web Analytics; seção de deploy; build/lint/format verdes; commit

## 2. Cloudflare Pages

- [ ] 2.1 [Cesar] Criar/entrar na conta Cloudflare; Workers & Pages → Create → Pages → Connect to Git → repo `cbsorrilha/dbarros.dev` (autorizar o app do GitHub só nesse repo)
- [ ] 2.2 [Cesar] Build: preset Astro, comando `npm run build`, saída `dist`, variável `NODE_VERSION=24`; Web Analytics **desligado**
- [ ] 2.3 [juntos] Primeiro deploy verde; conferir `*.pages.dev`: `/` redireciona por idioma, páginas, 404s, sem script de analytics
- [ ] 2.4 [juntos] Push numa branch de teste gera preview; apagar a branch

## 3. DNS

- [ ] 3.1 [Cesar] Exportar a zona `dbarros.dev` do Google Cloud DNS (console ou `gcloud` na conta pessoal) e me passar o arquivo
- [ ] 3.2 [agente] `docs/deploy/dns-inventory.md`: cada registro com destino (recriar ou descartar por ser do Firebase)
- [ ] 3.3 [Cesar] Adicionar a zona `dbarros.dev` na Cloudflare (plano Free) mantendo os registros atuais, inclusive os `A` do Firebase
- [ ] 3.4 [juntos] Comparar a zona da Cloudflare com o inventário; nada faltando
- [ ] 3.5 [juntos] Checar DNSSEC (`dig +dnssec`, registrar e Cloud DNS); desligar se estiver ligado e esperar propagar
- [ ] 3.6 [Cesar] Trocar os nameservers no registrar pelos dois da Cloudflare
- [ ] 3.7 [juntos] Esperar a zona "Active" na Cloudflare; `dig NS dbarros.dev` só com `*.ns.cloudflare.com`; site ainda respondendo (Firebase)

## 4. Domínio no ar

- [ ] 4.1 [Cesar] No projeto Pages: Custom domains → `dbarros.dev`; confirmar a troca dos `A` do Firebase pelo registro do Pages
- [ ] 4.2 [Cesar] Registro `www` (proxy ligado) e Redirect Rule "Redirect from WWW to root" (301, mantendo caminho)
- [ ] 4.3 [juntos] Certificado "Active"; verificar com `curl`: `https://dbarros.dev/` 302 por idioma e `cf-ray`; `/pt/` 200; `/es/posts/` 301; `www` 301 para o apex; 404 por idioma; nenhum script de analytics nas páginas
- [ ] 4.4 [juntos] Analytics da zona mostrando tráfego (Analytics & Logs → Traffic)

## 5. Firebase

- [ ] 5.1 [Cesar] Desativar o Hosting do site no Firebase e excluir o projeto (só depois do 4.3)
- [ ] 5.2 [juntos] Remover do inventário/zona qualquer registro de verificação do Firebase que tenha sobrado

## 6. Registro do domínio (opcional)

- [ ] 6.1 [Cesar] Comparar o preço de renovação atual com o do Cloudflare Registrar; se valer, desbloquear o domínio, pegar o código de autorização e transferir pela Cloudflare
- [ ] 6.2 [juntos] Confirmar a transferência concluída e a nova data de expiração

## 7. Fechamento

- [ ] 7.1 [agente] `AGENTS.md`: fatia 6 feita, como funciona o deploy, onde ver analytics; `design.md` com o que mudou na execução
