# Heart to Heart — Decap CMS setup guide

You already have a GitHub repo (`heart-to-heart`) and a Netlify site from the earlier
attempt. This guide updates both for the new Decap-powered version — logo, socials,
podcasts with YouTube embeds, challenges, and free visitor analytics.

---

## PART A — update GitHub with the new files

1. Unzip the new **`heart-to-heart-site.zip`**.
2. Go to your repo on GitHub → **Add file → Upload files**.
3. Open the unzipped folder and drag in **every file and folder** — all the
   `.html` files, `styles.css`, `app.js`, `content.js`, the whole **`content/`**
   folder, the whole **`admin/`** folder, and `uploads/`.
   - This overwrites the old HTML files with the new versions and adds everything else.
4. **Delete the old `cloudcannon.config.yml`** if it's still in the repo (open it on
   GitHub → trash-can icon → commit). It's not used anymore.
5. Commit.

Check the repo's file list afterward — you should see `content/`, `admin/`, and
`uploads/` folders alongside the `.html` files, all at the top level.

---

## PART B — make sure Netlify is building from GitHub

If you already connected this repo to Netlify (from the earlier walkthrough), it will
redeploy automatically once you commit — skip to Part C.

If not:
1. https://app.netlify.com → **Add new site → Import an existing project → Deploy with GitHub**
2. Pick the `heart-to-heart` repo.
3. **Branch:** `main` · **Build command:** *(leave empty)* · **Publish directory:** `.`
4. Deploy. Open the resulting URL and confirm the styled site loads.

---

## PART C — turn on the login system (Netlify Identity + Git Gateway)

This is what lets your friend log in at `/admin` with just an email and password —
no GitHub account for them.

1. In your Netlify site → **Identity** tab (left sidebar; if you don't see it, it's
   under **Site configuration**) → **Enable Identity**.
2. **Identity → Settings → Registration** → set to **Invite only** (so strangers can't
   sign themselves up).
3. Still in Identity settings, scroll to **Services → Git Gateway** → **Enable Git Gateway**.
   This lets Decap write changes back to your GitHub repo on the friend's behalf,
   without them ever having GitHub access.
4. Back on the main Identity tab → **Invite users** → enter your own email first and
   test it (see Part D) before inviting your friend for real.

> If "Identity" isn't visible anywhere in your Netlify dashboard, tell me — some
> newer Netlify accounts hide it behind a different name or it needs enabling from
> a different menu, and I'll find the current path.

---

## PART D — test it yourself first

1. Check your email for the Netlify Identity invite, click the link.
2. It should land on `yoursite.netlify.app/admin/` and prompt you to set a password.
3. Set one, log in.
4. You should see the Decap CMS dashboard with **Site Settings**, **Page Headlines**,
   **Podcast Episodes**, and **Challenges** in the sidebar.
5. Click **Site Settings**, type something in "Instagram URL", click **Publish** (or
   **Save** then **Publish**, depending on the version).
6. Wait ~1 minute, refresh your live site, confirm the change appears in the footer.

If that round-trip works, everything is wired correctly — invite your friend the same
way (Part C, step 4, their real email).

---

## PART E — send this to your friend

> **Editing the Heart to Heart site**
>
> 1. Check your email for an invite from Netlify Identity, click the link, and set a password.
> 2. From then on, go to **`yoursite.netlify.app/admin`** and log in with that email + password.
> 3. You'll see a few sections in the sidebar:
>
> **Site Settings** — the logo, Instagram, TikTok, and contact email:
> - Click **Site Settings** → **Site Settings**.
> - **Logo**: click the image box → upload a square image (works best), or leave blank to keep the heart icon.
> - **Instagram URL / TikTok URL**: paste the full link, e.g. `https://instagram.com/yourpage`.
> - **Contact email**: powers the "Contact" link in the footer.
> - Click **Publish** (or Save, then Publish). Live in about a minute.
>
> **Podcast Episodes** — add, edit, or remove episodes:
> - Click **Podcast Episodes** → the one entry → you'll see a list of episodes.
> - **+ Add "Episodes"** for a new one. Fill in: Title, Duration (e.g. "11 MIN"),
>   Category, a Description.
> - **Got a YouTube video?** Paste the full YouTube link into "YouTube URL" — it
>   turns into a playable video on the page automatically, and the description box
>   is skipped. No video? Just fill in the description instead.
> - Spotify / Apple links are optional — leave blank to hide that link.
> - Drag entries by their handle to reorder. Click the trash icon to remove one.
> - **Publish** when done.
>
> **Challenges** — same idea: **+ Add** for a new challenge card, fill in Title, Tag,
> Description, and the button text/link. **Publish**.
>
> You can also edit each page's big headline/subtext under **Page Headlines**, and
> The Reset's 4 week descriptions under **Page Headlines → The Reset Challenge**.
>
> Everything else (colours, layout, the About page's deep content) still needs a developer.

---

## PART F — free visitor analytics (GoatCounter)

Set this up once yourself (not something your friend needs to touch):

1. Go to **https://www.goatcounter.com** → **Sign up** (free).
2. Pick a site code, e.g. `hearttoheart` — your stats live at
   `hearttoheart.goatcounter.com`.
3. Finish signup (skip the "install" code snippet steps — you don't need to paste
   anything into the site).
4. Log into `yoursite.netlify.app/admin` → **Site Settings** → **Analytics code
   (GoatCounter)** → type just the code part (e.g. `hearttoheart`) → **Publish**.
5. Wait a minute, then visit a few pages of your live site yourself to generate some
   traffic, then check `https://hearttoheart.goatcounter.com` (log in there) —
   you should see visits.

Bookmark that goatcounter.com URL — that's "how many people are viewing the website,"
updated in real time, completely free, and it doesn't need a cookie banner since it
doesn't track individuals.

---

## Troubleshooting

- **Friend can't log in / no invite email**: check spam. Resend from Netlify →
  Identity → find their entry → resend invite.
- **Changes in `/admin` don't show on the live site**: give it 1–2 minutes, then hard
  refresh (Cmd+Shift+R). If still nothing, check Netlify → **Deploys** for a failed
  build.
- **A YouTube link doesn't embed**: make sure it's a normal YouTube link
  (`youtube.com/watch?v=...` or `youtu.be/...`), not a channel or playlist link.
- **"Identity" missing in Netlify's menu**: tell me what you do see in your Netlify
  dashboard's left sidebar and I'll point you to the current location.
