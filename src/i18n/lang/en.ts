import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Home",
    posts: "Posts",
    tags: "Tags",
    about: "About",
  },
  post: {
    publishedAt: "Published at",
    updatedAt: "Updated",
    tagLabel: "Tags",
    backToTop: "Back to top",
    goBack: "Go back",
    previousPost: "Previous",
    nextPost: "Next",
  },
  code: {
    copy: "Copy",
    copied: "Copied",
  },
  pagination: {
    prev: "Prev",
    next: "Next",
    page: "Page",
  },
  home: {
    socialLinks: "Social Links",
    featured: "Featured",
    recentPosts: "Recent Posts",
    allPosts: "All Posts",
  },
  footer: {
    credit: "© {{year}} {{author}}",
    rss: "RSS",
    about: "About",
  },
  pages: {
    tagTitle: "Tag",
    tagDesc: "All the articles with the tag",

    tagsTitle: "Tags",
    tagsDesc: "All the tags used in posts.",

    postsTitle: "Posts",
    postsDesc: "All the articles I've posted.",
  },
  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
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
