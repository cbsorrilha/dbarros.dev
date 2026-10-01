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
    publishedAt: "Publicado el",
    updatedAt: "Actualizado",
    tagLabel: "Etiquetas",
    backToTop: "Volver arriba",
    goBack: "Volver",
    previousPost: "Anterior",
    nextPost: "Siguiente",
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
    tagTitle: "Etiqueta",
    tagDesc: "Todos los posts con la etiqueta",

    tagsTitle: "Etiquetas",
    tagsDesc: "Todas las etiquetas usadas en los posts.",

    postsTitle: "Posts",
    postsDesc: "Todo lo que he publicado.",
    noPosts: "Todavía no hay posts en español.",
  },
  about: {
    linksTitle: "Enlaces",
  },
  rss: {
    title: "{{site}} (español)",
    description: "Posts de Cesar de Barros en español.",
  },
  a11y: {
    skipToContent: "Saltar al contenido",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    closeImagePreview: "Cerrar imagen",
    homeLink: "dbarros.dev, inicio",
  },
  notFound: {
    title: "Esta página no existe.",
    message:
      "La dirección puede haber cambiado, o el post no existe en este idioma.",
    goHome: "Ver todos los posts",
  },
} satisfies UIStrings;
