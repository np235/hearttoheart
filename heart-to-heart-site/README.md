# Heart to Heart

Free, static website for cardiovascular health awareness aimed at youth / Gen Z / uni students.
Plain HTML + CSS + vanilla JS. **No build step, no framework, no Node.js required.**

A non-technical editor can manage the logo, social links, podcast episodes (including
YouTube embeds), challenges, and The Reset's weekly text through **Decap CMS**, a free
form-based editor at `/admin`. A free **GoatCounter** link shows visitor stats.

---

## How it works

The pages are ordinary HTML/CSS. A small script, `content.js`, runs in the visitor's
browser, fetches a few JSON files from `content/`, and fills in the page — the logo,
social links, podcast cards, challenge cards, and a handful of headlines. Decap CMS
(at `/admin`) is just a form that edits those JSON files and commits the change to
GitHub. Netlify picks up the commit and republishes — no build step anywhere.

## Files

| Path | What it is |
|---|---|
| `index.html`, `about.html`, `challenges.html`, `challenge-reset.html`, `podcasts.html`, `thanks.html` | The 6 pages |
| `styles.css` | All colours, fonts, spacing, animations |
| `app.js` | Mobile nav, scroll reveals, the 28-day tracker + Perfect-28 celebration |
| `content.js` | Reads `content/*.json` and fills in the page at load time |
| `content/settings.json` | Logo, Instagram, TikTok, contact email, analytics code |
| `content/pages/*.json` | Hero heading/subtext for each page, and The Reset's 4 weeks |
| `content/podcasts.json` | The podcast episode list |
| `content/challenges.json` | The challenge card list |
| `uploads/` | Images uploaded through the CMS (e.g. the logo) land here |
| `admin/index.html`, `admin/config.yml` | The Decap CMS editor and its field definitions |

## What's editable through Decap, and what isn't

**Editable (friend can do this alone, no code):**
- Logo, Instagram/TikTok links, contact email, analytics code
- Podcast episodes — add/edit/remove, including a YouTube link that auto-embeds
- Challenges — add/edit/remove
- The Reset's 4 week titles/descriptions
- Each page's big headline/subtext (Home's subtext only; Home's exact styled
  headline is left as-is to protect its custom typography)

**Not wired up yet (still hand-edit the HTML, or ask a developer):**
About page's fact/myth cards and FAQ, the footer, the medical disclaimer, colours/layout.

---

## Preview locally

```bash
cd heart-to-heart
python3 -m http.server 8080
# visit http://localhost:8080
```

---

## Publish + set up the editor

See **`SETUP-GUIDE.md`** for the full step-by-step (GitHub, Netlify, enabling the
CMS login, inviting your friend, and setting up free visitor analytics).

Quick version:
1. Push this folder to a GitHub repo (flat files, no missing subfolders).
2. Netlify → **Add new site → Import from GitHub** → build command empty, publish
   directory `.`
3. Netlify → **Identity** → Enable, set registration to **Invite only** → **Services →
   Git Gateway** → Enable.
4. Netlify → **Identity → Invite users** → your friend's email.
5. Friend logs in at `yoursite.com/admin`.

Forms: the `<form>` tags already have `data-netlify="true"` and work on Netlify as-is.

---

## Before going live — content checklist

- [ ] Replace placeholder stats in `index.html` / `about.html` with cited figures
      (WHO, AHA, British Heart Foundation, or your national heart foundation).
- [ ] Have a health professional review `about.html`.
- [ ] Keep the medical disclaimer in the footer on every page.
- [ ] Set the real logo, Instagram, TikTok and contact email via `/admin`.
- [ ] Sign up for GoatCounter and put the code in `/admin` → Site Settings.
