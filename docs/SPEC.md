# dbarros.dev — Spec do MVP

Blog pessoal de Cesar de Barros em `dbarros.dev`. Este documento é autocontido:
todas as decisões necessárias para implementar o MVP estão aqui. Ele nasceu de uma
sessão de design em 2026-09-30 e deve evoluir via OpenSpec dentro deste repo.

## Propósito

Diário público com cara decente e leve função de vitrine para recrutamento. Não é
educacional nem pretende ser um polo de demonstração de conhecimento: é onde Cesar
resume seus achados.

Temas iniciais:

- aprendizado de Rust;
- reflexões sobre carreira;
- conclusões e experimentos com IA, agentes e afins.

## Princípios

1. **Custo zero ou próximo disso.** O único custo aceito é o domínio, que já existe.
2. **Deploy extra simples.** `git push` na `main` publica. Nada mais.
3. **Zero mecânica para o autor.** Escrever Markdown e commitar deve bastar.
4. **Build determinístico.** O build de produção nunca chama LLM nem serviço pago.
5. **Simples de manter vence completo.** Na dúvida, escolha a opção com menos estado.

## Stack

| Camada | Decisão |
|---|---|
| Gerador | Astro, partindo do tema AstroPaper |
| Linguagem de scripts | TypeScript/Node, no mesmo repo |
| Repo | GitHub, **privado** |
| Hospedagem | Cloudflare Pages, deploy automático a partir da `main`, preview por branch |
| DNS | Cloudflare (migrado do Google Cloud DNS atual) |
| Analytics | Analytics da zona Cloudflare (servidor) + Cloudflare Web Analytics/RUM (beacon injetado pela Cloudflare; grátis, sem cookies) |
| Tradução | Ollama local com `qwen3:14b` (modelo configurável) |
| Git hooks | Husky |

## Idiomas e roteamento

- Idiomas do MVP: **`pt`, `en`, `es`**. Francês está explicitamente fora de escopo,
  para sempre.
- Todos os idiomas têm prefixo: `/pt/...`, `/en/...`, `/es/...`.
- A raiz `/` redireciona com base no `Accept-Language`, via **Cloudflare Pages
  Function**, com **`pt` como fallback**. Em dev local, um redirect simples para
  `/pt/` basta.
- O mesmo `slug` em todos os idiomas: `/pt/posts/meu-post`, `/en/posts/meu-post`.
  Isso deixa o seletor de idioma trivial.
- Cada página emite `<link rel="alternate" hreflang="...">` para os idiomas em que
  existe.
- As strings de interface (menu, rótulos, aviso de tradução) ficam em um dicionário
  por idioma, não espalhadas nos componentes.

## Conteúdo

### Layout dos arquivos

Cada post é uma pasta, com um arquivo por idioma e as imagens ao lado:

```text
src/content/posts/
  meu-post/
    pt.md
    en.md
    es.md
    diagrama.png
```

Convenções de escrita, para funcionar tanto no Obsidian quanto no VS Code:

- links em Markdown padrão (`[texto](../outro-post/)`), **sem `[[wikilinks]]`**;
- imagens referenciadas de forma relativa, na pasta do post;
- front matter em YAML (`---`), compatível com as Properties do Obsidian.

### Front matter

Validado pelo schema da content collection. Um erro de schema quebra o build.

```yaml
---
title: "Título"
description: "Resumo de uma ou duas frases."
pubDate: 2026-10-01
updatedDate: 2026-10-05        # opcional
tags: [rust, ai]               # somente valores do conjunto fechado
lang: pt                       # idioma deste arquivo
source_lang: pt                # idioma em que o post foi escrito originalmente
draft: false
# Somente em arquivos traduzidos:
translation:
  source_hash: "sha256:..."    # hash do arquivo-fonte no momento da tradução
  model: "qwen3:14b"
  translated_at: 2026-10-01
  locked: false                # true = editado à mão; o script não sobrescreve
---
```

- O PT é a fonte padrão, mas um post pode ser escrito direto em outro idioma.
  `source_lang` diz qual arquivo é a fonte.
- O arquivo-fonte não tem o bloco `translation`.

### Tags

- Conjunto **fechado**, definido em um único lugar e usado como `enum` no schema.
- Cada tag tem um **slug fixo** (usado na URL) e um **rótulo traduzido** por idioma:

