export interface UIStrings {
  nav: {
    home: string;
    posts: string;
    tags: string;
    about: string;
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
  pagination: {
    prev: string;
    next: string;
    page: string;
  };
  home: {
    socialLinks: string;
    featured: string;
    recentPosts: string;
    allPosts: string;
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
  };
  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    goToPreviousPage: string;
    goToNextPage: string;
    closeImagePreview: string;
    homeLink: string;
  };
  notFound: {
    title: string;
    message: string;
    goHome: string;
  };
}
