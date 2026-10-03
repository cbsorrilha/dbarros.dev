# i18n-routing Specification

## Purpose
Define como o dbarros.dev serve o mesmo conteúdo em português, inglês e espanhol:
rotas por idioma, redirect da raiz, textos de interface, troca de idioma e o que
acontece quando uma página não existe em um idioma.

## Requirements

### Requirement: Idiomas suportados
O site SHALL suportar exatamente os idiomas `pt`, `en` e `es`, com `pt` como idioma
padrão. Um idioma novo MUST exigir só a inclusão do seu código na lista de idiomas e do
seu dicionário de interface. O francês MUST NOT ser suportado.

#### Scenario: Idiomas gerados
- **WHEN** o site é construído
- **THEN** existem páginas sob `/pt/`, `/en/` e `/es/`, e nenhuma sob outro prefixo de idioma

### Requirement: Rotas com prefixo de idioma
Toda página de conteúdo SHALL ter o código do idioma como primeiro segmento da URL,
inclusive no idioma padrão. Um mesmo conteúdo SHALL usar o mesmo caminho após o prefixo
em todos os idiomas. As rotas por idioma SHALL ser: `/{lang}/` (lista de posts),
`/{lang}/posts/{slug}/`, `/{lang}/tags/`, `/{lang}/tags/{tag}/`, `/{lang}/about/` e
`/{lang}/rss.xml`. `/{lang}/posts/` SHALL redirecionar para `/{lang}/`.

#### Scenario: Mesmo slug entre idiomas
- **WHEN** o post `meu-post` existe em `pt` e `en`
- **THEN** ele é servido em `/pt/posts/meu-post/` e em `/en/posts/meu-post/`

#### Scenario: Idioma padrão também tem prefixo
- **WHEN** o site é construído
- **THEN** a lista de posts em português está em `/pt/`, e não há páginas de conteúdo sem prefixo

#### Scenario: Caminho de posts sem slug
- **WHEN** o visitante abre `/es/posts/`
- **THEN** é redirecionado para `/es/`

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

### Requirement: Dicionário de interface por idioma
Todo texto de interface (navegação, rótulos, botões, mensagens, títulos e descrições de
páginas geradas, descrição do site) SHALL vir de um dicionário por idioma, escolhido
pelo idioma da rota. Componentes MUST NOT conter texto de interface fixo. O atributo
`lang` do `<html>` SHALL ser o idioma da rota. Datas SHALL ser exibidas no formato e
com os nomes de mês do idioma da página.

#### Scenario: Interface em espanhol
- **WHEN** o visitante abre qualquer página sob `/es/`
- **THEN** a navegação, o rodapé e o botão de copiar código aparecem em espanhol e o `<html>` tem `lang="es"`

#### Scenario: Data localizada
- **WHEN** um post com `pubDate: 2026-10-01` é exibido em `/pt/` e em `/en/`
- **THEN** a data mostra o mês de outubro em português na primeira e em inglês na segunda

#### Scenario: Chave faltando
- **WHEN** um dicionário não define uma chave usada pela interface
- **THEN** o build falha na checagem de tipos

### Requirement: Seletor de idioma
O cabeçalho de toda página SHALL ter um seletor com os idiomas em que a página atual
existe, marcando o idioma atual. Cada item SHALL levar ao mesmo caminho no outro
idioma. Idiomas em que a página atual não existe MUST NOT aparecer no seletor.

#### Scenario: Post nos três idiomas
- **WHEN** o visitante está em `/pt/posts/meu-post/` e o post existe nos três idiomas
- **THEN** o seletor mostra PT (atual), EN e ES, e EN leva a `/en/posts/meu-post/`

#### Scenario: Post só em português
- **WHEN** o visitante está em `/pt/posts/so-pt/` e o post não existe em `en` nem `es`
- **THEN** o seletor mostra só PT

#### Scenario: Página que existe em todos os idiomas
- **WHEN** o visitante está em `/en/tags/`
- **THEN** o seletor mostra PT, EN e ES, levando a `/pt/tags/` e `/es/tags/`

