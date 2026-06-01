# Cozy Game Guide — Newsletter Playbook (Kit)

Status: ✅ **Ready to use.** A reusable weekly-email setup for **Kit (ConvertKit)** in the
Cozy Game Guide voice — warm, calm, no nautical lore.

> Your signup form is already wired: the on-site `NewsletterCTA` posts to Kit form
> **9507506** (`MONETIZATION.newsletter.actionUrl` in `src/config.ts`). This doc is the
> *email* side — what subscribers actually receive.

## First, how Kit handles email design

Kit isn't a "paste one big HTML email per send" tool like MailerLite. There are two paths —
pick based on your Kit plan:

- **Path A — Visual editor (works on every plan; recommended to start).** You write each
  broadcast in Kit's editor. Branding comes from a small logo/header image plus a consistent
  weekly structure. Kit's clean, simple style genuinely tends to convert well.
- **Path B — Custom HTML template (if your plan supports HTML templates).** You save a branded
  *wrapper* once, and every broadcast drops its content inside it. A Kit HTML template **must**
  include three Liquid tags or it won't save:
  - `{{ message_content }}` — where your broadcast body is injected
  - `{{ unsubscribe_url }}` used as a link `href` (or `{{ unsubscribe_link }}` on its own)
  - `{{ address }}` — your physical mailing address (legally required on every email)

## The weekly structure (use in either path)

Keep this rhythm every week — readers learn it and open rates climb:

1. **Warm hello** — 1–2 friendly sentences
2. **🌿 This week's cozy pick** — one game + a one-line "why" + link
3. **💡 A quick tip** — a small, useful tip + link to a guide
4. **🎮 What we're playing** — a personal sentence or two
5. **Warm sign-off**

> Voice reminder: ✅ "Your weekly cozy corner — from our editing table at Cozy Game Guide."
> ❌ Never "from the pier desk / Harbor Dispatch."

## Path B — Kit HTML wrapper template

In Kit: **Settings → Email → Templates → New template → HTML**, then paste this. Each weekly
broadcast you send with this template will appear inside it; you write the body (the five
sections above) in the editor, and Kit injects it at `{{ message_content }}`.

```html
<!-- Cozy Game Guide — Kit HTML wrapper template -->
<div style="margin:0;padding:0;background:#f4eee3;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4eee3;">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
        style="max-width:600px;width:100%;background:#fbf7f0;border:1px solid #e8e0d2;border-radius:16px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="padding:28px 32px 8px;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:bold;color:#3c372f;">
          🏡 Cozy Game Guide
        </td></tr>

        <!-- Tagline bar -->
        <tr><td style="padding:0 32px 8px;">
          <div style="background:#f3e2d6;border-radius:8px;padding:8px 14px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:.04em;color:#756d62;">
            🌿 Your weekly cozy corner
          </div>
        </td></tr>

        <!-- Your broadcast body goes here -->
        <tr><td style="padding:16px 32px 8px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:#3c372f;">
          {{ message_content }}
        </td></tr>

        <!-- Footer (required: address + unsubscribe) -->
        <tr><td style="padding:16px 32px 28px;border-top:1px solid #e8e0d2;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#756d62;">
          <a href="https://cozygameguide.com" style="color:#5f8470;">cozygameguide.com</a><br/><br/>
          {{ address }}<br/>
          <a href="{{ unsubscribe_url }}" style="color:#756d62;">Unsubscribe</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</div>
```

> Tip: in the editor, keep the body simple (headings, paragraphs, links, one button) so it
> inherits the wrapper's look cleanly.

## Optional — fully designed single broadcast

If you'd rather send one fully styled email (and your plan lets you paste complete HTML into a
broadcast/template), here's the rich layout with the weekly sections baked in. Duplicate it each
week and fill the three `[...]` spots.

