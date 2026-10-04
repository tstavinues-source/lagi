/* =====================================================================
   tts.js — Mode Ujian: soal DIBACAKAN (Web Speech API, bahasa Jepang)
   ---------------------------------------------------------------------
   File ini berdiri sendiri; cukup tambahkan di index.html:
     <script type="module" src="tts.js"></script>
   Fitur:
   - Bacakan soal otomatis setiap soal baru muncul (+ tombol "Baca ulang")
   - Opsi: soal disembunyikan (teks Jepang + terjemahan), sehingga hanya
     mendengarkan seperti saat shiken. Gambar soal TETAP tampil.
   - Opsi: sembunyikan lagi otomatis tiap lanjut ke soal berikutnya
   - Tombol Tampilkan/Sembunyikan untuk melihat soal yang sedang dibacakan
   - Setelah dijawab, soal otomatis ditampilkan lagi (untuk dicek)
   - Untuk Set 12-x, bacaan kanji memakai data furigana (lebih akurat)
   - Kecepatan baca: Lambat / Normal / Cepat
   ===================================================================== */
import { icon } from "./icons.js";
import { getFurigana } from "./furigana.js";

const KEY = "kuis-tts-v1";
const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
const supported = !!(synth && typeof SpeechSynthesisUtterance !== "undefined");

const opt = { read: false, hide: false, rehide: true, rate: 0.9 };
try { Object.assign(opt, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(opt)); } catch (e) {} };

let hidden = false;
let voice = null;
let qEl, indoWrap, barEl, btnHide, btnRead;

/* ---------- suara ---------- */
function pickVoice() {
  if (!supported) return;
  const vs = synth.getVoices();
  voice = vs.find((v) => /^ja[-_]JP$/i.test(v.lang)) || vs.find((v) => /^ja/i.test(v.lang)) || null;
}
if (supported) {
  pickVoice();
  synth.addEventListener?.("voiceschanged", pickVoice);
}

function spokenText() {
  const clone = qEl.cloneNode(true);
  clone.querySelectorAll("rt").forEach((n) => n.remove());
  let text = clone.textContent.trim();
  const m = (document.getElementById("q-set-badge")?.textContent || "").match(/Set\s+(\S+)\s+·\s+No\.\s*(\d+)/);
  if (m) {
    const furi = getFurigana(m[1], Number(m[2]));
    if (furi) text = furi.replace(/[一-鿿々〆]+\(([^)]*)\)/g, "$1");
  }
  return text.replace(/◯/g, "まる");
}

export function speak() {
  if (!supported || !qEl) return;
  synth.cancel();
  const text = spokenText();
  if (!text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  if (voice) u.voice = voice;
  u.rate = opt.rate;
  u.onstart = () => barEl && barEl.classList.add("speaking");
  u.onend = u.onerror = () => barEl && barEl.classList.remove("speaking");
  setTimeout(() => synth.speak(u), 60); // jeda kecil agar cancel() selesai (bug Chrome)
}
function stop() { if (supported) synth.cancel(); barEl && barEl.classList.remove("speaking"); }

/* ---------- sembunyi / tampil ---------- */
function applyHidden() {
  qEl.classList.toggle("tts-hidden", hidden);
  indoWrap && indoWrap.classList.toggle("tts-hidden-wrap", hidden);
  if (btnHide) {
    btnHide.innerHTML = icon(hidden ? "eye" : "eyeOff") + `<span class="ico-txt">${hidden ? "Tampilkan Soal" : "Sembunyikan Soal"}</span>`;
    btnHide.classList.toggle("on", hidden);
  }
}

function onNewQuestion() {
  if (opt.hide) { if (opt.rehide) hidden = true; } else hidden = false;
  applyHidden();
  if (opt.read) speak(); else stop();
}

/* ---------- UI di layar kuis ---------- */
function buildBar() {
  barEl = document.createElement("div");
  barEl.className = "tts-bar";
  barEl.innerHTML = `
    <button type="button" class="tts-btn" id="tts-read">${icon("replay")}<span class="ico-txt">Baca Soal</span></button>
    <button type="button" class="tts-btn" id="tts-hide"></button>`;
  qEl.insertAdjacentElement("beforebegin", barEl);
  btnRead = barEl.querySelector("#tts-read");
  btnHide = barEl.querySelector("#tts-hide");
  btnRead.disabled = !supported;
  btnRead.addEventListener("click", () => { if (barEl.classList.contains("speaking")) stop(); else speak(); });
  btnHide.addEventListener("click", () => { hidden = !hidden; applyHidden(); });
}

/* ---------- UI di layar awal ---------- */
function buildHomeOptions() {
  const grid = document.querySelector(".feature-grid");
  if (!grid) return;
  const wrap = document.createElement("div");
  wrap.className = "tts-home";
  wrap.innerHTML = `
    <p class="section-title feature-title">Mode Ujian (Soal Dibacakan)</p>
    <div class="tts-grid">
      <button type="button" class="feature-toggle" data-opt="read" aria-pressed="false"><span class="dot"></span><span class="label">Bacakan Soal</span></button>
      <button type="button" class="feature-toggle" data-opt="hide" aria-pressed="false"><span class="dot"></span><span class="label">Sembunyikan Soal</span></button>
      <button type="button" class="feature-toggle tts-wide" data-opt="rehide" aria-pressed="false"><span class="dot"></span><span class="label">Sembunyikan lagi tiap soal berikutnya</span></button>
      <div class="tts-rate tts-wide" role="group" aria-label="Kecepatan baca">
        <span class="tts-rate-label">${icon("speaker")}<span class="ico-txt">Kecepatan</span></span>
        <button type="button" data-rate="0.7">Lambat</button>
        <button type="button" data-rate="0.9">Normal</button>
        <button type="button" data-rate="1.1">Cepat</button>
      </div>
    </div>
    ${supported ? "" : `<p class="tts-note">Browser ini tidak mendukung suara (Web Speech). Coba Chrome / Edge / Safari.</p>`}`;
  grid.insertAdjacentElement("afterend", wrap);

  const sync = () => {
    wrap.querySelectorAll("[data-opt]").forEach((b) => {
      const on = !!opt[b.dataset.opt];
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    wrap.querySelectorAll("[data-rate]").forEach((b) => b.classList.toggle("on", Number(b.dataset.rate) === opt.rate));
    wrap.querySelector('[data-opt="rehide"]').style.opacity = opt.hide ? "1" : ".55";
  };
  wrap.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.opt) {
      opt[t.dataset.opt] = !opt[t.dataset.opt];
      if (t.dataset.opt === "read" && opt.read && supported) { // pancing izin suara dari gestur klik
        const u = new SpeechSynthesisUtterance("はい"); u.lang = "ja-JP"; u.volume = 0.4; synth.speak(u);
      }
    } else if (t.dataset.rate) opt.rate = Number(t.dataset.rate);
    save(); sync();
  });
  sync();
}

