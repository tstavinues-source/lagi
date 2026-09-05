/* ============================================================
   PROGRESS.JS — Nama pengguna + progres penguasaan per-set
   ============================================================
   File ini BERDIRI SENDIRI (tidak menambah beban script.js):
   - Saat pertama kali dibuka, tampilkan popup wajib isi nama
   - Nama disimpan (localStorage + Firestore) dan ditampilkan
     sebagai badge di pojok kiri atas — bisa diklik untuk ganti nama
   - Setiap kali satu sesi kuis SELESAI, dicek: kalau soal yang
     dikerjakan mencakup SATU SET PENUH (misal semua 20 soal Set A),
     skor sesi itu (persen benar) dibandingkan dengan skor terbaik
     yang tersimpan — kalau lebih tinggi, itu jadi skor baru set itu.
     Sesi "Ulangi Soal yang Salah" (biasanya cuma sebagian) tidak ikut
     dihitung karena bukan putaran lengkap.
     dan disimpan ke Firestore
   - Badge persentase progres otomatis muncul di tiap kartu Set A-G
     di halaman pilih soal (dipantau lewat MutationObserver, jadi
     tidak perlu ubah renderSetPicker() di script.js)

   Cara pakai di script.js (sudah ditambahkan):
     import { recordSessionResult } from "./progress.js";
     ...
     recordSessionResult(state.queue, state.wrong); // panggil di finishQuiz()

   Identitas user disimpan sebagai ID acak permanen di localStorage
   (bukan nama itu sendiri) supaya kalau nama diganti, progres lama
   TIDAK hilang — nama hanya field yang bisa diubah-ubah.
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
  getAuth,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAX6oiukr0SAe2W7btRMe3e3aXqLZoGdXk",
  authDomain: "studio-4638697066-ac0a1.firebaseapp.com",
  projectId: "studio-4638697066-ac0a1",
  storageBucket: "studio-4638697066-ac0a1.firebasestorage.app",
  messagingSenderId: "722291749123",
  appId: "1:722291749123:web:af0aa30fde91fa54673936",
};

// Nama app Firebase dibuat unik ("quizProgressApp") supaya tidak
// bentrok dengan instance Firebase lain yang mungkin sudah dibuat
// oleh script.js — keduanya tetap terhubung ke proyek yang sama.
let db = null;
try {
  const app = initializeApp(firebaseConfig, "quizProgressApp");
  db = getFirestore(app);
  const auth = getAuth(app);
  signInAnonymously(auth).catch(() => {});
} catch (e) {
  console.warn("Firebase (progress) gagal diinisialisasi:", e);
}

const LS_UID_KEY = "pressquiz_uid";
const LS_NAME_KEY = "pressquiz_username";

const state = {
  uid: null,
  name: "",
  bestScores: {}, // { "A": 90, "B": 100, ... } — skor terbaik dari putaran lengkap per set
  loaded: false,
};

/* ============================================================
   IDENTITAS USER
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

async function loadUserData() {
  state.uid = getOrCreateUid();
  state.name = localStorage.getItem(LS_NAME_KEY) || "";

  if (!db) {
    state.loaded = true;
    return;
  }
  try {
    const snap = await getDoc(doc(db, "users", state.uid));
    if (snap.exists()) {
      const data = snap.data();
      if (data.name) {
        state.name = data.name;
        localStorage.setItem(LS_NAME_KEY, data.name);
      }
      if (data.bestScores && typeof data.bestScores === "object") {
        state.bestScores = data.bestScores;
      }
    }
  } catch (e) {
    console.warn("Gagal memuat data progres dari Firestore:", e);
  }
  state.loaded = true;
}

async function persistName(name) {
  state.name = name;
  localStorage.setItem(LS_NAME_KEY, name);
  updateCornerBadge();
  if (!db || !state.uid) return;
  try {
    await setDoc(
      doc(db, "users", state.uid),
      { name, updatedAt: new Date().toISOString() },
      { merge: true }
    );
  } catch (e) {
    console.warn("Gagal menyimpan nama ke Firestore:", e);
  }
}

/* ============================================================
   SKOR PER-SET (ditentukan dari satu putaran kuis yang LENGKAP)
   ============================================================ */

