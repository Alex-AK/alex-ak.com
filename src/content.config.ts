import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * `draft` keeps a post in the repo and out of every listing, feed, and route.
 * Filtering happens in one place, `listPosts()` in src/lib/posts.ts, so a new
 * surface cannot forget to apply it.
 */
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing };
