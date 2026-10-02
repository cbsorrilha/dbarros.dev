---
title: Ejemplo del tema Vlad
description: Publicación provisional para verificar tipografía, código y citas del tema Vlad.
pubDate: 2026-10-01
tags:
  - rust
lang: es
source_lang: pt
translation:
  source_hash: sha256:dfae30768784d15e7a904ec8d2dfff8fef707555c7922e00ab085338c20cf199
  model: qwen3:14b
  translated_at: 2026-10-01
  locked: false
---

Post provisional para revisar el tema y el i18n. Sale antes de que el sitio vaya al aire.
El compilador rechazó el código hasta que moví el `Vec<String>` dentro de
la closure, como explica [la documentación](https://doc.rust-lang.org/book/).

## Préstamos y dueños

Un párrafo con **negrita**, _italica_ y un enlace a [otro lugar](https://dbarros.dev/).

> En duda, elige la opción con menos estado.

- Comentarios, porque el repositorio es privado.
- Búsqueda, por ahora.
- Francés, para siempre.

![Imagen de compartir el tema Vlad](./imagem.png)

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

1. Un elemento numerado.
2. Otro elemento.
