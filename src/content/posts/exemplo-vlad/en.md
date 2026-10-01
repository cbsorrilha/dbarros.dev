---
title: "Vlad theme sample"
description: "Placeholder post to check the Vlad theme's typography, code and quotes."
pubDate: 2026-10-01
tags: [rust]
lang: en
source_lang: pt
---

Placeholder post to check the theme and i18n. It goes away before the site goes
live. The compiler rejected the code until I moved the `Vec<String>` into the
closure, as [the documentation](https://doc.rust-lang.org/book/) explains.

## Borrowing and ownership

A paragraph with **bold**, _italics_ and a link to [somewhere else](https://dbarros.dev/).

> When in doubt, pick the option with less state.

- Comments, because the repository is private.
- Search, for now.
- French, forever.

![Vlad theme share image](./imagem.png)

```rust
// Sums twice each element
fn soma_dobro(xs: &[i32]) -> i32 {
    let msg = "olá, borrow checker";
    xs.iter().map(|x| x * 2).sum()
}
```

```sh
OLLAMA_HOST=http://localhost:11434 npm run translate -- --post exemplo-vlad --model qwen3:14b --verbose --dry-run
```

```
Block with no declared language: the bar only shows the Copy button.
```

1. A numbered item.
2. Another item.
