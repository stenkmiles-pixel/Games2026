# Topic Radar

_This file is auto-generated weekly by the **Topic radar** GitHub Action_
_(`.github/workflows/discover-topics.yml` → `scripts/discover-topics.mjs`)._

It hasn't run on GitHub yet. To generate the first real radar:

1. **(Optional, for AI suggestions)** Add a repository secret — either
   `ANTHROPIC_API_KEY` *or* `GEMINI_API_KEY` — under
   **Settings → Secrets and variables → Actions**.
2. Go to the **Actions** tab → **Topic radar** → **Run workflow**.

On each run it writes two sections here:

- **Part A — Raw signals:** trending "hot" posts from cozy-gaming subreddits
  (no API key needed).
- **Part B — AI topic suggestions:** ranked article ideas that read Part A +
  the existing article list (to avoid duplicates), each citing the signal it
  came from. Only appears when an LLM key is set.

> ⚠️ This is an **assistant, not an autopilot.** Always review and fact-check
> suggestions before writing, and never auto-publish AI-drafted content.
