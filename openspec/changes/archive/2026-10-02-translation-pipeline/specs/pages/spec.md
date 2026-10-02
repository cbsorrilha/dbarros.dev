## ADDED Requirements

### Requirement: Aviso de tradução
Todo post exibido a partir de um arquivo traduzido (com o bloco `translation`) SHALL
mostrar, entre os chips e o corpo, um aviso discreto no idioma da página: "Traduzido
do {idioma de origem} por IA local e revisado pelo autor." seguido do link "Ler o
original" para o post no idioma do fonte. O aviso SHALL seguir o design (borda 1px
`--border`, raio 8, texto 15px `--text-muted`, ponto de 7px em `--notice` com brilho) e
MUST NOT aparecer no arquivo-fonte.

#### Scenario: Post traduzido
- **WHEN** o visitante abre `/en/posts/meu-post/`, traduzido de `pt`
- **THEN** vê "Translated from Portuguese by a local AI and reviewed by the author." e "Read the original", que leva a `/pt/posts/meu-post/`

#### Scenario: Original
- **WHEN** o visitante abre `/pt/posts/meu-post/`, que é o fonte
- **THEN** não há aviso de tradução
