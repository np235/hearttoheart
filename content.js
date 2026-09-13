/* Heart to Heart — loads editor-managed content (from /content/*.json,
   written by the Decap CMS at /admin) into the static HTML at runtime.
   No build step: every value is inserted with textContent or as an
   element property, never innerHTML, so nothing an editor types can
   run as code. */
(function () {
  const $all = (sel, root = document) => [...root.querySelectorAll(sel)];

  async function getJSON(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function setText(key, value) {
    if (!value) return;
    $all(`[data-content="${key}"]`).forEach((el) => { el.textContent = value; });
  }

  function youtubeId(url) {
    if (!url) return null;
    const m = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtube\.com\/watch\?.*[?&]v=)([A-Za-z0-9_-]{11})/
    );
    return m ? m[1] : null;
  }

  function makeLink(label, url) {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = label;
    return a;
  }

  /* ---------- site-wide settings: logo, socials, analytics ---------- */
  async function applySettings() {
    const s = await getJSON("content/settings.json");
    if (!s) return;

    if (s.site_name) {
      $all(".brand").forEach((el) => {
        // keep the icon span, replace only the trailing text node
        const dot = el.querySelector(".dot");
        el.textContent = "";
        if (dot) el.appendChild(dot);
        el.appendChild(document.createTextNode(" " + s.site_name));
      });
    }

    if (s.logo) {
      $all(".brand .dot").forEach((dot) => {
        dot.textContent = "";
        const img = document.createElement("img");
        img.src = s.logo;
        img.alt = s.site_name || "logo";
        dot.appendChild(img);
      });
    }

    if (s.instagram) $all('[data-social="instagram"]').forEach((a) => { a.href = s.instagram; a.target = "_blank"; a.rel = "noopener"; });
    if (s.tiktok) $all('[data-social="tiktok"]').forEach((a) => { a.href = s.tiktok; a.target = "_blank"; a.rel = "noopener"; });
    if (s.contact_email) $all('[data-social="contact"]').forEach((a) => { a.href = "mailto:" + s.contact_email; });

    if (s.analytics_code && !window.goatcounterLoaded) {
      window.goatcounterLoaded = true;
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://gc.zgo.at/count.js";
      script.setAttribute("data-goatcounter", `https://${s.analytics_code}.goatcounter.com/count`);
      document.head.appendChild(script);
    }
  }

  /* ---------- per-page hero text + The Reset's weeks ---------- */
  async function applyPageText() {
    const page = document.body.dataset.page;
    if (!page) return;
    const data = await getJSON(`content/pages/${page}.json`);
    if (!data) return;

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "string") setText(key, value);
    });

    if (Array.isArray(data.weeks)) {
      const weekEls = $all(".weeks .week");
      data.weeks.forEach((w, i) => {
        const el = weekEls[i];
        if (!el) return;
        const h3 = el.querySelector("h3");
        const p = el.querySelector("p");
        if (h3 && w.title) h3.textContent = w.title;
        if (p && w.description) p.textContent = w.description;
      });
    }
  }

  /* ---------- podcast episodes (with optional YouTube embed) ---------- */
  function podcastCard(ep, i) {
    const card = document.createElement("div");
    card.className = "card";

    const pod = document.createElement("div");
    pod.className = "pod";

    const art = document.createElement("div");
    art.className = "pod-art " + ["a", "b", "c", "d"][i % 4];
    art.textContent = "🎧";

    const info = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.textContent = ep.title || "Untitled episode";
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = [ep.duration, ep.category].filter(Boolean).join(" · ");
    const links = document.createElement("div");
    links.className = "links";
    if (ep.spotify_url) links.appendChild(makeLink("Spotify", ep.spotify_url));
    if (ep.apple_url) links.appendChild(makeLink("Apple", ep.apple_url));
    if (ep.youtube_url) links.appendChild(makeLink("YouTube", ep.youtube_url));
    info.append(h3, meta, links);
    pod.append(art, info);
    card.appendChild(pod);

    const yid = youtubeId(ep.youtube_url);
    if (yid) {
      const wrap = document.createElement("div");
      wrap.className = "yt-embed";
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${yid}`;
      iframe.title = ep.title || "Episode";
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      wrap.appendChild(iframe);
      card.appendChild(wrap);
    } else if (ep.description) {
      const p = document.createElement("p");
      p.className = "pod-desc";
      p.textContent = ep.description;
      card.appendChild(p);
    }
    return card;
  }

  async function applyPodcasts() {
    const mount = document.getElementById("podcast-list");
    if (!mount) return;
    const data = await getJSON("content/podcasts.json");
    if (!data || !Array.isArray(data.episodes) || !data.episodes.length) return;
    mount.innerHTML = "";
    data.episodes.forEach((ep, i) => mount.appendChild(podcastCard(ep, i)));
  }

  /* ---------- challenge cards ---------- */
  function challengeCard(c) {
    const card = document.createElement("article");
    card.className = "card";
    if (c.tag) {
      const tag = document.createElement("span");
      tag.className = "tag" + (c.tag_color === "grape" ? " grape" : "");
      tag.textContent = c.tag;
      card.appendChild(tag);
    }
    const h3 = document.createElement("h3");
    h3.textContent = c.title || "";
    const p = document.createElement("p");
    p.textContent = c.description || "";
    const ctaWrap = document.createElement("p");
    ctaWrap.style.marginTop = "16px";
    const a = document.createElement("a");
    a.className = "btn " + (c.cta_style === "primary" ? "btn-primary" : "btn-ghost");
    a.href = c.cta_link || "challenge-reset.html";
    a.textContent = c.cta_label || "Start";
    ctaWrap.appendChild(a);
    card.append(h3, p, ctaWrap);
    return card;
  }

  async function applyChallenges() {
    const mount = document.getElementById("challenge-list");
    if (!mount) return;
    const data = await getJSON("content/challenges.json");
    if (!data || !Array.isArray(data.challenges) || !data.challenges.length) return;
    mount.innerHTML = "";
    data.challenges.forEach((c) => mount.appendChild(challengeCard(c)));
  }

  applySettings();
  applyPageText();
  applyPodcasts();
  applyChallenges();
})();
