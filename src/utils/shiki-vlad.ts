import type { ThemeRegistration } from "shiki";
import dracula from "shiki/themes/dracula.mjs";

// Tema do Shiki do Vlad: Dracula com fundo e comentário ajustados.
// Literais espelham --bg-deep e --code-comment de src/styles/vlad-tokens.css
// (ver docs/design/vlad/shiki-vlad.md); o Shiki exige cores literais.
const BG_DEEP = "#0c080b";
const CODE_COMMENT = "#7a6f85";

const isComment = (scope: string | string[] | undefined) =>
  ([] as string[]).concat(scope ?? []).some(s => s.startsWith("comment"));

export const vlad: ThemeRegistration = {
  ...dracula,
  name: "vlad",
  colors: { ...dracula.colors, "editor.background": BG_DEEP },
  tokenColors: dracula.tokenColors?.map(t =>
    isComment(t.scope)
      ? { ...t, settings: { ...t.settings, foreground: CODE_COMMENT } }
      : t
  ),
};
