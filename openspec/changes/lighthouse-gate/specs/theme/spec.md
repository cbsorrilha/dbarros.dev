## ADDED Requirements

### Requirement: Nome acessível do logo
O link do logo SHALL ter nome acessível que contenha o texto visível "dbarros.dev",
com a marca gráfica "d•B" escondida de tecnologias assistivas, e MUST NOT usar
`aria-label` com texto diferente do visível.

#### Scenario: Leitor de tela
- **WHEN** um leitor de tela chega ao logo
- **THEN** anuncia o link como "dbarros.dev"
