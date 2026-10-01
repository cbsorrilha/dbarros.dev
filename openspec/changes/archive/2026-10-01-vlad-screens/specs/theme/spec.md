## ADDED Requirements

### Requirement: Menu no celular
Em telas de até 640px, Tags e Sobre SHALL sair do cabeçalho, que passa a ter um botão
de menu de 44×44px. O botão SHALL abrir um menu em tela cheia sobre `--bg-deep`, com os
itens Posts, Tags e Sobre em tamanho grande, o item ativo marcado com um ponto em
`--link`, o seletor de idioma com os nomes completos dos idiomas em que a página existe
e, no rodapé do menu, o crédito e o link de RSS. Com o menu aberto, o ícone vira um X e
a página por trás MUST NOT rolar; Esc e o botão fecham o menu. O botão SHALL informar o
estado com `aria-expanded`. O menu MUST funcionar sem JavaScript.

#### Scenario: Abrir o menu
- **WHEN** o visitante, numa tela de 375px, toca no botão de menu
- **THEN** o menu cobre a tela com Posts, Tags, Sobre, os idiomas por nome e o RSS, e o botão mostra um X

#### Scenario: Fechar com Esc
- **WHEN** o menu está aberto e o visitante aperta Esc
- **THEN** o menu fecha e o foco volta ao botão de menu

#### Scenario: Sem JavaScript
- **WHEN** o menu é aberto e fechado com JavaScript desativado
- **THEN** ele funciona igual, inclusive com Esc

#### Scenario: Desktop
- **WHEN** a tela tem mais de 640px
- **THEN** o botão de menu não aparece e Posts, Tags e Sobre ficam no cabeçalho

### Requirement: JavaScript mínimo
O site SHALL usar JavaScript no navegador só quando não houver alternativa em HTML e
CSS. Hoje o único uso permitido é o botão Copiar dos blocos de código, e o script dele
MUST ser carregado só em páginas que têm bloco de código. Navegação, menu, seletor de
idioma, 404, "pular para o conteúdo" e imagens MUST funcionar sem JavaScript.

#### Scenario: Página sem código
- **WHEN** a listagem, as tags, o Sobre ou uma 404 são carregados
- **THEN** a página não carrega nenhum `<script>` executável

#### Scenario: Post com código
- **WHEN** um post com bloco de código é carregado
- **THEN** o único script executável é o do botão Copiar

#### Scenario: Pular para o conteúdo
- **WHEN** o visitante ativa "Pular para o conteúdo" pelo teclado, sem JavaScript
- **THEN** o foco vai para o conteúdo principal
