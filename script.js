/* ============================================================
   METAL PRESS QUIZ — script.js
   Kuis Latihan Metal Pressing (Jepang -> Indonesia)
   Data soal bawaan + soal tambahan dari Firebase Firestore
   ============================================================ */

/* ---------- Firebase (modular v10, via CDN) ---------- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
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

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  const auth = getAuth(app);
  signInAnonymously(auth).catch(() => {
    /* Anonymous auth optional — kuis tetap jalan tanpa akses Firestore */
  });
} catch (e) {
  console.warn("Firebase gagal diinisialisasi, memakai soal bawaan saja.", e);
}

/* ---------- Folder gambar soal ---------- */
/* File gambar diletakkan SEJAJAR dengan index.html & script.js (folder yang sama),
   dengan nama mengikuti pola "<SetKey>-<NomorSoal>.png", contoh: A-4.png
   Jika kamu memindahkan gambar ke dalam subfolder (misal "images/"), ubah nilai di bawah
   ini menjadi "images/" (jangan lupa slash di akhir). */
const IMAGE_FOLDER = "";

/* ---------- Data soal bawaan (Set A - G) ---------- */
/* answer: true = pernyataan ini BENAR (tadashii / 正しい)
   answer: false = pernyataan ini SALAH (ayamari / 誤り) */

