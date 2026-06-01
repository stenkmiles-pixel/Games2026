import type { APIContext } from 'astro';
import { SITE, CATEGORIES } from '../config';
import { getPublishedPosts } from '../utils/posts';

// Plain-Markdown index of the whole site for LLM tools (an emerging convention).
// Auto-generated from the content collection, so it never needs maintenance.
export async function GET(context: APIContext) {
  const site = new URL(context.site ?? SITE.url).href.replace(/\/$/, '');
  const abs = (path: string) => `${site}${path}`;
  const posts = await getPublishedPosts();

  let out = `# ${SITE.name}\n\n> ${SITE.description}\n\n`;

  for (const [key, cat] of Object.entries(CATEGORIES)) {
    const inCat = posts.filter((p) => p.data.category === key);
    if (inCat.length === 0) continue;
    out += `## ${cat.label}\n\n`;
    for (const p of inCat) {
      out += `- [${p.data.title}](${abs(`/blog/${p.id}/`)}): ${p.data.description}\n`;
    }
    out += '\n';
  }

  out += '## More\n\n';
  out += `- [About](${abs('/about/')})\n`;
  out += `- [Contact](${abs('/contact/')})\n`;
  out += `- [RSS feed](${abs('/rss.xml')})\n`;
  out += `- [Sitemap](${abs('/sitemap-index.xml')})\n`;

  return new Response(out, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
