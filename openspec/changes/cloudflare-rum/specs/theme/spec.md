## MODIFIED Requirements

### Requirement: JavaScript mínimo
O site SHALL usar JavaScript no navegador só quando não houver alternativa em HTML e
CSS. Os únicos usos permitidos são: o botão Copiar dos blocos de código, cujo script
MUST ser carregado só em páginas que têm bloco de código; e o beacon do Cloudflare Web
Analytics, injetado pela Cloudflare. Qualquer outro script MUST passar por um change do
OpenSpec. Navegação, menu, seletor de idioma, 404, "pular para o conteúdo" e imagens
MUST funcionar sem JavaScript.

#### Scenario: Página sem código
- **WHEN** a listagem, as tags, o Sobre ou uma 404 são carregados
- **THEN** o único `<script>` executável é o beacon do Cloudflare Web Analytics

#### Scenario: Post com código
- **WHEN** um post com bloco de código é carregado
- **THEN** os únicos scripts executáveis são o do botão Copiar e o beacon do Cloudflare Web Analytics

#### Scenario: Pular para o conteúdo
- **WHEN** o visitante ativa "Pular para o conteúdo" pelo teclado, sem JavaScript
- **THEN** o foco vai para o conteúdo principal
