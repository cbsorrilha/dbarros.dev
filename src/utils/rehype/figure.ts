import type { Element, Root } from "hast";

/**
 * Parágrafo que só contém uma imagem com `alt` vira
 * <figure><img><figcaption>alt</figcaption></figure>: legenda em Markdown puro.
 */
export function rehypeFigure() {
  return (tree: Root) => {
    const visit = (node: Root | Element) => {
      node.children = node.children.map(child => {
        if (child.type !== "element") return child;
        if (child.tagName === "p") {
          const content = child.children.filter(
            c => !(c.type === "text" && c.value.trim() === "")
          );
          const [img] = content;
          const alt =
            img?.type === "element" && img.tagName === "img"
              ? String(img.properties.alt ?? "").trim()
              : "";
          if (content.length === 1 && alt) {
            return {
              type: "element",
              tagName: "figure",
              properties: { className: ["post-figure"] },
              children: [
                img,
                {
                  type: "element",
                  tagName: "figcaption",
                  properties: {},
                  children: [{ type: "text", value: alt }],
                },
              ],
            } satisfies Element;
          }
        }
        visit(child);
        return child;
      });
    };
    visit(tree);
  };
}
