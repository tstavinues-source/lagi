/* ============================================================
   KEYWORDHINTS.JS — Pemicu ingatan singkat per kata kunci
   ============================================================
   File ini BERDIRI SENDIRI dan terpisah dari explain.js.

   Bedanya dengan explanation di explain.js:
   - explanation (explain.js)  = penjelasan teknis LENGKAP kenapa
     jawaban soal itu benar/salah — tetap dipertahankan apa adanya.
   - hint (file ini)           = kalimat PEMICU INGATAN yang pendek
     dan sederhana, khusus untuk kata kunci tertentu. Tujuannya
     supaya begitu user lihat kata kunci itu lagi di lain waktu,
     langsung "klik" di kepala tanpa perlu baca penjelasan panjang.
     Contoh gaya yang dipakai: "Karena tipis hasil partnya
     mengkerut (benar)".

   Cara pakai (sudah disambungkan otomatis lewat explain.js):
     import { getKeywordHint } from "./keywordhints.js";
     const hint = getKeywordHint(setKey, no, word);

   Cara menambah/mengedit: cari baris "SetKey-Nomor" lalu ubah teks
   di sebelah kanan kata kunci yang dimaksud. Kalau soal baru belum
   punya entri di sini, sistem otomatis memakai penjelasan biasa
   dari explain.js sebagai cadangan — tidak akan error.
   ============================================================ */