const QUIZ_SETS = {
  A: {
    title: "Set A — Dasar Mesin Press",
    questions: [
      { no: 1, ja: "スクリュープレスは こうそくど うちぬきかこうに つかいます", id: "Screw press digunakan untuk proses pukul lubang (piercing/blanking) berkecepatan tinggi.", answer: false },
      { no: 2, ja: "クランクプレスの ストロークながさは クランクの はんけいと おなじです", id: "Panjang stroke pada crank press sama dengan jari-jari (radius) crank.", answer: false },
      { no: 3, ja: "トランスファプレスは たこうていの れんぞくかこうをするための プレスです", id: "Transfer press adalah mesin press untuk melakukan proses berkelanjutan multi-tahap (multi-station).", answer: true },
      { no: 4, ja: "ずは Cがた フレームの プレスきかいです", id: "Gambar tersebut adalah mesin press dengan rangka (frame) tipe C.", answer: true, img: "A-4.png" },

      { no: 5, ja: "フリクションクラッチつきの クランクプレスは すんどううんてんが できません", id: "Crank press yang dilengkapi friction clutch tidak dapat melakukan operasi inching (gerak sedikit demi sedikit).", answer: false },
      { no: 6, ja: "うちぬきりょくは せんだんながさ いたあつ ざいしつを きじゅんに けいさんします", id: "Gaya pemotongan (blanking force) dihitung berdasarkan panjang geser, ketebalan pelat, dan jenis bahan.", answer: true },
      { no: 7, ja: "プレスかこうには おもに うちぬき・まげ・せいけい・しぼりなどが あります", id: "Proses press terutama meliputi pemotongan (blanking), penekukan (bending), pembentukan (forming), dan penarikan (drawing).", answer: true },
      { no: 8, ja: "ずの Aのぶぶんは がいけいぬきで かこうします", id: "Bagian A pada gambar diproses dengan pemotongan bentuk luar (outline blanking).", answer: false, img: "A-8.png" },

      { no: 9, ja: "かながたの クッションピンあなの けいは プレスきかいの クッションピンあなの けいより おおきくします", id: "Diameter lubang pin cushion pada cetakan dibuat lebih besar daripada diameter lubang pin cushion mesin press.", answer: true },
      { no: 10, ja: "うちぬきがたの ストリッパーはパンチから ざいりょうを ひきはなすための ものです", id: "Stripper pada cetakan pemotongan berfungsi melepaskan material dari punch.", answer: true },
      { no: 11, ja: "ずの プレスきかいに かながたを とりつけるときは うわがたから こていします", id: "Saat memasang cetakan pada mesin press, pemasangan dimulai dari fiksasi cetakan atas (upper die) terlebih dahulu.", answer: true, img: "A-11.png" },

      { no: 12, ja: "しぼりダイの Rはダイラジアスとも いいます", id: "R pada die penarikan (drawing die) juga disebut die radius.", answer: true },
      { no: 13, ja: "ぬきかこうした せいひんの キズの げんいんのひとつに かすあがりが あります", id: "Salah satu penyebab cacat pada produk hasil pemotongan adalah naiknya sisa potongan (scrap lift-up).", answer: true },
      { no: 14, ja: "フランジつきえんとうしぼりをおこなうときに できるしわは ノックアウトりょくを つよくすると すくなくできます", id: "Saat melakukan penarikan silinder berflensa, kerutan yang terjadi dapat dikurangi dengan memperkuat gaya knockout.", answer: false },
      { no: 15, ja: "せんだんめんは クリアランスをおおきくすると せまくなります", id: "Permukaan geser (shear surface) menjadi lebih sempit jika clearance diperbesar.", answer: true },
      { no: 16, ja: "パンチとダイのクリアランスがおおきいと ずのようににじせんだんめんが できます", id: "Jika clearance antara punch dan die besar, akan terbentuk permukaan geser ganda seperti pada gambar.", answer: false, img: "A-16.png" },

      { no: 17, ja: "プレスかこうよう ざいりょうとして おおく つかわれているのは ねっかんあつえんなんこうはん（SPHC）と れいかんあつえんこうはん（SPCC）です", id: "Bahan yang paling banyak digunakan untuk proses press adalah pelat baja canai panas lunak (SPHC) dan pelat baja canai dingin (SPCC).", answer: true },
      { no: 18, ja: "じゅんどの たかい アルミニウムは いっぱんに しぼりせいけいせいが よいです", id: "Aluminium dengan kemurnian tinggi umumnya memiliki sifat mampu tarik (drawability) yang baik.", answer: true },
      { no: 19, ja: "かながたの とりはずしに つかう こうぐは ボルスタの うえに おいたまま さぎょうをしても よいです", id: "Alat yang digunakan untuk melepas cetakan boleh dibiarkan tergeletak di atas bolster selama bekerja.", answer: false },
      { no: 20, ja: "てさぎょうでの プレスさぎょうは あんぜんいちこうていうんてんで します", id: "Pekerjaan press secara manual dilakukan dengan operasi satu-siklus aman (safety single stroke).", answer: true },
    ],
  },
  B: {
    title: "Set B — Alat Pengaman & Bending",
    questions: [
      { no: 1, ja: "かふかあんぜんそうちは かながたの じゅうりょうの バランスを たもつための そうちです", id: "Alat pengaman pengimbang (counterbalance) berfungsi menjaga keseimbangan berat cetakan.", answer: false },
      { no: 2, ja: "プレスのあんぜんそうちには ガードしき こうせんしき りょうてそうさしき てびきしき てばらいしきなどが あります", id: "Alat pengaman pada mesin press terdiri dari tipe pelindung (guard), tipe sinar (photoelectric), tipe kontrol dua tangan, tipe penarik tangan, dan tipe penyapu tangan.", answer: true },
      { no: 3, ja: "ずのような りょうてそうさしきあんぜんそうちの おしボタンのかんかくAは 300mmいじょうです", id: "Pada alat pengaman kontrol dua tangan seperti gambar, jarak antar tombol tekan A adalah 300mm atau lebih.", answer: true, img: "B-3.png" },

      { no: 4, ja: "ずは Cがた フレームの プレスきかいです", id: "Gambar tersebut adalah mesin press dengan rangka tipe C.", answer: true, img: "B-4.png" },

      { no: 5, ja: "ダイクッションは しぼりかこうの しわおさえなどに つかいます", id: "Die cushion digunakan untuk menahan kerutan (blank holder) dalam proses penarikan (drawing).", answer: true },
      { no: 6, ja: "うえほうこうに しぼる かこうほうほうを ぎゃくしぼりかこうと いいます", id: "Metode proses menarik (drawing) ke arah atas disebut proses penarikan terbalik (reverse drawing).", answer: false },
      { no: 7, ja: "ずの せいひんは しぼりがたによって つくられます", id: "Produk pada gambar dibuat dengan menggunakan cetakan penarikan (drawing die).", answer: false, img: "B-7.png" },

      { no: 8, ja: "うちぬきかこうにおける アルミニウムばんと なんこうはんのクリアランスは ちがいます", id: "Clearance pada proses pemotongan untuk pelat aluminium dan pelat baja lunak berbeda.", answer: true },
      { no: 9, ja: "まげがたには Lまげがた Uまげがた などが あります", id: "Jenis cetakan tekuk (bending die) meliputi tipe tekuk L dan tipe tekuk U, dan lain-lain.", answer: true },
      { no: 10, ja: "ずの うちぬきかじゅうは パンチに シャーかく（けいしゃかく）を つけても ちいさく なりません", id: "Beban pemotongan pada gambar tidak akan berkurang meskipun punch diberi sudut geser (shear angle).", answer: false, img: "B-10.png" },

      { no: 11, ja: "ずの プレスきかいに かながたを とりつけるときには したがたから さきに こていします", id: "Saat memasang cetakan pada mesin press, pemasangan dimulai dari fiksasi cetakan bawah terlebih dahulu.", answer: false, img: "B-11.png" },

      { no: 12, ja: "しぼりダイの Rはダイラジアスとも いいます", id: "R pada die penarikan juga disebut die radius.", answer: true },
      { no: 13, ja: "かえりと バリは おなじです", id: "Istilah 'kaeri' dan 'bari' (keduanya berarti burr / sisa tajam) memiliki arti yang sama.", answer: true },
      { no: 14, ja: "ずのような Vまげかこうを するとき まげダイのかたはば Wは いたあつtの 6～8ばいていどに します", id: "Saat melakukan penekukan V seperti pada gambar, lebar bahu die tekuk W dibuat sekitar 6-8 kali ketebalan pelat (t).", answer: true, img: "B-14.png" },

      { no: 15, ja: "パンチとダイのクリアランスがおおきいとバリがおおきくなります。", id: "Jika clearance antara punch dan die besar, maka burr yang dihasilkan juga akan besar.", answer: true },
      { no: 16, ja: "まげかこうでは われは そとがわに でます", id: "Pada proses penekukan (bending), retak (crack) muncul di sisi luar lengkungan.", answer: true },
      { no: 17, ja: "アルミニウムばんの ひじゅうは れいかんあつえんこうはん よりも おおきいです", id: "Berat jenis pelat aluminium lebih besar dibandingkan pelat baja canai dingin (SPCC).", answer: false },
      { no: 18, ja: "れいかんあつえんこうはんは アルミニウムばんよりも ひっぱりおうりょくが おおきいです", id: "Kekuatan tarik (tensile strength) pelat baja canai dingin lebih besar dibandingkan pelat aluminium.", answer: true },
      { no: 19, ja: "このひょうしきが あるところには はいっては いけません", id: "Tempat yang terdapat tanda (simbol larangan masuk) ini tidak boleh dimasuki.", answer: true, img: "B-19.png" },

      { no: 20, ja: "プレスさぎょうを ちゅうだんして きかいからはなれるときは でんげんを きります", id: "Saat menghentikan pekerjaan press sementara dan meninggalkan mesin, harus mematikan sumber listrik.", answer: true },
    ],
  },
  C: {
    title: "Set C — Keamanan & Proses Tekuk",
    questions: [
      { no: 1, ja: "あんぜんいちこうていでの スライドかこうちゅうは きゅうていしが できません", id: "Pada mode operasi satu-siklus aman (safety one-stroke), slide yang sedang bergerak turun tidak dapat dihentikan mendadak.", answer: false },
      { no: 2, ja: "ガードしきあんぜんそうちとは てやゆびが かながたなどに ちかづけば きゅうていしするものです", id: "Alat pengaman tipe pelindung (guard) adalah alat yang akan berhenti mendadak jika tangan atau jari mendekati cetakan.", answer: false },
      { no: 3, ja: "ずの Aは ダイクッション です", id: "A pada gambar adalah die cushion.", answer: true, img: "C-3.png" },

      { no: 4, ja: "ずの プレスきかいの ダイハイトは Aです", id: "Tinggi cetakan (die height) mesin press pada gambar ditunjukkan oleh A.", answer: true, img: "C-4.png" },

      { no: 5, ja: "フリクションクラッチつきの クランクプレスは すんどううんてんが できません", id: "Crank press yang dilengkapi friction clutch tidak dapat melakukan operasi inching.", answer: false },
      { no: 6, ja: "しぼりかこうの しわおさえりょくは しわが はっせいしない さいていのちからが よいです", id: "Gaya penahan kerutan (blank holder force) pada proses penarikan sebaiknya adalah gaya minimum yang tidak menimbulkan kerutan.", answer: true },
      { no: 7, ja: "はりだしかこうすると いたあつが あつく なります", id: "Proses pembentukan tonjolan (stretch/bulge forming) menyebabkan ketebalan pelat menjadi lebih tebal.", answer: false },
      { no: 8, ja: "まげかこうには Lまげ Uまげなどが あります", id: "Proses penekukan (bending) meliputi tekukan L dan tekukan U, dan lain-lain.", answer: true },
      { no: 9, ja: "しぼりがたの しゅようぶは パンチ ダイ しわおさえ より なりたって います", id: "Bagian utama cetakan penarikan terdiri dari punch, die, dan penahan kerutan (blank holder).", answer: true },
      { no: 10, ja: "ずの プレスきかいに かながたを とりつけるときには したがたから さきに こていします", id: "Saat memasang cetakan pada mesin press, pemasangan dimulai dari fiksasi cetakan bawah terlebih dahulu.", answer: false, img: "C-10.png" },

      { no: 11, ja: "ずの かながたは Vまげがたです", id: "Cetakan pada gambar adalah cetakan tekuk tipe V (V-bend die).", answer: true, img: "C-11.png" },

      { no: 12, ja: "しぼりダイの Rは ダイラジアスとも いいます", id: "R pada die penarikan juga disebut die radius.", answer: true },
      { no: 13, ja: "ずの うちぬきせいひんの Aは バリです", id: "A pada produk hasil pemotongan di gambar adalah burr (sisa tajam).", answer: false, img: "C-13.png" },

      { no: 14, ja: "しぼりかこうでは ショックマークは できません", id: "Pada proses penarikan (drawing), tanda kejut (shock mark / ring mark) tidak akan muncul.", answer: false },
      { no: 15, ja: "バーリングかこうとは ずのような かこうを いいます", id: "Proses burring adalah proses pembuatan lubang berbibir/berflensa seperti pada gambar.", answer: true, img: "C-15.png" },

      { no: 16, ja: "まげかこうでは われは そとがわに でます", id: "Pada proses penekukan, retak muncul di sisi luar lengkungan.", answer: true },
      { no: 17, ja: "じゅんどの たかい アルミニウムは いっぱんに しぼりせいけいせいが よいです", id: "Aluminium kemurnian tinggi umumnya memiliki sifat mampu tarik yang baik.", answer: true },
      { no: 18, ja: "ステンレスこうはんは すべて じしゃくが つきません", id: "Semua pelat baja tahan karat (stainless steel) tidak dapat ditempeli magnet.", answer: false },
      { no: 19, ja: "はじめて プレスさぎょうを するときは あんぜんきょういくを うけなければ いけません", id: "Saat pertama kali melakukan pekerjaan press, harus mengikuti pelatihan keselamatan kerja terlebih dahulu.", answer: true },
      { no: 20, ja: "プレスさぎょうを ちゅうだんして きかいから はなれるときは でんげんを きります", id: "Saat menghentikan pekerjaan press dan meninggalkan mesin, harus mematikan sumber listrik.", answer: true },
    ],
  },
  D: {
    title: "Set D — Rangka Mesin & Progressive Die",
    questions: [
      { no: 1, ja: "こうせんしきあんぜんそうちとは てや ゆびが かながたなどに ちかづけば きゅうていし するものです", id: "Alat pengaman tipe sinar (photoelectric) adalah alat yang akan berhenti mendadak jika tangan atau jari mendekati cetakan.", answer: true },
      { no: 2, ja: "ずのような りょうてそうさしきあんぜんそうちの おしボタンのかんかくAは 200mmです", id: "Pada alat pengaman kontrol dua tangan, jarak antar tombol tekan A adalah 200mm.", answer: false, img: "D-2.png" },

      { no: 3, ja: "ストレートサイドがた フレームプレスは Cがたフレームプレスより さぎょうせいが よいです", id: "Mesin press rangka tipe straight-side memiliki kemudahan kerja (workability) yang lebih baik dibandingkan mesin press rangka tipe C.", answer: false },
      { no: 4, ja: "きかいプレスの spmは フライホイールの かいてんすうに ひれいします", id: "SPM (jumlah stroke per menit) mesin press sebanding dengan jumlah putaran flywheel.", answer: true },
      { no: 5, ja: "ずの Aは プレスきかいの フレームです", id: "A pada gambar adalah rangka (frame) mesin press.", answer: false, img: "D-5.png" },

      { no: 6, ja: "ずの ぶひんの かこうは Vまげかこうが てきしています", id: "Proses pembuatan komponen pada gambar cocok menggunakan proses tekuk V (V-bending).", answer: false, img: "D-6.png" },

      { no: 7, ja: "ずの Aの ぶぶんは せんだんめんです", id: "Bagian A pada gambar adalah permukaan geser (shear surface).", answer: true, img: "D-7.png" },

      { no: 8, ja: "はりだしかこうすると いたあつが あつくなります", id: "Proses pembentukan tonjolan (stretch forming) menyebabkan ketebalan pelat menjadi lebih tebal.", answer: false },
      { no: 9, ja: "じゅんおくりがた（じゅんそうがた）では かくこうていの いちせいどを かくほしなげれば なりません", id: "Pada cetakan jenis pengumpanan bertahap (progressive die), akurasi posisi setiap tahap proses harus dipastikan.", answer: true },
      { no: 10, ja: "がいけいぬきかこうでは パンチに ついた ざいりょうを ストリッパーでおとします", id: "Pada proses pemotongan bentuk luar (blanking), material yang menempel pada punch dilepaskan menggunakan stripper.", answer: true },
      { no: 11, ja: "うわがたは プレスきかいの スライドがわに とりつけます", id: "Cetakan atas (upper die) dipasang pada sisi slide mesin press.", answer: true },
      { no: 12, ja: "しぼりパンチの Rは パンチラジアスとも いいます", id: "R pada punch penarikan (drawing punch) juga disebut punch radius.", answer: true },
      { no: 13, ja: "まげかこうを するときは つかう ざいりょうの さいしょうまげはんけいが じゅうようです", id: "Saat melakukan proses penekukan, radius tekuk minimum dari material yang digunakan merupakan hal yang penting.", answer: true },
      { no: 14, ja: "バーリングかこうでは したあなの バリがわから かこうすると われが でにくいです", id: "Pada proses burring, jika diproses dari sisi burr lubang awal (pilot hole), retak akan lebih sulit terjadi.", answer: true, img: "D-14.png" },

      { no: 15, ja: "Uまげかこうで ずのような うちがわに とじる じょうたいを スプリングゴーといいます", id: "Pada proses tekuk U, kondisi menutup ke arah dalam seperti pada gambar disebut spring-go.", answer: true, img: "D-15.png" },

      { no: 16, ja: "かえりと バリは ちがいます", id: "Istilah 'kaeri' dan 'bari' memiliki arti yang berbeda.", answer: false },
      { no: 17, ja: "アルミニウムばんの ひじゅうは れいかんあつえんこうはんよりも おおきいです", id: "Berat jenis pelat aluminium lebih besar dibandingkan pelat baja canai dingin.", answer: false },
      { no: 18, ja: "れいかんあつえんこうはんは アルミニウムばん よりも たいしょくせいが よいです", id: "Pelat baja canai dingin (SPCC) memiliki ketahanan korosi yang lebih baik dibandingkan pelat aluminium.", answer: false },
      { no: 19, ja: "このひょうしきが あるところには はいっては いけません", id: "Tempat yang terdapat tanda (simbol larangan masuk) ini tidak boleh dimasuki.", answer: true, img: "D-19.png" },

      { no: 20, ja: "しぎょうまえてんけんは まいにち さぎょうかいしまえに おこなう ひつようが あります", id: "Pemeriksaan sebelum mulai bekerja (pre-operation check) perlu dilakukan setiap hari sebelum memulai pekerjaan.", answer: true },
    ],
  },
  E: {
    title: "Set E — Gaya Potong & Cacat Produk",
    questions: [
      { no: 1, ja: "あんぜんいちこうていでの スライドかこうちゅうは きゅうていしが できません", id: "Pada mode operasi satu-siklus aman, slide yang sedang bergerak turun tidak dapat dihentikan mendadak.", answer: false },
      { no: 2, ja: "こうせんしきあんぜんそうちの ていしせいのうは にんげんの てが うごくはやさを きじゅんにしています", id: "Kemampuan berhenti alat pengaman tipe sinar (photoelectric) didasarkan pada standar kecepatan gerak tangan manusia.", answer: true },
      { no: 3, ja: "フリクションクラッチつきの クランクプレスは すんどううんてんが できません", id: "Crank press yang dilengkapi friction clutch tidak dapat melakukan operasi inching.", answer: false },
      { no: 4, ja: "プレスかこうは つうじょう すんどううんてんで おこなわれます", id: "Proses press biasanya dilakukan dengan operasi inching (gerak sedikit demi sedikit).", answer: false },
      { no: 5, ja: "ダイクッションは しぼりかこうの しわおさえなどに つかいます", id: "Die cushion digunakan untuk menahan kerutan dalam proses penarikan (drawing).", answer: true },
      { no: 6, ja: "うちぬきりょくは ずの パンチの めんせきを きじゅんに けいさんします", id: "Gaya pemotongan (blanking force) dihitung berdasarkan luas penampang punch seperti pada gambar.", answer: false, img: "E-6.png" },

      { no: 7, ja: "ずの Aの ぶぶんは ダレです", id: "Bagian A pada gambar adalah bagian 'dare' (rollover / pembulatan tepi akibat proses pemotongan).", answer: true, img: "E-7.png" },

      { no: 8, ja: "はりだしかこうすると いたあつが あつく なります", id: "Proses pembentukan tonjolan (stretch forming) menyebabkan ketebalan pelat menjadi lebih tebal.", answer: false },
      { no: 9, ja: "ずの うちぬきかじゅうは パンチにシャーかく（けいしゃかく）を つけると ちいさくなります", id: "Beban pemotongan pada gambar akan berkurang jika punch diberi sudut geser (shear angle).", answer: true, img: "E-9.png" },

      { no: 10, ja: "ずの プレスきかいに かながたをとりつけるときは うわがたから こていします", id: "Saat memasang cetakan pada mesin press, pemasangan dimulai dari fiksasi cetakan atas terlebih dahulu.", answer: true, img: "E-10.png" },

      { no: 11, ja: "ずの Aは うちぬきようの クリアランスです", id: "A pada gambar adalah clearance untuk proses pemotongan (blanking).", answer: false, img: "E-11.png" },

      { no: 12, ja: "しぼりかこうでは せいひんのいたあつが ざいりょうのあつさより おおきくなる ばあいが あります", id: "Pada proses penarikan (drawing), ketebalan produk terkadang bisa menjadi lebih besar dari ketebalan material awal.", answer: true },
      { no: 13, ja: "ぬきかこうした せいひんの キズのげんいんの ひとつに かすあがり が あります", id: "Salah satu penyebab cacat pada produk hasil pemotongan adalah naiknya sisa potongan (scrap lift-up).", answer: true },
      { no: 14, ja: "しぼりりつは まげかこうを おこなうときに つかいます", id: "Rasio penarikan (drawing ratio) digunakan saat melakukan proses penekukan (bending).", answer: false },
      { no: 15, ja: "いたあつが うすいと ずのように しぼりかこうで しわが でることが あります", id: "Jika ketebalan pelat tipis, kerutan dapat muncul pada proses penarikan (drawing) seperti pada gambar.", answer: true, img: "E-15.png" },

      { no: 16, ja: "ほそながいぶひんを Vまげかこうすると ずのような そりが でやすいです", id: "Jika komponen yang panjang dan sempit ditekuk-V, kelengkungan (warp) seperti pada gambar mudah terjadi.", answer: true, img: "E-16.png" },

      { no: 17, ja: "ねっかんあつえんこうはんは れいかんあつえんこうはんとくらべて ざいりょうの せいのうの バラツキが おおきいです", id: "Pelat baja canai panas memiliki variasi sifat material yang lebih besar dibandingkan pelat baja canai dingin.", answer: true },
      { no: 18, ja: "クリアランスは かこうする せいひんの せんだんめんの けいじょうに えいきょうします", id: "Clearance mempengaruhi bentuk permukaan geser (shear surface) pada produk yang diproses.", answer: true },
      { no: 19, ja: "あんぜんそうちは かってに とりはずしては いけません", id: "Alat pengaman tidak boleh dilepas sembarangan tanpa izin.", answer: true },
      { no: 20, ja: "しぎょうまえてんけんは まいにち さぎょうかいしまえに おこなう ひつようが あります", id: "Pemeriksaan sebelum mulai bekerja perlu dilakukan setiap hari sebelum memulai pekerjaan.", answer: true },
    ],
  },
  F: {
    title: "Set F — Clutch, Material & K3",
    questions: [
      { no: 1, ja: "こうせんしきあんぜんそうちの ていしせいのうは にんげんの てが うごくはやさを きじゅんに しています", id: "Kemampuan berhenti alat pengaman tipe sinar (photoelectric) didasarkan pada standar kecepatan gerak tangan manusia.", answer: true },
      { no: 2, ja: "クランクプレスの くどうじくの かいてんそくどは じょうしてんと かしてんで もっともおそく なります", id: "Kecepatan putar poros penggerak (drive shaft) crank press menjadi paling lambat pada titik mati atas dan titik mati bawah.", answer: false },
      { no: 3, ja: "スクリュープレスは こうそくど うちぬきかこうに つかいます", id: "Screw press digunakan untuk proses pukul lubang (piercing/blanking) berkecepatan tinggi.", answer: false },
      { no: 4, ja: "ずの プレスきかいの ダイハイトはA です", id: "Tinggi cetakan (die height) mesin press pada gambar ditunjukkan oleh A.", answer: true, img: "F-4.png" },

      { no: 5, ja: "プレスきかいの フリクションクラッチは ローリングキーにより どうりょくを つたえます", id: "Friction clutch pada mesin press meneruskan tenaga penggerak melalui rolling key.", answer: false },
      { no: 6, ja: "うちぬきかこうと せんだんかこうの げんりは おなじです", id: "Prinsip proses pemotongan lubang (blanking) dan proses pemotongan geser (shearing) adalah sama.", answer: true },
      { no: 7, ja: "ずの ぶひんの かこうは Vまげかこうが てきしています", id: "Proses pembuatan komponen pada gambar cocok menggunakan proses tekuk V.", answer: false, img: "F-7.png" },

      { no: 8, ja: "ざいりょうから せいひんをうちぬくときは のこったざいりょうの めんせきを できるだけ ちいさくなるように します", id: "Saat memotong produk dari lembaran material, luas sisa material (scrap) harus dibuat sekecil mungkin.", answer: true },
      { no: 9, ja: "かながたの クッションピンあなの けいは プレスきかいの クッションピンあなの けいより おおきくします", id: "Diameter lubang pin cushion pada cetakan dibuat lebih besar daripada diameter lubang pin cushion mesin press.", answer: true },
      { no: 10, ja: "しぼりパンチのRは パンチラジアスとも いいます", id: "R pada punch penarikan juga disebut punch radius.", answer: true },
      { no: 11, ja: "クリアランスとは パンチとダイの すきまを いいます", id: "Clearance adalah celah (jarak) antara punch dan die.", answer: true },
      { no: 12, ja: "ずのうちぬきかじゅうは パンチにシャーかく（けいしゃかく）をつけても ちいさくなりません", id: "Beban pemotongan pada gambar tidak akan berkurang meskipun punch diberi sudut geser (shear angle).", answer: false, img: "F-12.png" },

      { no: 13, ja: "まげかこうではそざいの あつえんほうこうに きをつけます", id: "Pada proses penekukan (bending), perlu memperhatikan arah pengerolan (rolling direction) material.", answer: true },
      { no: 14, ja: "ずの うちぬきせいひんの Aは バリです", id: "A pada produk hasil pemotongan di gambar adalah burr (sisa tajam).", answer: false, img: "F-14.png" },

      { no: 15, ja: "スプリングバックとは じかんがたって へんけいすることです", id: "Spring back adalah perubahan bentuk (deformasi) yang terjadi seiring berjalannya waktu.", answer: false },
      { no: 16, ja: "ほそながいぶひんを Vまげかこうすると ずのような そりが でやすいです", id: "Jika komponen yang panjang dan sempit ditekuk-V, kelengkungan seperti pada gambar mudah terjadi.", answer: true, img: "F-16.png" },

      { no: 17, ja: "ステンレスこうはんは すべて じしゃくが つきません", id: "Semua pelat baja tahan karat (stainless) tidak dapat ditempeli magnet.", answer: false },
      { no: 18, ja: "プレスかこうよう ざいりょうとして おおくつかわれているのは ねっかんあつえん なんこうはん（SPHC）と れいかんあつえんこうはん（SPCC）です", id: "Bahan yang paling banyak digunakan untuk proses press adalah pelat baja canai panas lunak (SPHC) dan pelat baja canai dingin (SPCC).", answer: true },
      { no: 19, ja: "このひょうしきが あるところは あんぜんです", id: "Tempat yang terdapat tanda peringatan (segitiga seru) ini aman.", answer: false, img: "F-19.png" },

      { no: 20, ja: "だいしゃを おすときは にもつを めのたかさより たかくします", id: "Saat mendorong kereta dorong (trolley), muatan harus dinaikkan lebih tinggi dari ketinggian mata.", answer: false },
    ],
  },
  G: {
    title: "Set G — Ulasan Lanjutan",
    questions: [
      { no: 1, ja: "安全一工程ではスライドが下に向かって動いているときは急停止ができません。", id: "Pada mode operasi satu-siklus aman, slide yang sedang bergerak turun tidak dapat dihentikan mendadak.", answer: false },
      { no: 2, ja: "下の図のプレス機械のダイハイトの寸法はAです。", id: "Dimensi tinggi cetakan (die height) mesin press pada gambar ditunjukkan oleh A.", answer: true, img: "G-2.png" },

      { no: 3, ja: "ナックルプレスは潰しを含んだ加工に適しています。", id: "Knuckle press cocok digunakan untuk proses yang melibatkan penekanan padat/coining.", answer: true },
      { no: 4, ja: "高速の打ち抜き加工にはスクリュープレスを使います。", id: "Screw press digunakan untuk proses pukul lubang (blanking) berkecepatan tinggi.", answer: false },
      { no: 5, ja: "下の図のようなV曲げ加工するときは曲げダイの肩幅Wは板厚Tよりも大きくします。", id: "Saat melakukan penekukan V seperti pada gambar, lebar bahu die tekuk W dibuat lebih besar daripada ketebalan pelat T.", answer: true, img: "G-5.png" },

      { no: 6, ja: "曲げ半径が大きいほどスプリングバックも大きくなります。", id: "Semakin besar radius tekuk, semakin besar pula springback yang terjadi.", answer: true },
      { no: 7, ja: "下の図のAの部分は四角のパンチで抜きます。", id: "Bagian A pada gambar dilubangi menggunakan punch berbentuk persegi.", answer: false, img: "G-7.png" },

      { no: 8, ja: "絞りダイのRはダイラジアスとも言います。", id: "R pada die penarikan (drawing die) juga disebut die radius.", answer: true },
      { no: 9, ja: "機械製図で中心線は細い一点鎖線で表します。", id: "Dalam gambar teknik mesin, garis sumbu (center line) digambarkan dengan garis putus-titik tipis.", answer: true },
      { no: 10, ja: "シャンクは金型の大きさ、重さに関係なくすべての上型に付けます。", id: "Shank dipasang pada semua cetakan atas tanpa memandang ukuran dan berat cetakan.", answer: false },
      { no: 11, ja: "U曲げ型はパンチよりダイのほうが摩耗しやすいです。", id: "Pada cetakan tekuk U, bagian die lebih mudah aus dibandingkan punch.", answer: true },
      { no: 12, ja: "フランジ付き円筒絞りのしわはノックアウト力を強くすると少なくなります。", id: "Saat melakukan penarikan silinder berflensa, kerutan yang terjadi dapat dikurangi dengan memperkuat gaya knockout.", answer: false },
      { no: 13, ja: "精密な穴抜き加工ではパンチの摩耗が穴の寸法に影響します。", id: "Pada proses pelubangan presisi, keausan punch mempengaruhi dimensi lubang yang dihasilkan.", answer: true },
      { no: 14, ja: "下の図の打ち抜き製品のAはバリです。", id: "A pada produk hasil pemotongan di gambar adalah burr (sisa tajam).", answer: false, img: "G-14.png" },

      { no: 15, ja: "絞り加工ではショックマーク（リングマーク）はできません。", id: "Pada proses penarikan (drawing), tanda kejut (shock mark / ring mark) tidak akan muncul.", answer: false },
      { no: 16, ja: "アルミニウム板金材料はすべて伸びやすい材料です。", id: "Semua bahan pelat aluminium adalah bahan yang mudah mulur/ditarik.", answer: false },
      { no: 17, ja: "冷間圧延鋼板は熱間圧延鋼板に比べて整形性がすぐれています。", id: "Pelat baja canai dingin memiliki sifat mampu bentuk (formability) yang lebih baik dibandingkan pelat baja canai panas.", answer: true },
      { no: 18, ja: "消火器や電源盤の前にものを置いてもよいです。", id: "Boleh meletakkan barang di depan alat pemadam kebakaran atau panel listrik.", answer: false },
      { no: 19, ja: "金属プレス作業をするときは安全靴をはきます。", id: "Saat melakukan pekerjaan metal press, wajib memakai sepatu keselamatan (safety shoes).", answer: true },
      { no: 20, ja: "フォークリフトを運転するときはパレットを目の高さより高くします。", id: "Saat mengemudikan forklift, palet harus dinaikkan lebih tinggi dari ketinggian mata.", answer: false },
    ],
  },
};