### Requirement: Links alternativos por idioma
Cada página SHALL emitir `<link rel="alternate" hreflang="{lang}">` com URL absoluta
para cada idioma em que existe, incluindo o próprio, e MUST NOT emitir para idiomas em
que não existe.

#### Scenario: Alternativos de um post parcial
- **WHEN** um post existe em `pt` e `en`, mas não em `es`
- **THEN** as duas páginas do post emitem `hreflang="pt"` e `hreflang="en"`, e nenhuma emite `hreflang="es"`

### Requirement: Tradução ausente
Quando um post não tem arquivo em um idioma, ele SHALL simplesmente não existir nesse
idioma: sem página, sem entrada na lista, nas páginas de tag e no RSS daquele idioma,
sem item no seletor e sem `hreflang`. Isso MUST NOT causar erro de build nem link
quebrado. Uma tag sem posts em um idioma MUST NOT ter página nesse idioma.

#### Scenario: Post só em português
- **WHEN** o post `so-pt` tem apenas `pt.md`
- **THEN** ele aparece em `/pt/` e em `/pt/posts/so-pt/`, não aparece em `/en/` nem `/es/`, `/en/posts/so-pt/` não é gerado e o build termina com sucesso

#### Scenario: Nenhum link aponta para tradução ausente
- **WHEN** o site é construído com um post que falta em `es`
- **THEN** nenhuma página em `dist/` contém link para a URL desse post em `es`

### Requirement: Sobre por idioma
Cada idioma SHALL ter uma página Sobre em `/{lang}/about/`, com texto próprio
naquele idioma e os links públicos do autor (GitHub, LinkedIn e RSS do idioma).

#### Scenario: Sobre em inglês
- **WHEN** o visitante abre `/en/about/`
- **THEN** o texto está em inglês e há links para o GitHub, o LinkedIn e `/en/rss.xml`

### Requirement: Links para traduções no post
A página de um post SHALL listar, depois dos chips, as outras traduções publicadas do
post, cada uma pelo nome do idioma no próprio idioma ("English", "Español") e como link
para o mesmo slug naquele idioma. Idiomas em que o post não existe MUST NOT aparecer.

#### Scenario: Post em três idiomas
- **WHEN** o visitante abre `/pt/posts/meu-post/` e o post existe nos três idiomas
- **THEN** a página mostra "Também em English e Español", com links para `/en/posts/meu-post/` e `/es/posts/meu-post/`

#### Scenario: Post em dois idiomas
- **WHEN** o post existe em `pt` e `es`
- **THEN** a página em `/es/` mostra só "Português" em "Também em"

### Requirement: 404 no idioma da URL
O build SHALL gerar uma página 404 estática por idioma (`/{lang}/404.html`) e uma na
raiz (`/404.html`, no idioma padrão), para que o servidor entregue a 404 mais próxima do
caminho pedido. Para cada post que falta em um idioma mas existe em outro, o build SHALL
gerar também `/{lang}/posts/{slug}/404.html`, no idioma da URL, com o link "Ler em
{idioma}" para a versão publicada, preferindo o idioma padrão e depois a ordem dos
idiomas. As páginas 404 MUST NOT depender de JavaScript.

#### Scenario: Post que não existe no idioma
- **WHEN** o visitante abre `/en/posts/so-pt/` e o post só existe em `pt`
- **THEN** a 404 aparece em inglês com "See all posts" e "Read in Português", este levando a `/pt/posts/so-pt/`

#### Scenario: Rota inexistente
- **WHEN** o visitante abre `/es/qualquer-coisa/`
- **THEN** a 404 aparece em espanhol, sem o link "Ler em"

#### Scenario: URL sem idioma
- **WHEN** o visitante abre `/foo`
- **THEN** a 404 aparece no idioma padrão

#### Scenario: Arquivos gerados
- **WHEN** o site é construído com o post `so-pt` só em `pt`
- **THEN** `dist/` contém `404.html`, `pt/404.html`, `en/404.html`, `es/404.html`, `en/posts/so-pt/404.html` e `es/posts/so-pt/404.html`, e nenhum `<script>` nesses arquivos
