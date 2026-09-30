import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Início",
    posts: "Posts",
    tags: "Tags",
    about: "Sobre",
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
  pagination: {
    prev: "Anterior",
    next: "Próxima",
    page: "Página",
  },
  home: {
    socialLinks: "Redes",
    featured: "Destaques",
    recentPosts: "Posts recentes",
    allPosts: "Todos os posts",
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
  },
  a11y: {
    skipToContent: "Pular para o conteúdo",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    goToPreviousPage: "Ir para a página anterior",
    goToNextPage: "Ir para a próxima página",
    closeImagePreview: "Fechar imagem",
    homeLink: "dbarros.dev, página inicial",
  },
  notFound: {
    title: "Esta página não existe.",
    message: "O endereço pode ter mudado, ou o post não existe neste idioma.",
    goHome: "Ver todos os posts",
  },
} satisfies UIStrings;