/* ============================================================
   STATE
   ============================================================ */

const state = {
  allSets: {},        // gabungan QUIZ_SETS bawaan + soal Firestore
  activeSetKeys: [],   // set-set yang dipakai di sesi kuis sekarang
  queue: [],           // urutan soal aktif { setKey, no, ja, id, answer }
  index: 0,
  score: 0,
  wrong: [],
  studyMode: false,    // true = terjemahan langsung tampil
  answered: false,
};

const els = {};

/* ============================================================
   INIT
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {
  cacheEls();
  state.allSets = JSON.parse(JSON.stringify(QUIZ_SETS));
  bindHomeEvents();
  renderSetPicker();
  await loadCustomSetsFromFirestore();
  renderSetPicker();
});

function cacheEls() {
  els.screens = {
    home: document.getElementById("screen-home"),
    quiz: document.getElementById("screen-quiz"),
    result: document.getElementById("screen-result"),
  };
  els.setPicker = document.getElementById("set-picker");
  els.btnStartAll = document.getElementById("btn-start-all");
  els.btnStartSelected = document.getElementById("btn-start-selected");
  els.toggleStudy = document.getElementById("toggle-study");
  els.firebaseStatus = document.getElementById("firebase-status");

  els.progressFill = document.getElementById("progress-fill");
  els.progressLabel = document.getElementById("progress-label");
  els.scoreLabel = document.getElementById("score-label");
  els.qSetBadge = document.getElementById("q-set-badge");
  els.qJapanese = document.getElementById("q-japanese");
  els.qImageWrap = document.getElementById("q-image-wrap");
  els.qImage = document.getElementById("q-image");
  els.qIndonesian = document.getElementById("q-indonesian");
  els.qIndonesianWrap = document.getElementById("q-indonesian-wrap");
  els.btnTrue = document.getElementById("btn-true");
  els.btnFalse = document.getElementById("btn-false");
  els.feedback = document.getElementById("feedback");
  els.btnNext = document.getElementById("btn-next");
  els.btnQuitQuiz = document.getElementById("btn-quit-quiz");

  els.resultScore = document.getElementById("result-score");
  els.resultTotal = document.getElementById("result-total");
  els.resultPercent = document.getElementById("result-percent");
  els.resultRing = document.getElementById("result-ring");
  els.wrongList = document.getElementById("wrong-list");
  els.btnRetryWrong = document.getElementById("btn-retry-wrong");
  els.btnBackHome = document.getElementById("btn-back-home");

  els.glitterLayer = document.getElementById("glitter-layer");
  els.cyberFlash = document.getElementById("cyber-flash");
}

/* ============================================================
   PALET WARNA (untuk kartu set & efek)
   ============================================================ */

