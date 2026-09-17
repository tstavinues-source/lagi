/* ============================================================
   VOCABQUIZ.JS — Kuis kosakata dari kata kunci soal
   ============================================================
   File ini BERDIRI SENDIRI (tidak menambah beban script.js):
   - Kumpulkan semua kata kunci unik dari keywordhints.js (132 kata
     yang selama ini muncul sebagai penanda jawaban di 140 soal)
   - Silangkan dengan kamus VOCAB di vocab.js untuk ambil arti,
     bentuk kamus, dan jenis katanya
   - Sajikan sebagai kuis pilihan ganda: tampilkan kata Jepang-nya,
     user pilih arti Indonesia yang benar dari 4 opsi
   - Tombol "📚" di wadah tombol pojok kiri atas untuk membuka kuis
     ini kapan saja, terpisah dari kuis Benar/Salah utama

   Cara mengaktifkan: tambahkan baris ini di index.html
     <script type="module" src="vocabquiz.js"></script>
   ============================================================ */

import { VOCAB } from "./vocab.js";
import { KEYWORD_HINTS } from "./keywordhints.js";

const QUESTIONS_PER_ROUND = 15;
const OPTIONS_PER_QUESTION = 4;

/* ============================================================
   BANGUN KOLAM KOSAKATA dari kata kunci + kamus VOCAB
   ============================================================ */

function buildVocabPool() {
  const words = new Set();
  Object.values(KEYWORD_HINTS).forEach((entry) => {
    Object.keys(entry).forEach((w) => words.add(w));
  });

  const pool = [];
  words.forEach((w) => {
    const entry = VOCAB[w];
    if (entry && entry.id) {
      pool.push({ word: w, base: entry.base, pos: entry.pos, meaning: entry.id });
    }
  });
  return pool;
}

const POS_LABEL = {
  benda: "Kata Benda",
  kerja: "Kata Kerja",
  "sifat-i": "Kata Sifat (i)",
  "sifat-na": "Kata Sifat (na)",
  partikel: "Partikel",
  lainnya: "Lainnya",
};

/* ============================================================
   STATE
   ============================================================ */

const state = {
  pool: [],
  queue: [],
  index: 0,
  score: 0,
  wrong: [],
  answered: false,
};

/* ============================================================
   AUDIO — sama seperti sfx di kuis utama, ringan & mandiri
   ============================================================ */

let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  return audioCtx;
}
function playTone(freqStart, freqEnd, duration, type, gainPeak) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(freqStart, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), now + duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainPeak, now + duration * 0.15);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}
function playCorrectSound() {
  playTone(520, 880, 0.14, "sine", 0.15);
  setTimeout(() => playTone(780, 1180, 0.18, "sine", 0.12), 90);
}
function playIncorrectSound() {
  playTone(220, 110, 0.26, "sawtooth", 0.12);
}

