import type { ShikiTransformer } from "shiki";
import type { Element } from "hast";

// Linguagens que o Astro atribui a blocos sem linguagem declarada.
const UNLABELED = new Set(["plaintext", "text", "txt", "plain"]);

/**
 * Envolve o <pre> no bloco de código do tema Vlad: barra superior com o nome da
 * linguagem e o botão Copiar. O rótulo do botão vem do dicionário de UI em
 * runtime (src/scripts/codeCopy.ts), então o botão nasce vazio e escondido.
 */
export const transformerCodeBlock = (): ShikiTransformer => ({
  name: "vlad:code-block",
  root(root) {
    const pre = root.children.find(
      (n): n is Element => n.type === "element" && n.tagName === "pre"
    );
    if (!pre) return;

    // Rolável pelo teclado.
    pre.properties.tabindex = 0;

    const lang = this.options.lang;
    const label = lang && !UNLABELED.has(lang) ? lang : "";

    const bar: Element = {
      type: "element",
      tagName: "div",
      properties: { className: ["code-block-bar"] },
      children: [
        {
          type: "element",
          tagName: "span",
          properties: { className: ["code-block-lang"] },
          children: label ? [{ type: "text", value: label }] : [],
        },
        {
          type: "element",
          tagName: "button",
          properties: {
            type: "button",
            className: ["code-block-copy"],
            dataCodeCopy: "",
            hidden: true,
          },
          children: [],
        },
      ],
    };

    root.children = [
      {
        type: "element",
        tagName: "figure",
        properties: {
          className: ["code-block"],
          ...(label ? { dataLang: label } : {}),
        },
        children: [bar, pre],
      },
    ];
  },
});
