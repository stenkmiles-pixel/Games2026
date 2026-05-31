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
