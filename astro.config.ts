import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { SITE } from './src/config';

// https://astro.build/config
export default defineConfig({
  // `site` is used to generate absolute URLs for the sitemap, RSS feed and
  // canonical tags. Update this to your real domain after deploying.
  site: SITE.url,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        // Keep utility/legal pages out of the sitemap.
        !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
