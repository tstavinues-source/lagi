/* ============================================================
   GUIDE.JS — Panduan fitur (balon komentar) + tombol lampu
   ============================================================
   File ini BERDIRI SENDIRI (tidak perlu diimpor/dipanggil apa pun
   dari script.js) — cukup ditambahkan sebagai file baru sejajar
   dengan index.html, dan otomatis:
   - Menampilkan panduan balon komentar SEKALI secara otomatis saat
     pertama kali web dibuka (ditandai lewat localStorage)
   - Menyediakan tombol lampu di pojok kiri atas (di sebelah badge
     nama dari progress.js, kalau ada) untuk menyalakan/mematikan
     panduan kapan saja
   - Balon komentar otomatis menyesuaikan layar yang sedang aktif
     (Beranda / Kuis / Hasil) lewat MutationObserver

   Supaya file ini AKTIF, tambahkan baris ini ke index.html
   (sebelum atau sesudah tag <script src="script.js">):
     <script type="module" src="guide.js"></script>

   Cara menambah/mengubah teks panduan: edit array GUIDE_STEPS
   di bawah, tidak perlu sentuh file lain.
   ============================================================ */

const LS_GUIDE_SEEN_KEY = "pressquiz_guide_seen";

/* ============================================================
   ISI PANDUAN — silakan edit/tambah sesuai kebutuhan
   ============================================================ */

const GUIDE_STEPS = [
  // --- Layar Beranda ---
  {
    screen: "screen-home",
    selector: "#set-picker",
    placement: "bottom",
    text: "Centang satu atau beberapa Set soal yang mau kamu pelajari di sini.",
  },
  {
    screen: "screen-home",
    selector: "#toggle-study",
    placement: "top",
    text: "Nyalakan supaya terjemahan Indonesia langsung terlihat sebelum kamu menjawab.",
  },
  {
    screen: "screen-home",
    selector: "#toggle-keywords",
    placement: "top",
    text: "Nyalakan supaya kata kunci penanda jawaban langsung terlihat sebelum menjawab.",
  },
  {
    screen: "screen-home",
    selector: "#toggle-order",
    placement: "top",
    text: "Klik untuk memilih urutan soal: Berurutan (Set A → G) atau Acak.",
  },
  {
    screen: "screen-home",
    selector: "#btn-start-selected",
    placement: "top",
    text: "Mulai kuis hanya dari Set yang sudah kamu centang di atas.",
  },
  {
    screen: "screen-home",
    selector: "#btn-start-all",
    placement: "top",
    text: "Atau langsung latihan semua soal dari semua Set sekaligus.",
  },
  {
    screen: "screen-home",
    selector: ".corner-badge",
    placement: "bottom",
    text: "Ini namamu. Klik kapan saja untuk menggantinya — progresmu tetap tersimpan.",
  },

  // --- Layar Kuis ---
  {
    screen: "screen-quiz",
    selector: "#q-japanese",
    placement: "bottom",
    text: "Ini soal berbahasa Jepang. Kata yang bergaris putus-putus bisa diklik untuk melihat artinya.",
  },
  {
    screen: "screen-quiz",
    selector: ".answer-row",
    placement: "top",
    text: "Pilih jawabanmu di sini: BENAR atau SALAH.",
  },
  {
    screen: "screen-quiz",
    selector: "#feedback",
    placement: "bottom",
    text: "Setelah menjawab, penjelasan lengkap beserta kata kuncinya akan muncul di bawah sini.",
  },
  {
    screen: "screen-quiz",
    selector: ".progress-bar",
    placement: "bottom",
    text: "Menunjukkan sudah sampai soal keberapa kamu dalam sesi ini.",
  },

  // --- Layar Hasil ---
  {
    screen: "screen-result",
    selector: "#result-ring",
    placement: "bottom",
    text: "Persentase jawaban benarmu di sesi ini.",
  },
  {
    screen: "screen-result",
    selector: "#btn-retry-wrong",
    placement: "top",
    text: "Klik untuk mengulangi khusus soal-soal yang tadi salah.",
  },
];

/* ============================================================
   STATE
   ============================================================ */

let guideActive = false;
let bubbleEls = [];
let lightbulbEl = null;

/* ============================================================
   RENDER BALON KOMENTAR
   ============================================================ */

