import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** All non-draft posts, newest first. The single source for every listing. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Related posts: same category first, then most recent, excluding `current`. */
export function relatedPosts(all: Post[], current: Post, limit = 3): Post[] {
  return all
    .filter((p) => p.id !== current.id)
    .sort((a, b) => {
      const aSame = a.data.category === current.data.category ? 0 : 1;
      const bSame = b.data.category === current.data.category ? 0 : 1;
      return aSame - bSame;
    })
    .slice(0, limit);
}

export const PAGE_SIZE = 9;

/**
 * Pick a foreground SceneHero motif from a post's metadata so a generated hero
 * instantly reads as "that kind of game" — no licensed art required. Returns ''
 * (plain scene) when nothing specific matches, which is fine for broad lists.
 */
export function sceneMotif(data: Post['data']): string {
  const hay = [data.title, data.gameName, data.category, ...(data.tags ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const has = (...keys: string[]) => keys.some((k) => hay.includes(k));
  if (has('fish', 'webfishing', 'cast n chill', 'dave the diver', 'diving', 'ocean', 'coral', 'underwater')) return 'fishing';
  if (has('farm', 'stardew', 'harvest', 'mistria', 'sandrock', 'story of seasons', 'crop', 'ranch')) return 'farm';
  if (has('build', 'decorat', 'town to city', 'house flipper', 'tiny glade', 'cottage', 'unpack', 'a little to the left', 'paralives', 'the sims', 'interior')) return 'cottage';
  if (has('hike', 'mountain', 'climb')) return 'mountain';
  if (has('cottagecore', 'forest', 'nature', 'cozy grove', 'witch', 'wylde', 'spirit', 'palia', 'fae')) return 'forest';
  if (has('mindful', 'relax', 'stress', 'anxiet', 'calm', 'self-care', 'wellbeing', 'soundtrack', 'ritual', 'soothing', 'after work', 'wind down', 'no combat')) return 'campfire';
  return '';
}
