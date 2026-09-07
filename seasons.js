/* ============================================================
   SEASONS.JS — Dekorasi musim (Haru/Natsu/Aki/Fuyu) bergantian
   ============================================================
   File ini BERDIRI SENDIRI (tidak menyentuh script.js sama sekali):
   - Setiap kali halaman dibuka, satu musim dipilih ACAK dari 4
     musim Jepang: 🌸 Haru (semi), ✨ Natsu (panas), 🍁 Aki (gugur),
     ❄️ Fuyu (dingin)
   - Menampilkan badge kecil "MUSIM: ..." di header
   - Partikel musim (kelopak/kilau/daun/salju) melayang di latar
     belakang — jatuh perlahan untuk Haru/Aki/Fuyu, berkelip untuk
     Natsu (meniru bintang/kilau musim panas)
   - Menggantikan dekorasi sakura statis yang lama (yang sebelumnya
     langsung ditulis di index.html) dengan sistem yang lebih hidup

   Supaya file ini AKTIF, tambahkan baris ini di index.html:
     <script type="module" src="seasons.js"></script>

   Cara mengubah/menambah musim: edit array SEASONS di bawah.
   ============================================================ */

const SEASONS = [
  {
    id: "haru",
    name: "Haru (Semi)",
    emoji: "🌸",
    icons: ["🌸", "💮"],
    glow: "#ffb7c5",
    badgeBg: "#FFC0C0",
    mode: "fall",
  },
  {
    id: "natsu",
    name: "Natsu (Panas)",
    emoji: "✨",
    icons: ["✨", "⭐", "✦"],
    glow: "#F4D242",
    badgeBg: "#F4D242",
    mode: "blink",
  },
  {
    id: "aki",
    name: "Aki (Gugur)",
    emoji: "🍁",
    icons: ["🍁", "🍂"],
    glow: "#E07A47",
    badgeBg: "#E07A47",
    mode: "fall",
  },
  {
    id: "fuyu",
    name: "Fuyu (Dingin)",
    emoji: "❄️",
    icons: ["❄️", "❅", "❆"],
    glow: "#80B0E8",
    badgeBg: "#80B0E8",
    mode: "fall",
  },
];

const FALL_PARTICLE_COUNT = 14;
const BLINK_PARTICLE_COUNT = 22;

/* ============================================================
   PILIH MUSIM & BUAT BADGE
   ============================================================ */

function pickSeason() {
  return SEASONS[Math.floor(Math.random() * SEASONS.length)];
}

function renderSeasonBadge(season) {
  const header = document.querySelector(".app-header");
  if (!header) return;

  const badge = document.createElement("div");
  badge.className = "season-badge";
  badge.style.setProperty("--season-color", season.badgeBg);
  badge.innerHTML = `MUSIM: <span>${season.emoji} ${escapeHtml(season.name)}</span>`;

  // taruh tepat setelah status Firebase kalau ada, atau di akhir header
  const fbStatus = header.querySelector(".fb-status");
  if (fbStatus && fbStatus.parentNode) {
    fbStatus.insertAdjacentElement("afterend", badge);
  } else {
    header.appendChild(badge);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ============================================================
   PARTIKEL
   ============================================================ */

function buildParticleLayer(season) {
  const layer = document.createElement("div");
  layer.className = "season-particle-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.prepend(layer);

  const count = season.mode === "blink" ? BLINK_PARTICLE_COUNT : FALL_PARTICLE_COUNT;
  for (let i = 0; i < count; i++) {
    layer.appendChild(makeParticle(season, i));
  }
}

function makeParticle(season, index) {
  const el = document.createElement("span");
  el.className = `season-particle season-${season.mode}`;
  el.textContent = season.icons[Math.floor(Math.random() * season.icons.length)];
  el.style.color = season.glow;
  el.style.textShadow = `0 0 10px ${season.glow}, 0 0 18px ${season.glow}`;

  if (season.mode === "blink") {
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = `${Math.random() * 100}vh`;
    el.style.fontSize = `${(Math.random() * 1.1 + 0.6).toFixed(2)}rem`;
    el.style.animationDuration = `${(Math.random() * 2 + 1.5).toFixed(2)}s`;
    el.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;
  } else {
    el.style.left = `${Math.random() * 100}vw`;
    el.style.fontSize = `${(Math.random() * 1 + 0.9).toFixed(2)}rem`;
    const fallDuration = (Math.random() * 6 + 9).toFixed(2); // 9-15s, cukup pelan
    const swayDuration = (Math.random() * 2 + 1.8).toFixed(2);
    el.style.animationName = "seasonFall, seasonSway";
    el.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    el.style.animationTimingFunction = "linear, ease-in-out";
    el.style.animationIterationCount = "infinite, infinite";
    el.style.animationDirection = "normal, alternate";
    el.style.animationDelay = `${(Math.random() * 10).toFixed(2)}s, ${(Math.random() * 2).toFixed(2)}s`;
  }
  el.style.opacity = (Math.random() * 0.5 + 0.4).toFixed(2);
  return el;
}

/* ============================================================
   STYLE
   ============================================================ */

function injectStyles() {
  if (document.getElementById("season-style")) return;
  const style = document.createElement("style");
  style.id = "season-style";
  style.textContent = `
    .season-badge{
      display:inline-block;margin-top:10px;margin-left:8px;
      padding:6px 14px;border-radius:999px;font-size:11px;font-weight:700;
      letter-spacing:.04em;color:#2E2620;
      background:#FFFFFF;
      border:1.5px solid color-mix(in srgb, var(--season-color, #999) 55%, transparent);
      box-shadow:0 8px 18px -10px color-mix(in srgb, var(--season-color, #999) 60%, transparent);
    }
    .season-badge span{color:color-mix(in srgb, var(--season-color, #999) 75%, black 15%);}

    .season-particle-layer{
      position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;
    }
    .season-particle{
      position:absolute;top:-8vh;user-select:none;pointer-events:none;
      will-change:transform, opacity;
    }
    .season-particle.season-blink{
      top:auto;animation-name:seasonBlink;
      animation-timing-function:ease-in-out;animation-iteration-count:infinite;
      animation-direction:alternate;
    }

    @keyframes seasonFall{
      0%{ transform:translateY(-8vh); }
      100%{ transform:translateY(112vh); }
    }
    @keyframes seasonSway{
      0%{ margin-left:-22px; }
      100%{ margin-left:22px; }
    }
    @keyframes seasonBlink{
      0%, 100%{ opacity:.15; transform:scale(.7); }
      50%{ opacity:1; transform:scale(1.3); }
    }

    @media (max-width:480px){
      .season-badge{margin-left:0;margin-top:8px;}
    }
  `;
  document.head.appendChild(style);
}

/* ============================================================
   INIT
   ============================================================ */

function init() {
  injectStyles();
  const season = pickSeason();
  renderSeasonBadge(season);
  buildParticleLayer(season);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
