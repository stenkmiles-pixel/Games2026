/**
 * Single source of truth for site-wide settings.
 * Edit this file to rebrand, change navigation, or plug in monetization IDs —
 * no other code changes required.
 */

export const SITE = {
  /** Brand name shown in the header, footer and <title>. */
  name: 'Cozy Game Guide',
  /** Used as the default <title> on the homepage. */
  title: 'Cozy Game Guide — Cozy & Simulation Game Recommendations and Guides',
  /** Default meta description / homepage description. */
  description:
    'Cozy Game Guide helps you find, choose, and get good at cozy and simulation games — relaxing recommendations, honest reviews, and beginner-friendly guides.',
  /**
   * Full canonical URL of the deployed site (no trailing slash).
   * IMPORTANT: change this to your real domain once you have one. It drives
   * the sitemap, RSS feed, canonical tags and Open Graph URLs.
   */
  url: 'https://cozygameguide.com',
  /** Short, friendly one-liner shown on the homepage hero. */
  tagline:
    'The cozy corner of the internet for finding, playing, and getting good at relaxing games.',
  author: 'The Cozy Game Guide Team',
  /** Contact email shown on the Contact page. Update to your real inbox. */
  email: 'hello@cozygameguide.com',
  locale: 'en',
  /** OpenGraph locale tag. */
  ogLocale: 'en_US',
  /**
   * Google Search Console verification. After adding your site in Search
   * Console, choose the "HTML tag" method and paste ONLY the content value
   * here (the long string inside content="..."). Then redeploy and click Verify.
   */
  googleSiteVerification: 'y35Xbe5vRfkxLUQpQ-HB5oKYPWpo04UwvHszVzXCrRY',
} as const;

/** Primary navigation links (header + footer). */
export const NAV: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'All Articles', href: '/blog' },
  { label: 'Recommendations', href: '/category/recommendations' },
  { label: 'Reviews', href: '/category/reviews' },
  { label: 'Guides', href: '/category/guides' },
  { label: 'Resources', href: '/category/resources' },
  { label: 'About', href: '/about' },
];

/**
 * Content categories (the four content pillars). The keys MUST match the
 * `category` enum in src/content.config.ts.
 */
export const CATEGORIES = {
  Recommendations: {
    slug: 'recommendations',
    label: 'Recommendations',
    emoji: '🌱',
    blurb: 'Curated lists to help you find your next cozy game by platform, mood, or budget.',
  },
  Reviews: {
    slug: 'reviews',
    label: 'Reviews',
    emoji: '⭐',
    blurb: 'Honest, spoiler-light takes on whether a cozy game is worth your time and money.',
  },
  Guides: {
    slug: 'guides',
    label: 'Guides',
    emoji: '📖',
    blurb: 'Beginner-friendly tips and walkthroughs so you spend less time stuck and more time relaxing.',
  },
  Resources: {
    slug: 'resources',
    label: 'Resources',
    emoji: '🎁',
    blurb: 'Mods, gift guides, and cozy gear round-ups to make your gaming time even nicer.',
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

/** Look up a category definition by its URL slug. */
export function categoryBySlug(slug: string) {
  return Object.entries(CATEGORIES).find(([, c]) => c.slug === slug);
}

/** Social links shown in the footer. Leave href empty to hide a link. */
export const SOCIAL: { label: string; href: string }[] = [
  // { label: 'Twitter / X', href: 'https://x.com/your-handle' },
  // { label: 'Bluesky', href: 'https://bsky.app/profile/your-handle' },
];

/**
 * Monetization configuration. Everything is OFF / placeholder by default so the
 * site is launch-ready and ad-network-compliant without showing empty boxes.
 * Flip `enabled` flags and drop in your IDs once your accounts are approved.
 */
export const MONETIZATION = {
  ads: {
    /** Loads the AdSense script (in BaseLayout) for verification + Auto ads. */
    enabled: true,
    /** Your AdSense publisher id, e.g. 'ca-pub-XXXXXXXXXXXXXXXX'. */
    adsenseClientId: 'ca-pub-3299003349230089',
  },
  affiliates: {
    /** Show the affiliate disclosure banner on monetized pages. */
    disclosureEnabled: true,
    /** Amazon Associates tracking tag, e.g. 'cozygameguide-20'. */
    amazonTag: '',
    /** Generic storefronts — paste your tracked links/IDs when approved. */
    humble: '',
    fanatical: '',
    greenManGaming: '',
  },
  newsletter: {
    enabled: true,
    /**
     * Paste your email provider's form action URL (Buttondown, MailerLite,
     * ConvertKit, etc.). Left as '#' the form is a non-functional placeholder.
     */
    actionUrl: '#',
  },
  /** Lead-magnet download (e.g. a printable cheat sheet). Placeholder for now. */
  download: {
    enabled: true,
    label: 'Free Stardew Valley Gift Cheat Sheet (PDF)',
    href: '/downloads/stardew-valley-gift-cheat-sheet.pdf',
  },
} as const;
