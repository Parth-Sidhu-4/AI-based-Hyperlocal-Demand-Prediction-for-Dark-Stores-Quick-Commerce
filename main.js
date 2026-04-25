/* ═══════════════════════════════════════════════════════════
   MASTER SCRIPT — AI-Based Hyperlocal Demand Prediction
   ═══════════════════════════════════════════════════════════ */

// ── Page load curtain ────────────────────────────────────────
window.addEventListener("load", () => {
  document.getElementById("page-curtain").classList.add("gone");
});

// ── Custom Cursor ────────────────────────────────────────────
(function () {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  });

  function animateRing() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();
})();

// ── Progress Bar ─────────────────────────────────────────────
(function () {
  const bar = document.getElementById("progress-bar");
  window.addEventListener("scroll", () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.transform = `scaleX(${pct})`;
  }, { passive: true });
})();

// ── Nav Scroll State ─────────────────────────────────────────
(function () {
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });
})();

// ── Mobile Nav ───────────────────────────────────────────────
(function () {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileNav.classList.toggle("open");
    document.body.style.overflow = mobileNav.classList.contains("open") ? "hidden" : "";
  });

  mobileNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileNav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
})();

// ── Nav Active State ─────────────────────────────────────────
(function () {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.remove("active"));
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add("active");
      }
    });
  }, { threshold: 0.3 });

  sections.forEach((s) => obs.observe(s));
})();

// ── Scroll Reveal ────────────────────────────────────────────
(function () {
  const els = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  els.forEach((el) => obs.observe(el));
})();

// ── Smooth Anchor Scroll ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ── Magnetic Buttons ─────────────────────────────────────────
document.querySelectorAll(".magnetic").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.18;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "";
  });
});

// ── Starfield ────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, stars = [];
  const N = 240;

  function resize() {
    W = canvas.width = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < N; i++) {
      const size = Math.random() * 1.5 + 0.3;
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size,
        speed: (Math.random() * 0.12 + 0.03) * (Math.random() > 0.5 ? 1 : -1),
        drift: (Math.random() * 0.06 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        opacity: Math.random() * 0.7 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach((s) => {
      s.twinkle += s.twinkleSpeed;
      const alpha = s.opacity * (0.7 + 0.3 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,235,226,${alpha})`;
      ctx.fill();

      if (s.size > 1.2) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2.5);
        grad.addColorStop(0, `rgba(212,175,55,${alpha * 0.3})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fill();
      }

      s.y += s.speed;
      s.x += s.drift * 0.3;
      if (s.y < -2) s.y = H + 2;
      if (s.y > H + 2) s.y = -2;
      if (s.x < -2) s.x = W + 2;
      if (s.x > W + 2) s.x = -2;
    });
    requestAnimationFrame(draw);
  }

  resize();
  initStars();
  draw();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); initStars(); }, 250);
  });
})();

// ── Counter Animation ─────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1800;
    const start = Date.now();
    const tick = () => {
      const t = Math.min((Date.now() - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = target * eased;
      el.textContent = (Number.isInteger(target) ? Math.floor(val) : val.toFixed(2)) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    tick();
  });
}

const counterSection = document.querySelector(".dataset-stats-row");
if (counterSection) {
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
  }, { threshold: 0.4 });
  obs.observe(counterSection);
}

// ══════════════════════════════════════════════════════════════
// CHART DRAWING FUNCTIONS (Gold / Ivory / Void palette)
// ══════════════════════════════════════════════════════════════

const GOLD   = "#D4AF37";
const GOLD_L = "#E8C97A";
const TEAL   = "#19C0BA";
const RED    = "#B8392A";
const IVORY  = "rgba(240,235,226,0.8)";
const DIM    = "rgba(240,235,226,0.25)";
const GRID   = "rgba(191,155,48,0.07)";
const MONO   = "'Syne', sans-serif";

function dpiCanvas(canvas, h) {
  const dpr = devicePixelRatio || 1;
  const W = canvas.offsetWidth;
  canvas.width = W * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return { ctx, W, H: h };
}

