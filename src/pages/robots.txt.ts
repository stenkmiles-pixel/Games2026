import type { APIContext } from 'astro';
import { SITE } from '../config';

export async function GET(context: APIContext) {
  const sitemapURL = new URL('sitemap-index.xml', context.site ?? SITE.url).href;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL}\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
