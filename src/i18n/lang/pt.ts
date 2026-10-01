import type { UIStrings } from "../types";

export default {
  languageName: "Português",
  languageShort: "PT",
  site: {
    description: "Diário público de Cesar de Barros sobre Rust, carreira e IA.",
  },
  nav: {
    home: "Início",
    posts: "Posts",
    tags: "Tags",
    about: "Sobre",
    language: "Idioma",
  },
  post: {
    previousPost: "Anterior",
    nextPost: "Próximo",
    readingTime: "{{min}} min de leitura",
    alsoIn: "Também em",
    and: " e ",
    backToPosts: "Posts",
  },
  code: {
    copy: "Copiar",
    copied: "Copiado",
  },
  footer: {
    credit: "© {{year}} {{author}}",
    rss: "RSS",
    about: "Sobre",
  },
  pages: {
    tagsTitle: "Tags",

    postsTitle: "Posts",
    noPosts: "Nenhum post em português ainda.",
    all: "Todos",
    latest: "Mais recente",
    postCount: { one: "{{n}} post", other: "{{n}} posts" },
    backToTags: "Tags",
  },
  rss: {
    title: "{{site}} (português)",
    description: "Posts de Cesar de Barros em português.",
  },
  a11y: {
    skipToContent: "Pular para o conteúdo",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    homeLink: "dbarros.dev, página inicial",
  },
  notFound: {
    title: "Esta página não existe.",
    message: "O endereço pode ter mudado, ou o post não existe neste idioma.",
    goHome: "Ver todos os posts",
    readIn: "Ler em {{lang}}",
  },
} satisfies UIStrings;
