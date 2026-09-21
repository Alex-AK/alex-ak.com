import rss from '@astrojs/rss';

import { SITE } from '../consts';
import { listPosts } from '../lib/posts';

export async function GET(context) {
  const posts = await listPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: `/writing/${post.id}/`,
    })),
  });
}
