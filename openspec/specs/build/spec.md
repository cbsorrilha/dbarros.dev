# build Specification

## Purpose
Define como o dbarros.dev é desenvolvido e construído: comandos padrão, build
determinístico sem dependência de rede ou serviço pago, e o conjunto enxuto de recursos
herdados do AstroPaper que o MVP mantém.

## Requirements

### Requirement: Comandos de desenvolvimento e build
O repo SHALL oferecer `npm run dev`, que sobe o site localmente com recarga, e
`npm run build`, que valida os tipos e gera o site estático em `dist/`. O gerenciador de
pacotes do projeto SHALL ser o npm, com `package-lock.json` versionado. A versão de Node
suportada SHALL estar declarada no repo.

#### Scenario: Instalação limpa e build
- **WHEN** alguém clona o repo, roda `npm ci` e depois `npm run build`
- **THEN** o comando termina com código 0 e `dist/` contém o site

#### Scenario: Servidor de desenvolvimento
- **WHEN** alguém roda `npm run dev`
- **THEN** o site responde localmente e reflete edições em arquivos sem reiniciar o servidor

#### Scenario: Erro de tipo
- **WHEN** um arquivo `.astro` ou `.ts` tem um erro de tipo
- **THEN** `npm run build` falha e aponta o arquivo

### Requirement: Build determinístico e sem rede
O `npm run build` MUST NOT fazer requisições de rede nem chamar LLM ou serviço pago.
Dado o mesmo commit e as mesmas dependências instaladas, o build SHALL produzir o mesmo
conteúdo, com uma única exceção: o ano do crédito no rodapé, que é o ano do build. A
visibilidade de um post MUST depender só do front matter (`draft`), nunca da data ou
hora em que o build roda.

#### Scenario: Post com data futura
- **WHEN** um post não rascunho tem data de publicação posterior ao momento do build
- **THEN** ele é publicado normalmente

#### Scenario: Build offline
- **WHEN** as dependências já estão instaladas e a máquina está sem rede
- **THEN** `npm run build` termina com sucesso

### Requirement: Recursos fora do MVP ausentes
O site MUST NOT incluir busca, geração dinâmica de imagens Open Graph, botões de
compartilhamento em redes sociais, link de "editar post", página de arquivo, nem
comentários. O conteúdo de exemplo do AstroPaper MUST NOT ser publicado.

#### Scenario: Sem busca
- **WHEN** o site é construído
- **THEN** não existe rota `/search`, nem índice de busca em `dist/`, nem link de busca no cabeçalho

#### Scenario: Sem conteúdo de exemplo
- **WHEN** o site é construído
- **THEN** nenhum post de exemplo do AstroPaper aparece em `dist/`

#### Scenario: Post sem extras
- **WHEN** um post é exibido
- **THEN** não há botões de compartilhamento nem link para editar o post

### Requirement: Identidade do site
O site SHALL ser configurado com URL canônica `https://dbarros.dev`, título
`dbarros.dev`, autor "Cesar de Barros" e fuso horário `America/Sao_Paulo` para datas
de posts. Essas informações SHALL estar definidas em um único arquivo de configuração.

#### Scenario: URL canônica
- **WHEN** uma página é gerada
- **THEN** sua `<link rel="canonical">` começa com `https://dbarros.dev/`

#### Scenario: Data de publicação
- **WHEN** um post tem `pubDate: 2026-10-01`
- **THEN** a data exibida é 1º de outubro de 2026, independentemente do fuso da máquina de build
