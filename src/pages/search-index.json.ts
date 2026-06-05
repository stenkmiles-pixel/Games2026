import type { APIContext } from 'astro';
import { getPublishedPosts } from '../utils/posts';

// Lightweight client-side search index: title/description/category/tags per post.
// Generated at build time; the /search page fetches and filters it in-browser.
export async function GET(_context: APIContext) {
  const posts = await getPublishedPosts();
  const index = posts.map((p) => ({
    title: p.data.title,
    description: p.data.description,
    url: `/blog/${p.id}/`,
    category: p.data.category,
    tags: p.data.tags ?? [],
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