/* ---------- CSS ---------- */
function injectCss() {
  const st = document.createElement("style");
  st.id = "tts-style";
  st.textContent = `
    .tts-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:22px;}
    .tts-wide{grid-column:1 / -1;}
    .tts-note{font-size:12px;color:var(--text-mid,#7A6F5D);margin:-10px 0 18px;}
    .tts-rate{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
    .tts-rate-label{font-size:12.5px;font-weight:700;color:var(--text-mid,#7A6F5D);margin-right:4px;}
    .tts-rate button{font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;padding:8px 14px;border-radius:999px;
      border:1.5px solid rgba(70,50,25,.18);background:#fff;color:#7A6F5D;}
    .tts-rate button.on{background:var(--teal,#008471);border-color:var(--teal,#008471);color:#fff;}
    .cyberpunk-mode .tts-rate button{background:rgba(8,12,22,.85);border-color:var(--teal);color:var(--teal);}
    .cyberpunk-mode .tts-rate button.on{background:var(--teal);color:#04141a;box-shadow:0 0 12px var(--teal);}

    .tts-bar{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 12px;}
    .tts-btn{font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:2px;
      padding:8px 14px;border-radius:999px;border:1.5px solid rgba(70,50,25,.18);background:#fff;color:var(--teal,#008471);}
    .tts-btn:disabled{opacity:.4;cursor:not-allowed;}
    .tts-btn.on{background:color-mix(in srgb,var(--teal,#008471) 14%,#fff);}
    .tts-bar.speaking #tts-read{background:var(--teal,#008471);color:#fff;animation:ttsPulse 1.1s ease-in-out infinite;}
    @keyframes ttsPulse{50%{box-shadow:0 0 0 5px color-mix(in srgb,var(--teal,#008471) 25%,transparent);}}
    .cyberpunk-mode .tts-btn{background:rgba(8,12,22,.85);border-color:var(--teal);color:var(--teal);box-shadow:0 0 10px -3px var(--teal);}
    .cyberpunk-mode .tts-bar.speaking #tts-read{background:var(--teal);color:#04141a;}

    .q-japanese.tts-hidden{font-size:0 !important;line-height:0 !important;min-height:64px;display:flex;align-items:center;
      border-radius:14px;border:1.5px dashed rgba(70,50,25,.25);padding:0 16px;user-select:none;}
    .q-japanese.tts-hidden *{display:none !important;}
    .q-japanese.tts-hidden::before{content:"Soal disembunyikan — dengarkan, lalu jawab";font-size:14px;line-height:1.4;font-weight:600;color:var(--text-mid,#7A6F5D);}
    .tts-hidden-wrap{display:none !important;}
    .cyberpunk-mode .q-japanese.tts-hidden{border-color:var(--teal);}
    .cyberpunk-mode .q-japanese.tts-hidden::before{color:var(--teal);}
  `;
  document.head.appendChild(st);
}

/* ---------- init ---------- */
function init() {
  qEl = document.getElementById("q-japanese");
  if (!qEl) return;
  indoWrap = document.getElementById("q-indonesian-wrap");
  injectCss();
  buildBar();
  buildHomeOptions();
  applyHidden();

  // mulai sesi baru -> reset status sembunyi sesuai opsi (capture: jalan sebelum render pertama)
  document.addEventListener("click", (e) => {
    if (e.target.closest("#btn-start-selected, #btn-start-all, #btn-retry-wrong")) hidden = opt.hide;
    if (e.target.closest("#btn-quit-quiz, #btn-back-home")) stop();
  }, true);

  new MutationObserver(onNewQuestion).observe(qEl, { childList: true });

  // setelah dijawab -> tampilkan soal lagi supaya bisa dicek
  const fb = document.getElementById("feedback");
  if (fb) new MutationObserver(() => {
    if (/\b(ok|bad)\b/.test(fb.className) && hidden) { hidden = false; applyHidden(); }
  }).observe(fb, { attributes: true, attributeFilter: ["class"] });

  window.addEventListener("pagehide", stop);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
