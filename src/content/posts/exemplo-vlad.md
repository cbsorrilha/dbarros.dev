---
title: "Exemplo do tema Vlad"
description: "Post provisório para verificar tipografia, código e citações do tema Vlad."
pubDatetime: 2026-10-01
tags: [rust]
---

Post provisório da fatia de scaffold. Ele existe só para conferir o tema e sai
quando o layout de posts por pasta chegar. O compilador recusou o código até que eu
movesse o `Vec<String>` para dentro da closure, como explica
[a documentação](https://doc.rust-lang.org/book/).

## Empréstimos e donos

Um parágrafo com **negrito**, _itálico_ e um link para [outro lugar](https://dbarros.dev/).

> Na dúvida, escolha a opção com menos estado.

- Comentários, porque o repositório é privado.
- Busca, por enquanto.
- Francês, para sempre.

```rust
// Soma o dobro de cada elemento
fn soma_dobro(xs: &[i32]) -> i32 {
    let msg = "olá, borrow checker";
    xs.iter().map(|x| x * 2).sum()
}
```

```typescript
// Retraduz só o que mudou e não foi editado à mão
const hash = sha256(source);
if (t.source_hash !== hash && !t.locked) {
  await translate(post, lang, {
    model: "qwen3:14b",
    host: process.env.OLLAMA_HOST ?? "http://localhost:11434",
  });
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
