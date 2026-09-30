# theme Specification

## Purpose
Define a identidade visual Vlad do dbarros.dev: um site somente escuro, com cores,
tipografia, espaço e componentes-base vindos de um único conjunto de tokens, fiel ao
handoff de design em `docs/design/vlad/`.

## Requirements

### Requirement: Site somente escuro
O site SHALL ser renderizado sempre no tema escuro Vlad, sem alternador de tema, sem
variante clara e sem depender de `localStorage` ou de `prefers-color-scheme` para
escolher cores.

#### Scenario: Sem alternador de tema
- **WHEN** um visitante abre qualquer página do site
- **THEN** não existe botão ou controle para trocar entre claro e escuro

#### Scenario: Preferência clara do sistema é ignorada
- **WHEN** o navegador do visitante está configurado com `prefers-color-scheme: light`
- **THEN** a página é exibida com o fundo `--bg` e o texto `--text` do tema Vlad

#### Scenario: Sem estado de tema no navegador
- **WHEN** uma página é carregada
- **THEN** nenhuma chave de tema é lida ou gravada no `localStorage`

### Requirement: Tokens visuais centralizados
Todas as cores, famílias tipográficas, tamanhos de fonte, espaçamentos e raios usados
pelo site SHALL vir de um único arquivo de tokens com os valores de
`docs/design/vlad/vlad-tokens.css`. Componentes e estilos MUST referenciar tokens por
variável CSS; valores hexadecimais de cor MUST NOT aparecer fora desse arquivo, exceto
onde o formato exige um literal (a cor de `<meta name="theme-color">` e o tema do
Shiki), e nesses casos o valor MUST ser idêntico ao token correspondente.

#### Scenario: Cor fora do arquivo de tokens
- **WHEN** se procura por literais hexadecimais de cor nos estilos e componentes em `src/`
- **THEN** só são encontrados no arquivo de tokens e nas exceções documentadas

#### Scenario: Troca de um token
- **WHEN** o valor de `--link` é alterado no arquivo de tokens e o site é reconstruído
- **THEN** links, ponto do logo e demais usos de `--link` mudam juntos, sem outra edição

### Requirement: Tipografia Vlad
O texto e a interface SHALL usar a família Spectral (pesos 400, 500, 600, 700 e
itálicos 400 e 600). A família monoespaçada Meslo NF SHALL ser usada somente em blocos
de código e código inline. O site MUST NOT usar fonte sem serifa. As fontes MUST ser
servidas pelo próprio site, sem requisição a serviços de fontes de terceiros.

#### Scenario: Texto corrido
- **WHEN** um parágrafo de post é exibido
- **THEN** a fonte computada é Spectral

#### Scenario: Código
- **WHEN** um bloco de código ou código inline é exibido
- **THEN** a fonte computada é Meslo NF

#### Scenario: Sem fonte de terceiros
- **WHEN** uma página é carregada com a aba de rede aberta
- **THEN** nenhum arquivo de fonte é pedido a um domínio que não seja o do próprio site

### Requirement: Realce de sintaxe Vlad
Blocos de código SHALL ser realçados no build com o tema `vlad`: a paleta Dracula com o
fundo do editor igual a `--bg-deep` e comentários na cor `--code-comment`. O realce MUST
ocorrer no build, sem JavaScript no cliente.

#### Scenario: Cores de sintaxe
- **WHEN** um bloco de código Rust com palavra-chave, string e comentário é renderizado
- **THEN** a palavra-chave é `#ff79c6`, a string é `#f1fa8c` e o comentário é `#7a6f85`

#### Scenario: Realce sem JavaScript
- **WHEN** a página é carregada com JavaScript desativado
- **THEN** o bloco de código aparece com as cores de sintaxe

### Requirement: Bloco de código
Cada bloco de código SHALL exibir uma barra superior com o nome da linguagem à esquerda
e um botão "Copiar" à direita. O botão SHALL copiar o texto do bloco para a
área de transferência e trocar o rótulo para "Copiado", na cor `--notice`, por 1,6 s.
O código MUST NOT quebrar linha: linhas longas rolam na horizontal, e o respiro interno
de 20px MUST ser mantido também ao rolar. No desktop o bloco sangra 24px para cada lado
da coluna de leitura; em telas de até 640px ele não sangra. Os rótulos do botão MUST
vir do dicionário de interface, não do componente.

#### Scenario: Copiar código
- **WHEN** o visitante clica em "Copiar" em um bloco de código
- **THEN** a área de transferência passa a conter exatamente o código do bloco
- **AND** o rótulo muda para "Copiado" e volta a "Copiar" após 1,6 s

#### Scenario: Linha longa
- **WHEN** um bloco tem uma linha mais larga que a coluna
- **THEN** o bloco ganha rolagem horizontal, a linha não quebra e o fim da linha mantém 20px de respiro

#### Scenario: Linguagem desconhecida
- **WHEN** um bloco de código não declara linguagem
- **THEN** o bloco é exibido com a barra superior e o botão Copiar, sem rótulo de linguagem

#### Scenario: Celular
- **WHEN** o bloco é exibido em uma tela de 375px de largura
- **THEN** ele fica dentro da margem lateral de 20px, sem sangrar

### Requirement: Casca comum do layout
Toda página SHALL ter o cabeçalho e o rodapé do tema Vlad. O cabeçalho SHALL mostrar o
logo 2d (`d`, ponto em `--link` com brilho, `B`, em Spectral itálico, construído em
HTML/CSS e não imagem) seguido de `dbarros.dev`, como link para a página inicial, e a
navegação Posts, Tags e Sobre, com o item ativo destacado. O rodapé SHALL mostrar
"© {ano} Cesar de Barros" e links para RSS e Sobre. Elementos focáveis MUST exibir
contorno de 2px em `--link` com afastamento de 2px ao receber foco pelo teclado.
Transições MUST se limitar a mudanças de cor.

#### Scenario: Logo
- **WHEN** o cabeçalho é exibido
- **THEN** o logo é texto selecionável com o ponto vermelho entre `d` e `B`, e clicar nele leva à página inicial

#### Scenario: Navegação ativa
- **WHEN** o visitante está na listagem de posts
- **THEN** o item "Posts" aparece em `--text` com sublinhado de 1px em `--link`, e os demais em `--text-muted`

#### Scenario: Foco por teclado
- **WHEN** o visitante navega com Tab até um link
- **THEN** o link exibe contorno de 2px em `--link` afastado 2px

### Requirement: Ícones e imagem de compartilhamento
O site SHALL servir os favicons (16 e 32 px), o apple-touch-icon (180 px) e o ícone de
512 px do handoff, e SHALL usar `og-default.png` (1200×630) como imagem Open Graph
padrão das páginas.

#### Scenario: Favicon
- **WHEN** uma página é aberta no navegador
- **THEN** a aba mostra o favicon do tema Vlad

#### Scenario: Compartilhamento
- **WHEN** a URL de uma página é colada em uma rede social
- **THEN** a meta `og:image` aponta para a imagem padrão do tema Vlad
