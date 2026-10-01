import type { Post } from "./posts";
import { slugifyStr } from "./slugify";

type Tag = {
  tag: string;
  tagName: string;
};

/**
 * Tags dos posts dados (já filtrados por idioma), sem repetição e em ordem.
 * `tag` é o slug da URL; `tagName` é o rótulo como escrito no front matter.
 */
export function getUniqueTags(posts: Post[]): Tag[] {
  return posts
    .flatMap(post => post.entry.data.tags)
    .map(tag => ({ tag: slugifyStr(tag), tagName: tag }))
    .filter(
      (value, index, self) =>
        self.findIndex(tag => tag.tag === value.tag) === index
    )
    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));
}

/** O post tem a tag (comparando pelo slug)? */
export function postHasTag(post: Post, tag: string): boolean {
  return post.entry.data.tags.some(name => slugifyStr(name) === tag);
}
