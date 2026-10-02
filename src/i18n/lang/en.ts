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
    previousPost: "Previous",
    nextPost: "Next",
    readingTime: "{{min}} min read",
    alsoIn: "Also in",
    and: " and ",
    backToPosts: "Posts",
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
    tagsTitle: "Tags",

    postsTitle: "Posts",
    noPosts: "No posts in English yet.",
    all: "All",
    latest: "Latest",
    postCount: { one: "{{n}} post", other: "{{n}} posts" },
    backToTags: "Tags",
  },
  rss: {
    title: "{{site}} (English)",
    description: "Posts by Cesar de Barros in English.",
  },
  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    homeLink: "dbarros.dev, home",
  },
  notice: {
    translated: "Translated {{from}} by a local AI and reviewed by the author.",
    from: { pt: "from Portuguese", en: "from English", es: "from Spanish" },
    readOriginal: "Read the original",
  },
  notFound: {
    title: "This page does not exist.",
    message:
      "The address may have changed, or the post does not exist in this language.",
    goHome: "See all posts",
    readIn: "Read in {{lang}}",
  },
} satisfies UIStrings;
