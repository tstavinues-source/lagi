/* ============================================================
   FIREBASE-SHARED.JS — Satu koneksi Firebase untuk semua file
   ============================================================
   File ini BERDIRI SENDIRI dan jadi satu-satunya tempat Firebase
   di-inisialisasi. Sebelumnya script.js, progress.js, dan history.js
   MASING-MASING membuat app Firebase + login anonim sendiri-sendiri
   (3 kali proses auth paralel di setiap buka halaman!) — itu salah
   satu penyebab utama kenapa pengambilan data terasa lama.

   Sekarang ketiganya cukup import db & ensureAuthReady dari sini,
   jadi cuma ADA SATU login anonim per sesi, bukan tiga.

   Cara pakai di file lain:
     import { db, ensureAuthReady } from "./firebase-shared.js";
     ...
     await ensureAuthReady();
     const snap = await getDoc(doc(db, "users", uid));
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAX6oiukr0SAe2W7btRMe3e3aXqLZoGdXk",
  authDomain: "studio-4638697066-ac0a1.firebaseapp.com",
  projectId: "studio-4638697066-ac0a1",
  storageBucket: "studio-4638697066-ac0a1.firebasestorage.app",
  messagingSenderId: "722291749123",
  appId: "1:722291749123:web:af0aa30fde91fa54673936",
};

export let db = null;
let authReadyPromise = Promise.resolve();

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  const auth = getAuth(app);
  authReadyPromise = signInAnonymously(auth).catch((e) => {
    console.warn("Login anonim Firebase gagal:", e);
  });
} catch (e) {
  console.warn("Firebase gagal diinisialisasi:", e);
}

/** Tunggu login anonim selesai dulu sebelum baca/tulis Firestore —
 *  mencegah race condition yang bikin operasi Firestore lambat/gagal
 *  diam-diam kalau security rules butuh auth. */
export async function ensureAuthReady() {
  try {
    await authReadyPromise;
  } catch (e) {
    /* diabaikan — biar error asli tetap kelihatan di operasi Firestore-nya */
  }
}
