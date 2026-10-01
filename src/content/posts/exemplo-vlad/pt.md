---
title: "Exemplo do tema Vlad"
description: "Post provisório para verificar tipografia, código e citações do tema Vlad."
pubDate: 2026-10-01
tags: [rust]
lang: pt
source_lang: pt
---

Post provisório para conferir o tema e o i18n. Ele sai antes do site ir para o ar.
O compilador recusou o código até que eu movesse o `Vec<String>` para dentro da
closure, como explica [a documentação](https://doc.rust-lang.org/book/).

## Empréstimos e donos

Um parágrafo com **negrito**, _itálico_ e um link para [outro lugar](https://dbarros.dev/).

> Na dúvida, escolha a opção com menos estado.

- Comentários, porque o repositório é privado.
- Busca, por enquanto.
- Francês, para sempre.

![Imagem de compartilhamento do tema Vlad](./imagem.png)

```rust
// Soma o dobro de cada elemento
fn soma_dobro(xs: &[i32]) -> i32 {
    let msg = "olá, borrow checker";
    xs.iter().map(|x| x * 2).sum()
}
```

```sh
OLLAMA_HOST=http://localhost:11434 npm run translate -- --post exemplo-vlad --model qwen3:14b --verbose --dry-run
```

```
Bloco sem linguagem declarada: a barra mostra só o botão Copiar.
```

1. Um item numerado.
2. Outro item.