/** Baca total soal tiap set langsung dari kartu di #set-picker. */
function getSetTotalsFromDom() {
  const totals = {};
  document.querySelectorAll("#set-picker .set-card").forEach((card) => {
    const checkbox = card.querySelector(".set-check");
    const countEl = card.querySelector(".set-count");
    if (!checkbox || !countEl) return;
    const match = countEl.textContent.match(/(\d+)/);
    if (!match) return;
    totals[checkbox.dataset.key] = parseInt(match[1], 10);
  });
  return totals;
}

/**
 * Panggil ini SEKALI setiap kali satu sesi kuis selesai (bukan setiap
 * jawaban). Set dianggap "dikerjakan lengkap" hanya kalau jumlah soal
 * set itu di sesi ini sama dengan jumlah total soal set itu — jadi sesi
 * "Ulangi Soal yang Salah" (biasanya cuma sebagian) tidak ikut dihitung.
 * Skor yang disimpan adalah skor TERBAIK yang pernah dicapai per set.
 */
export async function recordSessionResult(queueItems, wrongItems) {
  if (!queueItems || !queueItems.length) return;
  const totals = getSetTotalsFromDom();
  const wrongKeySet = new Set((wrongItems || []).map((w) => `${w.setKey}-${w.no}`));

  const bySet = {};
  queueItems.forEach((q) => {
    (bySet[q.setKey] = bySet[q.setKey] || []).push(q.no);
  });

  let changed = false;
  const updates = {};

  Object.keys(bySet).forEach((setKey) => {
    const nos = bySet[setKey];
    const total = totals[setKey];
    if (!total || nos.length !== total) return; // bukan putaran lengkap, lewati

    const wrongCount = nos.filter((no) => wrongKeySet.has(`${setKey}-${no}`)).length;
    const percent = Math.round(((nos.length - wrongCount) / nos.length) * 100);
    const prevBest = state.bestScores[setKey] || 0;

    if (percent > prevBest) {
      state.bestScores[setKey] = percent;
      updates[`bestScores.${setKey}`] = percent;
      changed = true;
    }
  });

  if (!changed) return;
  refreshProgressBadges();

  if (!db || !state.uid) return;
  updates.updatedAt = new Date().toISOString();
  try {
    await updateDoc(doc(db, "users", state.uid), updates);
  } catch (e) {
    try {
      await setDoc(
        doc(db, "users", state.uid),
        { name: state.name, bestScores: state.bestScores, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (e2) {
      console.warn("Gagal menyimpan progres ke Firestore:", e2);
    }
  }
}

/* ============================================================
   BADGE PERSENTASE DI KARTU SET A-G
   ============================================================ */

function injectProgressBadges() {
  const cards = document.querySelectorAll("#set-picker .set-card");
  if (!cards.length) return;
  cards.forEach((card) => {
    const checkbox = card.querySelector(".set-check");
    const inner = card.querySelector(".set-card-inner");
    if (!checkbox || !inner) return;
    const setKey = checkbox.dataset.key;
    const percent = Math.min(100, Math.max(0, state.bestScores[setKey] || 0));

    let badge = inner.querySelector(".progress-badge");
    if (!badge) {
      badge = document.createElement("div");
      badge.className = "progress-badge";
      badge.innerHTML = `
        <div class="progress-badge-bar"><div class="progress-badge-fill"></div></div>
        <span class="progress-badge-text"></span>
      `;
      inner.appendChild(badge);
    }
    badge.querySelector(".progress-badge-fill").style.width = `${percent}%`;
    badge.querySelector(".progress-badge-text").textContent =
      percent >= 100 ? "✓ Terkuasai 100%" : `${percent}% dikuasai`;
    badge.classList.toggle("complete", percent >= 100);
  });
}

function refreshProgressBadges() {
  injectProgressBadges();
}

function watchSetPicker(retries = 20) {
  const picker = document.getElementById("set-picker");
  if (!picker) {
    if (retries > 0) setTimeout(() => watchSetPicker(retries - 1), 250);
    return;
  }
  const observer = new MutationObserver(() => injectProgressBadges());
  observer.observe(picker, { childList: true });
  injectProgressBadges();
}

/* ============================================================
   UI — badge nama pojok kiri atas + popup isi/ubah nama
   ============================================================ */

let cornerBadgeEl = null;
let overlayEl = null;

function updateCornerBadge() {
  if (!cornerBadgeEl) return;
  cornerBadgeEl.querySelector(".corner-badge-name").textContent =
    state.name || "Tamu";
}

function renderCornerBadge() {
  if (cornerBadgeEl) return updateCornerBadge();
  cornerBadgeEl = document.createElement("button");
  cornerBadgeEl.type = "button";
  cornerBadgeEl.className = "corner-badge";
  cornerBadgeEl.innerHTML = `
    <span class="corner-badge-avatar">👤</span>
    <span class="corner-badge-name">${escapeHtml(state.name || "Tamu")}</span>
    <span class="corner-badge-edit">✎</span>
  `;
  cornerBadgeEl.addEventListener("click", () => openNamePopup(false));
  document.body.appendChild(cornerBadgeEl);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function openNamePopup(mandatory) {
  if (overlayEl) overlayEl.remove();

  overlayEl = document.createElement("div");
  overlayEl.className = "name-overlay";
  overlayEl.innerHTML = `
    <div class="name-modal">
      <div class="name-modal-title">${mandatory ? "Siapa namamu?" : "Ganti Nama"}</div>
      <div class="name-modal-desc">${
        mandatory
          ? "Nama ini dipakai untuk menyimpan progres belajarmu."
          : "Progres belajarmu tetap tersimpan walau namanya diganti."
      }</div>
      <input type="text" class="name-modal-input" placeholder="Tulis nama kamu..." maxlength="40" value="${escapeHtml(
        state.name || ""
      )}" />
      <div class="name-modal-actions">
        ${mandatory ? "" : '<button type="button" class="name-modal-btn ghost" data-action="cancel">Batal</button>'}
        <button type="button" class="name-modal-btn primary" data-action="save">Simpan</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlayEl);

  const input = overlayEl.querySelector(".name-modal-input");
  input.focus();
  input.select();

  const submit = () => {
    const value = input.value.trim();
    if (!value) {
      input.classList.add("shake-error");
      setTimeout(() => input.classList.remove("shake-error"), 400);
      return;
    }
    persistName(value);
    overlayEl.remove();
    overlayEl = null;
  };

  overlayEl.querySelector('[data-action="save"]').addEventListener("click", submit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submit();
  });

  const cancelBtn = overlayEl.querySelector('[data-action="cancel"]');
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      overlayEl.remove();
      overlayEl = null;
    });
  }
}

function injectStyles() {
  if (document.getElementById("progress-style")) return;
  const style = document.createElement("style");
  style.id = "progress-style";
  style.textContent = `
    .corner-badge{
      position:fixed;top:14px;left:14px;z-index:500;
      display:flex;align-items:center;gap:7px;
      background:#FFFFFF;border:1px solid rgba(70,50,25,.1);
      border-radius:999px;padding:8px 14px 8px 10px;cursor:pointer;
      box-shadow:0 10px 22px -10px rgba(70,50,25,.3);
      font-family:'Segoe UI','Noto Sans JP',-apple-system,BlinkMacSystemFont,sans-serif;
      transition:transform .15s ease, box-shadow .15s ease;
    }
    .corner-badge:hover{transform:translateY(-1px);box-shadow:0 14px 26px -10px rgba(70,50,25,.38);}
    .corner-badge:active{transform:translateY(1px) scale(.97);}
    .corner-badge-avatar{
      width:22px;height:22px;border-radius:50%;
      background:linear-gradient(160deg, var(--teal-light, #4fd6bd), var(--teal, #008471));
      display:flex;align-items:center;justify-content:center;font-size:11px;
    }
    .corner-badge-name{font-size:12.5px;font-weight:800;color:var(--ink, #2E2620);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .corner-badge-edit{font-size:11px;color:var(--ink-soft, #7A6F5D);}

    .name-overlay{
      position:fixed;inset:0;z-index:900;
      background:rgba(46,38,32,.45);backdrop-filter:blur(2px);
      display:flex;align-items:center;justify-content:center;padding:20px;
      animation:nameOverlayFade .2s ease;
    }
    @keyframes nameOverlayFade{from{opacity:0;}to{opacity:1;}}
    .name-modal{
      background:#FFFFFF;border-radius:24px;padding:26px;max-width:340px;width:100%;
      box-shadow:0 30px 60px -20px rgba(0,0,0,.4);
      font-family:'Segoe UI','Noto Sans JP',-apple-system,BlinkMacSystemFont,sans-serif;
      animation:nameModalPop .25s ease;
    }
    @keyframes nameModalPop{from{opacity:0;transform:scale(.92) translateY(8px);}to{opacity:1;transform:scale(1) translateY(0);}}
    .name-modal-title{font-size:18px;font-weight:800;color:var(--ink, #2E2620);margin-bottom:6px;}
    .name-modal-desc{font-size:12.5px;color:var(--ink-soft, #7A6F5D);margin-bottom:16px;line-height:1.5;}
    .name-modal-input{
      width:100%;padding:13px 16px;border-radius:14px;border:1.5px solid rgba(70,50,25,.15);
      font-size:14px;font-family:inherit;box-sizing:border-box;
      background:#FBF6EB;color:var(--ink, #2E2620);
    }
    .name-modal-input:focus{outline:none;border-color:var(--teal, #008471);}
    .name-modal-input.shake-error{animation:nameShake .35s;border-color:var(--tomato, #C45F3F);}
    @keyframes nameShake{
      0%,100%{transform:translateX(0);} 25%{transform:translateX(-6px);} 75%{transform:translateX(6px);}
    }
    .name-modal-actions{display:flex;gap:10px;margin-top:16px;justify-content:flex-end;}
    .name-modal-btn{
      appearance:none;border:none;cursor:pointer;border-radius:999px;padding:10px 20px;
      font-size:13px;font-weight:700;font-family:inherit;
    }
    .name-modal-btn.primary{background:linear-gradient(160deg, var(--teal-light, #4fd6bd), var(--teal, #008471));color:#04241d;}
    .name-modal-btn.ghost{background:transparent;color:var(--ink-soft, #7A6F5D);border:1px solid rgba(70,50,25,.15);}

    .progress-badge{margin-top:8px;width:100%;}
    .progress-badge-bar{
      width:100%;height:6px;border-radius:999px;background:rgba(255,255,255,.4);
      overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.15);
    }
    .progress-badge-fill{
      height:100%;border-radius:999px;width:0%;
      background:linear-gradient(90deg, var(--teal-dark, #045c4d), var(--teal-light, #4fd6bd));
      transition:width .4s ease;
    }
    .progress-badge-text{
      display:block;margin-top:4px;font-size:9.5px;font-weight:700;
      color:rgba(255,255,255,.92);text-shadow:0 1px 2px rgba(0,0,0,.25);
    }
    .progress-badge.complete .progress-badge-fill{
      background:linear-gradient(90deg, #1f8a4c, #4fe08a);
    }
  `;
  document.head.appendChild(style);
}

/* ============================================================
   INIT
   ============================================================ */

async function init() {
  injectStyles();
  await loadUserData();
  renderCornerBadge();
  watchSetPicker();

  if (!state.name) {
    openNamePopup(true); // wajib isi nama — belum pernah diisi sebelumnya
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
