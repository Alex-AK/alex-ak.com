import type { APIRoute } from 'astro';
import { listPosts, type Post } from '../../lib/posts';
import { renderPostImage } from '../../lib/og';

export async function getStaticPaths() {
  const posts = await listPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Post };
  const png = await renderPostImage(post.data.title);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