function getActiveScreenId() {
  const active = document.querySelector(".screen.active");
  return active ? active.id : null;
}

function clearBubbles() {
  bubbleEls.forEach((b) => b.remove());
  bubbleEls = [];
}

function positionBubble(bubble, targetEl, placement) {
  const rect = targetEl.getBoundingClientRect();
  const bw = bubble.offsetWidth;
  const bh = bubble.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top, left;
  if (placement === "top") {
    top = rect.top - bh - 12;
    left = rect.left + rect.width / 2 - bw / 2;
    if (top < 8) {
      top = rect.bottom + 12;
      bubble.classList.add("arrow-top");
      bubble.classList.remove("arrow-bottom");
    } else {
      bubble.classList.add("arrow-bottom");
      bubble.classList.remove("arrow-top");
    }
  } else {
    top = rect.bottom + 12;
    left = rect.left + rect.width / 2 - bw / 2;
    if (top + bh > vh - 8) {
      top = rect.top - bh - 12;
      bubble.classList.add("arrow-bottom");
      bubble.classList.remove("arrow-top");
    } else {
      bubble.classList.add("arrow-top");
      bubble.classList.remove("arrow-bottom");
    }
  }
  left = Math.max(8, Math.min(left, vw - bw - 8));
  top = Math.max(8, Math.min(top, vh - bh - 8));

  bubble.style.left = `${left}px`;
  bubble.style.top = `${top}px`;

  // posisi anak panah supaya tetap mengarah ke tengah target, bukan tengah bubble
  const arrowLeft = Math.max(14, Math.min(rect.left + rect.width / 2 - left, bw - 14));
  bubble.style.setProperty("--arrow-left", `${arrowLeft}px`);
}

