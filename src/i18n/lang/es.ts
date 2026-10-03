import type { UIStrings } from "../types";

export default {
  languageName: "Español",
  languageShort: "ES",
  site: {
    description: "Diario público de Cesar de Barros sobre Rust, carrera e IA.",
  },
  nav: {
    home: "Inicio",
    posts: "Posts",
    tags: "Etiquetas",
    about: "Sobre mí",
    language: "Idioma",
  },
  post: {
    previousPost: "Anterior",
    nextPost: "Siguiente",
    readingTime: "{{min}} min de lectura",
    alsoIn: "También en",
    and: " y ",
    backToPosts: "Posts",
  },
  code: {
    copy: "Copiar",
    copied: "Copiado",
  },
  footer: {
    credit: "© {{year}} {{author}}",
    rss: "RSS",
    about: "Sobre mí",
  },
  pages: {
    tagsTitle: "Etiquetas",

    postsTitle: "Posts",
    noPosts: "Todavía no hay posts en español.",
    all: "Todos",
    latest: "Más reciente",
    postCount: { one: "{{n}} post", other: "{{n}} posts" },
    backToTags: "Etiquetas",
  },
  rss: {
    title: "{{site}} (español)",
    description: "Posts de Cesar de Barros en español.",
  },
  a11y: {
    skipToContent: "Saltar al contenido",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  notice: {
    translated: "Traducido {{from}} por IA local y revisado por el autor.",
    from: { pt: "del portugués", en: "del inglés", es: "del español" },
    readOriginal: "Leer el original",
  },
  notFound: {
    title: "Esta página no existe.",
    message:
      "La dirección puede haber cambiado, o el post no existe en este idioma.",
    goHome: "Ver todos los posts",
    readIn: "Leer en {{lang}}",
  },
} satisfies UIStrings;