const PALETTE = [
  "#F2E9D8", // Cream
  "#59718A", // Slate Blue
  "#2F6F6D", // Teal
  "#E07A47", // Terracotta
  "#D4A72C", // Mustard
  "#8FA68F", // Sage Green
  "#C47C8A", // Dusty Rose
  "#5B3A62", // Deep Plum
];

function colorForIndex(i) {
  return PALETTE[i % PALETTE.length];
}

/* ============================================================
   SOUND EFFECTS — Web Audio API (tanpa file eksternal)
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
  playTone(520, 880, 0.14, "sine", 0.18);
  setTimeout(() => playTone(780, 1180, 0.18, "sine", 0.15), 90);
}

function playIncorrectSound() {
  playTone(220, 110, 0.28, "sawtooth", 0.14);
  setTimeout(() => playTone(140, 80, 0.22, "square", 0.08), 70);
}

/* ============================================================
   GLITTER CYBERPUNK BURST
   ============================================================ */

function spawnGlitter(isCorrect) {
  if (!els.glitterLayer) return;
  const colors = isCorrect
    ? [PALETTE[2], PALETTE[5], PALETTE[0], PALETTE[4]] // teal, sage, cream, mustard
    : [PALETTE[3], PALETTE[6], PALETTE[7], PALETTE[0]]; // terracotta, rose, plum, cream

  const rect = els.glitterLayer.getBoundingClientRect();
  const originX = rect.width / 2;
  const originY = rect.height * 0.55;

  const count = 26;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "glitter-piece";
    const size = 4 + Math.random() * 6;
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 140;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 30;
    const rot = (Math.random() * 720 - 360) + "deg";
    const color = colors[Math.floor(Math.random() * colors.length)];

    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size}px`;
    piece.style.background = color;
    piece.style.boxShadow = `0 0 6px ${color}`;
    piece.style.setProperty("--dx", `${dx}px`);
    piece.style.setProperty("--dy", `${dy}px`);
    piece.style.setProperty("--rot", rot);
    piece.style.animationDelay = `${Math.random() * 0.08}s`;

    els.glitterLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }

  if (els.cyberFlash) {
    els.cyberFlash.style.setProperty(
      "--flash-color",
      isCorrect ? "var(--teal)" : "var(--terracotta)"
    );
    els.cyberFlash.classList.remove("play");
    void els.cyberFlash.offsetWidth; // restart animasi
    els.cyberFlash.classList.add("play");
  }
}

/* ============================================================
   FIRESTORE — soal tambahan
   ============================================================ */

async function loadCustomSetsFromFirestore() {
  if (!db) return;
  try {
    const snap = await getDocs(collection(db, "customQuestionSets"));
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (!data || !Array.isArray(data.questions)) return;
      state.allSets[docSnap.id] = {
        title: data.title || `Set ${docSnap.id} (Tambahan)`,
        questions: data.questions,
        custom: true,
      };
    });
    setFirebaseStatus(`Terhubung — ${snap.size} set tambahan dimuat.`, "ok");
  } catch (e) {
    console.warn("Tidak bisa memuat soal tambahan dari Firestore:", e);
    setFirebaseStatus("Soal bawaan saja (Firestore tidak tersedia).", "warn");
  }
}

function setFirebaseStatus(text, kind) {
  if (!els.firebaseStatus) return;
  els.firebaseStatus.textContent = text;
  els.firebaseStatus.className = "fb-status " + (kind || "");
}

/* ============================================================
   HOME SCREEN
   ============================================================ */

function bindHomeEvents() {
  els.btnStartAll.addEventListener("click", () => {
    startQuiz(Object.keys(state.allSets));
  });
  els.btnStartSelected.addEventListener("click", () => {
    const checked = Array.from(
      document.querySelectorAll('.set-check:checked')
    ).map((el) => el.dataset.key);
    if (checked.length === 0) {
      pulseWarn(els.btnStartSelected);
      return;
    }
    startQuiz(checked);
  });
  els.toggleStudy.addEventListener("change", (e) => {
    state.studyMode = e.target.checked;
  });
  els.btnQuitQuiz.addEventListener("click", () => showScreen("home"));
  els.btnBackHome.addEventListener("click", () => showScreen("home"));
  els.btnNext.addEventListener("click", nextQuestion);
  els.btnTrue.addEventListener("click", () => answer(true));
  els.btnFalse.addEventListener("click", () => answer(false));
  els.btnRetryWrong.addEventListener("click", () => {
    if (state.wrong.length === 0) return;
    const items = state.wrong.slice();
    beginSession(items);
  });
}

function renderSetPicker() {
  els.setPicker.innerHTML = "";
  Object.keys(state.allSets).forEach((key) => {
    const set = state.allSets[key];
    const card = document.createElement("label");
    card.className = "set-card";
    card.innerHTML = `
      <input type="checkbox" class="set-check" data-key="${key}" />
      <span class="set-card-inner">
        <span class="set-key">${key}</span>
        <span class="set-title">${set.title}</span>
        <span class="set-count">${set.questions.length} soal</span>
      </span>
    `;
    els.setPicker.appendChild(card);
  });
}

function pulseWarn(el) {
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 450);
}

/* ============================================================
   QUIZ FLOW
   ============================================================ */

function startQuiz(setKeys) {
  const items = [];
  setKeys.forEach((key) => {
    const set = state.allSets[key];
    if (!set) return;
    set.questions.forEach((q) => {
      items.push({ setKey: key, ...q });
    });
  });
  shuffle(items);
  beginSession(items);
}

function beginSession(items) {
  state.queue = items;
  state.index = 0;
  state.score = 0;
  state.wrong = [];
  showScreen("quiz");
  renderQuestion();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderQuestion() {
  state.answered = false;
  const total = state.queue.length;
  const current = state.queue[state.index];

  els.progressFill.style.width = `${(state.index / total) * 100}%`;
  els.progressLabel.textContent = `Soal ${state.index + 1} / ${total}`;
  els.scoreLabel.textContent = `Skor: ${state.score}`;
  els.qSetBadge.textContent = `Set ${current.setKey} · No. ${current.no}`;
  els.qJapanese.textContent = current.ja;
  els.qIndonesian.textContent = current.id;

  if (current.img) {
    els.qImage.src = IMAGE_FOLDER + current.img;
    els.qImageWrap.classList.add("visible");
    els.qImage.onerror = () => {
      console.warn(`Gambar tidak ditemukan: ${IMAGE_FOLDER + current.img} (Set ${current.setKey} No. ${current.no})`);
      els.qImageWrap.classList.remove("visible");
    };
  } else {
    els.qImageWrap.classList.remove("visible");
    els.qImage.removeAttribute("src");
  }

  els.qIndonesianWrap.classList.toggle("visible", state.studyMode);
  els.feedback.className = "feedback";
  els.feedback.textContent = "";
  els.btnNext.classList.remove("show");
  els.btnTrue.disabled = false;
  els.btnFalse.disabled = false;
  els.btnTrue.classList.remove("correct", "incorrect");
  els.btnFalse.classList.remove("correct", "incorrect");
}

function answer(userSaysTrue) {
  if (state.answered) return;
  state.answered = true;
  const current = state.queue[state.index];
  const isCorrect = userSaysTrue === current.answer;

  els.qIndonesianWrap.classList.add("visible");
  els.btnTrue.disabled = true;
  els.btnFalse.disabled = true;

  const correctBtn = current.answer ? els.btnTrue : els.btnFalse;
  correctBtn.classList.add("correct");
  if (!isCorrect) {
    const wrongBtn = userSaysTrue ? els.btnTrue : els.btnFalse;
    wrongBtn.classList.add("incorrect");
  }

  if (isCorrect) {
    state.score += 1;
    els.feedback.textContent = "✓ Benar! Kamu menguasai soal ini.";
    els.feedback.className = "feedback ok";
    playCorrectSound();
    spawnGlitter(true);
  } else {
    state.wrong.push(current);
    const label = current.answer ? "BENAR (Tadashii)" : "SALAH (Ayamari)";
    els.feedback.textContent = `✗ Kurang tepat. Jawaban yang benar: ${label}.`;
    els.feedback.className = "feedback bad";
    playIncorrectSound();
    spawnGlitter(false);
  }

  els.scoreLabel.textContent = `Skor: ${state.score}`;
  els.btnNext.classList.add("show");
  els.btnNext.textContent =
    state.index + 1 < state.queue.length ? "Soal Berikutnya →" : "Lihat Hasil →";
}

function nextQuestion() {
  state.index += 1;
  if (state.index >= state.queue.length) {
    finishQuiz();
  } else {
    renderQuestion();
  }
}

function finishQuiz() {
  const total = state.queue.length;
  const percent = total ? Math.round((state.score / total) * 100) : 0;

  els.resultScore.textContent = state.score;
  els.resultTotal.textContent = total;
  els.resultPercent.textContent = `${percent}%`;
  els.resultRing.style.setProperty("--pct", percent);

  els.wrongList.innerHTML = "";
  if (state.wrong.length === 0) {
    els.wrongList.innerHTML = `<li class="wrong-empty">Sempurna! Tidak ada soal yang salah. 🎉</li>`;
    els.btnRetryWrong.classList.add("hidden");
  } else {
    els.btnRetryWrong.classList.remove("hidden");
    state.wrong.forEach((q) => {
      const li = document.createElement("li");
      li.className = "wrong-item";
      li.innerHTML = `
        <div class="wrong-badge">Set ${q.setKey} · No. ${q.no}</div>
        <div class="wrong-ja">${q.ja}</div>
        <div class="wrong-id">${q.id}</div>
        <div class="wrong-answer">Jawaban benar: <b>${q.answer ? "BENAR" : "SALAH"}</b></div>
      `;
      els.wrongList.appendChild(li);
    });
  }

  showScreen("result");
}

/* ============================================================
   SCREEN SWITCH
   ============================================================ */

function showScreen(name) {
  Object.entries(els.screens).forEach(([key, el]) => {
    el.classList.toggle("active", key === name);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}