/* ============================================================
   LOGIKA KUIS
   ============================================================ */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildRound() {
  const pool = shuffle([...state.pool]);
  const count = Math.min(QUESTIONS_PER_ROUND, pool.length);
  state.queue = pool.slice(0, count).map((item) => {
    const distractorPool = state.pool.filter((p) => p.meaning !== item.meaning);
    shuffle(distractorPool);
    const distractors = distractorPool.slice(0, OPTIONS_PER_QUESTION - 1).map((d) => d.meaning);
    const options = shuffle([item.meaning, ...distractors]);
    return { ...item, options };
  });
  state.index = 0;
  state.score = 0;
  state.wrong = [];
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ============================================================
   UI
   ============================================================ */

let overlayEl = null;
let vocabBtnEl = null;

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

function renderVocabButton() {
  if (vocabBtnEl) return;
  vocabBtnEl = document.createElement("button");
  vocabBtnEl.type = "button";
  vocabBtnEl.className = "vocabquiz-btn";
  vocabBtnEl.setAttribute("aria-label", "Kuis kosakata kata kunci");
  vocabBtnEl.innerHTML = "📚";
  vocabBtnEl.addEventListener("click", openVocabQuiz);
  ensureToolbar().appendChild(vocabBtnEl);
}

function ensureOverlay() {
  if (overlayEl) return overlayEl;
  overlayEl = document.createElement("div");
  overlayEl.className = "vq-overlay";
  document.body.appendChild(overlayEl);
  overlayEl.addEventListener("click", (e) => {
    if (e.target.closest("[data-vq-close]")) closeVocabQuiz();
  });
  return overlayEl;
}

function openVocabQuiz() {
  if (state.pool.length < OPTIONS_PER_QUESTION) {
    alert("Kosakata belum cukup untuk membuat kuis (data belum termuat).");
    return;
  }
  buildRound();
  ensureOverlay();
  renderQuestionScreen();
  overlayEl.classList.add("show");
}

function closeVocabQuiz() {
  if (overlayEl) overlayEl.classList.remove("show");
}

function renderQuestionScreen() {
  state.answered = false;
  const total = state.queue.length;
  const current = state.queue[state.index];
  const posLabel = POS_LABEL[current.pos] || "Kosakata";
  const showBase = current.base && current.base !== current.word;

  overlayEl.innerHTML = `
    <div class="vq-modal">
      <button type="button" class="vq-close" data-vq-close="1">✕</button>
      <div class="vq-progress">Soal ${state.index + 1} / ${total} &nbsp;•&nbsp; Skor: ${state.score}</div>
      <div class="vq-pos">${escapeHtml(posLabel)}</div>
      <div class="vq-word">${escapeHtml(current.word)}</div>
      ${showBase ? `<div class="vq-base">Bentuk kamus: <b>${escapeHtml(current.base)}</b></div>` : ""}
      <div class="vq-question-label">Apa artinya dalam Bahasa Indonesia?</div>
      <div class="vq-options">
        ${current.options
          .map(
            (opt, i) =>
              `<button type="button" class="vq-option" data-idx="${i}">${escapeHtml(opt)}</button>`
          )
          .join("")}
      </div>
      <div class="vq-feedback"></div>
      <button type="button" class="vq-next" style="display:none;">Lanjut →</button>
    </div>
  `;

  overlayEl.querySelectorAll(".vq-option").forEach((btn) => {
    btn.addEventListener("click", () => handleAnswer(btn));
  });
  overlayEl.querySelector(".vq-next").addEventListener("click", nextQuestion);
}

function handleAnswer(btnEl) {
  if (state.answered) return;
  state.answered = true;

  const current = state.queue[state.index];
  const chosen = btnEl.textContent;
  const isCorrect = chosen === current.meaning;

  overlayEl.querySelectorAll(".vq-option").forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === current.meaning) btn.classList.add("correct");
    else if (btn === btnEl) btn.classList.add("incorrect");
  });

  const feedback = overlayEl.querySelector(".vq-feedback");
  if (isCorrect) {
    state.score++;
    feedback.textContent = "✓ Benar!";
    feedback.className = "vq-feedback ok";
    playCorrectSound();
  } else {
    state.wrong.push(current);
    feedback.textContent = `✗ Kurang tepat. Arti yang benar: ${current.meaning}`;
    feedback.className = "vq-feedback bad";
    playIncorrectSound();
  }
  overlayEl.querySelector(".vq-progress").textContent = `Soal ${state.index + 1} / ${state.queue.length} • Skor: ${state.score}`;
  overlayEl.querySelector(".vq-next").style.display = "block";
}

function nextQuestion() {
  state.index++;
  if (state.index >= state.queue.length) {
    renderResultScreen();
  } else {
    renderQuestionScreen();
  }
}

function renderResultScreen() {
  const total = state.queue.length;
  const percent = total ? Math.round((state.score / total) * 100) : 0;

  const wrongListHtml = state.wrong.length
    ? state.wrong
        .map(
          (w) => `
        <div class="vq-wrong-row">
          <span class="vq-wrong-word">${escapeHtml(w.word)}</span>
          <span class="vq-wrong-meaning">${escapeHtml(w.meaning)}</span>
        </div>`
        )
        .join("")
    : `<div class="vq-wrong-empty">Sempurna! Semua kosakata terjawab benar. 🎉</div>`;

  overlayEl.innerHTML = `
    <div class="vq-modal">
      <button type="button" class="vq-close" data-vq-close="1">✕</button>
      <div class="vq-result-title">📚 Hasil Kuis Kosakata</div>
      <div class="vq-result-score">${state.score} / ${total} <span>(${percent}%)</span></div>
      <div class="vq-actions">
        <button type="button" class="vq-restart">Main Lagi</button>
        <button type="button" class="vq-close-btn" data-vq-close="1">Tutup</button>
      </div>
      <div class="vq-wrong-title">Perlu diulang:</div>
      <div class="vq-wrong-list">${wrongListHtml}</div>
    </div>
  `;
  overlayEl.querySelector(".vq-restart").addEventListener("click", () => {
    buildRound();
    renderQuestionScreen();
  });
}

/* ============================================================
   STYLE
   ============================================================ */

