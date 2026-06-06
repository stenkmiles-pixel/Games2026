# Cozy Game Guide — Improvement Roadmap

_Consolidated from the design critique + competitive research. Living doc — update as items ship._

## ✅ Shipped

**Design (5 phases):**
- Genre-motif silhouettes on generated heroes (farm/cottage/fishing/campfire/mountain/forest)
- Homepage hierarchy: cozy-valley hero illustration, bigger Editor's pick, tinted Browse band (5→3 cols)
- A11y: in-article links pass WCAG AA contrast; consistent card hover
- On-site search (`/search` + header icon, zero-dependency)
- Nav consolidated into a `Browse ▾` dropdown

**Infra / monetization / content:**
- GEO/AEO structured-data layer (Organization graph, BlogPosting, llms.txt, ads.txt, robots AI bots)
- AdSense (in review) · Amazon `cozygameguide-20` · Humble `8471381` · Impact verified · Kit newsletter
- Daily ITAD live prices + weekly Topic Radar (Gemini, free-tier limited) automations
- 78 articles, fact-checked

## 🔍 Competitive insights (cozy-games niche)

- The strongest sites are **hubs, not just blogs**: a filterable **game database** (cozygames.io ~220 games), an **upcoming-release calendar**, ratings, and guides — not just article lists.
- **Monetization ladder** is the big lever: AdSense → **Ezoic** (no min traffic, ~2× AdSense) → **Mediavine Journey** (10k sessions) / **Raptive** (25k pageviews) / **Mediavine** (50k) = 2–4× AdSense.
- **Affiliates beat display ads in 94% of niches**; 82% of top earners use multiple methods. Add game-key affiliates (Eneba / Instant Gaming / Fanatical via Impact).

## 🎯 Backlog (prioritized by ROI ÷ effort)

| Item | Type | ROI | Status |
|---|---|---|---|
| **`/games` game library** (filter by genre, sort by our rating, ITAD price, review link) | Design+Function | ⭐⭐⭐ | ▶️ building |
| **Review "score card"** (verdict box: rating + pros/cons + who-it's-for + price) | UI | ⭐⭐⭐ | todo |
| **Real game imagery** on top ~15 reviews (Steam header / press kit; motif fallback) | Design | ⭐⭐⭐ | todo |
| **Upcoming cozy releases calendar** (semi-auto from Topic Radar Steam signals) | Function | ⭐⭐ | todo |
| **List-page filter/sort chips** (`/blog` + categories) | UI | ⭐⭐ | todo |
| **"Find your next cozy game" finder/quiz** | Function | ⭐⭐ | todo |
| **Game-key affiliate** (Eneba/Instant Gaming/Fanatical) in Where-to-Buy | Monetization | ⭐⭐ | needs IDs |
| **Wishlist / save (localStorage)** | Function | ⭐ | todo |
| **Digital products** (printable cheat sheets / wallpapers via Gumroad/Ko-fi) | Monetization | ⭐ | later |
| **Ad-network upgrade** (Ezoic→Mediavine/Raptive) | Monetization | ⭐⭐⭐ | gated on traffic |
| **Dark-mode tuning** for hero/motif illustrations | Design | ⭐ | todo |

## 📅 Publishing cadence

78 articles on a ~1-week-old domain is **already high** — Google scrutinizes new sites that mass-publish (scaled-content risk). Going forward:
- **Slow to ~1–3 quality articles/week**, steady.
- Shift effort to: **depth of top pages**, **features above**, **traffic/links** — not raw article count.
- Keep evergreen lists current (`2025→2026`, internal links).

## ▶️ Recommended sequence

1. `/games` library + review score cards (turn the content into a hub).
2. Real imagery on top reviews.
3. Traffic: GSC indexing + community sharing.
4. Ad-network upgrade once traffic supports it.
