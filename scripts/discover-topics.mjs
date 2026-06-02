/**
 * Weekly "topic radar": collects trending cozy-gaming signals and (optionally)
 * asks an LLM to turn them into ranked article ideas. Writes docs/topic-radar.md.
 *
 * Design (mirrors scripts/fetch-prices.mjs):
 *  - NEVER throw. Every source is fault-tolerant; one failure can't sink the run.
 *  - Works with NO API key: produces Part A (raw signals) only.
 *  - With an LLM key, adds Part B (AI topic suggestions), each citing the raw
 *    signal it came from — so suggestions are auditable, not black-box.
 *
 * Signal sources are CI-friendly (datacenter IPs, no auth): the Steam store
 * search API and the Hacker News (Algolia) API. Reddit's public JSON blocks
 * cloud IPs, so it was dropped; re-add it later via OAuth if desired.
 *
 * Secrets / env (all optional):
 *   ANTHROPIC_API_KEY   -> use Claude for Part B
 *   GEMINI_API_KEY      -> use Gemini for Part B (checked if no Anthropic key)
 *   LLM_MODEL           -> override the default model id
 * Usage (local): ANTHROPIC_API_KEY=sk-... node scripts/discover-topics.mjs
 */
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = join(ROOT, 'src', 'content', 'blog');
const OUT_PATH = join(ROOT, 'docs', 'topic-radar.md');

const UA = 'cozygameguide-topic-radar/1.0 (+https://cozygameguide.com)';
const NOW_ISO = new Date().toISOString();

/** Decode the handful of HTML entities Steam titles can contain. */
const decodeEntities = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&trade;/g, '™')
    .replace(/&reg;/g, '®');

/** Read the slugs of every existing article so the LLM can avoid duplicates. */
function existingSlugs() {
  try {
    return readdirSync(BLOG_DIR)
      .filter((f) => /\.(md|mdx)$/.test(f))
      .map((f) => f.replace(/\.(md|mdx)$/, ''))
      .sort();
  } catch {
    return [];
  }
}

/** Fetch games from the Steam store search API. Returns [{ title, url }]. */
async function fetchSteam(query) {
  try {
    const res = await fetch(`https://store.steampowered.com/search/results/?${query}&infinite=1`, {
      headers: { 'User-Agent': UA },
    });
    if (!res.ok) {
      console.warn(`[topics] Steam (${query}): HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    const html = data?.results_html || '';
    const re =
      /<a[^>]+href="(https:\/\/store\.steampowered\.com\/app\/[^"]+)"[\s\S]*?<span class="title">([^<]+)<\/span>/g;
    const items = [];
    for (const m of html.matchAll(re)) {
      items.push({ title: decodeEntities(m[2]).trim(), url: m[1].split('?')[0] });
    }
    return items;
  } catch (e) {
    console.warn(`[topics] Steam (${query}) failed: ${e.message}`);
    return [];
  }
}

/** Search the Hacker News (Algolia) API. Returns [{ title, url, meta }]. */
async function fetchHN(query) {
  try {
    const res = await fetch(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=8`
    );
    if (!res.ok) {
      console.warn(`[topics] HN "${query}": HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    return (data?.hits ?? [])
      .filter((h) => h.title)
      .map((h) => ({
        title: h.title,
        url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        meta: `${h.points ?? 0} pts`,
      }));
  } catch (e) {
    console.warn(`[topics] HN "${query}" failed: ${e.message}`);
    return [];
  }
}

/** Drop duplicate titles (case-insensitive), preserving order. */
function dedupeByTitle(items) {
  const seen = new Set();
  const out = [];
  for (const it of items) {
    const key = it.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}

/** Build the human-readable "raw signals" section (Part A). `groups` = [{label, items}]. */
function buildSignalsMarkdown(groups) {
  let md = '';
  for (const g of groups) {
    if (g.items.length === 0) continue;
    md += `### ${g.label}\n\n`;
    for (const it of g.items.slice(0, 15)) {
      md += `- [${it.title.replace(/\|/g, '\\|')}](${it.url})${it.meta ? ` — ${it.meta}` : ''}\n`;
    }
    md += '\n';
  }
  return md || '_No signals fetched this run (network or rate limit). Try again later._\n';
}

/** Compose the instruction sent to the LLM. `signals` = [{source, title}]. */
function buildLLMPrompt(signals, slugs) {
  const signalList = signals
    .slice(0, 50)
    .map((s) => `- [${s.source}] ${s.title}`)
    .join('\n');

  return `You are the SEO content editor for Cozy Game Guide (cozygameguide.com), a site about cozy & simulation games (recommendations, reviews, guides, resources, and a "Mindful Gaming" wellness angle).

EXISTING ARTICLES (slugs) — do NOT propose duplicates of these:
${slugs.join(', ')}

THIS WEEK'S SIGNALS (newest & top-selling "cozy" games on Steam, plus cozy-gaming buzz on Hacker News):
${signalList || '(none fetched this run)'}

TASK: Propose 8 NEW article ideas that (a) are not duplicates of the existing slugs, (b) target real search demand suggested by the signals or by evergreen cozy-gaming interest, and (c) fit one of these categories exactly: Recommendations, Reviews, Guides, Resources, Mindful Gaming.

Favor: newer/rising games (lower competition for a young site), high-intent "is X worth it" / "X vs Y" angles, and specific long-tail queries over broad head terms.

Respond with ONLY a JSON array (no prose, no code fences). Each item:
{
  "title": "Proposed article title (English)",
  "category": "one of the five categories",
  "targetKeyword": "the primary search query to target",
  "intent": "informational | comparison | commercial-investigation | listicle",
  "whyNow": "1 sentence; if it's from a signal above, name that signal",
  "suggestedInternalLinks": ["existing-slug-1", "existing-slug-2"]
}`;
}

/** Call whichever LLM is configured. Returns parsed suggestions array or null. */
async function askLLM(prompt) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  let rawText = null;
  let provider = null;

  try {
    if (anthropicKey) {
      provider = 'Claude';
      const model = process.env.LLM_MODEL || 'claude-3-5-haiku-latest';
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model,
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!res.ok) {
        console.warn(`[topics] Anthropic HTTP ${res.status}`);
        return { provider, items: null, raw: null };
      }
      const data = await res.json();
      rawText = data?.content?.[0]?.text ?? null;
    } else if (geminiKey) {
      provider = 'Gemini';
      const model = process.env.LLM_MODEL || 'gemini-2.0-flash';
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            // Force a bare JSON response (no markdown fences / prose to parse around).
            generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
          }),
        }
      );
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.warn(`[topics] Gemini HTTP ${res.status}`);
        return { provider, items: null, raw: `HTTP ${res.status} (model "${model}"): ${body.slice(0, 400)}` };
      }
      const data = await res.json();
      rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
      if (!rawText) {
        return { provider, items: null, raw: `Gemini returned no usable text: ${JSON.stringify(data).slice(0, 400)}` };
      }
    } else {
      return { provider: null, items: null, raw: null };
    }
  } catch (e) {
    console.warn(`[topics] LLM call failed: ${e.message}`);
    return { provider, items: null, raw: null };
  }

  if (!rawText) return { provider, items: null, raw: null };
  return { provider, items: parseSuggestions(rawText), raw: rawText };
}

