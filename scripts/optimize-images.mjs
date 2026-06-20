// Generate WebP versions of the self-hosted JPEG cover art for faster loading.
// Modern browsers receive the much smaller WebP via <picture>; the original
// JPEG stays as the universal fallback AND remains the Open Graph /
// structured-data image (social + AI card WebP support is still patchy).
//
// Run: node scripts/optimize-images.mjs   (re-run after adding new covers)
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const DIR = 'public/images/games';
const files = (await readdir(DIR)).filter((f) => /\.jpe?g$/i.test(f));

let made = 0;
let saved = 0;
for (const f of files) {
  const src = join(DIR, f);
  const out = join(DIR, f.replace(/\.jpe?g$/i, '.webp'));
  const before = (await sharp(src).metadata()).size ?? 0;
  const info = await sharp(src).webp({ quality: 80 }).toFile(out);
  made++;
  saved += Math.max(0, before - info.size);
  console.log(`  ${f.padEnd(42)} -> ${(info.size / 1024).toFixed(0)}KB webp`);
}
console.log(`\nDone: ${made} WebP files written. ~${(saved / 1024).toFixed(0)}KB saved vs JPEG.`);
