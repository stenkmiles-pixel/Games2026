import type { APIContext } from 'astro';
import { SITE } from '../config';

// Named AI/LLM crawlers we explicitly welcome. The wildcard below already allows
// everyone; naming them is an unambiguous "yes, you may read and cite us" signal.
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'CCBot',
];

export async function GET(context: APIContext) {
  const base = context.site ?? SITE.url;
  const sitemapURL = new URL('sitemap-index.xml', base).href;
  const llmsURL = new URL('llms.txt', base).href;
  const aiSection = AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n');
  const body =
    `User-agent: *\nAllow: /\n\n` +
    `${aiSection}\n\n` +
    `# AI/LLM content index: ${llmsURL}\n` +
    `Sitemap: ${sitemapURL}\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
