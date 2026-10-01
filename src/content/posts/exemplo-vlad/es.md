---
title: "Ejemplo del tema Vlad"
description: "Post provisional para verificar la tipografía, el código y las citas del tema Vlad."
pubDate: 2026-10-01
tags: [rust]
lang: es
source_lang: pt
---

Post provisional para revisar el tema y el i18n. Se retira antes de que el sitio
salga al aire. El compilador rechazó el código hasta que moví el `Vec<String>`
dentro de la closure, como explica [la documentación](https://doc.rust-lang.org/book/).

## Préstamos y dueños

Un párrafo con **negrita**, _cursiva_ y un enlace a [otro lugar](https://dbarros.dev/).

> En la duda, elige la opción con menos estado.

- Comentarios, porque el repositorio es privado.
- Búsqueda, por ahora.
- Francés, nunca.

![Imagen para compartir del tema Vlad](./imagem.png)

```rust
// Suma el doble de cada elemento
fn soma_dobro(xs: &[i32]) -> i32 {
    let msg = "olá, borrow checker";
    xs.iter().map(|x| x * 2).sum()
}
```

```sh
OLLAMA_HOST=http://localhost:11434 npm run translate -- --post exemplo-vlad --model qwen3:14b --verbose --dry-run
```

```
Bloque sin lenguaje declarado: la barra solo muestra el botón Copiar.
```

1. Un elemento numerado.
2. Otro elemento.
