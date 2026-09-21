import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'writing'>;

/**
 * The only way this site reads the writing collection. Drafts are dropped and
 * order is newest first, so no page, feed or route can disagree about either.
 */
export async function listPosts(): Promise<Post[]> {
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf()
  );
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
