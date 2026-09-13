/* Heart to Heart — vanilla JS, no dependencies */

/* ---------- mobile nav ---------- */
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-nav-toggle]")) {
    document.querySelector(".nav-links")?.classList.toggle("open");
  } else if (!e.target.closest(".nav-links")) {
    document.querySelector(".nav-links")?.classList.remove("open");
  }
});

/* ---------- nav shadow on scroll ---------- */
const nav = document.querySelector(".nav");
const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 12);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- footer year ---------- */
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

/* ---------- reveal on scroll + count-up ---------- */
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const dur = 1100;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = target % 1 ? (target * eased).toFixed(1) : Math.round(target * eased);
    el.textContent = val + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("in");
      el.querySelectorAll?.("[data-count]").forEach(countUp);
      if (el.hasAttribute("data-count")) countUp(el);
      io.unobserve(el);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll("[data-reveal]").forEach((el, i) => {
    if (!el.style.transitionDelay) el.style.transitionDelay = (i % 4) * 70 + "ms";
    io.observe(el);
  });
  document.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
} else {
  document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("in"));
  document.querySelectorAll("[data-count]").forEach((el) => {
    el.textContent = el.dataset.count + (el.dataset.suffix || "");
  });
}

/* ---------- pointer parallax on hero mesh ---------- */
const hero = document.querySelector(".hero");
if (hero && !reduce && window.matchMedia("(pointer: fine)").matches) {
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    hero.style.setProperty("--px", (x * 14).toFixed(2) + "px");
    hero.style.setProperty("--py", (y * 14).toFixed(2) + "px");
  });
}

/* -------------------------------------------------
   28-day challenge tracker (localStorage, per-page)
   Add data-tracker="<unique-key>" to a .tracker block
--------------------------------------------------*/
document.querySelectorAll("[data-tracker]").forEach((root) => {
  const key = "h2h:" + root.dataset.tracker;
  const total = 28;
  const daysWrap = root.querySelector(".days");
  const bar = root.querySelector(".progress > i");
  const doneEl = root.querySelector('[data-stat="done"]');
  const pctEl = root.querySelector('[data-stat="pct"]');
  const streakEl = root.querySelector('[data-stat="streak"]');

  let state = load();
  let complete = state.length === total; // already finished on load?
  let firstRender = true;

  function load() {
    try {
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.slice(0, total) : [];
    } catch { return []; }
  }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }
  function bestStreak() {
    let best = 0, run = 0;
    for (let d = 1; d <= total; d++) {
      if (state.includes(d)) { run++; best = Math.max(best, run); } else run = 0;
    }
    return best;
  }
  function render() {
    daysWrap.innerHTML = "";
    for (let d = 1; d <= total; d++) {
      const b = document.createElement("button");
      b.className = "day" + (state.includes(d) ? " done" : "");
      b.textContent = d;
      b.type = "button";
      b.setAttribute("aria-pressed", state.includes(d));
      b.addEventListener("click", () => {
        state = state.includes(d) ? state.filter((x) => x !== d) : [...state, d];
        save();
        render();
      });
      daysWrap.appendChild(b);
    }
    const done = state.length;
    const pct = Math.round((done / total) * 100);
    if (bar) bar.style.width = pct + "%";
    if (doneEl) doneEl.textContent = done + "/" + total;
    if (pctEl) pctEl.textContent = pct + "%";
    if (streakEl) streakEl.textContent = bestStreak();

    const nowComplete = done === total;
    if (replayBtn) replayBtn.hidden = !nowComplete;
    // fire once, only on the tick that completes the grid (not on page load)
    if (nowComplete && !complete && !firstRender) celebrate();
    complete = nowComplete;
    firstRender = false;
  }

  const replayBtn = root.querySelector("[data-replay]");
  replayBtn?.addEventListener("click", () => celebrate());

  root.querySelector("[data-reset]")?.addEventListener("click", () => {
    if (confirm("Clear all progress for this challenge?")) { state = []; save(); render(); }
  });

  render();
});