| Slug | pt | en | es |
|---|---|---|---|
| `rust` | Rust | Rust | Rust |
| `ai` | IA | AI | IA |
| `reflections` | Reflexões | Reflections | Reflexiones |

- Uma tag nova custa uma linha nessa definição.
- A navegação por tag precisa ser óbvia para qualquer visitante: chips clicáveis no
  post e na listagem, e uma página por tag e por idioma.

### Política de tradução ausente

- **Regra:** todo post publicado existe nos três idiomas.
- **Válvula de escape:** se uma tradução não existir, o post simplesmente não aparece
  naquele idioma: sem link quebrado e sem erro de build.

## Pipeline de tradução

A tradução roda **localmente e por comando explícito**, nunca no build nem na CI.

### `npm run translate`

1. Para cada post, identifica o arquivo-fonte (`source_lang`).
2. Calcula o `sha256` do arquivo-fonte (front matter relevante e corpo).
3. Para cada idioma-alvo:
   - se a tradução não existe, traduz;
   - se existe com `source_hash` diferente e `locked: false`, retraduz;
   - se existe com `locked: true` e hash diferente, **não sobrescreve**: só avisa que
     precisa de revisão manual.
4. Grava o arquivo traduzido com o bloco `translation` preenchido.

Requisitos da chamada ao modelo:

- API HTTP do Ollama; host e modelo vêm de um arquivo de config
  (padrões: `http://localhost:11434`, `qwen3:14b`), sobrescrevíveis por variável de
  ambiente.
- Preservar intactos os blocos de código, o código inline, as URLs, os caminhos de
  imagem, as chaves do front matter e os slugs das tags.
- Traduzir `title`, `description` e o corpo.
- Traduzir post a post, com logs claros do progresso. É aceitável ser lento.

### `npm run translate:check`

Não chama o LLM. Falha, com uma lista legível, se algum post publicado tiver:

- tradução ausente em algum idioma (a não ser que a válvula de escape seja usada
  conscientemente; defina como isso é marcado, por exemplo `translations: [pt, en]`
  no fonte);
- `source_hash` divergente em tradução não bloqueada.

Onde roda:

- hook de `pre-commit` via Husky;
- também no build da Cloudflare, como rede de segurança. O check é determinístico e
  não depende do Ollama.

### Aviso de tradução

Todo post traduzido exibe um aviso discreto, no idioma da página. Por exemplo:
*"Traduzido do português por IA local e revisado pelo autor."*

## Visual: tema **Vlad**

- O tema se chama **Vlad**, em homenagem ao vampiro da novela *Vamp* (Globo, 1991).
- É **dark-only**: remover o alternador claro/escuro do AstroPaper.
- A base é a paleta oficial **Dracula**:

| Token | Hex |
|---|---|
| background | `#282a36` |
| current line | `#44475a` |
| foreground | `#f8f8f2` |
| comment | `#6272a4` |
| cyan | `#8be9fd` |
| green | `#50fa7b` |
| orange | `#ffb86c` |
| pink | `#ff79c6` |
| purple | `#bd93f9` |
| red | `#ff5555` |
| yellow | `#f1fa8c` |

- **O design vem antes do código visual.** Cesar vai desenhar o tema com calma no
  Claude Design. Os tokens que saírem de lá são a fonte da verdade e substituem esta
  tabela quando existirem. Até lá, a implementação usa a paleta acima como tokens CSS
  centralizados, nunca hex espalhado.
- **Blocos de código são componente de primeira classe:** syntax highlighting com o
  tema Dracula (Shiki), rótulo da linguagem, botão de copiar e boa legibilidade em
  mobile.
- **Tipografia:** em aberto (ver Decisões em aberto). A monoespaçada é usada **somente
  em blocos de código e código inline**.

## Escopo do MVP

Entra:

- listagem de posts por idioma;
- páginas de tag por idioma;
- seletor de idioma no post e no layout;
- página **Sobre** por idioma, com links e um resumo profissional;
- feed RSS **por idioma**;
- analytics da zona Cloudflare e Cloudflare Web Analytics (RUM), sem cookies;
- redirect da raiz por `Accept-Language`;
- pipeline de tradução e check;
- rascunhos (`draft: true`) nunca publicados.