// ── Censoring Chart ───────────────────────────────────────────
function drawCensoringChart() {
  const canvas = document.getElementById("censoringChart");
  if (!canvas) return;
  const { ctx, W, H } = dpiCanvas(canvas, 280);

  const days = 30;
  const trueDemand = [
    18, 22, 25, 30, 14, 8, 35, 40, 28, 32, 19, 24, 29, 36, 20,
    10, 42, 45, 31, 38, 22, 27, 33, 40, 18, 12, 38, 44, 30, 36,
  ];
  const stockoutDays = [5, 6, 14, 15, 24, 25];
  const observed = trueDemand.map((v, i) =>
    stockoutDays.includes(i) ? Math.round(v * 0.45) : v
  );

  const pad = { top: 24, right: 24, bottom: 40, left: 44 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;
  const maxV = 52;

  const xP = (i) => pad.left + (i / (days - 1)) * cw;
  const yP = (v) => pad.top + ch - (v / maxV) * ch;

  stockoutDays.forEach((d) => {
    const bw = cw / days;
    ctx.fillStyle = "rgba(184,57,42,0.1)";
    ctx.fillRect(xP(d) - bw / 2, pad.top, bw, ch);
  });

  [10, 20, 30, 40, 50].forEach((v) => {
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, yP(v));
    ctx.lineTo(pad.left + cw, yP(v));
    ctx.stroke();
    ctx.fillStyle = DIM;
    ctx.font = `10px ${MONO}`;
    ctx.fillText(v, pad.left - 32, yP(v) + 4);
  });

  ctx.beginPath();
  trueDemand.forEach((v, i) => i === 0 ? ctx.moveTo(xP(i), yP(v)) : ctx.lineTo(xP(i), yP(v)));
  ctx.lineTo(xP(days - 1), yP(0));
  ctx.lineTo(xP(0), yP(0));
  ctx.closePath();
  ctx.fillStyle = "rgba(191,155,48,0.07)";
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  trueDemand.forEach((v, i) => i === 0 ? ctx.moveTo(xP(i), yP(v)) : ctx.lineTo(xP(i), yP(v)));
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = TEAL;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.setLineDash([5, 4]);
  observed.forEach((v, i) => i === 0 ? ctx.moveTo(xP(i), yP(v)) : ctx.lineTo(xP(i), yP(v)));
  ctx.stroke();
  ctx.setLineDash([]);

  stockoutDays.forEach((d) => {
    ctx.beginPath();
    ctx.arc(xP(d), yP(trueDemand[d]), 4, 0, Math.PI * 2);
    ctx.fillStyle = GOLD;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(xP(d), yP(observed[d]), 4, 0, Math.PI * 2);
    ctx.fillStyle = RED;
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(184,57,42,0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.moveTo(xP(d), yP(trueDemand[d]));
    ctx.lineTo(xP(d), yP(observed[d]));
    ctx.stroke();
    ctx.setLineDash([]);
  });

  ctx.fillStyle = DIM;
  ctx.font = `9px ${MONO}`;
  [0, 7, 14, 21, 29].forEach((i) => ctx.fillText(`D${i + 1}`, xP(i) - 10, H - 8));
}

// ── Diurnal Chart ─────────────────────────────────────────────
function drawDiurnalChart() {
  const canvas = document.getElementById("diurnalChart");
  if (!canvas) return;
  const { ctx, W, H } = dpiCanvas(canvas, 180);

  const hours = Array.from({ length: 16 }, (_, i) => i + 6);
  const rates = [2, 3, 4, 6, 8, 12, 10, 14, 16, 18, 20, 22, 24, 25, 26, 22];
  const maxR = 30;
  const pad = { top: 16, right: 16, bottom: 36, left: 42 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;
  const bw = cw / hours.length - 3;

  [10, 20, 30].forEach((v) => {
    const y = pad.top + ch - (v / maxR) * ch;
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + cw, y);
    ctx.stroke();
    ctx.fillStyle = "rgba(191,155,48,0.5)";
    ctx.font = `9px ${MONO}`;
    ctx.fillText(v + "%", pad.left - 36, y + 3);
  });

  hours.forEach((h, i) => {
    const x = pad.left + i * (cw / hours.length);
    const bh = (rates[i] / maxR) * ch;
    const y = pad.top + ch - bh;
    const alpha = 0.3 + (rates[i] / maxR) * 0.7;
    ctx.fillStyle = `rgba(184,57,42,${alpha})`;
    ctx.fillRect(x + 1, y, bw, bh);
    ctx.fillStyle = DIM;
    ctx.font = `8px ${MONO}`;
    ctx.fillText(h + "h", x + 1, H - 6);
  });
}

// ── Power Law Chart ───────────────────────────────────────────
function drawPowerLawChart() {
  const canvas = document.getElementById("powerLawChart");
  if (!canvas) return;
  const { ctx, W, H } = dpiCanvas(canvas, 180);

  const pad = { top: 16, right: 16, bottom: 36, left: 42 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;
  const N = 100;

  ctx.beginPath();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2.5;
  for (let i = 0; i < N; i++) {
    const xn = i / N;
    const x = pad.left + xn * cw;
    const raw = Math.pow(xn * 0.95 + 0.05, -2.83 / 3.5);
    const yn = Math.min(raw / 12, 1);
    const y = pad.top + ch - yn * ch;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const xn = i / N;
    const x = pad.left + xn * cw;
    const raw = Math.pow(xn * 0.95 + 0.05, -2.83 / 3.5);
    const yn = Math.min(raw / 12, 1);
    const y = pad.top + ch - yn * ch;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.lineTo(pad.left + cw, pad.top + ch);
  ctx.lineTo(pad.left, pad.top + ch);
  ctx.closePath();
  ctx.fillStyle = "rgba(191,155,48,0.06)";
  ctx.fill();

  const x20 = pad.left + 0.2 * cw;
  ctx.strokeStyle = "rgba(25,192,186,0.7)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(x20, pad.top);
  ctx.lineTo(x20, pad.top + ch);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = TEAL;
  ctx.font = `9px ${MONO}`;
  ctx.fillText("Top 20% SKUs", x20 + 4, pad.top + 14);
  ctx.fillText("→ 51.8% volume", x20 + 4, pad.top + 26);

  ctx.fillStyle = DIM;
  ctx.font = `9px ${MONO}`;
  ctx.fillText("α = 2.83", pad.left + 4, pad.top + 14);
  ctx.fillText("SKU Rank →", pad.left + cw - 72, pad.top + ch + 26);
}

// ── Stage 1 Results Chart ─────────────────────────────────────
function drawS1Chart() {
  const canvas = document.getElementById("s1ResultsChart");
  if (!canvas) return;
  const { ctx, W, H } = dpiCanvas(canvas, 280);

  const models = ["TimesNet\n(Paper)", "DLinear\n(Paper)", "Random\nForest", "XGBoost", "LightGBM\n(Ours)"];
  const wapes  = [27.62, 29.99, 28.5, 28.52, 27.83];
  const colors = [
    "rgba(200,192,180,0.5)", "rgba(200,192,180,0.5)",
    "rgba(25,192,186,0.65)", "rgba(25,192,186,0.65)", "rgba(191,155,48,0.9)",
  ];

  const pad = { top: 28, right: 20, bottom: 60, left: 52 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;
  const minW = 25, maxW = 35;
  const bw = cw / models.length - 16;

  [26, 28, 30, 32, 34].forEach((v) => {
    const y = pad.top + ch - ((v - minW) / (maxW - minW)) * ch;
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + cw, y);
    ctx.stroke();
    ctx.fillStyle = DIM;
    ctx.font = `9px ${MONO}`;
    ctx.fillText(v + "%", 2, y + 4);
  });

  models.forEach((m, i) => {
    const x = pad.left + i * (cw / models.length) + 8;
    const bh = ((wapes[i] - minW) / (maxW - minW)) * ch;
    const y = pad.top + ch - bh;

    ctx.fillStyle = colors[i];
    ctx.fillRect(x, y, bw, bh);

    if (i === 4) {
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, bw, bh);
      ctx.fillStyle = GOLD_L;
      ctx.font = `bold 10px ${MONO}`;
      ctx.fillText("★ BEST", x + bw / 2 - 20, y - 10);
    }

    ctx.fillStyle = IVORY;
    ctx.font = `9px ${MONO}`;
    ctx.fillText(wapes[i] + "%", x + bw / 2 - 14, y - 3);

    ctx.fillStyle = DIM;
    ctx.font = `9px ${MONO}`;
    m.split("\n").forEach((l, li) =>
      ctx.fillText(l, x + bw / 2 - ctx.measureText(l).width / 2, pad.top + ch + 16 + li * 13)
    );
  });
}

// ── Stage 2 Results Chart ─────────────────────────────────────
function drawS2Chart() {
  const canvas = document.getElementById("s2ResultsChart");
  if (!canvas) return;
  const { ctx, W, H } = dpiCanvas(canvas, 280);

  const h   = [1, 2, 3, 4, 5, 6, 7];
  const lgb = [28.16, 28.58, 29.27, 29.27, 29.89, 30.31, 30.05];
  const mlp = [29.23, 29.67, 30.32, 30.91, 31.35, 31.23, 32.14];
  const ens = [28.09, 28.49, 29.15, 29.24, 29.88, 30.2, 30.05];
  const ssa = [39.94, 39.94, 39.94, 39.94, 39.94, 39.94, 39.94];

  const pad  = { top: 20, right: 96, bottom: 48, left: 52 };
  const cw   = W - pad.left - pad.right;
  const ch   = H - pad.top - pad.bottom;
  const minY = 26, maxY = 42;

  const xP = (i) => pad.left + (i / (h.length - 1)) * cw;
  const yP = (v) => pad.top + ch - ((v - minY) / (maxY - minY)) * ch;

  [28, 30, 32, 34, 36, 38, 40].forEach((v) => {
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, yP(v));
    ctx.lineTo(pad.left + cw, yP(v));
    ctx.stroke();
    ctx.fillStyle = DIM;
    ctx.font = `9px ${MONO}`;
    ctx.fillText(v + "%", 2, yP(v) + 4);
  });

  const series = [
    { data: ssa, color: "rgba(200,192,180,0.4)", dash: [6, 4], label: "SSA" },
    { data: mlp, color: "rgba(25,192,186,0.8)",  dash: [4, 3], label: "MLP" },
    { data: lgb, color: "rgba(191,155,48,0.85)", dash: [],      label: "LightGBM" },
    { data: ens, color: GOLD_L,                  dash: [],      label: "Ensemble", bold: true },
  ];

  series.forEach((s) => {
    ctx.beginPath();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.bold ? 3 : 2;
    ctx.lineJoin = "round";
    ctx.setLineDash(s.dash);
    s.data.forEach((v, i) => i === 0 ? ctx.moveTo(xP(i), yP(v)) : ctx.lineTo(xP(i), yP(v)));
    ctx.stroke();
    ctx.setLineDash([]);

    const lx = xP(s.data.length - 1);
    const ly = yP(s.data[s.data.length - 1]);
    ctx.fillStyle = s.color;
    ctx.font = `9px ${MONO}`;
    ctx.fillText(s.label, lx + 6, ly + 4);
  });

  ens.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(xP(i), yP(v), 4, 0, Math.PI * 2);
    ctx.fillStyle = GOLD_L;
    ctx.fill();
  });

  h.forEach((hv, i) => {
    ctx.fillStyle = DIM;
    ctx.font = `9px ${MONO}`;
    ctx.fillText("h=" + hv, xP(i) - 10, pad.top + ch + 18);
  });
}

// ── Initialize all charts ─────────────────────────────────────
function initCharts() {
  drawCensoringChart();
  drawDiurnalChart();
  drawPowerLawChart();
  drawS1Chart();
  drawS2Chart();
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initCharts, 350);
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initCharts, 250);
  });
});
