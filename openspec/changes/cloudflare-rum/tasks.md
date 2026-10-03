## 1. Código e documentação

- [x] 1.1 `public/_headers`: `script-src` com `https://static.cloudflareinsights.com` e `connect-src` com `https://cloudflareinsights.com`
- [x] 1.2 `docs/SPEC.md` e `AGENTS.md`: analytics = zona + RUM; exceção do beacon na regra de JavaScript mínimo
- [x] 1.3 Build, lint e format verdes; `dist/` sem `cloudflareinsights`; commit

## 2. Verificação em produção

- [ ] 2.1 [Cesar] Push na `main`
- [ ] 2.2 Chrome headless em `https://dbarros.dev/pt/`: beacon carregado, POST de medição enviado, nenhuma violação de CSP, nenhum cookie
