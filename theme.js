/* ============================================================
   THEME.JS — Toggle mode Neon Cyberpunk (gelap) <-> Cream (terang)
   ============================================================
   File ini BERDIRI SENDIRI:
   - Tombol ⚡ di wadah tombol pojok kiri atas (bareng badge nama,
     lampu panduan, riwayat) untuk beralih ke tampilan gelap neon
     ala cyberpunk — cocok dipakai bareng dekorasi musim di seasons.js
     yang memang lebih menyala di atas latar gelap.
   - Pilihan disimpan di localStorage, jadi tetap dipakai di kunjungan
     berikutnya sampai diganti manual.
   - Perubahan warnanya sendiri didefinisikan di index.html lewat
     class ".cyberpunk-mode" pada <body> (lihat blok CSS di
     index.html) — file ini cuma mengurus tombol & penyimpanan
     pilihannya.
   ============================================================ */

const LS_THEME_KEY = "pressquiz_theme"; // "cyberpunk" | "default"

let themeBtnEl = null;

/** Wadah bersama pojok kiri atas — dipakai juga oleh progress.js,
 *  guide.js, history.js. Idempotent lewat getElementById. */
function ensureToolbar() {
  let bar = document.getElementById("top-toolbar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "top-toolbar";
    bar.className = "top-toolbar";
    document.body.appendChild(bar);
  }
  return bar;
}

function applyTheme(isCyberpunk) {
  document.body.classList.toggle("cyberpunk-mode", isCyberpunk);
  if (themeBtnEl) {
    themeBtnEl.classList.toggle("active", isCyberpunk);
    themeBtnEl.setAttribute(
      "aria-label",
      isCyberpunk ? "Ganti ke mode terang" : "Ganti ke mode neon cyberpunk"
    );
  }
}

function toggleTheme() {
  const isCyberpunk = !document.body.classList.contains("cyberpunk-mode");
  applyTheme(isCyberpunk);
  try {
    localStorage.setItem(LS_THEME_KEY, isCyberpunk ? "cyberpunk" : "default");
  } catch (e) {
    console.warn("Gagal menyimpan pilihan tema:", e);
  }
}

function renderThemeButton() {
  if (themeBtnEl) return;
  themeBtnEl = document.createElement("button");
  themeBtnEl.type = "button";
  themeBtnEl.className = "theme-btn";
  themeBtnEl.innerHTML = "⚡";
  themeBtnEl.addEventListener("click", toggleTheme);
  ensureToolbar().appendChild(themeBtnEl);
}

function injectStyles() {
  if (document.getElementById("theme-style")) return;
  const style = document.createElement("style");
  style.id = "theme-style";
  style.textContent = `
    .theme-btn{
      width:38px;height:38px;border-radius:50%;flex-shrink:0;
      background:#FFFFFF;border:1px solid rgba(70,50,25,.1);cursor:pointer;
      display:flex;align-items:center;justify-content:center;font-size:16px;
      box-shadow:0 10px 22px -10px rgba(70,50,25,.3);
      transition:transform .15s ease, box-shadow .15s ease, background .2s ease, filter .2s ease;
      filter:grayscale(1) opacity(.65);
    }
    .theme-btn:hover{transform:translateY(-1px) scale(1.05);}
    .theme-btn:active{transform:translateY(1px) scale(.94);}
    .theme-btn.active{
      filter:none;
      background:radial-gradient(circle at 35% 30%, #7df6ff, #05d9e8);
      box-shadow:0 0 0 3px rgba(5,217,232,.3), 0 10px 22px -8px rgba(5,217,232,.55);
    }
  `;
  document.head.appendChild(style);
}

function init() {
  injectStyles();
  renderThemeButton();

  let saved = "default";
  try {
    saved = localStorage.getItem(LS_THEME_KEY) || "default";
  } catch (e) {
    /* localStorage tidak tersedia — pakai default terang */
  }
  applyTheme(saved === "cyberpunk");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
