import type { UIStrings } from "../types";

export default {
  languageName: "English",
  languageShort: "EN",
  site: {
    description: "Cesar de Barros's public journal on Rust, career and AI.",
  },
  nav: {
    home: "Home",
    posts: "Posts",
    tags: "Tags",
    about: "About",
    language: "Language",
  },
  post: {
    publishedAt: "Published on",
    updatedAt: "Updated",
    tagLabel: "Tags",
    backToTop: "Back to top",
    goBack: "Back",
    previousPost: "Previous",
    nextPost: "Next",
  },
  code: {
    copy: "Copy",
    copied: "Copied",
  },
  footer: {
    credit: "© {{year}} {{author}}",
    rss: "RSS",
    about: "About",
  },
  pages: {
    tagTitle: "Tag",
    tagDesc: "All posts tagged",

    tagsTitle: "Tags",
    tagsDesc: "All tags used in posts.",

    postsTitle: "Posts",
    postsDesc: "Everything I've published.",
    noPosts: "No posts in English yet.",
  },
  about: {
    linksTitle: "Links",
  },
  rss: {
    title: "{{site}} (English)",
    description: "Posts by Cesar de Barros in English.",
  },
  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    closeImagePreview: "Close image preview",
    homeLink: "dbarros.dev, home",
  },
  notFound: {
    title: "This page does not exist.",
    message:
      "The address may have changed, or the post does not exist in this language.",
    goHome: "See all posts",
  },
} satisfies UIStrings;