function renderBubblesForCurrentScreen() {
  clearBubbles();
  if (!guideActive) return;

  const screenId = getActiveScreenId();
  if (!screenId) return;

  const steps = GUIDE_STEPS.filter((s) => s.screen === screenId);
  steps.forEach((step) => {
    const target = document.querySelector(step.selector);
    if (!target || target.offsetParent === null) return; // elemen tidak ada / tidak terlihat

    const bubble = document.createElement("div");
    bubble.className = "guide-bubble";
    bubble.innerHTML = `<div class="guide-bubble-text">${escapeHtml(step.text)}</div>`;
    document.body.appendChild(bubble);
    bubbleEls.push(bubble);

    // ring highlight di sekeliling elemen target
    target.classList.add("guide-highlight");
    bubble._targetEl = target;

    requestAnimationFrame(() => {
      positionBubble(bubble, target, step.placement || "bottom");
      bubble.classList.add("show");
    });
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function clearHighlights() {
  document.querySelectorAll(".guide-highlight").forEach((el) => el.classList.remove("guide-highlight"));
}

/* ============================================================
   TOGGLE LAMPU
   ============================================================ */

function setGuideActive(active) {
  guideActive = active;
  if (lightbulbEl) lightbulbEl.classList.toggle("active", active);
  if (active) {
    renderBubblesForCurrentScreen();
  } else {
    clearBubbles();
    clearHighlights();
  }
}

function positionLightbulb() {
  if (!lightbulbEl) return;
  const corner = document.querySelector(".corner-badge");
  if (corner) {
    const rect = corner.getBoundingClientRect();
    lightbulbEl.style.top = `${rect.top}px`;
    lightbulbEl.style.left = `${rect.right + 10}px`;
  } else {
    lightbulbEl.style.top = "14px";
    lightbulbEl.style.left = "14px";
  }
}

function renderLightbulb() {
  if (lightbulbEl) return;
  lightbulbEl = document.createElement("button");
  lightbulbEl.type = "button";
  lightbulbEl.className = "guide-lightbulb";
  lightbulbEl.setAttribute("aria-label", "Tampilkan / sembunyikan panduan fitur");
  lightbulbEl.innerHTML = `💡`;
  lightbulbEl.addEventListener("click", () => setGuideActive(!guideActive));
  document.body.appendChild(lightbulbEl);
  positionLightbulb();
}

/* ============================================================
   PANTAU PERUBAHAN LAYAR & DOM
   ============================================================ */

function watchScreenChanges() {
  document.querySelectorAll(".screen").forEach((screenEl) => {
    const observer = new MutationObserver(() => {
      if (guideActive) renderBubblesForCurrentScreen();
    });
    observer.observe(screenEl, { attributes: true, attributeFilter: ["class"] });
  });
}

function watchSetPickerAndBadge(retries = 20) {
  const picker = document.getElementById("set-picker");
  const corner = document.querySelector(".corner-badge");
  if (!picker || !corner) {
    if (retries > 0) {
      setTimeout(() => watchSetPickerAndBadge(retries - 1), 250);
      return;
    }
  }
  positionLightbulb();
  if (guideActive) renderBubblesForCurrentScreen();

  if (picker) {
    const obs1 = new MutationObserver(() => {
      if (guideActive) renderBubblesForCurrentScreen();
    });
    obs1.observe(picker, { childList: true });
  }
  if (corner) {
    const obs2 = new MutationObserver(() => positionLightbulb());
    obs2.observe(corner, { childList: true, characterData: true, subtree: true });
  }
}

window.addEventListener("resize", () => {
  positionLightbulb();
  if (guideActive) renderBubblesForCurrentScreen();
});

/* ============================================================
   STYLE
   ============================================================ */

function injectStyles() {
  if (document.getElementById("guide-style")) return;
  const style = document.createElement("style");
  style.id = "guide-style";
  style.textContent = `
    .guide-lightbulb{
      position:fixed;z-index:500;width:38px;height:38px;border-radius:50%;
      background:#FFFFFF;border:1px solid rgba(70,50,25,.1);cursor:pointer;
      display:flex;align-items:center;justify-content:center;font-size:17px;
      box-shadow:0 10px 22px -10px rgba(70,50,25,.3);
      transition:transform .15s ease, box-shadow .15s ease, background .2s ease;
      filter:grayscale(1) opacity(.6);
    }
    .guide-lightbulb:hover{transform:translateY(-1px) scale(1.05);}
    .guide-lightbulb:active{transform:translateY(1px) scale(.94);}
    .guide-lightbulb.active{
      filter:none;
      background:radial-gradient(circle at 35% 30%, #fff6d0, var(--sun, #F4D242));
      box-shadow:0 0 0 3px rgba(244,210,66,.35), 0 10px 22px -8px rgba(244,210,66,.5);
    }

    .guide-highlight{
      position:relative;z-index:210 !important;
      box-shadow:0 0 0 3px color-mix(in srgb, var(--sun, #F4D242) 80%, transparent),
        0 0 0 7px color-mix(in srgb, var(--sun, #F4D242) 30%, transparent) !important;
      border-radius:16px;
      transition:box-shadow .2s ease;
    }

    .guide-bubble{
      position:fixed;z-index:220;max-width:230px;
      background:#2E2620;color:#FBF3E7;
      border-radius:14px;padding:10px 14px;
      font-family:'Segoe UI','Noto Sans JP',-apple-system,BlinkMacSystemFont,sans-serif;
      font-size:12.5px;line-height:1.5;font-weight:600;
      box-shadow:0 14px 28px -10px rgba(0,0,0,.4);
      opacity:0;transform:translateY(4px) scale(.96);
      transition:opacity .18s ease, transform .18s ease;
      pointer-events:none;
      --arrow-left:20px;
    }
    .guide-bubble.show{opacity:1;transform:translateY(0) scale(1);}
    .guide-bubble::after{
      content:"";position:absolute;left:var(--arrow-left);
      width:0;height:0;border:7px solid transparent;
    }
    .guide-bubble.arrow-top::after{
      top:-13px;border-bottom-color:#2E2620;
    }
    .guide-bubble.arrow-bottom::after{
      bottom:-13px;border-top-color:#2E2620;
    }
  `;
  document.head.appendChild(style);
}

/* ============================================================
   INIT
   ============================================================ */

function init() {
  injectStyles();
  renderLightbulb();
  watchScreenChanges();
  watchSetPickerAndBadge();

  const alreadySeen = localStorage.getItem(LS_GUIDE_SEEN_KEY);
  if (!alreadySeen) {
    localStorage.setItem(LS_GUIDE_SEEN_KEY, "1");
    setTimeout(() => setGuideActive(true), 600); // beri jeda supaya elemen lain selesai render
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
