# Cozy Game Guide — Newsletter Template

A reusable weekly-email template in the **Cozy Game Guide** voice. Warm and calm, no nautical lore.

## How to use it
1. In your email tool (**MailerLite** or **Kit/ConvertKit**), create a new **template** and paste the HTML below into the "code"/HTML block.
2. Each week, duplicate it and fill the three `[...]` spots: **This week's cozy pick**, **A quick tip**, **What we're playing**.
3. Keep the structure identical every week — readers learn the rhythm and open rates improve.
4. Email clients don't reliably load web fonts, so the template uses **Georgia** (serif, for headings) + **Helvetica/Arial** (body) to echo the site's Fraunces/Nunito feel.

> Voice reminder: ✅ "Your weekly cozy corner — from our editing table at Cozy Game Guide." ❌ Never "from the pier desk / Harbor Dispatch."

## Section structure
1. **Header** — 🏡 Cozy Game Guide
2. **Tagline bar** — "Your weekly cozy corner"
3. **Short letter** — 1–2 friendly paragraphs
4. **🌿 This week's cozy pick** — one game + a one-line "why" + link
5. **💡 A quick tip** — a small, useful tip + link to a guide
6. **🎮 What we're playing** — a sentence or two, personal
7. **Footer** — warm sign-off + unsubscribe

## HTML template

```html
<!-- Cozy Game Guide weekly email — paste into your provider's HTML block -->
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
          <p style="margin:0 0 14px;">[A warm sentence or two — what's the cozy mood this week? A season, a feeling, a little hello.]</p>
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
          <p style="margin:8px 0 0;">[A small, genuinely useful tip — e.g., a Stardew money trick.] <a href="[GUIDE URL]" style="color:#5f8470;">Full guide →</a></p>
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

        <!-- Footer -->
        <tr><td style="padding:16px 32px 28px;border-top:1px solid #e8e0d2;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#756d62;">
          <a href="https://cozygameguide.com" style="color:#5f8470;">cozygameguide.com</a>
          &nbsp;·&nbsp; You're getting this because you signed up for cozy game picks.
          &nbsp;·&nbsp; <a href="{{unsubscribe_url}}" style="color:#756d62;">Unsubscribe</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</div>
```

> Replace `{{unsubscribe_url}}` with your provider's unsubscribe merge tag (MailerLite: `{$unsubscribe}`; Kit: `{{ unsubscribe_url }}`).

## Subject-line ideas (keep it cozy + curious)
- "🌿 This week's coziest pick (+ a quick tip)"
- "Something gentle to play this weekend"
- "Your cozy corner: [Game] is worth a slow evening"

## Connecting the signup form
Once you've set up MailerLite/Kit, paste your form's action URL into `MONETIZATION.newsletter.actionUrl` in `src/config.ts` — the on-site `NewsletterCTA` already posts to it.
