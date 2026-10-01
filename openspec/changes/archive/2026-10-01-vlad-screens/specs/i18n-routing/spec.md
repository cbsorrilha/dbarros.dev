## ADDED Requirements

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