```html
<!-- Cozy Game Guide weekly email — fully designed version -->
<div style="margin:0;padding:0;background:#f4eee3;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4eee3;">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
        style="max-width:600px;width:100%;background:#fbf7f0;border:1px solid #e8e0d2;border-radius:16px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="padding:28px 32px 8px;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:bold;color:#3c372f;">
          🏡 Cozy Game Guide
        </td></tr>

        <!-- Tagline bar -->
        <tr><td style="padding:0 32px;">
          <div style="background:#f3e2d6;border-radius:8px;padding:8px 14px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:.04em;color:#756d62;">
            🌿 Your weekly cozy corner — from our editing table at Cozy Game Guide
          </div>
        </td></tr>

        <!-- Letter -->
        <tr><td style="padding:20px 32px 4px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:#3c372f;">
          <p style="margin:0 0 14px;">Hi friend,</p>
          <p style="margin:0 0 14px;">[A warm sentence or two — what's the cozy mood this week?]</p>
        </td></tr>

        <!-- This week's cozy pick -->
        <tr><td style="padding:8px 32px;">
          <div style="border:1px solid #e8e0d2;border-radius:12px;padding:16px 18px;">
            <div style="font-family:Georgia,serif;font-size:17px;font-weight:bold;color:#5f8470;">🌿 This week's cozy pick</div>
            <p style="margin:8px 0 12px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#3c372f;">
              <strong>[Game Name]</strong> — [one line on why it's worth your evening].
            </p>
            <a href="[ARTICLE URL]" style="display:inline-block;background:#5f8470;color:#ffffff;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;padding:9px 18px;border-radius:9999px;">Read more →</a>
          </div>
        </td></tr>

        <!-- A quick tip -->
        <tr><td style="padding:16px 32px 4px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:#3c372f;">
          <div style="font-family:Georgia,serif;font-size:17px;font-weight:bold;color:#3c372f;">💡 A quick tip</div>
          <p style="margin:8px 0 0;">[A small, genuinely useful tip.] <a href="[GUIDE URL]" style="color:#5f8470;">Full guide →</a></p>
        </td></tr>

        <!-- What we're playing -->
        <tr><td style="padding:16px 32px 4px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:#3c372f;">
          <div style="font-family:Georgia,serif;font-size:17px;font-weight:bold;color:#3c372f;">🎮 What we're playing</div>
          <p style="margin:8px 0 0;">[A personal sentence or two — what's on your screen this week.]</p>
        </td></tr>

        <!-- Sign-off -->
        <tr><td style="padding:20px 32px 8px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:#3c372f;">
          <p style="margin:0;">Warmly,<br/>The Cozy Game Guide team ☕</p>
        </td></tr>

        <!-- Footer (required: address + unsubscribe) -->
        <tr><td style="padding:16px 32px 28px;border-top:1px solid #e8e0d2;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#756d62;">
          <a href="https://cozygameguide.com" style="color:#5f8470;">cozygameguide.com</a>
          &nbsp;·&nbsp; {{ address }}
          &nbsp;·&nbsp; <a href="{{ unsubscribe_url }}" style="color:#756d62;">Unsubscribe</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</div>
```

## Welcome email (the first thing new subscribers get)

After someone confirms via the form, Kit sends a confirmation/welcome email — so brand that too
(Kit: **Grow → Landing Pages & Forms → your form → Incentive/confirmation email**, or set up a
welcome automation). Suggested copy:

> **Subject:** Welcome to your cozy corner 🌿
>
> Hi friend — thanks for joining Cozy Game Guide! Each week I'll send **one cozy game worth your
> evening**, a quick tip, and what we're playing — nothing more, nothing noisy.
>
> To get you started, here are the [15 best cozy games to play in 2025](https://cozygameguide.com/blog/best-cozy-games-2025/).
>
> Talk soon, and happy playing. ☕
> — The Cozy Game Guide team

## Subject-line ideas (cozy + curious)

- "🌿 This week's coziest pick (+ a quick tip)"
- "Something gentle to play this weekend"
- "Your cozy corner: [Game] is worth a slow evening"