Fica fora do MVP, mas sinalizado para o futuro:

- **Comentários.** Atenção: o Giscus exige repo público, e este repo é privado.
- **Busca.**
- **Nó de inferência na LAN:** rodar o Ollama no `acer-server`, o hub sempre ligado da
  rede de casa, e apontar o script para ele via config (`OLLAMA_HOST`).
- **Mais idiomas:** italiano, alemão e chinês. Francês nunca.

## Domínio e deploy

Estado observado em 2026-09-30:

- nameservers do `dbarros.dev`: `ns-cloud-e1..e4.googledomains.com`;
- registros A: `151.101.1.195` e `151.101.65.195`, do Firebase Hosting.

Plano:

1. **Inventariar todos os registros DNS atuais** (A, AAAA, CNAME, MX, TXT, CAA) antes
   de qualquer mudança. Não perder nada que não seja do Firebase.
2. Criar a zona `dbarros.dev` na Cloudflare e recriar os registros que devem ficar.
3. Trocar os nameservers no registrar para os da Cloudflare.
4. Conectar o repo ao Cloudflare Pages: build `npm run build`, output `dist/`.
5. Adicionar `dbarros.dev` (apex) como domínio customizado. Decidir o `www`
   (sugestão: redirect `www` → apex).
6. Remover o site do Firebase Hosting e o projeto associado. **Não há nada a
   preservar lá.**

## Fatias de implementação

Cada fatia termina com o build verde e algo verificável.

1. **Design system Vlad** (Cesar, no Claude Design). Tokens de cor, tipografia, card
   de post, chip de tag, bloco de código e aviso de tradução.
   *Não bloqueia as fatias 2–5, que usam a paleta Dracula provisória.*
2. **Scaffold.** AstroPaper no repo, dark-only, tokens CSS centralizados com a paleta
   Dracula, Shiki com o tema Dracula.
   *Aceite:* `npm run dev` e `npm run build` funcionam; não existe alternador de tema.
3. **i18n e conteúdo.** Rotas `/pt|en|es/`, layout de posts por pasta, schema do
   front matter, dicionário de UI, seletor de idioma, `hreflang`, página Sobre, RSS
   por idioma, válvula de escape de tradução ausente.
   *Aceite:* um post de exemplo nos três idiomas navega corretamente; um post só em PT
   não aparece em EN/ES e não quebra nada.
4. **Tags.** Conjunto fechado com rótulos traduzidos, chips e páginas de tag.
   *Aceite:* uma tag fora do conjunto falha o build.
5. **Tradução.** `translate`, `translate:check`, Husky `pre-commit` e o check no
   build. Aviso de tradução por IA no post.
   *Aceite:* editar o PT de um post faz o check falhar; `translate` corrige; uma
   tradução com `locked: true` não é sobrescrita.
6. **Deploy e DNS.** Pages Function do redirect da raiz, Cloudflare Pages, migração
   de DNS, analytics da zona e desligamento do Firebase.
   *Aceite:* `https://dbarros.dev` responde pela Cloudflare e `/` redireciona de
   acordo com o idioma do navegador.
7. **Primeiro post.** Sugestão: o making-of do próprio blog (trilíngue, custo zero,
   LLM local), com a tag `ai`.

## Definição de pronto do MVP

- `dbarros.dev` servindo pela Cloudflare Pages;
- Firebase Hosting desligado;
- **um post real publicado nos três idiomas**, revisado por Cesar.

## Decisões em aberto

| Decisão | Dono | Notas |
|---|---|---|
| Fonte do texto: com ou sem serifa | Cesar | Será decidida no design do tema Vlad. |
| Fonte monoespaçada de código | Cesar | Candidatas: JetBrains Mono, Fira Code. |
| Como marcar a válvula de escape de tradução ausente | Implementação | Proposta: lista `translations` no front matter do fonte. |
| `www` → apex ou o contrário | Implementação | Sugestão: apex canônico. |
| Editor de escrita: Obsidian ou VS Code | Cesar | As convenções acima funcionam nos dois. |

## Não objetivos

- Construir um gerador de sites próprio.
- Traduzir no build, na CI ou com API paga.
- Modo claro.
- Qualquer dependência do repositório `diario-estudos` (a wiki pessoal): este repo é
  completamente separado.