export const KEYWORD_HINTS = {
  /* ================= SET A ================= */
  "A-1": { "スクリュープレス": "Screw press itu pelan, bukan cepat (salah)", "こうそくど": "Kecepatan tinggi bukan sifat screw press (salah)" },
  "A-2": { "ストローク": "Stroke = 2x radius, bukan sama (salah)", "はんけい": "Radius cuma setengah dari stroke (salah)" },
  "A-3": { "トランスファプレス": "Transfer press = multi-tahap, sesuai namanya (benar)", "たこうてい": "Multi-tahap memang ciri transfer press (benar)" },
  "A-4": { "フレーム": "Rangka bentuk huruf C = C-frame (benar)" },
  "A-5": { "フリクションクラッチ": "Friction clutch justru BISA inching (salah)", "すんどううんてん": "Inching itu kelebihan friction clutch (salah)" },
  "A-6": { "せんだんながさ": "Panjang geser = bagian rumus gaya potong (benar)", "いたあつ": "Tebal pelat = bagian rumus gaya potong (benar)", "ざいしつ": "Jenis bahan = bagian rumus gaya potong (benar)" },
  "A-7": { "うちぬき": "Salah satu dari 4 proses press dasar (benar)", "まげ": "Salah satu dari 4 proses press dasar (benar)", "せいけい": "Salah satu dari 4 proses press dasar (benar)", "しぼり": "Salah satu dari 4 proses press dasar (benar)" },
  "A-8": { "がいけいぬき": "Lubang di tengah = piercing, bukan potong bentuk luar (salah)" },
  "A-9": { "クッションピン": "Lubang di cetakan harus lebih besar (benar)", "あな": "Lubang cetakan > lubang mesin (benar)", "おおきく": "Cetakan dibuat lebih besar dari mesin (benar)" },
  "A-10": { "ストリッパー": "Stripper = pelepas material dari punch (benar)", "ひきはなす": "Tugas stripper memang melepaskan (benar)" },
  "A-11": { "うわがた": "Upper die dipasang lebih dulu (benar)", "こていします": "Fiksasi dimulai dari atas (benar)" },
  "A-12": { "ダイラジアス": "R pada drawing die = die radius (benar)" },
  "A-13": { "かすあがり": "Sisa potongan naik = penyebab cacat (benar)" },
  "A-14": { "ノックアウト": "Kerutan diatasi blank holder, bukan knockout (salah)", "しわ": "Bukan knockout yang mengurangi kerutan (salah)" },
  "A-15": { "クリアランス": "Clearance besar = permukaan geser sempit (benar)", "せんだんめん": "Permukaan geser menyempit kalau clearance besar (benar)" },
  "A-16": { "クリアランス": "Clearance besar = burr besar, bukan permukaan ganda (salah)", "にじせんだんめん": "Bukan istilah untuk efek clearance besar (salah)" },
  "A-17": { "ねっかんあつえん": "SPHC = material press paling umum (benar)", "れいかんあつえん": "SPCC = material press paling umum (benar)" },
  "A-18": { "じゅんど": "Aluminium murni = lebih lunak (benar)", "しぼりせいけいせい": "Murni tinggi = drawability bagus (benar)" },
  "A-19": { "ボルスタ": "Alat dibiarkan di atas bolster = bahaya (salah)", "おいたまま": "Ditinggal tergeletak = risiko K3 (salah)" },
  "A-20": { "あんぜんいちこうてい": "Kerja manual wajib pakai mode aman (benar)" },

  /* ================= SET B ================= */
  "B-1": { "じゅうりょう": "Penyeimbang itu untuk berat SLIDE, bukan cetakan (salah)", "バランス": "Balance buat slide, bukan cetakan (salah)" },
  "B-2": { "ガードしき": "Salah satu jenis alat pengaman standar (benar)", "こうせんしき": "Salah satu jenis alat pengaman standar (benar)", "りょうてそうさしき": "Salah satu jenis alat pengaman standar (benar)" },
  "B-3": { "おしボタン": "Jarak tombol dua-tangan minimal 300mm (benar)", "かんかく": "300mm = jarak aman standar (benar)" },
  "B-4": { "フレーム": "Rangka bentuk huruf C = C-frame (benar)" },
  "B-5": { "ダイクッション": "Die cushion = penahan kerutan drawing (benar)", "しわおさえ": "Fungsi die cushion memang blank holder (benar)" },
  "B-6": { "うえほうこう": "Menarik ke atas saja ≠ reverse drawing (salah)", "ぎゃくしぼりかこう": "Reverse drawing = arah terbalik, bukan sekadar atas (salah)" },
  "B-7": { "しぼりがた": "Bentuk kanal U = hasil bending, bukan drawing (salah)" },
  "B-8": { "アルミニウム": "Clearance beda tiap jenis logam (benar)", "なんこうはん": "Clearance disesuaikan per material (benar)", "クリアランス": "Aluminium vs baja lunak clearance-nya beda (benar)" },
  "B-9": { "まげがた": "L-bend & U-bend = klasifikasi standar (benar)" },
  "B-10": { "シャーかく": "Shear angle justru MENGURANGI beban potong (salah)" },
  "B-11": { "したがた": "Harusnya upper die duluan, bukan lower (salah)", "こていします": "Urutan pasang mulai dari atas (salah)" },
  "B-12": { "ダイラジアス": "R pada drawing die = die radius (benar)" },
  "B-13": { "かえり": "Kaeri & bari = istilah untuk hal sama (benar)", "バリ": "Dua nama, satu makna: burr (benar)" },
  "B-14": { "かたはば": "Lebar bahu die = 6-8x tebal pelat (benar)" },
  "B-15": { "クリアランス": "Clearance besar = burr besar (benar)", "バリ": "Burr besar akibat clearance besar (benar)" },
  "B-16": { "われ": "Retak muncul di sisi luar tekukan (benar)", "そとがわ": "Sisi luar paling meregang saat ditekuk (benar)" },
  "B-17": { "ひじゅう": "Aluminium justru lebih ringan dari baja (salah)", "アルミニウム": "Berat jenis aluminium lebih kecil (salah)" },
  "B-18": { "ひっぱりおうりょく": "Baja lebih kuat tarik dari aluminium (benar)" },
  "B-19": { "ひょうしき": "Tanda larangan wajib dipatuhi (benar)" },
  "B-20": { "でんげん": "Matikan power saat tinggalkan mesin (benar)", "きります": "Prosedur K3 dasar (benar)" },

  /* ================= SET C ================= */
  "C-1": { "あんぜんいちこうてい": "Mode aman justru BISA berhenti darurat (salah)", "きゅうていし": "Emergency stop tetap bisa jalan (salah)" },
  "C-2": { "ガードしき": "Guard = penghalang fisik, bukan sensor (salah)" },
  "C-3": { "ダイクッション": "Posisi A di gambar = die cushion (benar)" },
  "C-4": { "ダイハイト": "Dimensi A di gambar = die height (benar)" },
  "C-5": { "フリクションクラッチ": "Friction clutch justru BISA inching (salah)", "すんどううんてん": "Inching tetap bisa dengan friction clutch (salah)" },
  "C-6": { "しわおさえりょく": "Gaya blank holder = seminimal mungkin (benar)", "さいてい": "Cukup asal kerutan tak muncul (benar)" },
  "C-7": { "はりだしかこう": "Stretch forming = MENIPISKAN, bukan menebalkan (salah)", "あつく": "Justru menipis, bukan tebal (salah)" },
  "C-8": { "まげ": "L-bend & U-bend = klasifikasi standar (benar)" },
  "C-9": { "しぼりがた": "Punch + die + blank holder = bagian utama (benar)", "しわおさえ": "Blank holder = bagian utama cetakan (benar)" },
  "C-10": { "したがた": "Harusnya upper die duluan (salah)", "こていします": "Urutan pasang mulai dari atas (salah)" },
  "C-11": { "まげがた": "Bentuk V di cetakan = V-bend die (benar)" },
  "C-12": { "ダイラジアス": "R pada drawing die = die radius (benar)" },
  "C-13": { "バリ": "Tekstur kasar = fracture zone, bukan burr (salah)" },
  "C-14": { "ショックマーク": "Shock mark justru sering muncul di drawing (salah)" },
  "C-15": { "バーリングかこう": "Lubang berbibir/flensa = proses burring (benar)" },
  "C-16": { "われ": "Retak muncul di sisi luar tekukan (benar)", "そとがわ": "Sisi luar paling meregang (benar)" },
  "C-17": { "じゅんど": "Aluminium murni = lebih lunak (benar)", "しぼりせいけいせい": "Murni tinggi = drawability bagus (benar)" },
  "C-18": { "ステンレスこうはん": "Tidak semua stainless anti-magnet (salah)", "じしゃく": "Jenis ferritic tetap nempel magnet (salah)" },
  "C-19": { "あんぜんきょういく": "Wajib pelatihan sebelum kerja pertama kali (benar)" },
  "C-20": { "でんげん": "Matikan power saat tinggalkan mesin (benar)", "きります": "Prosedur K3 dasar (benar)" },

  /* ================= SET D ================= */
  "D-1": { "こうせんしき": "Definisi photoelectric type ini memang tepat (benar)" },
  "D-2": { "おしボタン": "Standarnya 300mm, bukan 200mm (salah)", "かんかく": "Jarak tombol seharusnya lebih jauh (salah)" },
  "D-3": { "ストレートサイドがた": "C-frame lebih unggul soal workability (salah)", "さぎょうせい": "Straight-side unggul presisi, bukan kerja (salah)" },
  "D-4": { "フライホイール": "SPM sebanding putaran flywheel (benar)", "かいてんすう": "Makin cepat putar, makin besar SPM (benar)" },
  "D-5": { "フレーム": "Huruf A di gambar bukan rangka utama (salah)" },
  "D-6": { "まげかこう": "Bentuk rumit butuh tekuk bertahap, bukan V simpel (salah)" },
  "D-7": { "せんだんめん": "Bagian A di gambar = shear surface (benar)" },
  "D-8": { "はりだしかこう": "Stretch forming = MENIPISKAN, bukan menebalkan (salah)", "あつく": "Justru menipis (salah)" },
  "D-9": { "じゅんおくりがた": "Progressive die butuh akurasi posisi tiap tahap (benar)", "いちせいど": "Posisi presisi = kunci progressive die (benar)" },
  "D-10": { "がいけいぬき": "Stripper lepas material setelah blanking (benar)", "ストリッパー": "Fungsi stripper memang melepaskan material (benar)" },
  "D-11": { "うわがた": "Upper die dipasang di sisi slide (benar)", "スライドがわ": "Slide = tempat cetakan atas menempel (benar)" },
  "D-12": { "パンチラジアス": "R pada drawing punch = punch radius (benar)" },
  "D-13": { "さいしょうまげはんけい": "Radius tekuk minimum penting dihitung (benar)" },
  "D-14": { "したあな": "Proses dari sisi burr lubang awal (benar)", "バリがわ": "Aliran material lebih mulus dari sisi burr (benar)" },
  "D-15": { "スプリングゴー": "Menutup ke dalam saat tekuk U = spring-go (benar)" },
  "D-16": { "かえり": "Kaeri & bari sebenarnya istilah yang sama (salah)", "バリ": "Dua nama, satu makna — bukan beda (salah)" },
  "D-17": { "ひじゅう": "Aluminium justru lebih ringan dari baja (salah)", "アルミニウム": "Berat jenis aluminium lebih kecil (salah)" },
  "D-18": { "たいしょくせい": "Aluminium justru lebih tahan korosi (salah)" },
  "D-19": { "ひょうしき": "Tanda larangan wajib dipatuhi (benar)" },
  "D-20": { "しぎょうまえてんけん": "Cek sebelum kerja = wajib tiap hari (benar)" },

  /* ================= SET E ================= */
  "E-1": { "あんぜんいちこうてい": "Mode aman justru BISA berhenti darurat (salah)", "きゅうていし": "Emergency stop tetap bisa jalan (salah)" },
  "E-2": { "こうせんしき": "Photoelectric menghitung kecepatan tangan manusia (benar)", "ていしせいのう": "Basis kemampuan berhenti = kecepatan tangan (benar)" },
  "E-3": { "フリクションクラッチ": "Friction clutch justru BISA inching (salah)", "すんどううんてん": "Inching tetap bisa dilakukan (salah)" },
  "E-4": { "すんどううんてん": "Produksi normal pakai mode kontinu, bukan inching (salah)" },
  "E-5": { "ダイクッション": "Die cushion = penahan kerutan drawing (benar)", "しわおさえ": "Fungsi die cushion memang blank holder (benar)" },
  "E-6": { "パンチ": "Gaya potong dari keliling potong, bukan luas punch (salah)", "めんせき": "Bukan luas penampang yang dipakai (salah)" },
  "E-7": { "ダレ": "Bagian membulat di tepi = dare/rollover (benar)" },
  "E-8": { "はりだしかこう": "Stretch forming = MENIPISKAN, bukan menebalkan (salah)", "あつく": "Justru menipis (salah)" },
  "E-9": { "シャーかく": "Shear angle MENGURANGI beban potong (benar)", "ちいさくなります": "Beban jadi lebih kecil dengan shear angle (benar)" },
  "E-10": { "うわがた": "Upper die dipasang lebih dulu (benar)", "こていします": "Fiksasi dimulai dari atas (benar)" },
  "E-11": { "クリアランス": "Huruf A di gambar bukan menunjuk clearance (salah)" },
  "E-12": { "いたあつ": "Ketebalan bisa bertambah di area tertentu (benar)", "おおきくなる": "Kompresi bikin sebagian menebal (benar)" },
  "E-13": { "かすあがり": "Sisa potongan naik = penyebab cacat (benar)" },
  "E-14": { "しぼりりつ": "Drawing ratio dipakai di penarikan, bukan tekuk (salah)", "まげかこう": "Bukan dipakai di proses bending (salah)" },
  "E-15": { "いたあつ": "Pelat tipis lebih rentan berkerut (benar)", "しわ": "Kurang kaku = gampang kerut (benar)" },
  "E-16": { "ほそながい": "Komponen panjang-sempit rawan melengkung (benar)", "そり": "Gaya tak merata bikin warp (benar)" },
  "E-17": { "ねっかんあつえん": "Hot rolled = variasi sifat lebih besar (benar)", "バラツキ": "Kurang presisi dari cold rolled (benar)" },
  "E-18": { "クリアランス": "Clearance pengaruhi bentuk permukaan geser (benar)", "せんだんめん": "Kekasaran shear surface tergantung clearance (benar)" },
  "E-19": { "あんぜんそうち": "Alat pengaman tak boleh dilepas sembarangan (benar)" },
  "E-20": { "しぎょうまえてんけん": "Cek sebelum kerja = wajib tiap hari (benar)" },

  /* ================= SET F ================= */
  "F-1": { "こうせんしき": "Photoelectric menghitung kecepatan tangan manusia (benar)", "ていしせいのう": "Basis kemampuan berhenti = kecepatan tangan (benar)" },
  "F-2": { "くどうじく": "Poros penggerak konstan, yang melambat itu slide (salah)", "かいてんそくど": "Kecepatan motor tetap, bukan melambat (salah)" },
  "F-3": { "スクリュープレス": "Screw press itu pelan, bukan cepat (salah)", "こうそくど": "Bukan untuk kecepatan tinggi (salah)" },
  "F-4": { "ダイハイト": "Dimensi A di gambar = die height (benar)" },
  "F-5": { "フリクションクラッチ": "Friction clutch pakai gesekan, bukan rolling key (salah)", "ローリングキー": "Rolling key itu ciri key clutch (salah)" },
  "F-6": { "うちぬきかこう": "Blanking = bentuk khusus dari shearing (benar)", "せんだんかこう": "Prinsip dasarnya sama dengan shearing (benar)" },
  "F-7": { "まげかこう": "Bentuk rumit butuh tekuk bertahap (salah)" },
  "F-8": { "のこった": "Sisa scrap harus dibuat sekecil mungkin (benar)", "めんせき": "Efisiensi material = sisa minimal (benar)" },
  "F-9": { "クッションピン": "Lubang di cetakan harus lebih besar (benar)", "おおきく": "Cetakan dibuat lebih besar dari mesin (benar)" },
  "F-10": { "パンチラジアス": "R pada drawing punch = punch radius (benar)" },
  "F-11": { "クリアランス": "Clearance = celah antara punch dan die (benar)" },
  "F-12": { "シャーかく": "Shear angle justru MENGURANGI beban (salah)" },
  "F-13": { "あつえんほうこう": "Arah pengerolan pengaruhi risiko retak (benar)" },
  "F-14": { "バリ": "Tekstur kasar = fracture zone, bukan burr (salah)" },
  "F-15": { "スプリングバック": "Springback = pemulihan LANGSUNG, bukan seiring waktu (salah)" },
  "F-16": { "ほそながい": "Komponen panjang-sempit rawan melengkung (benar)", "そり": "V-bend di bagian sempit = warp (benar)" },
  "F-17": { "ステンレスこうはん": "Tidak semua stainless anti-magnet (salah)", "じしゃく": "Jenis ferritic tetap nempel magnet (salah)" },
  "F-18": { "ねっかんあつえん": "SPHC = material press paling umum (benar)", "れいかんあつえん": "SPCC = material press paling umum (benar)" },
  "F-19": { "ひょうしき": "Segitiga seru = tanda BAHAYA, bukan aman (salah)" },
  "F-20": { "めのたかさ": "Muatan harusnya di BAWAH mata, bukan atas (salah)" },

  /* ================= SET G ================= */
  "G-1": { "安全一工程": "Mode aman justru BISA berhenti darurat (salah)", "急停止": "Emergency stop tetap bisa jalan (salah)" },
  "G-2": { "ダイハイト": "Dimensi A di gambar = die height (benar)" },
  "G-3": { "ナックルプレス": "Knuckle press cocok buat coining (benar)", "潰し": "Tonase besar di titik bawah = coining (benar)" },
  "G-4": { "スクリュープレス": "Screw press itu pelan, bukan cepat (salah)" },
  "G-5": { "肩幅": "Lebar bahu die = 6-8x tebal pelat (benar)", "板厚": "Bahu die jauh lebih besar dari tebal pelat (benar)" },
  "G-6": { "曲げ半径": "Radius besar = springback makin besar (benar)", "スプリングバック": "Deformasi plastis kecil = springback besar (benar)" },
  "G-7": { "四角": "Bentuk di gambar bulat, bukan persegi (salah)" },
  "G-8": { "ダイラジアス": "R pada drawing die = die radius (benar)" },
  "G-9": { "中心線": "Garis sumbu = garis putus-titik tipis (benar)", "一点鎖線": "Aturan standar gambar teknik JIS (benar)" },
  "G-10": { "すべて": "Tidak semua upper die pakai shank (salah)", "シャンク": "Cetakan besar biasa diklem, bukan pakai shank (salah)" },
  "G-11": { "摩耗": "Die U-bend lebih cepat aus dari punch (benar)" },
  "G-12": { "ノックアウト": "Kerutan diatasi blank holder, bukan knockout (salah)" },
  "G-13": { "摩耗": "Keausan punch pengaruhi presisi lubang (benar)", "寸法": "Ukuran lubang ikut ukuran punch (benar)" },
  "G-14": { "バリ": "Tekstur kasar = fracture zone, bukan burr (salah)" },
  "G-15": { "ショックマーク": "Shock mark justru sering muncul di drawing (salah)" },
  "G-16": { "すべて": "Tidak semua aluminium mudah mulur (salah)", "伸びやすい": "Tergantung jenis paduan & temper (salah)" },
  "G-17": { "冷間圧延": "Cold rolled = permukaan lebih halus (benar)", "整形性": "Akurasi dimensi lebih baik dari hot rolled (benar)" },
  "G-18": { "消火器": "Area depan alat pemadam wajib bebas hambatan (salah)", "電源盤": "Panel listrik harus mudah diakses (salah)" },
  "G-19": { "安全靴": "Sepatu keselamatan wajib dipakai saat kerja press (benar)" },
  "G-20": { "目の高さ": "Muatan forklift harusnya di BAWAH mata (salah)" },
};

/**
 * Ambil pemicu ingatan singkat untuk satu kata kunci.
 * Balikin null kalau belum ada datanya (soal custom baru, dsb) —
 * pemanggilnya (explain.js) akan otomatis pakai cadangan penjelasan biasa.
 */
export function getKeywordHint(setKey, no, word) {
  const entry = KEYWORD_HINTS[`${setKey}-${no}`];
  if (!entry) return null;
  return entry[word] || null;
}
