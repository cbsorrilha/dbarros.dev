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
    previousPost: string;
    nextPost: string;
    /** Placeholder: {{min}} */
    readingTime: string;
    /** "Também em" + lista de idiomas */
    alsoIn: string;
    /** Conjunção entre os dois últimos itens de uma lista, com espaços. */
    and: string;
    /** Rótulo do link "← Posts". */
    backToPosts: string;
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
    tagsTitle: string;

    postsTitle: string;
    noPosts: string;
    /** Chip de filtro que mostra todos os posts. */
    all: string;
    /** Rótulo do post mais recente no índice de tags. */
    latest: string;
    /** Contagem de posts. Placeholder: {{n}} */
    postCount: { one: string; other: string };
    /** Rótulo do link "← Tags". */
    backToTags: string;
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
    homeLink: string;
  };
  notFound: {
    title: string;
    message: string;
    goHome: string;
    /** Placeholder: {{lang}} (nome do idioma) */
    readIn: string;
  };
}
