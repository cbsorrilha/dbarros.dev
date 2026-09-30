# Shiki: tema Dracula com um ajuste

Use o tema `dracula` do Shiki com duas trocas:

- fundo do editor: `#0c080b` (`--bg-deep`), igual à página de post;
- comentários: `#7a6f85` (`--code-comment`) no lugar de `#6272a4`.

Exemplo em `astro.config.mjs`:

```js
import dracula from "shiki/themes/dracula.mjs";

const vlad = {
  ...dracula,
  name: "vlad",
  colors: { ...dracula.colors, "editor.background": "#0c080b" },
  tokenColors: dracula.tokenColors.map((t) =>
    [].concat(t.scope ?? []).some((s) => s.startsWith("comment"))
      ? { ...t, settings: { ...t.settings, foreground: "#7a6f85" } }
      : t
  ),
};

export default defineConfig({
  markdown: { shikiConfig: { theme: vlad, wrap: false } },
});
```

Cores de sintaxe resultantes: keyword `#ff79c6`, função `#50fa7b`, string `#f1fa8c`,
número `#bd93f9`, tipo `#8be9fd` itálico, parâmetro `#ffb86c` itálico,
comentário `#7a6f85`, texto `#ece4e6`.
