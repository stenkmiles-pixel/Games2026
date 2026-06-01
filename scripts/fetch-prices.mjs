/**
 * Fetches current game prices from the IsThereAnyDeal (ITAD) API and writes a
 * normalized src/data/prices.json that the WhereToBuy component reads.
 *
 * Design goals:
 *  - NEVER throw / fail the build. On any error it keeps the last-good
 *    prices.json so deploys can't break because ITAD is down or rate-limited.
 *  - Run on a schedule (GitHub Action), not on every deploy.
 *  - Only surface prices from REPUTABLE stores (no grey-market key resellers).
 *
 * Secret: reads process.env.ITAD_API_KEY (GitHub repo secret / local env).
 * Usage (local):  ITAD_API_KEY=xxxx node scripts/fetch-prices.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GAMES_PATH = join(ROOT, 'src', 'data', 'games.json');
const OUT_PATH = join(ROOT, 'src', 'data', 'prices.json');
const KEY = process.env.ITAD_API_KEY;
const COUNTRY = process.env.ITAD_COUNTRY || 'US';
const API = 'https://api.isthereanydeal.com';

// Only show prices from trustworthy storefronts (no grey-market key resellers).
const ALLOWED_SHOPS = new Set([
  'steam',
  'humble store',
  'fanatical',
  'gog',
  'gog.com',
  'microsoft store',
  'epic game store',
  'green man gaming',
  'greenmangaming',
  'gamesplanet',
  'nintendo eshop',
  'playstation store',
  'ubisoft store',
  'ea app',
]);

const readJSON = (p, fallback) => {
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
};

async function main() {
  const existing = readJSON(OUT_PATH, {});

  if (!KEY) {
    console.warn('[prices] No ITAD_API_KEY set — keeping existing prices.json.');
    return;
  }
  const games = readJSON(GAMES_PATH, []);
  if (!Array.isArray(games) || games.length === 0) {
    console.warn('[prices] games.json empty — nothing to do.');
    return;
  }

  const result = { ...existing }; // start from last-good; partial failures won't wipe data

  try {
    // 1) Resolve each game (by its ITAD lookup title) to an ITAD game id,
    //    keyed by the display `name` (which matches the article's gameName).
    const ids = {};
    for (const g of games) {
      if (!g?.name) continue;
      const lookupTitle = g.title || g.name;
      try {
        const res = await fetch(
          `${API}/games/lookup/v1?key=${KEY}&title=${encodeURIComponent(lookupTitle)}`
        );
        if (!res.ok) {
          console.warn(`[prices] lookup ${g.name}: HTTP ${res.status}`);
          continue;
        }
        const data = await res.json();
        if (data?.found && data?.game?.id) ids[g.name] = data.game.id;
        else console.warn(`[prices] lookup ${g.name} ("${lookupTitle}"): not found`);
      } catch (e) {
        console.warn(`[prices] lookup ${g.name} failed: ${e.message}`);
      }
    }

    const idList = [...new Set(Object.values(ids))];
    if (idList.length === 0) {
      console.warn('[prices] No ITAD ids resolved — keeping existing.');
      writeFileSync(OUT_PATH, JSON.stringify(result, null, 2) + '\n');
      return;
    }

    // 2) Fetch current prices (include non-deal/regular prices too).
    const res = await fetch(
      `${API}/games/prices/v3?key=${KEY}&country=${COUNTRY}&nondeals=true&vouchers=false`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idList),
      }
    );
    if (!res.ok) {
      console.warn(`[prices] prices request: HTTP ${res.status} — keeping existing.`);
      writeFileSync(OUT_PATH, JSON.stringify(result, null, 2) + '\n');
      return;
    }
    const priceData = await res.json();

    const dealsById = {};
    for (const entry of Array.isArray(priceData) ? priceData : []) {
      if (entry?.id) dealsById[entry.id] = entry.deals || [];
    }

    // 3) Normalize into our own shape, keyed by game name, reputable shops only.
    const now = new Date().toISOString();
    for (const [name, id] of Object.entries(ids)) {
      const deals = dealsById[id] || [];
      const offers = deals
        .map((d) => ({
          shop: d?.shop?.name ?? 'Store',
          price: typeof d?.price?.amount === 'number' ? d.price.amount : null,
          cut: typeof d?.cut === 'number' ? d.cut : 0,
          url: d?.url ?? null,
        }))
        .filter((o) => o.price != null && ALLOWED_SHOPS.has(o.shop.toLowerCase()));
      if (offers.length === 0) {
        console.warn(`[prices] ${name}: no reputable-shop offers — skipping.`);
        continue;
      }
      offers.sort((a, b) => a.price - b.price);
      result[name] = { updated: now, best: offers[0], offers: offers.slice(0, 6) };
    }

    writeFileSync(OUT_PATH, JSON.stringify(result, null, 2) + '\n');
    console.log(`[prices] Wrote prices for ${Object.keys(result).length} game(s).`);
  } catch (e) {
    console.warn(`[prices] Refresh failed (${e.message}) — keeping existing prices.json.`);
    writeFileSync(OUT_PATH, JSON.stringify(existing, null, 2) + '\n');
  }
}

main();
