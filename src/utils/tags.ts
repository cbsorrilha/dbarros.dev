import type { Post } from "./posts";
import { TAG_SLUGS, type TagSlug } from "@/content/tags";

/** Tags com posts entre os dados, na ordem da definição (src/content/tags.ts). */
export function getTagsInUse(posts: Post[]): TagSlug[] {
  const used = new Set(posts.flatMap(post => post.entry.data.tags));
  return TAG_SLUGS.filter(slug => used.has(slug));
}

export function postHasTag(post: Post, slug: TagSlug): boolean {
  return post.entry.data.tags.includes(slug);
}
