# translation-pipeline Specification

## Purpose
Define como os posts do dbarros.dev são traduzidos: um comando local e explícito que
usa um LLM rodando na máquina do autor, e um check determinístico que impede publicar
tradução ausente ou desatualizada, sem nunca chamar o modelo no build.

## Requirements

### Requirement: Hash do arquivo-fonte
O hash de um post SHALL ser o SHA-256, no formato `sha256:<hex>`, do conteúdo
traduzível do arquivo-fonte: `title`, `description` e corpo, normalizados (finais de
linha `\n`, sem espaços no fim do corpo). Mudanças só em outros campos do front matter
MUST NOT alterar o hash.

#### Scenario: Edição do corpo
- **WHEN** o autor muda uma frase no corpo de `meu-post/pt.md`
- **THEN** o hash do post muda

#### Scenario: Edição de metadado
- **WHEN** o autor muda só o `pubDate` do fonte
- **THEN** o hash do post não muda

### Requirement: Idiomas esperados de um post
Um post SHALL existir em todos os idiomas suportados, salvo quando o arquivo-fonte
declara `translations`, a lista de idiomas em que o post deve existir. Idiomas fora
dessa lista não são esperados.

#### Scenario: Sem a lista
- **WHEN** o fonte não tem `translations`
- **THEN** o post é esperado em `pt`, `en` e `es`

#### Scenario: Válvula de escape
- **WHEN** o fonte `pt.md` tem `translations: [pt, en]`
- **THEN** o post é esperado em `pt` e `en`, e a falta de `es.md` não é cobrada

### Requirement: Comando translate
`npm run translate` SHALL percorrer os posts e, para cada idioma esperado que não é o
do fonte: traduzir quando o arquivo não existe; retraduzir quando existe com
`source_hash` diferente e `locked: false`; e, quando existe com `locked: true` e hash
diferente, MUST NOT alterar o arquivo, só registrar aviso de revisão manual. O arquivo
gerado SHALL ter `title`, `description` e corpo traduzidos; os demais campos (`pubDate`,
`updatedDate`, `tags`, `draft`, `source_lang`) copiados do fonte; `lang` do idioma; e o
bloco `translation` com `source_hash`, `model`, `translated_at` e `locked: false`. O
comando SHALL logar o progresso por post e idioma, aceitar `--post <slug>` para
restringir a um post e `--dry-run` para só listar o que faria, e terminar com código
diferente de zero se alguma tradução falhar.

#### Scenario: Tradução nova
- **WHEN** `meu-post/` só tem `pt.md` e o autor roda `npm run translate`
- **THEN** são criados `en.md` e `es.md` traduzidos, com `source_hash` igual ao hash atual do fonte

#### Scenario: Fonte editado
- **WHEN** o autor edita `meu-post/pt.md` e roda `npm run translate`
- **THEN** `en.md` e `es.md` são retraduzidos e passam a ter o novo `source_hash`

#### Scenario: Tradução bloqueada
- **WHEN** `meu-post/en.md` tem `locked: true` e o fonte foi editado
- **THEN** `en.md` não é alterado e o comando avisa que precisa de revisão manual

#### Scenario: Nada a fazer
- **WHEN** todas as traduções estão em dia
- **THEN** o comando termina sem chamar o modelo

#### Scenario: Simulação
- **WHEN** o autor roda `npm run translate -- --dry-run`
- **THEN** o comando lista o que traduziria e não chama o modelo nem grava arquivos

### Requirement: Fidelidade da tradução
A tradução MUST preservar sem alteração: blocos de código cercados, código inline,
URLs, caminhos de imagem e de links, a estrutura do Markdown (títulos, listas,
citações) e os slugs de tag. Se a resposta do modelo perder ou alterar algum trecho
protegido, a tradução daquele arquivo SHALL ser considerada falha e o arquivo MUST NOT
ser gravado.

#### Scenario: Código preservado
- **WHEN** o fonte tem um bloco ```rust com um comentário em português
- **THEN** a tradução tem o bloco idêntico, byte a byte

#### Scenario: Link preservado
- **WHEN** o fonte tem `[a documentação](https://doc.rust-lang.org/book/)`
- **THEN** a tradução traduz o texto do link e mantém a URL idêntica

#### Scenario: Resposta corrompida
- **WHEN** o modelo devolve o corpo sem um dos trechos protegidos
- **THEN** o arquivo não é gravado e o comando registra a falha daquele post e idioma

### Requirement: Configuração do modelo
O host e o modelo do Ollama SHALL vir de um arquivo de configuração versionado, com
padrões `http://localhost:11434` e `qwen3:14b`, e SHALL poder ser sobrescritos pelas
variáveis de ambiente `OLLAMA_HOST` e `OLLAMA_MODEL`. Se o Ollama não responder, o
comando MUST falhar logo, com mensagem dizendo como subir o servidor.

#### Scenario: Host remoto
- **WHEN** o autor roda com `OLLAMA_HOST=http://acer-server:11434`
- **THEN** as chamadas vão para esse host

#### Scenario: Ollama parado
- **WHEN** nenhum servidor responde no host configurado
- **THEN** o comando falha antes de traduzir, sugerindo `brew services start ollama` ou `ollama serve`

### Requirement: Check de traduções
`npm run translate:check` MUST NOT chamar o modelo nem acessar a rede. Ele SHALL falhar,
com uma lista legível de post, idioma e motivo, quando um post publicado (fonte não
rascunho) tiver um idioma esperado sem arquivo, ou uma tradução com `locked: false` e
`source_hash` diferente do hash atual. Traduções `locked: true` desatualizadas SHALL só
gerar aviso. O check SHALL rodar no `pre-commit` (via Husky) e no início do `npm run
build`.

#### Scenario: Fonte editado sem retraduzir
- **WHEN** o autor edita `meu-post/pt.md` e roda `npm run translate:check`
- **THEN** o check falha listando `meu-post` em `en` e `es` como desatualizados

#### Scenario: Depois de traduzir
- **WHEN** o autor roda `npm run translate` e depois `npm run translate:check`
- **THEN** o check passa

#### Scenario: Commit bloqueado
- **WHEN** o autor tenta commitar com tradução desatualizada
- **THEN** o hook de `pre-commit` falha e o commit não acontece

#### Scenario: Build da Cloudflare
- **WHEN** o build roda sem Ollama e com uma tradução ausente
- **THEN** o build falha no check, antes do `astro build`

#### Scenario: Rascunho não é cobrado
- **WHEN** um post com fonte `draft: true` não tem traduções
- **THEN** o check passa
