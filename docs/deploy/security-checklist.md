# Segurança das contas — dbarros.dev

Quem controla estas contas controla o site e o domínio. O site em si é estático (sem
servidor, banco ou login); estas contas são o alvo real. Sem segredos neste arquivo:
só o que deve estar ligado.

| Conta | O que controla | Item | Status |
|---|---|---|---|
| GitHub (`cbsorrilha`) | código e deploy (push na `main` publica) | 2FA com app autenticador ou chave física (não SMS); códigos de recuperação guardados | [x] 2026-10-02 |
| Cloudflare | site (Pages), DNS, certificados | 2FA com app ou chave física; códigos de recuperação guardados | [x] via conta Google (login com Google; 2FA próprio do serviço indisponível) |
| Squarespace | registro do domínio `dbarros.dev` | 2FA com app ou chave física; códigos de recuperação guardados | [x] via conta Google (login com Google; 2FA próprio do serviço indisponível) |
| Squarespace | registro do domínio | trava de transferência ligada (impede mover o domínio sem autorização) | [x] 2026-10-02 |
| Cloudflare + Squarespace | DNS | DNSSEC ligado na Cloudflare e `DS` cadastrado no Squarespace | [x] 2026-10-02 |

Contas que entram com "Fazer login com o Google" herdam a segurança da conta Google:
o item crítico é 2FA forte na **conta Google** (app autenticador, passkey ou chave
física; códigos de backup guardados). 2FA próprio do serviço é camada extra opcional e
exige definir uma senha nele.

- [x] **Conta Google** (2026-10-02) (login de Cloudflare/Squarespace): 2FA com app, passkey ou chave
  física; códigos de backup guardados; revisar apps conectados.

Revisar uma vez por ano, ou ao trocar de celular (app autenticador).
