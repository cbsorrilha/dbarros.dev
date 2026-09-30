import type { CollectionEntry } from "astro:content";

/**
 * Determines whether a post is eligible to be listed/rendered.
 *
 * Only drafts are excluded. There is no scheduling by date: the build must be
 * deterministic, so its output cannot depend on when it runs.
 */
export function postFilter({ data }: CollectionEntry<"posts">) {
  return !data.draft;
}
