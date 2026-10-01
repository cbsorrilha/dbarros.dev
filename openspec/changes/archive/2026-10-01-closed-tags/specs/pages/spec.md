## MODIFIED Requirements

### Requirement: Chip de tag
Toda tag exibida SHALL ser um chip em formato de pílula, com o rótulo da tag no idioma
da página, e SHALL ser link para `/{lang}/tags/{slug}/`. O chip SHALL usar a cor da tag
(texto na cor, fundo a 10% e borda a 30%), vinda do token `--tag-<slug>`. Chips não
mostram `#`.

#### Scenario: Tag com cor
- **WHEN** um post tem a tag `rust`
- **THEN** o chip aparece em `--tag-rust` e leva a `/{lang}/tags/rust/`

#### Scenario: Tag sem token
- **WHEN** uma tag do conjunto não tem token de cor
- **THEN** o build falha antes de gerar qualquer chip (ver `tags`), então nenhuma página exibe chip sem cor

#### Scenario: Rótulo no idioma da página
- **WHEN** um post com a tag `ai` é exibido em `/pt/`
- **THEN** o chip mostra "IA" e leva a `/pt/tags/ai/`
