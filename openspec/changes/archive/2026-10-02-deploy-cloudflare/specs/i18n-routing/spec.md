## MODIFIED Requirements

### Requirement: Redirect da raiz
Em produção, a raiz `/` SHALL redirecionar (302) para a home do idioma preferido do
navegador, escolhido pelo cabeçalho `Accept-Language`: o primeiro idioma suportado em
ordem de preferência (considerando os pesos `q` e só a língua principal, então `pt-BR`
e `pt-PT` valem `pt`). Sem cabeçalho ou sem idioma suportado, SHALL usar o idioma
padrão, `/pt/`. A resposta SHALL declarar `Vary: Accept-Language`. Fora da Cloudflare
(desenvolvimento e preview local sem Function), a raiz SHALL redirecionar para `/pt/`.

#### Scenario: Acesso à raiz
- **WHEN** o visitante abre `/` sem cabeçalho `Accept-Language`
- **THEN** é levado a `/pt/`

#### Scenario: Navegador em inglês
- **WHEN** o visitante abre `/` com `Accept-Language: en-US,en;q=0.9`
- **THEN** recebe 302 para `/en/`

#### Scenario: Preferência com pesos
- **WHEN** o visitante abre `/` com `Accept-Language: fr-FR,es;q=0.8,en;q=0.5`
- **THEN** recebe 302 para `/es/`

#### Scenario: Idioma não suportado
- **WHEN** o visitante abre `/` com `Accept-Language: de-DE`
- **THEN** recebe 302 para `/pt/`
