# deploy Specification

## Purpose
Define como o dbarros.dev é publicado: Cloudflare Pages a partir da `main`, domínio
canônico, redirects feitos no servidor, DNS na Cloudflare e medição de audiência sem
JavaScript no navegador.

## Requirements

### Requirement: Publicação pela Cloudflare Pages
O site SHALL ser publicado pela Cloudflare Pages a partir do repositório privado no
GitHub: todo push na `main` SHALL gerar um deploy de produção, e todo push em outra
branch SHALL gerar um deploy de preview com URL própria. O build SHALL rodar `npm run
build` (que inclui o `translate:check`) com Node 24 e publicar `dist/`. Um build que
falhe MUST NOT substituir a versão no ar. Nenhum passo manual além do `git push` SHALL
ser necessário para publicar.

#### Scenario: Push na main
- **WHEN** o autor faz push de um commit na `main`
- **THEN** a Cloudflare Pages constrói e publica o site em `https://dbarros.dev` sem outra ação

#### Scenario: Tradução desatualizada
- **WHEN** um push chega com tradução desatualizada que escapou do hook local
- **THEN** o build falha no `translate:check` e a versão anterior continua no ar

#### Scenario: Preview
- **WHEN** o autor faz push numa branch `rascunho-x`
- **THEN** existe um deploy de preview dessa branch numa URL `*.pages.dev`

### Requirement: Domínio canônico
`https://dbarros.dev` (apex) SHALL ser o endereço canônico, servido pela Cloudflare com
HTTPS. `www.dbarros.dev` SHALL redirecionar com 301 para o mesmo caminho no apex.

#### Scenario: Apex
- **WHEN** alguém abre `https://dbarros.dev/pt/`
- **THEN** a resposta vem da Cloudflare (cabeçalho `cf-ray`) com status 200

#### Scenario: www
- **WHEN** alguém abre `https://www.dbarros.dev/en/about/`
- **THEN** recebe 301 para `https://dbarros.dev/en/about/`

### Requirement: Redirects no servidor
Redirects fixos do site SHALL ser feitos pelo servidor, com status HTTP, e não por meta
refresh: `/{lang}/posts/` SHALL responder 301 para `/{lang}/`.

#### Scenario: Caminho de posts
- **WHEN** alguém abre `https://dbarros.dev/es/posts/`
- **THEN** recebe 301 para `/es/`

### Requirement: Analytics sem JavaScript
A audiência do site SHALL ser medida no servidor pelo analytics da zona na Cloudflare.
O site MUST NOT carregar script de analytics, beacon ou pixel de rastreamento, e MUST
NOT usar cookies.

#### Scenario: Página sem rastreador
- **WHEN** qualquer página publicada é carregada
- **THEN** nenhum script ou requisição de analytics parte do navegador

### Requirement: DNS na Cloudflare
A zona `dbarros.dev` SHALL ser servida pelos nameservers da Cloudflare. Antes da
migração, todos os registros da zona anterior SHALL ser inventariados, e todo registro
que não seja do Firebase Hosting SHALL ser recriado na Cloudflare.

#### Scenario: Nameservers
- **WHEN** se consulta `dig NS dbarros.dev`
- **THEN** a resposta lista só nameservers `*.ns.cloudflare.com`

#### Scenario: Nada perdido
- **WHEN** a migração termina
- **THEN** cada registro do inventário está recriado na Cloudflare ou anotado como do Firebase e descartado

### Requirement: Sem conteúdo provisório em produção
Os posts de exemplo usados no desenvolvimento MUST NOT ser publicados em produção. Sem
posts, o site SHALL continuar construindo e mostrar o estado vazio de cada tela.

#### Scenario: Site sem posts
- **WHEN** não há nenhum post em `src/content/posts/`
- **THEN** `npm run build` termina com sucesso e `/pt/` mostra a mensagem de lista vazia
