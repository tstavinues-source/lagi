/* ============================================================
   HISTORY.JS — Log riwayat latihan (berapa kali & perkembangannya)
   ============================================================
   File ini BERDIRI SENDIRI (tidak menambah beban script.js):
   - Mencatat SETIAP sesi kuis yang selesai (baik putaran penuh
     satu Set, gabungan beberapa Set, semua soal, maupun sesi
     "Ulangi Soal yang Salah") — supaya "berapa kali latihan"
     terhitung dari SEMUA jenis sesi, bukan cuma yang lengkap.
   - Setiap entri berisi: waktu, Set apa saja yang dikerjakan,
     jumlah soal, jumlah benar, dan persentase.
   - Disimpan ke localStorage (utama, instan, tahan restart —
     lihat catatan bug di progress.js) + disinkronkan ke Firestore
     di latar belakang sebagai cadangan/lintas-perangkat.
   - Tombol 📊 di pojok kiri atas (menyesuaikan posisi di sebelah
     badge nama / tombol panduan yang sudah ada) membuka panel
     riwayat: total latihan + daftar sesi terbaru, dengan tanda
     ▲/▼ dibanding sesi sebelumnya untuk kombinasi Set yang sama —
     supaya kelihatan apakah ada peningkatan atau belum.

   Cara pakai di script.js (sudah ditambahkan):
     import { recordHistoryEntry } from "./history.js";
     ...
     recordHistoryEntry(state.queue, state.wrong); // panggil di finishQuiz()

   Memakai UID yang SAMA dengan progress.js (localStorage key
   "pressquiz_uid") supaya riwayat & progres nyambung ke user yang
   sama tanpa perlu koordinasi khusus antar file.
   ============================================================ */

import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db, ensureAuthReady } from "./firebase-shared.js";
// ^ Koneksi Firebase sekarang BERSAMA (satu app, satu login anonim) —
//   lihat firebase-shared.js. Sebelumnya file ini bikin app terpisah
//   ("quizHistoryApp") dengan login anonimnya sendiri (ini yang ketiga,
//   bareng script.js & progress.js) — tiga proses login paralel setiap
//   buka halaman itu salah satu penyebab utama data terasa lama diambil.

const MAX_ENTRIES = 100; // batas jumlah riwayat yang disimpan (biar tidak membengkak)

const LS_UID_KEY = "pressquiz_uid"; // SAMA dengan progress.js, sengaja disatukan
const LS_HISTORY_KEY = "pressquiz_history";

const state = {
  uid: null,
  entries: [], // { ts, sets: "A" | "A,B" | "SEMUA", total, correct, percent }
};

/* ============================================================
   IDENTITAS USER — konsisten dengan progress.js
   ============================================================ */

function generateId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return "u-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

function getOrCreateUid() {
  let uid = localStorage.getItem(LS_UID_KEY);
  if (!uid) {
    uid = generateId();
    localStorage.setItem(LS_UID_KEY, uid);
  }
  return uid;
}

/* ============================================================
   BACA / TULIS LOKAL
   ============================================================ */

function readLocalHistory() {
  try {
    const raw = localStorage.getItem(LS_HISTORY_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function writeLocalHistory(entries) {
  try {
    localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(entries));
  } catch (e) {
    console.warn("Gagal menyimpan riwayat ke localStorage:", e);
  }
}

/** Gabungkan dua daftar riwayat berdasarkan timestamp, buang duplikat,
 *  urutkan terbaru dulu, lalu potong sesuai batas maksimum. */
function mergeHistories(a, b) {
  const map = new Map();
  [...(a || []), ...(b || [])].forEach((e) => {
    if (e && e.ts) map.set(e.ts, e);
  });
  return [...map.values()].sort((x, y) => new Date(y.ts) - new Date(x.ts)).slice(0, MAX_ENTRIES);
}

/* ============================================================
   API PUBLIK
   ============================================================ */

/**
 * Catat satu sesi kuis yang baru saja selesai — apa pun jenisnya
 * (Set tunggal, gabungan, semua soal, atau ulangi-yang-salah).
 */
export async function recordHistoryEntry(queueItems, wrongItems) {
  if (!queueItems || !queueItems.length) return;

  const setKeys = [...new Set(queueItems.map((q) => q.setKey))].sort();
  const total = queueItems.length;
  const wrongCount = (wrongItems || []).length;
  const correct = total - wrongCount;
  const percent = Math.round((correct / total) * 100);

  const entry = {
    ts: new Date().toISOString(),
    sets: setKeys.join(","),
    total,
    correct,
    percent,
  };

  // Sesi baru SELALU ditambahkan (bukan digabung/dedup) — dedup berbasis
  // timestamp hanya relevan saat menyatukan dengan data dari Firestore,
  // bukan untuk mencatat sesi baru yang baru saja selesai.
  state.entries.unshift(entry);
  state.entries = state.entries.slice(0, MAX_ENTRIES);
  writeLocalHistory(state.entries);
  renderHistoryPanelIfOpen();

  if (!db || !state.uid) return;
  await ensureAuthReady();
  try {
    await setDoc(
      doc(db, "users", state.uid),
      { history: state.entries, updatedAt: new Date().toISOString() },
      { merge: true }
    );
  } catch (e) {
    console.warn("Gagal menyimpan riwayat ke Firestore:", e);
  }
}

/* ============================================================
   MUAT DATA
   ============================================================ */

function loadLocalHistory() {
  state.uid = getOrCreateUid();
  state.entries = readLocalHistory();
}

async function syncFromFirestore() {
  if (!db) return;
  await ensureAuthReady();
  try {
    const snap = await getDoc(doc(db, "users", state.uid));
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.history)) {
        state.entries = mergeHistories(state.entries, data.history);
        writeLocalHistory(state.entries);
        renderHistoryPanelIfOpen();
      }
    }
  } catch (e) {
    console.warn("Gagal memuat riwayat dari Firestore:", e);
  }
}

