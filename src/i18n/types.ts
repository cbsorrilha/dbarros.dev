export interface UIStrings {
  /** Nome do idioma no próprio idioma, ex.: "Português". */
  languageName: string;
  /** Código curto exibido no seletor, ex.: "PT". */
  languageShort: string;
  site: {
    description: string;
  };
  nav: {
    home: string;
    posts: string;
    tags: string;
    about: string;
    /** Rótulo acessível do seletor de idioma. */
    language: string;
  };
  post: {
    publishedAt: string;
    updatedAt: string;
    tagLabel: string;
    backToTop: string;
    goBack: string;
    previousPost: string;
    nextPost: string;
  };
  code: {
    copy: string;
    copied: string;
  };
  footer: {
    /** Placeholders: {{year}}, {{author}} */
    credit: string;
    rss: string;
    about: string;
  };
  pages: {
    tagTitle: string;
    tagDesc: string;

    tagsTitle: string;
    tagsDesc: string;

    postsTitle: string;
    postsDesc: string;
    noPosts: string;
  };
  about: {
    linksTitle: string;
  };
  rss: {
    /** Placeholder: {{site}} */
    title: string;
    description: string;
  };
  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    closeImagePreview: string;
    homeLink: string;
  };
  notFound: {
    title: string;
    message: string;
    goHome: string;
  };
}