function injectStyles() {
  if (document.getElementById("vocabquiz-style")) return;
  const style = document.createElement("style");
  style.id = "vocabquiz-style";
  style.textContent = `
    .vocabquiz-btn{
      width:38px;height:38px;border-radius:50%;flex-shrink:0;
      background:#FFFFFF;border:1px solid rgba(70,50,25,.1);cursor:pointer;
      display:flex;align-items:center;justify-content:center;font-size:16px;
      box-shadow:0 10px 22px -10px rgba(70,50,25,.3);
      transition:transform .15s ease, box-shadow .15s ease;
    }
    .vocabquiz-btn:hover{transform:translateY(-1px) scale(1.05);}
    .vocabquiz-btn:active{transform:translateY(1px) scale(.94);}

    .vq-overlay{
      position:fixed;inset:0;z-index:950;background:rgba(46,38,32,.5);
      backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;
      padding:20px;opacity:0;pointer-events:none;transition:opacity .2s ease;
    }
    .vq-overlay.show{opacity:1;pointer-events:auto;}
    .vq-modal{
      position:relative;background:#FBF3E7;border-radius:24px;padding:26px;
      max-width:400px;width:100%;max-height:85vh;overflow-y:auto;
      box-shadow:0 30px 60px -20px rgba(0,0,0,.4);
      font-family:'Segoe UI','Noto Sans JP',-apple-system,BlinkMacSystemFont,sans-serif;
      transform:scale(.94) translateY(8px);transition:transform .2s ease;
    }
    .vq-overlay.show .vq-modal{transform:scale(1) translateY(0);}
    .vq-close{
      position:absolute;top:16px;right:16px;width:26px;height:26px;border-radius:50%;
      border:none;background:rgba(70,50,25,.08);cursor:pointer;font-size:13px;color:#2E2620;
    }
    .vq-progress{font-size:11.5px;color:#7A6F5D;font-weight:700;margin-bottom:14px;}
    .vq-pos{
      display:inline-block;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
      color:#C45F3F;background:rgba(196,95,63,.1);padding:3px 10px;border-radius:999px;margin-bottom:10px;
    }
    .vq-word{font-size:26px;font-weight:800;color:#008471;margin-bottom:4px;}
    .vq-base{font-size:12px;color:#7A6F5D;margin-bottom:14px;}
    .vq-base b{color:#2E2620;}
    .vq-question-label{font-size:13px;color:#2E2620;font-weight:700;margin-bottom:12px;}
    .vq-options{display:flex;flex-direction:column;gap:10px;}
    .vq-option{
      text-align:left;padding:13px 16px;border-radius:14px;
      background:#FFFFFF;border:1.5px solid rgba(70,50,25,.12);
      font-size:13.5px;color:#2E2620;cursor:pointer;font-family:inherit;
      transition:border-color .15s ease, background .15s ease;
    }
    .vq-option:hover:not(:disabled){border-color:#008471;}
    .vq-option:disabled{cursor:default;}
    .vq-option.correct{background:rgba(18,184,134,.15);border-color:#008471;font-weight:700;}
    .vq-option.incorrect{background:rgba(196,95,63,.15);border-color:#C45F3F;}
    .vq-feedback{min-height:20px;margin-top:14px;font-size:13px;font-weight:700;}
    .vq-feedback.ok{color:#008471;}
    .vq-feedback.bad{color:#C45F3F;}
    .vq-next{
      width:100%;margin-top:14px;padding:13px;border-radius:999px;border:none;cursor:pointer;
      background:linear-gradient(160deg,#4fd6bd,#008471);color:#04241d;font-weight:800;font-size:14px;
      font-family:inherit;
    }

    .vq-result-title{font-size:18px;font-weight:800;color:#2E2620;margin-bottom:10px;}
    .vq-result-score{font-size:32px;font-weight:800;color:#008471;margin-bottom:18px;}
    .vq-result-score span{font-size:16px;color:#7A6F5D;font-weight:600;}
    .vq-actions{display:flex;gap:10px;margin-bottom:18px;}
    .vq-restart, .vq-close-btn{
      flex:1;padding:12px;border-radius:999px;border:none;cursor:pointer;font-weight:700;
      font-size:13px;font-family:inherit;
    }
    .vq-restart{background:linear-gradient(160deg,#4fd6bd,#008471);color:#04241d;}
    .vq-close-btn{background:transparent;border:1.5px solid rgba(70,50,25,.2);color:#7A6F5D;}
    .vq-wrong-title{font-size:12px;font-weight:700;color:#7A6F5D;text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px;}
    .vq-wrong-list{display:flex;flex-direction:column;gap:8px;}
    .vq-wrong-row{
      display:flex;justify-content:space-between;gap:10px;background:#FFFFFF;
      border-radius:12px;padding:10px 14px;font-size:12.5px;border-left:3px solid #C45F3F;
    }
    .vq-wrong-word{font-weight:700;color:#2E2620;}
    .vq-wrong-meaning{color:#7A6F5D;text-align:right;}
    .vq-wrong-empty{text-align:center;color:#7A6F5D;font-size:12.5px;padding:14px;}
  `;
  document.head.appendChild(style);
}

/* ============================================================
   INIT
   ============================================================ */

function init() {
  injectStyles();
  state.pool = buildVocabPool();
  renderVocabButton();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