/* ============================================================
   FORMAT TAMPILAN
   ============================================================ */

function formatSetsLabel(setsStr) {
  const keys = setsStr.split(",").filter(Boolean);
  if (keys.length >= 7) return "Semua Set";
  if (keys.length === 1) return `Set ${keys[0]}`;
  return `Set ${keys.join(", ")}`;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  } catch (e) {
    return iso;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ============================================================
   UI — tombol 📊 + panel riwayat
   ============================================================ */

let historyBtnEl = null;
let panelEl = null;
let overlayEl = null;
let panelOpen = false;

/** Wadah bersama pojok kiri atas — dipakai juga oleh progress.js,
 *  guide.js, theme.js. Idempotent lewat getElementById. */
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

function renderHistoryButton() {
  if (historyBtnEl) return;
  historyBtnEl = document.createElement("button");
  historyBtnEl.type = "button";
  historyBtnEl.className = "history-btn";
  historyBtnEl.setAttribute("aria-label", "Lihat riwayat latihan");
  historyBtnEl.innerHTML = "📊";
  historyBtnEl.addEventListener("click", openHistoryPanel);
  ensureToolbar().appendChild(historyBtnEl);
}

function buildHistoryRows() {
  if (!state.entries.length) {
    return `<div class="history-empty">Belum ada riwayat latihan. Yuk mulai kuis pertamamu!</div>`;
  }

  // Untuk hitung tren ▲▼, cari entri SEBELUMNYA dengan kombinasi Set yang sama
  const bySetsChrono = [...state.entries].reverse(); // urut lama -> baru per grup
  const lastPercentBySets = {};

  return state.entries
    .map((entry) => {
      const idxChrono = bySetsChrono.findIndex((e) => e.ts === entry.ts);
      let trendHtml = "";
      const prev = lastPercentBySets[entry.sets];
      if (prev !== undefined) {
        if (entry.percent > prev) trendHtml = `<span class="history-trend up">▲ ${entry.percent - prev}%</span>`;
        else if (entry.percent < prev) trendHtml = `<span class="history-trend down">▼ ${prev - entry.percent}%</span>`;
        else trendHtml = `<span class="history-trend flat">= sama</span>`;
      }
      lastPercentBySets[entry.sets] = entry.percent;

      return `
        <div class="history-row">
          <div class="history-row-main">
            <span class="history-row-sets">${escapeHtml(formatSetsLabel(entry.sets))}</span>
            <span class="history-row-score">${entry.correct}/${entry.total} (${entry.percent}%)</span>
          </div>
          <div class="history-row-sub">
            <span class="history-row-date">${escapeHtml(formatDate(entry.ts))}</span>
            ${trendHtml}
          </div>
        </div>
      `;
    })
    .join("");
}

function renderHistoryPanelIfOpen() {
  if (panelOpen) renderHistoryPanelContent();
}

function renderHistoryPanelContent() {
  if (!panelEl) return;
  const totalAttempts = state.entries.length;
  const avgPercent = totalAttempts
    ? Math.round(state.entries.reduce((sum, e) => sum + e.percent, 0) / totalAttempts)
    : 0;

  panelEl.innerHTML = `
    <div class="history-modal">
      <button type="button" class="history-close" data-close="1">✕</button>
      <div class="history-title">📊 Riwayat Latihan</div>
      <div class="history-summary">
        <div class="history-summary-item">
          <span class="history-summary-num">${totalAttempts}</span>
          <span class="history-summary-label">Kali Latihan</span>
        </div>
        <div class="history-summary-item">
          <span class="history-summary-num">${avgPercent}%</span>
          <span class="history-summary-label">Rata-rata Skor</span>
        </div>
      </div>
      <div class="history-list">${buildHistoryRows()}</div>
    </div>
  `;
}

function openHistoryPanel() {
  if (!panelEl) {
    panelEl = document.createElement("div");
    panelEl.className = "history-overlay";
    document.body.appendChild(panelEl);
    panelEl.addEventListener("click", (e) => {
      if (e.target === panelEl || e.target.closest("[data-close]")) closeHistoryPanel();
    });
  }
  panelOpen = true;
  renderHistoryPanelContent();
  requestAnimationFrame(() => panelEl.classList.add("show"));
}

function closeHistoryPanel() {
  panelOpen = false;
  if (panelEl) panelEl.classList.remove("show");
}

/* ============================================================
   STYLE
   ============================================================ */

function injectStyles() {
  if (document.getElementById("history-style")) return;
  const style = document.createElement("style");
  style.id = "history-style";
  style.textContent = `
    .history-btn{
      width:38px;height:38px;border-radius:50%;flex-shrink:0;
      background:#FFFFFF;border:1px solid rgba(70,50,25,.1);cursor:pointer;
      display:flex;align-items:center;justify-content:center;font-size:16px;
      box-shadow:0 10px 22px -10px rgba(70,50,25,.3);
      transition:transform .15s ease, box-shadow .15s ease;
    }
    .history-btn:hover{transform:translateY(-1px) scale(1.05);}
    .history-btn:active{transform:translateY(1px) scale(.94);}

    .history-overlay{
      position:fixed;inset:0;z-index:900;background:rgba(46,38,32,.45);
      backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;
      padding:20px;opacity:0;pointer-events:none;transition:opacity .2s ease;
    }
    .history-overlay.show{opacity:1;pointer-events:auto;}
    .history-modal{
      position:relative;background:#FBF3E7;border-radius:24px;padding:24px;
      max-width:380px;width:100%;max-height:80vh;overflow-y:auto;
      box-shadow:0 30px 60px -20px rgba(0,0,0,.4);
      font-family:'Segoe UI','Noto Sans JP',-apple-system,BlinkMacSystemFont,sans-serif;
      transform:scale(.94) translateY(8px);transition:transform .2s ease;
    }
    .history-overlay.show .history-modal{transform:scale(1) translateY(0);}
    .history-close{
      position:absolute;top:16px;right:16px;width:26px;height:26px;border-radius:50%;
      border:none;background:rgba(70,50,25,.08);cursor:pointer;font-size:13px;color:#2E2620;
    }
    .history-title{font-size:18px;font-weight:800;color:#2E2620;margin-bottom:16px;}
    .history-summary{display:flex;gap:12px;margin-bottom:18px;}
    .history-summary-item{
      flex:1;background:#FFFFFF;border-radius:16px;padding:14px;text-align:center;
      box-shadow:0 6px 16px -10px rgba(70,50,25,.25);
    }
    .history-summary-num{display:block;font-size:22px;font-weight:800;color:#008471;}
    .history-summary-label{display:block;font-size:11px;color:#7A6F5D;margin-top:2px;}

    .history-list{display:flex;flex-direction:column;gap:10px;}
    .history-empty{text-align:center;color:#7A6F5D;font-size:13px;padding:24px 10px;}
    .history-row{
      background:#FFFFFF;border-radius:14px;padding:12px 14px;
      box-shadow:0 4px 12px -8px rgba(70,50,25,.2);
    }
    .history-row-main{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;}
    .history-row-sets{font-size:13px;font-weight:700;color:#2E2620;}
    .history-row-score{font-size:13px;font-weight:800;color:#008471;}
    .history-row-sub{display:flex;justify-content:space-between;align-items:center;}
    .history-row-date{font-size:11px;color:#a89a82;}
    .history-trend{font-size:11px;font-weight:700;}
    .history-trend.up{color:#2FAE60;}
    .history-trend.down{color:#C45F3F;}
    .history-trend.flat{color:#a89a82;}
  `;
  document.head.appendChild(style);
}

/* ============================================================
   INIT
   ============================================================ */

function init() {
  injectStyles();
  loadLocalHistory(); // instan dari localStorage
  renderHistoryButton();
  syncFromFirestore(); // latar belakang, tidak memblokir apa pun
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
