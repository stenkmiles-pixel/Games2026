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

// Cozy-gaming subreddits to sample "hot" posts from. Missing/banned subs just
// return nothing (fault-tolerant), so it's safe to add/remove freely.
const SUBREDDITS = [
  'CozyGamers',
  'StardewValley',
  'AnimalCrossing',
  'SimulationGaming',
  'FieldsOfMistria',
  'Palia',
];

const UA = 'cozygameguide-topic-radar/1.0 (+https://cozygameguide.com)';
const NOW_ISO = new Date().toISOString();

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

/** Fetch "hot" posts from one subreddit. Returns [] on any error. */
async function fetchSubreddit(sub) {
  try {
    const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=15&raw_json=1`, {
      headers: { 'User-Agent': UA },
    });
    if (!res.ok) {
      console.warn(`[topics] r/${sub}: HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    const posts = data?.data?.children ?? [];
    return posts
      .map((p) => p?.data)
      .filter((d) => d && !d.stickied)
      .map((d) => ({
        sub,
        title: d.title,
        score: d.score ?? 0,
        comments: d.num_comments ?? 0,
        url: `https://www.reddit.com${d.permalink}`,
      }));
  } catch (e) {
    console.warn(`[topics] r/${sub} failed: ${e.message}`);
    return [];
  }
}

/** Build the human-readable "raw signals" section (Part A). */
function buildSignalsMarkdown(redditPosts) {
  if (redditPosts.length === 0) {
    return '_No Reddit signals fetched this run (network or rate limit). Try again later._\n';
  }
  const top = [...redditPosts].sort((a, b) => b.score - a.score).slice(0, 30);
  const lines = top.map(
    (p) => `| r/${p.sub} | [${p.title.replace(/\|/g, '\\|')}](${p.url}) | ${p.score} | ${p.comments} |`
  );
  return (
    '| Subreddit | Hot post | Upvotes | Comments |\n' +
    '|---|---|---:|---:|\n' +
    lines.join('\n') +
    '\n'
  );
}

/** Compose the instruction sent to the LLM. */
function buildLLMPrompt(redditPosts, slugs) {
  const signalList = [...redditPosts]
    .sort((a, b) => b.score - a.score)
    .slice(0, 40)
    .map((p) => `- [r/${p.sub} | ${p.score}↑ | ${p.comments}c] ${p.title}`)
    .join('\n');

  return `You are the SEO content editor for Cozy Game Guide (cozygameguide.com), a site about cozy & simulation games (recommendations, reviews, guides, resources, and a "Mindful Gaming" wellness angle).

EXISTING ARTICLES (slugs) — do NOT propose duplicates of these:
${slugs.join(', ')}

THIS WEEK'S TRENDING SIGNALS (Reddit hot posts in cozy-gaming subreddits):
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
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      if (!res.ok) {
        console.warn(`[topics] Gemini HTTP ${res.status}`);
        return { provider, items: null, raw: null };
      }
      const data = await res.json();
      rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    } else {
      return { provider: null, items: null, raw: null };
    }
  } catch (e) {
    console.warn(`[topics] LLM call failed: ${e.message}`);
    return { provider, items: null, raw: null };
  }

  if (!rawText) return { provider, items: null, raw: null };
  // Strip accidental code fences, then try to parse JSON.
  const cleaned = rawText.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
  try {
    const items = JSON.parse(cleaned);
    return { provider, items: Array.isArray(items) ? items : null, raw: rawText };
  } catch {
    return { provider, items: null, raw: rawText };
  }
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
  const redditResults = await Promise.all(SUBREDDITS.map(fetchSubreddit));
  const redditPosts = redditResults.flat();

  const partA = buildSignalsMarkdown(redditPosts);
  const suggestions = await askLLM(buildLLMPrompt(redditPosts, slugs));
  const partB = buildSuggestionsMarkdown(suggestions);

  const md = `# Topic Radar

_Auto-generated ${NOW_ISO}. Signals + AI suggestions to help pick what to write next._
_Review, fact-check, and never auto-publish — this is an assistant, not an autopilot._

## Part B — AI topic suggestions

${partB}

## Part A — Raw signals (Reddit "hot")

${partA}

---
_Tracking ${slugs.length} existing articles. Edit \`scripts/discover-topics.mjs\` to add signal sources (Steam upcoming, Google Trends, Search Console)._
`;

  try {
    mkdirSync(dirname(OUT_PATH), { recursive: true });
  } catch {
    /* docs/ already exists */
  }
  writeFileSync(OUT_PATH, md);
  console.log(
    `[topics] Wrote topic-radar.md (${redditPosts.length} signals, AI: ${suggestions.provider ?? 'off'}).`
  );
}

main();
