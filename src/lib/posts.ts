import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'writing'>;

/**
 * The only way this site reads the writing collection. Drafts are dropped and
 * order is newest first, so no page, feed, or route can disagree about either.
 */
export async function listPosts(): Promise<Post[]> {
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf()
  );
}

// Below the usual 230-265 estimates, because technical prose reads slower.
const WORDS_PER_MINUTE = 200;

export function readingMinutes(post: Post): number {
  const words = (post.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
