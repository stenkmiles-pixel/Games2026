import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The single `blog` collection holds every article. Adding a post is as simple
 * as dropping a new Markdown file into src/content/blog/ — the filename becomes
 * the URL slug and the frontmatter below is validated at build time.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // Must match a key in CATEGORIES (src/config.ts).
    category: z.enum(['Recommendations', 'Reviews', 'Guides', 'Resources', 'Mindful Gaming']),
    tags: z.array(z.string()).default([]),
    // Optional hero image — a path under /public (e.g. /images/posts/foo.jpg).
    // If omitted, an original generated "scene" illustration is shown instead.
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    heroCredit: z.string().optional(),
    author: z.string().default('The Cozy Game Guide Team'),
    /** Surface this post in the homepage "featured" strip. */
    featured: z.boolean().default(false),
    /** Hide from the site (won't be built into a page or listed). */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