/* -------------------------------------------------
   Perfect-28 celebration: heart-confetti + badge
--------------------------------------------------*/
function celebrate() {
  if (!reduce) launchConfetti();
  showPerfectBadge();
}

function launchConfetti(duration = 4400) {
  const canvas = document.createElement("canvas");
  canvas.className = "h2h-confetti";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H;
  const resize = () => {
    W = canvas.width = innerWidth * dpr;
    H = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  };
  resize();
  addEventListener("resize", resize);

  const colors = ["#ff3b5c", "#7b5cff", "#4fe0b0", "#ffd84d", "#ff9d5c"];
  const parts = [];
  const spawn = (x, y, vx, vy) => parts.push({
    x, y, vx, vy,
    g: 0.34 * dpr,
    size: (6 + Math.random() * 9) * dpr,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.32,
    color: colors[(Math.random() * colors.length) | 0],
    heart: Math.random() < 0.55,
    life: 1,
  });
  // centre fountain
  for (let i = 0; i < 130; i++) {
    spawn(W / 2, H * 0.52, (Math.random() - 0.5) * 15 * dpr, (Math.random() * -17 - 6) * dpr);
  }
  // two bottom-corner cannons
  for (let i = 0; i < 45; i++) {
    spawn(0, H, (Math.random() * 9 + 4) * dpr, (Math.random() * -15 - 7) * dpr);
    spawn(W, H, (-Math.random() * 9 - 4) * dpr, (Math.random() * -15 - 7) * dpr);
  }

  const heartPath = (c, s) => {
    c.beginPath();
    c.moveTo(0, s * 0.3);
    c.bezierCurveTo(0, -s * 0.1, -s, -s * 0.1, -s, s * 0.35);
    c.bezierCurveTo(-s, s * 0.75, 0, s * 0.98, 0, s * 1.25);
    c.bezierCurveTo(0, s * 0.98, s, s * 0.75, s, s * 0.35);
    c.bezierCurveTo(s, -s * 0.1, 0, -s * 0.1, 0, s * 0.3);
    c.closePath();
    c.fill();
  };

  const start = performance.now();
  function frame(now) {
    const t = now - start;
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += p.g;
      p.vx *= 0.996;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (t > duration - 1300) p.life = Math.max(0, (duration - t) / 1300);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      if (p.heart) heartPath(ctx, p.size * 0.5);
      else ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
    if (t < duration) requestAnimationFrame(frame);
    else { canvas.remove(); removeEventListener("resize", resize); }
  }
  requestAnimationFrame(frame);
}

function showPerfectBadge() {
  if (document.querySelector(".h2h-celebrate")) return;
  const el = document.createElement("div");
  el.className = "h2h-celebrate";
  el.innerHTML =
    '<div class="h2h-celebrate-card" role="dialog" aria-label="Challenge complete">' +
      '<div class="h2h-ring"></div>' +
      '<svg class="h2h-heart" viewBox="0 0 32 29" aria-hidden="true"><path d="M16 29S1 20 1 9.5A8.5 8.5 0 0 1 16 4a8.5 8.5 0 0 1 15 5.5C31 20 16 29 16 29z"/></svg>' +
      '<p class="h2h-kicker">The Reset · complete</p>' +
      '<h2 class="h2h-title">Perfect 28</h2>' +
      '<p class="h2h-sub">28 days, every single one ticked. That\'s a real habit now — your heart says thanks.</p>' +
      '<button class="btn btn-primary" data-close type="button"><span>Nice</span></button>' +
    "</div>";
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("in"));

  const close = () => {
    el.classList.remove("in");
    setTimeout(() => el.remove(), 400);
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  el.addEventListener("click", (e) => {
    if (e.target === el || e.target.closest("[data-close]")) close();
  });
  document.addEventListener("keydown", onKey);
}
