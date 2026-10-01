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
    publishedAt: "Publicado em",
    updatedAt: "Atualizado",
    tagLabel: "Tags",
    backToTop: "Voltar ao topo",
    goBack: "Voltar",
    previousPost: "Anterior",
    nextPost: "Próximo",
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
    tagTitle: "Tag",
    tagDesc: "Todos os posts com a tag",

    tagsTitle: "Tags",
    tagsDesc: "Todas as tags usadas nos posts.",

    postsTitle: "Posts",
    postsDesc: "Tudo o que publiquei.",
    noPosts: "Nenhum post em português ainda.",
  },
  about: {
    linksTitle: "Links",
  },
  rss: {
    title: "{{site}} (português)",
    description: "Posts de Cesar de Barros em português.",
  },
  a11y: {
    skipToContent: "Pular para o conteúdo",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    closeImagePreview: "Fechar imagem",
    homeLink: "dbarros.dev, página inicial",
  },
  notFound: {
    title: "Esta página não existe.",
    message: "O endereço pode ter mudado, ou o post não existe neste idioma.",
    goHome: "Ver todos os posts",
  },
} satisfies UIStrings;
