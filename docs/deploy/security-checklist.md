# Segurança das contas — dbarros.dev

Quem controla estas contas controla o site e o domínio. O site em si é estático (sem
servidor, banco ou login); estas contas são o alvo real. Sem segredos neste arquivo:
só o que deve estar ligado.

| Conta | O que controla | Item | Status |
|---|---|---|---|
| GitHub (`cbsorrilha`) | código e deploy (push na `main` publica) | 2FA com app autenticador ou chave física (não SMS); códigos de recuperação guardados | [ ] |
| Cloudflare | site (Pages), DNS, certificados | 2FA com app ou chave física; códigos de recuperação guardados | [ ] |
| Squarespace | registro do domínio `dbarros.dev` | 2FA com app ou chave física; códigos de recuperação guardados | [ ] |
| Squarespace | registro do domínio | trava de transferência ligada (impede mover o domínio sem autorização) | [ ] |
| Cloudflare + Squarespace | DNS | DNSSEC ligado na Cloudflare e `DS` cadastrado no Squarespace | [ ] |

Revisar uma vez por ano, ou ao trocar de celular (app autenticador).