/** Robustly pull a JSON array out of an LLM reply — raw, code-fenced, or in prose. */
function parseSuggestions(text) {
  const tryParse = (s) => {
    try {
      const v = JSON.parse(s);
      return Array.isArray(v) ? v : null;
    } catch {
      return null;
    }
  };
  const defenced = text.replace(/```(?:json)?/gi, '').trim();
  const arrayMatch = defenced.match(/\[[\s\S]*\]/);
  return tryParse(text.trim()) || tryParse(defenced) || (arrayMatch ? tryParse(arrayMatch[0]) : null);
}

/** Render Part B (AI suggestions) markdown. */
function buildSuggestionsMarkdown({ provider, items, raw }) {
  if (!provider) {
    return (
      '> **AI suggestions are off.** Add an `ANTHROPIC_API_KEY` *or* `GEMINI_API_KEY` ' +
      'repository secret to enable ranked topic ideas here. (Raw signals above work without a key.)\n'
    );
  }
  if (!items) {
    return (
      `> _${provider} was reached but returned no parseable suggestions this run._\n\n` +
      (raw ? '```\n' + raw.slice(0, 1500) + '\n```\n' : '')
    );
  }
  const rows = items.map((it, i) => {
    const links = Array.isArray(it.suggestedInternalLinks) ? it.suggestedInternalLinks.join(', ') : '';
    return `### ${i + 1}. ${it.title ?? '(untitled)'}
- **Category:** ${it.category ?? '—'}
- **Target keyword:** \`${it.targetKeyword ?? '—'}\`
- **Intent:** ${it.intent ?? '—'}
- **Why now:** ${it.whyNow ?? '—'}
- **Suggested internal links:** ${links || '—'}
`;
  });
  return `_Generated by ${provider}._\n\n` + rows.join('\n');
}

async function main() {
  const slugs = existingSlugs();

  // CI-friendly signal sources (no auth, datacenter-accessible).
  const [steamNew, steamTop, ...hnArrays] = await Promise.all([
    fetchSteam('term=cozy&category1=998&sort_by=Released_DESC&count=15'),
    fetchSteam('term=cozy&category1=998&filter=topsellers&count=15'),
    ...['cozy game', 'farming sim', 'life sim'].map(fetchHN),
  ]);

  const groups = [
    { label: 'Steam · newest cozy releases', items: dedupeByTitle(steamNew) },
    { label: 'Steam · top-selling cozy games', items: dedupeByTitle(steamTop) },
    { label: 'Hacker News buzz', items: dedupeByTitle(hnArrays.flat()) },
  ];
  const signals = groups.flatMap((g) => g.items.map((it) => ({ source: g.label, title: it.title })));

  const partA = buildSignalsMarkdown(groups);
  const suggestions = await askLLM(buildLLMPrompt(signals, slugs));
  const partB = buildSuggestionsMarkdown(suggestions);

  const md = `# Topic Radar

_Auto-generated ${NOW_ISO}. Signals + AI suggestions to help pick what to write next._
_Review, fact-check, and never auto-publish — this is an assistant, not an autopilot._

## Part B — AI topic suggestions

${partB}

## Part A — Raw signals (Steam + Hacker News)

${partA}

---
_Tracking ${slugs.length} existing articles. Next signal to add when traffic arrives: Google Search Console "almost-ranking" queries (see scripts/discover-topics.mjs)._
`;

  try {
    mkdirSync(dirname(OUT_PATH), { recursive: true });
  } catch {
    /* docs/ already exists */
  }
  writeFileSync(OUT_PATH, md);
  console.log(
    `[topics] Wrote topic-radar.md (${signals.length} signals, AI: ${suggestions.provider ?? 'off'}).`
  );
}

main();
