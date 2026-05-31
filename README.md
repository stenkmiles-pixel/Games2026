# Cozy Game Guide 🏡

A cozy-games content site — SEO-focused recommendations, reviews, and guides for cozy & simulation games. Built with [Astro](https://astro.build) + Tailwind CSS, output as a fast static site, and ready to deploy to Vercel.

> **Brand: "Cozy Game Guide"** · **Domain: [cozygameguide.com](https://cozygameguide.com)**. All site-wide settings live in [`src/config.ts`](src/config.ts).

---

## Quick start

```bash
npm install      # install dependencies (first time only)
npm run dev      # start the local dev server at http://localhost:4321
npm run build    # build the production site into dist/
npm run preview  # preview the production build locally
```

You need [Node.js](https://nodejs.org) 18.20.8+, 20.3+, or 22+.

---

## ✍️ How to publish a new article

This is the whole workflow — **no code changes needed.**

1. Create a new file in [`src/content/blog/`](src/content/blog/), e.g. `my-new-article.md`.
   The **filename becomes the URL** → `/blog/my-new-article/`. Use lowercase words separated by hyphens, with your target keyword in it.
2. Paste this template at the top (the part between the `---` lines is "frontmatter"):

```markdown
---
title: 'Your SEO Title — Put the Keyword Near the Front'
description: 'A 1–2 sentence summary for Google search results (aim for 120–155 characters).'
pubDate: 2026-06-01
# updatedDate: 2026-07-15   # optional — shows an "Updated" date
category: 'Recommendations' # one of: Recommendations | Reviews | Guides | Resources
tags: ['cozy games', 'switch']
# featured: true             # optional — pins it to the homepage "Editor's pick"
# draft: true                # optional — hides it from the site
---

Write your article in **Markdown** here. Use `##` for section headings
(these automatically appear in the article's table of contents).

Link to other articles like this: [beginner's guide](/blog/stardew-valley-beginner-guide/).
```

3. Save. In `npm run dev` the article appears instantly. Commit and push to publish.

### Tips for good articles
- Put your **main keyword** in the title, the first paragraph, and at least one `##` heading.
- Add 2–4 **internal links** to related articles — great for SEO and for readers.
- Keep the `description` unique per article; it's used as the meta description.

### Using affiliate / gear components inside an article
Plain `.md` files can't use components. If you want inline buy buttons or a gear box, name the file `.mdx` instead and import them — see [`src/content/blog/cozy-gamer-gift-guide.mdx`](src/content/blog/cozy-gamer-gift-guide.mdx) for a working example.

---

## 🎨 Customizing the site

Almost everything lives in **[`src/config.ts`](src/config.ts)**:

| What | Where in `config.ts` |
|---|---|
| Site name, title, description, URL, contact email | `SITE` |
| Header / footer navigation links | `NAV` |
| The four content categories (label, emoji, blurb) | `CATEGORIES` |
| Social links (footer) | `SOCIAL` |
| Ads, affiliate IDs, newsletter, download | `MONETIZATION` |

**Colors & fonts:** edit the CSS variables at the top of [`src/styles/global.css`](src/styles/global.css). Dark mode is built in (toggle in the header).

---

## 💰 Turning on monetization

Everything is **off / placeholder by default** so the live site is clean and ad-network-compliant. Flip things on in `MONETIZATION` (in `src/config.ts`) as your accounts get approved:

- **Google AdSense** — once approved, set `ads.enabled = true` and paste your `adsenseClientId`. Ad slots (`<AdSlot/>`) are already placed on the homepage and in articles. (In dev you'll see dashed "reserved ad slot" placeholders; these never show in production until enabled.)
- **Affiliate links** — add your `amazonTag` and other IDs. The `<GearBox/>` and `<AffiliateButton/>` components use them automatically. Always keep `rel="sponsored"` (already built in).
- **Newsletter** — paste your email provider's form action URL into `newsletter.actionUrl` to make the signup forms live.
- **Free download (lead magnet)** — point `download.href` at a real file (e.g. a PDF in `public/`) to activate the download CTA.

The **Affiliate Disclosure** and **Privacy Policy** pages already exist (required by AdSense & Amazon). Review their wording before relying on them.

---

## 🚀 Deploying to Vercel

1. Push this project to a new **GitHub** repository.
2. Go to [vercel.com](https://vercel.com), "Add New → Project," and import the repo.
3. Vercel auto-detects Astro — just click **Deploy**. (No extra config needed; this is a static site.)
4. After it goes live, **update `SITE.url` in `src/config.ts`** to your real URL (the `*.vercel.app` one, or your custom domain). This fixes canonical URLs, the sitemap, and RSS.
5. (Optional) Add a custom domain in Vercel's project settings.

Every future `git push` to the main branch redeploys automatically.

---

## ✅ Post-launch checklist

- [ ] Update `SITE.url` to the real domain and redeploy.
- [ ] Verify the site in [Google Search Console](https://search.google.com/search-console) and submit `https://yourdomain/sitemap-index.xml`.
- [ ] Add the site to [Bing Webmaster Tools](https://www.bing.com/webmasters).
- [ ] Replace the placeholder contact email in `config.ts`.
- [ ] Apply for affiliate programs (Amazon Associates, Humble, Fanatical, Green Man Gaming).
- [ ] Once you have ~15–25 quality articles, apply for Google AdSense.
- [ ] Optionally replace `public/og-default.svg` with a 1200×630 PNG for best social-share previews.

---

## 🗺️ Content roadmap

The site currently ships with **24 published articles** across all four pillars. Here are the next SEO topics to write using the template above:

1. Best Cozy Games of 2026 (New Releases to Watch)
2. Cozy Games Like Animal Crossing
3. Best Cozy Games on Xbox Game Pass
4. Best Cozy Games on PS5
5. Stardew Valley: Best Crops for Each Season
6. Stardew Valley: Complete Community Center Bundle Guide
7. Coral Island: How to Romance and Marry
8. Best Relaxing Games to Play After a Long Day
9. Best Farming Games for Beginners
10. Palia Beginner's Guide
11. Cottagecore Games: The Ultimate List
12. Best Cozy Games for Kids

Aim for 2–3 new articles per week, and revisit your best performers in Search Console to expand them.

---

## 📁 Project structure

```
src/
  config.ts              # ⭐ single source of truth (brand, nav, categories, monetization)
  content.config.ts      # article frontmatter schema
  content/blog/          # ⭐ your articles live here (one .md/.mdx per post)
  layouts/               # BaseLayout (head/SEO) + PostLayout (article page)
  components/            # Header, Footer, SEO, PostCard, AdSlot, AffiliateButton, GearBox, etc.
  pages/                 # routes: home, /blog, /blog/[slug], /category/[category], about, etc.
  styles/global.css      # theme colors, fonts, dark mode
  utils/posts.ts         # shared post querying/sorting
public/                  # favicon, default OG image, static files
astro.config.ts          # integrations: mdx, sitemap, tailwind
```

Built with care for cozy gamers. 🌿
