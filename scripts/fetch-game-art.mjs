/**
 * Downloads official Steam store cover art (capsule/header) for the games we
 * review, into public/images/games/<slug>.jpg. EDITORIAL USE on review pages.
 *
 * Safety: each appid is verified against the Steam appdetails API — if the
 * appid does not resolve to the expected game name, it's SKIPPED (so a review
 * can never get the wrong image). Re-run any time: node scripts/fetch-game-art.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'images', 'games');

// slug = article filename; name = expected game; appid = Steam app id.
const games = [
  { slug: 'tiny-glade-review', name: 'Tiny Glade', appid: 2198150 },
  { slug: 'coral-island-review', name: 'Coral Island', appid: 1158160 },
  { slug: 'fields-of-mistria-review', name: 'Fields of Mistria', appid: 2142790 },
  { slug: 'spiritfarer-review', name: 'Spiritfarer', appid: 972660 },
  { slug: 'disney-dreamlight-valley-worth-it', name: 'Disney Dreamlight Valley', appid: 1401590 },
  { slug: 'is-core-keeper-cozy', name: 'Core Keeper', appid: 1621690 },
  { slug: 'is-palia-worth-playing-2026', name: 'Palia', appid: 2707930 },
  { slug: 'is-sky-children-of-the-light-cozy', name: 'Sky: Children of the Light', appid: 2325290 },
  { slug: 'is-infinity-nikki-cozy', name: 'Infinity Nikki', appid: 3164330 },
  { slug: 'town-to-city-review', name: 'Town to City', appid: 3115220 },
  { slug: 'a-little-to-the-left-review', name: 'A Little to the Left', appid: 1629520 },
  { slug: 'hello-kitty-island-adventure-worth-it', name: 'Hello Kitty Island Adventure', appid: 2495100 },
  { slug: 'my-time-at-sandrock-review', name: 'My Time at Sandrock', appid: 1084600 },
  { slug: 'wylde-flowers-review', name: 'Wylde Flowers', appid: 1896700 },
  { slug: 'tales-of-the-shire-review', name: 'Tales of the Shire', appid: 2016460 },
];

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

async function appInfo(appid) {
  try {
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&filters=basic`);
    if (!res.ok) return null;
    const data = await res.json();
    const d = data?.[appid];
    if (!d?.success || !d.data) return null;
    return { name: d.data.name, dev: (d.data.developers || [])[0] || '' };
  } catch {
    return null;
  }
}

async function download(appid, slug) {
  for (const file of ['capsule_616x353.jpg', 'header.jpg']) {
    try {
      const res = await fetch(`https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/${file}`);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2000) continue; // too small => placeholder
      writeFileSync(join(OUT_DIR, `${slug}.jpg`), buf);
      return { file, bytes: buf.length };
    } catch {
      /* try next */
    }
  }
  return null;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const ok = [];
  for (const g of games) {
    const info = await appInfo(g.appid);
    if (!info) {
      console.warn(`[art] ${g.name}: appid ${g.appid} not found`);
      continue;
    }
    if (!norm(info.name).includes(norm(g.name)) && !norm(g.name).includes(norm(info.name))) {
      console.warn(`[art] ${g.name}: appid ${g.appid} = "${info.name}" — MISMATCH, skipping`);
      continue;
    }
    const d = await download(g.appid, g.slug);
    if (d) {
      ok.push({ ...g, confirmed: info.name, dev: info.dev, ...d });
      console.log(`[art] OK ${g.slug} <- "${info.name}" (${info.dev}) ${d.file} ${d.bytes}b`);
    } else {
      console.warn(`[art] ${g.name}: no image downloaded`);
    }
  }
  console.log(`\n=== ${ok.length}/${games.length} downloaded ===`);
  for (const o of ok) console.log(`${o.slug} | dev="${o.dev}"`);
}

main();
