# Heart to Heart

Free, static website for cardiovascular health awareness aimed at youth / Gen Z / uni students.
Plain HTML + CSS + a little vanilla JS. **No build step, no framework.**

Set up so a non-technical person can edit the text visually through **CloudCannon**
(or, as a free alternative, Decap CMS — see the end).

---

## Files

| File | What it is |
|---|---|
| `index.html` | Landing page |
| `podcasts.html` | Podcast episodes — paste real Spotify / Apple / YouTube embeds into the dashed boxes |
| `challenges.html` | Directory of 4-week challenges |
| `challenge-reset.html` | "The Reset" challenge + a 28-day tracker (saves in the visitor's browser) |
| `about.html` | "Heart 101" — cardiovascular basics |
| `thanks.html` | Shown after a form is submitted |
| `styles.css` | **All colours, fonts, spacing** — the whole visual theme |
| `app.js` | Tracker + scroll animations |
| `uploads/` | Images added through the CMS land here |
| `cloudcannon.config.yml` | CloudCannon editor settings |

Text elements that carry `class="editable"` are the bits the visual editor lets people change.
Everything else (layout, colours, forms, the tracker) stays locked.

---

## Preview locally

Open `index.html` in a browser, or for clean paths:

```bash
cd heart-to-heart
python3 -m http.server 8080
# visit http://localhost:8080
```

---

## Publish + set up visual editing (CloudCannon)

**One-time, done by someone comfortable clicking through a setup wizard:**

1. **GitHub** — create a free account at https://github.com, make a new repository
   (e.g. `heart-to-heart`), and upload the contents of this folder
   (drag the files onto the repo page → "Commit changes").

2. **CloudCannon** — sign up at https://cloudcannon.com → **Create Site** →
   **Connect a Git repository** → pick the repo.
   - Framework / SSG: **None** (plain HTML)
   - Build command: *(leave blank)*
   - Output path: `/`

3. CloudCannon builds a preview and can **host the site itself** (a `*.cloudcannon.com`
   URL, or connect a custom domain). You can retire the Netlify version once this works.

4. **Invite the editor** — Site → **Settings → Collaborators** → add your friend's email,
   role **Editor**. They get an email, set a password, and never touch GitHub.

**Editing, from then on (the editor's whole workflow):**

1. Log in at https://app.cloudcannon.com
2. Open the site → pick a page → the visual editor shows the real page
3. Click any headline or paragraph → type. Use the toolbar for bold / links.
4. Swap an image: click it → Upload
5. Click **Save** → the site rebuilds and is live in ~1 minute

Adding a whole new podcast card or page still needs a developer (duplicate an existing
block in the code editor). Everything text-based, the editor can do alone.

---

## Fallback: publish free on Netlify (no visual editor)

1. https://app.netlify.com/drop → drag this **folder** on (drag every file).
2. Or, logged in: Site → **Deploys** → drag the folder to redeploy.
3. Editing then means: change the `.html` files in a text editor, re-drag the folder.

Forms: the `<form>` tags have `data-netlify="true"` and work on Netlify as-is.
On CloudCannon hosting or GitHub Pages, point each form's `action` at a free
[Formspree](https://formspree.io) endpoint and remove `data-netlify="true"`.

---

## Free alternative to CloudCannon: Decap CMS

If CloudCannon's paid tier isn't worth it, the site can be converted to use
[Decap CMS](https://decapcms.org) (100% free): content moves into simple files, a
build step renders them, and the editor gets a form-based admin panel at `/admin`.
Bigger one-time change, same "editor never sees code" result. The `class="editable"`
groundwork already done here carries over.

---

## Before going live — content checklist

- [ ] Replace placeholder stats in `index.html` / `about.html` with cited figures
      (WHO, AHA, British Heart Foundation, or your national heart foundation).
- [ ] Have a health professional review `about.html`.
- [ ] Keep the medical disclaimer in the footer on every page.
- [ ] Real social links (currently `#`) and a real contact email.
- [ ] Add a short privacy note if you collect emails.
