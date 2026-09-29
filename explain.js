/* ============================================================
   EXPLAIN.JS — Kata kunci penanda + penjelasan jawaban
   ============================================================
   File ini BERDIRI SENDIRI (tidak menambah beban script.js):
   - Menyimpan daftar kata kunci "sinyal" per soal (kata yang jadi
     penanda kenapa jawabannya BENAR/SALAH) + penjelasan singkat
   - highlightKeywords(html, setKey, no) menandai kata kunci itu
     dengan warna berbeda di dalam teks soal yang sudah dianotasi
     oleh vocab.js
   - showExplanation(setKey, no, correctAnswer) menampilkan kartu
     penjelasan setelah user menjawab
   - Highlight kata kunci baru terlihat (revealed) saat Mode Belajar
     aktif ATAU setelah user menjawab — supaya tidak membocorkan
     jawaban sebelum dicoba

   Cara pakai di script.js (sudah ditambahkan):
     import { highlightKeywords, showExplanation, hideExplanation } from "./explain.js";
     els.qJapanese.innerHTML = highlightKeywords(annotateJapanese(current.ja), current.setKey, current.no);
     els.qJapanese.classList.toggle("kw-reveal", state.studyMode);
     ...
     els.qJapanese.classList.add("kw-reveal");
     showExplanation(current.setKey, current.no, current.answer);

   Cara menambah/mengedit soal baru: tambah entri baru di objek
   EXPLANATIONS di bawah dengan key "SetKey-Nomor" (contoh "H-1"),
   format:
     "H-1": { keywords: ["kata1","kata2"], explanation: "penjelasan singkat" }
   ============================================================ */

import { getKeywordHint } from "./keywordhints.js";

const EXPLANATIONS = {
  /* ================= SET A ================= */
  "A-1": { keywords: ["スクリュープレス", "こうそくど"], explanation: "Screw press dipakai untuk proses tekan kecepatan RENDAH seperti coining/forging, bukan piercing kecepatan tinggi — itu tugas mechanical/crank press." },
  "A-2": { keywords: ["ストローク", "はんけい"], explanation: "Panjang stroke crank press = 2 kali jari-jari crank (diameternya), bukan sama dengan jari-jarinya." },
  "A-3": { keywords: ["トランスファプレス", "たこうてい"], explanation: "Sesuai definisi baku, transfer press memang dirancang untuk proses berkelanjutan multi-tahap (multi-station)." },
  "A-4": { keywords: ["フレーム"], explanation: "Bentuk rangka seperti huruf C pada gambar adalah ciri khas C-frame press." },
  "A-5": { keywords: ["フリクションクラッチ", "すんどううんてん"], explanation: "Justru crank press dengan friction clutch BISA melakukan operasi inching — itu salah satu kelebihan utama friction clutch dibanding key/positive clutch." },
  "A-6": { keywords: ["せんだんながさ", "いたあつ", "ざいしつ"], explanation: "Rumus gaya potong memang berbasis panjang geser × ketebalan pelat × kekuatan geser material." },
  "A-7": { keywords: ["うちぬき", "まげ", "せいけい", "しぼり"], explanation: "Ini definisi umum jenis-jenis proses press yang memang mencakup keempatnya." },
  "A-8": { keywords: ["がいけいぬき"], explanation: "Bentuk pada gambar (lubang di tengah) adalah hasil proses piercing (pelubangan dalam), bukan blanking bentuk luar." },
  "A-9": { keywords: ["クッションピン", "あな", "おおきく"], explanation: "Lubang pin cushion di cetakan harus lebih besar supaya pin bisa bergerak bebas tanpa macet." },
  "A-10": { keywords: ["ストリッパー", "ひきはなす"], explanation: "Sesuai fungsi dasarnya, stripper memang melepaskan material yang menempel di punch setelah proses potong." },
  "A-11": { keywords: ["うわがた", "こていします"], explanation: "Prosedur standar pemasangan cetakan memang dimulai dari upper die (cetakan atas) dahulu." },
  "A-12": { keywords: ["ダイラジアス"], explanation: "Ini memang istilah standar — R pada drawing die disebut die radius." },
  "A-13": { keywords: ["かすあがり"], explanation: "Scrap lift-up (kasu-agari) memang salah satu penyebab umum cacat/goresan pada produk hasil blanking." },
  "A-14": { keywords: ["ノックアウト", "しわ"], explanation: "Kerutan dikurangi dengan memperkuat gaya BLANK HOLDER (penahan kerutan), bukan gaya knockout — fungsinya berbeda." },
  "A-15": { keywords: ["クリアランス", "せんだんめん"], explanation: "Semakin besar clearance, area permukaan geser (burnished surface) yang halus justru semakin sempit." },
  "A-16": { keywords: ["クリアランス", "にじせんだんめん"], explanation: "Clearance besar memang memperbesar burr, tapi tidak menghasilkan 'permukaan geser ganda' seperti pada gambar." },
  "A-17": { keywords: ["ねっかんあつえん", "れいかんあつえん"], explanation: "SPHC (canai panas) dan SPCC (canai dingin) memang dua material baja paling umum dipakai di industri press." },
  "A-18": { keywords: ["じゅんど", "しぼりせいけいせい"], explanation: "Aluminium kemurnian tinggi lebih lunak dan homogen sehingga drawability-nya memang lebih baik." },
  "A-19": { keywords: ["ボルスタ", "おいたまま"], explanation: "Alat yang dibiarkan di atas bolster berisiko tertabrak slide/cetakan saat mesin bergerak — pelanggaran K3 dasar." },
  "A-20": { keywords: ["あんぜんいちこうてい"], explanation: "Kerja manual memang wajib pakai mode operasi satu-siklus aman supaya slide berhenti otomatis tiap 1 langkah." },

  /* ================= SET B ================= */
  "B-1": { keywords: ["じゅうりょう", "バランス"], explanation: "Alat pengimbang (counterbalance) menjaga keseimbangan berat SLIDE, bukan berat cetakan." },
  "B-2": { keywords: ["ガードしき", "こうせんしき", "りょうてそうさしき"], explanation: "Ini daftar standar jenis-jenis alat pengaman press yang memang lengkap dan benar." },
  "B-3": { keywords: ["おしボタン", "かんかく"], explanation: "Standar keselamatan memang mensyaratkan jarak minimum 300mm antar tombol dua-tangan agar tidak bisa ditekan satu tangan." },
  "B-4": { keywords: ["フレーム"], explanation: "Bentuk rangka seperti huruf C pada gambar adalah ciri khas C-frame press." },
  "B-5": { keywords: ["ダイクッション", "しわおさえ"], explanation: "Die cushion memang berfungsi memberi tekanan blank holder pada proses drawing." },
  "B-6": { keywords: ["うえほうこう", "ぎゃくしぼりかこう"], explanation: "Istilah 'reverse drawing' merujuk pada penarikan ulang dengan arah terbalik dari drawing sebelumnya, bukan sekadar 'menarik ke atas'." },
  "B-7": { keywords: ["しぼりがた"], explanation: "Bentuk kanal/U pada gambar adalah hasil proses bending, bukan drawing." },
  "B-8": { keywords: ["アルミニウム", "なんこうはん", "クリアランス"], explanation: "Clearance blanking memang disesuaikan per jenis material karena keuletan tiap logam berbeda." },
  "B-9": { keywords: ["まげがた"], explanation: "Ini klasifikasi standar jenis cetakan tekuk yang memang benar." },
  "B-10": { keywords: ["シャーかく"], explanation: "Justru pemberian shear angle pada punch MENGURANGI beban potong karena kontak jadi bertahap, bukan sekaligus." },
  "B-11": { keywords: ["したがた", "こていします"], explanation: "Urutan standar pemasangan cetakan dimulai dari UPPER DIE (cetakan atas) dulu, bukan lower die." },
  "B-12": { keywords: ["ダイラジアス"], explanation: "Ini memang istilah standar — R pada drawing die disebut die radius." },
  "B-13": { keywords: ["かえり", "バリ"], explanation: "Kaeri dan bari memang dua istilah berbeda untuk hal yang sama, yaitu sisa tajam (burr)." },
  "B-14": { keywords: ["かたはば"], explanation: "Aturan praktis standar menetapkan lebar bahu die tekuk sekitar 6-8 kali ketebalan pelat." },
  "B-15": { keywords: ["クリアランス", "バリ"], explanation: "Clearance besar memang berbanding lurus dengan ukuran burr yang dihasilkan." },
  "B-16": { keywords: ["われ", "そとがわ"], explanation: "Saat ditekuk, sisi luar mengalami peregangan paling besar sehingga retak biasanya muncul di sana." },
  "B-17": { keywords: ["ひじゅう", "アルミニウム"], explanation: "Berat jenis aluminium (~2.7) justru jauh lebih kecil dibanding baja (~7.85)." },
  "B-18": { keywords: ["ひっぱりおうりょく"], explanation: "Baja memiliki tensile strength jauh lebih tinggi dibanding aluminium murni." },
  "B-19": { keywords: ["ひょうしき"], explanation: "Tanda larangan masuk memang wajib dipatuhi demi keselamatan." },
  "B-20": { keywords: ["でんげん", "きります"], explanation: "Mematikan power saat meninggalkan mesin adalah prosedur K3 standar untuk mencegah kecelakaan." },

  /* ================= SET C ================= */
  "C-1": { keywords: ["あんぜんいちこうてい", "きゅうていし"], explanation: "Mode safety one-stroke justru dirancang supaya slide BISA dihentikan darurat kapan saja selama bergerak turun." },
  "C-2": { keywords: ["ガードしき"], explanation: "Guard type adalah penghalang FISIK yang mencegah tangan masuk, bukan sensor otomatis — itu ciri photoelectric type." },
  "C-3": { keywords: ["ダイクッション"], explanation: "Sesuai posisi pada diagram, bagian A memang menunjuk die cushion." },
  "C-4": { keywords: ["ダイハイト"], explanation: "Sesuai posisi pada diagram, dimensi A memang menunjukkan die height." },
  "C-5": { keywords: ["フリクションクラッチ", "すんどううんてん"], explanation: "Justru crank press dengan friction clutch BISA melakukan operasi inching." },
  "C-6": { keywords: ["しわおさえりょく", "さいてい"], explanation: "Gaya blank holder idealnya seminimal mungkin (cukup mencegah kerutan) supaya material tidak sobek/tertahan berlebihan." },
  "C-7": { keywords: ["はりだしかこう", "あつく"], explanation: "Stretch/bulge forming justru MENIPISKAN pelat karena material diregangkan, bukan menebalkannya." },
  "C-8": { keywords: ["まげ"], explanation: "Ini klasifikasi standar jenis proses tekuk yang memang benar." },
  "C-9": { keywords: ["しぼりがた", "しわおさえ"], explanation: "Bagian utama cetakan penarikan memang terdiri dari punch, die, dan blank holder." },
  "C-10": { keywords: ["したがた", "こていします"], explanation: "Urutan standar pemasangan cetakan dimulai dari UPPER DIE (cetakan atas) dulu, bukan lower die." },
  "C-11": { keywords: ["まげがた"], explanation: "Bentuk V pada cetakan di gambar memang ciri khas V-bend die." },
  "C-12": { keywords: ["ダイラジアス"], explanation: "Ini memang istilah standar — R pada drawing die disebut die radius." },
  "C-13": { keywords: ["バリ"], explanation: "Bagian bertekstur kasar pada gambar adalah permukaan patah (fracture zone), bukan burr — burr letaknya di tepi tajam." },
  "C-14": { keywords: ["ショックマーク"], explanation: "Shock mark/ring mark justru sering muncul pada proses drawing akibat getaran awal punch menyentuh material." },
  "C-15": { keywords: ["バーリングかこう"], explanation: "Proses membuat lubang berbibir/flensa seperti pada gambar memang disebut burring." },
  "C-16": { keywords: ["われ", "そとがわ"], explanation: "Saat ditekuk, sisi luar mengalami peregangan paling besar sehingga retak biasanya muncul di sana." },
  "C-17": { keywords: ["じゅんど", "しぼりせいけいせい"], explanation: "Aluminium kemurnian tinggi lebih lunak dan homogen sehingga drawability-nya memang lebih baik." },
  "C-18": { keywords: ["ステンレスこうはん", "じしゃく"], explanation: "Hanya stainless jenis austenitic yang non-magnetic; jenis ferritic/martensitic tetap menempel magnet — jadi tidak 'semua'." },
  "C-19": { keywords: ["あんぜんきょういく"], explanation: "Pelatihan keselamatan wajib diikuti sebelum mulai bekerja dengan mesin press, terutama bagi pekerja baru." },
  "C-20": { keywords: ["でんげん", "きります"], explanation: "Mematikan power saat meninggalkan mesin adalah prosedur K3 standar untuk mencegah kecelakaan." },

  /* ================= SET D ================= */
  "D-1": { keywords: ["こうせんしき"], explanation: "Ini definisi tepat photoelectric type — sensor berhenti otomatis saat tangan/jari mendekat." },
  "D-2": { keywords: ["おしボタン", "かんかく"], explanation: "Standar sebenarnya minimal 300mm (bukan 200mm) supaya tombol tidak bisa ditekan dengan satu tangan." },
  "D-3": { keywords: ["ストレートサイドがた", "さぎょうせい"], explanation: "Justru C-frame lebih unggul soal workability/akses tiga sisi terbuka; straight-side lebih unggul di kekakuan/presisi." },
  "D-4": { keywords: ["フライホイール", "かいてんすう"], explanation: "SPM memang sebanding lurus dengan jumlah putaran flywheel per menit." },
  "D-5": { keywords: ["フレーム"], explanation: "Sesuai posisi pada diagram, huruf A tidak menunjuk ke bagian rangka utama mesin." },
  "D-6": { keywords: ["まげかこう"], explanation: "Bentuk komponen pada gambar (dengan beberapa dimensi tekukan) lebih cocok pakai proses tekuk bertahap, bukan V-bend sederhana." },
  "D-7": { keywords: ["せんだんめん"], explanation: "Sesuai posisi pada diagram, bagian A memang menunjuk permukaan geser (shear surface)." },
  "D-8": { keywords: ["はりだしかこう", "あつく"], explanation: "Stretch/bulge forming justru MENIPISKAN pelat karena material diregangkan, bukan menebalkannya." },
  "D-9": { keywords: ["じゅんおくりがた", "いちせいど"], explanation: "Pada progressive die, akurasi posisi tiap tahap memang wajib dijaga supaya hasil tiap proses presisi." },
  "D-10": { keywords: ["がいけいぬき", "ストリッパー"], explanation: "Stripper memang berfungsi melepas material yang menempel di punch setelah proses blanking." },
  "D-11": { keywords: ["うわがた", "スライドがわ"], explanation: "Cetakan atas memang dipasang di sisi slide (bagian yang bergerak) mesin press." },
  "D-12": { keywords: ["パンチラジアス"], explanation: "Ini memang istilah standar — R pada drawing punch disebut punch radius." },
  "D-13": { keywords: ["さいしょうまげはんけい"], explanation: "Radius tekuk minimum material penting diperhitungkan supaya material tidak retak saat ditekuk." },
  "D-14": { keywords: ["したあな", "バリがわ"], explanation: "Memproses dari sisi burr lubang awal membuat aliran material lebih mulus sehingga retak lebih sulit terjadi." },
  "D-15": { keywords: ["スプリングゴー"], explanation: "Kondisi menutup ke dalam pada tekuk U memang disebut spring-go (kebalikan dari spring-back)." },
  "D-16": { keywords: ["かえり", "バリ"], explanation: "Kaeri dan bari sebenarnya istilah berbeda untuk hal yang SAMA (burr), jadi pernyataan 'berbeda' ini keliru." },
  "D-17": { keywords: ["ひじゅう", "アルミニウム"], explanation: "Berat jenis aluminium (~2.7) justru jauh lebih kecil dibanding baja (~7.85)." },
  "D-18": { keywords: ["たいしょくせい"], explanation: "Justru aluminium punya lapisan oksida alami yang membuatnya lebih tahan korosi dibanding baja polos." },
  "D-19": { keywords: ["ひょうしき"], explanation: "Tanda larangan masuk memang wajib dipatuhi demi keselamatan." },
  "D-20": { keywords: ["しぎょうまえてんけん"], explanation: "Pemeriksaan sebelum kerja memang wajib dilakukan setiap hari sebelum mulai bekerja." },

  /* ================= SET E ================= */
  "E-1": { keywords: ["あんぜんいちこうてい", "きゅうていし"], explanation: "Mode safety one-stroke justru dirancang supaya slide BISA dihentikan darurat kapan saja selama bergerak turun." },
  "E-2": { keywords: ["こうせんしき", "ていしせいのう"], explanation: "Standar desain alat pengaman photoelectric memang menghitung kecepatan tangan manusia sebagai basis jarak aman-berhenti." },
  "E-3": { keywords: ["フリクションクラッチ", "すんどううんてん"], explanation: "Justru crank press dengan friction clutch BISA melakukan operasi inching." },
  "E-4": { keywords: ["すんどううんてん"], explanation: "Produksi normal memakai mode operasi kontinu/otomatis; inching hanya dipakai untuk setting/penyesuaian cetakan." },
  "E-5": { keywords: ["ダイクッション", "しわおさえ"], explanation: "Die cushion memang berfungsi memberi tekanan blank holder pada proses drawing." },
  "E-6": { keywords: ["パンチ", "めんせき"], explanation: "Gaya potong dihitung dari panjang keliling potong × tebal × kekuatan geser, bukan dari luas penampang punch." },
  "E-7": { keywords: ["ダレ"], explanation: "Bagian membulat di tepi hasil pemotongan memang disebut 'dare' (rollover)." },
  "E-8": { keywords: ["はりだしかこう", "あつく"], explanation: "Stretch/bulge forming justru MENIPISKAN pelat karena material diregangkan, bukan menebalkannya." },
  "E-9": { keywords: ["シャーかく", "ちいさくなります"], explanation: "Pemberian shear angle pada punch memang MENGURANGI beban potong karena kontak jadi bertahap." },
  "E-10": { keywords: ["うわがた", "こていします"], explanation: "Prosedur standar pemasangan cetakan memang dimulai dari upper die dahulu." },
  "E-11": { keywords: ["クリアランス"], explanation: "Sesuai posisi pada diagram, huruf A tidak menunjuk ke celah clearance pemotongan." },
  "E-12": { keywords: ["いたあつ", "おおきくなる"], explanation: "Di area tertentu (misal dinding dekat flange), ketebalan bisa bertambah akibat kompresi material saat ditarik." },
  "E-13": { keywords: ["かすあがり"], explanation: "Scrap lift-up (kasu-agari) memang salah satu penyebab umum cacat/goresan pada produk hasil blanking." },
  "E-14": { keywords: ["しぼりりつ", "まげかこう"], explanation: "Drawing ratio dipakai untuk menghitung proses PENARIKAN (drawing), bukan proses tekuk (bending)." },
  "E-15": { keywords: ["いたあつ", "しわ"], explanation: "Pelat tipis lebih rentan berkerut saat proses drawing karena kurang kaku menahan gaya tekan." },
  "E-16": { keywords: ["ほそながい", "そり"], explanation: "Komponen panjang-sempit yang ditekuk-V memang rawan melengkung (warp) akibat distribusi gaya yang tidak merata." },
  "E-17": { keywords: ["ねっかんあつえん", "バラツキ"], explanation: "Proses hot rolling kurang presisi dibanding cold rolling sehingga variasi sifat materialnya lebih besar." },
  "E-18": { keywords: ["クリアランス", "せんだんめん"], explanation: "Clearance memang mempengaruhi bentuk & kekasaran permukaan geser hasil potong." },
  "E-19": { keywords: ["あんぜんそうち"], explanation: "Alat pengaman tidak boleh dilepas sembarangan karena fungsinya vital untuk keselamatan operator." },
  "E-20": { keywords: ["しぎょうまえてんけん"], explanation: "Pemeriksaan sebelum kerja memang wajib dilakukan setiap hari sebelum mulai bekerja." },

  /* ================= SET F ================= */
  "F-1": { keywords: ["こうせんしき", "ていしせいのう"], explanation: "Standar desain alat pengaman photoelectric memang menghitung kecepatan tangan manusia sebagai basis jarak aman-berhenti." },
  "F-2": { keywords: ["くどうじく", "かいてんそくど"], explanation: "Kecepatan putar POROS PENGGERAK (motor) itu konstan; yang melambat di titik mati atas/bawah adalah kecepatan SLIDE." },
  "F-3": { keywords: ["スクリュープレス", "こうそくど"], explanation: "Screw press dipakai untuk proses tekan kecepatan rendah (coining/forging), bukan piercing kecepatan tinggi." },
  "F-4": { keywords: ["ダイハイト"], explanation: "Sesuai posisi pada diagram, dimensi A memang menunjukkan die height." },
  "F-5": { keywords: ["フリクションクラッチ", "ローリングキー"], explanation: "Friction clutch meneruskan tenaga lewat GESEKAN, bukan lewat rolling key — itu ciri khas positive/key clutch." },
  "F-6": { keywords: ["うちぬきかこう", "せんだんかこう"], explanation: "Blanking pada dasarnya adalah bentuk khusus dari proses shearing, jadi prinsip dasarnya memang sama." },
  "F-7": { keywords: ["まげかこう"], explanation: "Bentuk komponen pada gambar lebih cocok pakai proses tekuk bertahap, bukan V-bend sederhana." },
  "F-8": { keywords: ["のこった", "めんせき"], explanation: "Efisiensi material memang menuntut sisa scrap dibuat sekecil mungkin saat menyusun tata letak potongan." },
  "F-9": { keywords: ["クッションピン", "おおきく"], explanation: "Lubang pin cushion di cetakan harus lebih besar supaya pin bisa bergerak bebas tanpa macet." },
  "F-10": { keywords: ["パンチラジアス"], explanation: "Ini memang istilah standar — R pada drawing punch disebut punch radius." },
  "F-11": { keywords: ["クリアランス"], explanation: "Ini definisi dasar clearance yang memang tepat: celah antara punch dan die." },
  "F-12": { keywords: ["シャーかく"], explanation: "Pemberian shear angle pada punch justru MENGURANGI beban potong, bukan tetap sama." },
  "F-13": { keywords: ["あつえんほうこう"], explanation: "Arah pengerolan material memang mempengaruhi risiko retak saat ditekuk, jadi perlu diperhatikan." },
  "F-14": { keywords: ["バリ"], explanation: "Bagian bertekstur kasar pada gambar adalah permukaan patah (fracture zone), bukan burr." },
  "F-15": { keywords: ["スプリングバック"], explanation: "Spring back adalah pemulihan elastis yang terjadi LANGSUNG saat beban dilepas, bukan deformasi seiring waktu." },
  "F-16": { keywords: ["ほそながい", "そり"], explanation: "Komponen panjang-sempit yang ditekuk-V memang rawan melengkung (warp)." },
  "F-17": { keywords: ["ステンレスこうはん", "じしゃく"], explanation: "Hanya stainless jenis austenitic yang non-magnetic; jenis ferritic/martensitic tetap menempel magnet." },
  "F-18": { keywords: ["ねっかんあつえん", "れいかんあつえん"], explanation: "SPHC (canai panas) dan SPCC (canai dingin) memang dua material baja paling umum dipakai di industri press." },
  "F-19": { keywords: ["ひょうしき"], explanation: "Segitiga seru adalah tanda PERINGATAN BAHAYA, bukan tanda aman." },
  "F-20": { keywords: ["めのたかさ"], explanation: "Muatan trolley seharusnya DI BAWAH ketinggian mata supaya pandangan ke depan tidak terhalang saat mendorong." },

  /* ================= SET G ================= */
  "G-1": { keywords: ["安全一工程", "急停止"], explanation: "Mode safety one-stroke justru dirancang supaya slide BISA dihentikan darurat kapan saja selama bergerak turun." },
  "G-2": { keywords: ["ダイハイト"], explanation: "Sesuai posisi pada diagram, dimensi A memang menunjukkan die height." },
  "G-3": { keywords: ["ナックルプレス", "潰し"], explanation: "Knuckle press punya mekanisme yang menghasilkan tonase besar di titik bawah, cocok untuk proses coining/penekanan padat." },
  "G-4": { keywords: ["スクリュープレス"], explanation: "Screw press dipakai untuk proses tekan kecepatan rendah (coining/forging), bukan piercing kecepatan tinggi." },
  "G-5": { keywords: ["肩幅", "板厚"], explanation: "Lebar bahu die tekuk memang harus jauh lebih besar dari tebal pelat (aturan umum sekitar 6-8x)." },
  "G-6": { keywords: ["曲げ半径", "スプリングバック"], explanation: "Menurut kunci lembar latihan (Set G dan lembar 12-4), pernyataan ini SALAH. Catatan: secara teori umum springback cenderung membesar jika radius tekuk makin besar, tetapi untuk ujian ikuti kunci jawaban lembar ini." },
  "G-7": { keywords: ["四角"], explanation: "Bentuk pada gambar adalah lingkaran, jadi harus dipotong pakai punch bulat, bukan punch persegi." },
  "G-8": { keywords: ["ダイラジアス"], explanation: "Ini memang istilah standar — R pada drawing die disebut die radius." },
  "G-9": { keywords: ["中心線", "一点鎖線"], explanation: "Ini aturan standar gambar teknik (JIS): garis sumbu memang digambar dengan garis putus-titik tipis." },
  "G-10": { keywords: ["すべて", "シャンク"], explanation: "Cetakan besar/berat biasanya diklem langsung ke bolster/slide tanpa shank, jadi tidak 'semua' upper die pakai shank." },
  "G-11": { keywords: ["摩耗"], explanation: "Permukaan die U-bend menerima gesekan lebih banyak saat material meluncur, jadi lebih cepat aus dari punch." },
  "G-12": { keywords: ["ノックアウト"], explanation: "Kerutan dikurangi dengan memperkuat gaya BLANK HOLDER, bukan gaya knockout." },
  "G-13": { keywords: ["摩耗", "寸法"], explanation: "Pada piercing presisi, ukuran lubang mengikuti ukuran punch, jadi keausan punch langsung mempengaruhi presisi lubang." },
  "G-14": { keywords: ["バリ"], explanation: "Bagian bertekstur kasar pada gambar adalah permukaan patah (fracture zone), bukan burr." },
  "G-15": { keywords: ["ショックマーク"], explanation: "Shock mark/ring mark justru sering muncul pada proses drawing." },
  "G-16": { keywords: ["すべて", "伸びやすい"], explanation: "Sifat mulur aluminium sangat tergantung jenis paduan (alloy) dan temper-nya, tidak semua jenis aluminium mudah ditarik." },
  "G-17": { keywords: ["冷間圧延", "整形性"], explanation: "Cold rolled memiliki permukaan lebih halus dan akurasi dimensi lebih baik sehingga formability-nya lebih unggul." },
  "G-18": { keywords: ["消火器", "電源盤"], explanation: "Area depan alat pemadam & panel listrik wajib bebas hambatan supaya bisa diakses cepat saat darurat." },
  "G-19": { keywords: ["安全靴"], explanation: "Sepatu keselamatan wajib dipakai saat bekerja dengan mesin press untuk melindungi kaki dari benda jatuh/tajam." },
  "G-20": { keywords: ["目の高さ"], explanation: "Muatan forklift seharusnya DI BAWAH ketinggian mata supaya pandangan ke depan tidak terhalang." },
  /* ================= SET 12-1 s/d 12-4 (sinkron dengan teks lembar latihan) ================= */
  "12-1-1": { keywords: ["スクリュープレス", "高速"], explanation: "Screw press dipakai untuk proses tekan kecepatan RENDAH seperti coining/forging, bukan piercing kecepatan tinggi — itu tugas mechanical/crank press." },
  "12-1-2": { keywords: ["ストローク", "半径"], explanation: "Panjang stroke crank press = 2 kali jari-jari crank (diameternya), bukan sama dengan jari-jarinya." },
  "12-1-3": { keywords: ["トランスファープレス", "連続して"], explanation: "Sesuai definisi baku, transfer press memang dirancang untuk proses berkelanjutan multi-tahap (multi-station) secara otomatis." },
  "12-1-4": { keywords: ["フレーム", "C型"], explanation: "Bentuk rangka seperti huruf C pada gambar adalah ciri khas C-frame press (gap-frame press)." },
  "12-1-5": { keywords: ["フリクションクラッチ", "寸動運転"], explanation: "Justru crank press dengan friction clutch BISA melakukan operasi inching — itu salah satu kelebihan utama friction clutch dibanding key/positive clutch." },
  "12-1-6": { keywords: ["せん断長さ", "板厚"], explanation: "Rumus gaya potong memang berbasis panjang keliling potong (geser) × ketebalan pelat × kekuatan geser material (tergantung jenis bahan)." },
  "12-1-7": { keywords: ["打ち抜き", "曲げ", "成形", "絞り"], explanation: "Ini adalah definisi dan pengelompokan umum dari jenis-jenis proses pengerjaan press." },
  "12-1-8": { keywords: ["四角"], explanation: "Bentuk (A) pada gambar adalah sebuah lubang lingkaran, sehingga harus dipotong dengan punch bulat (silinder), bukan punch berbentuk persegi (四角)." },
  "12-1-9": { keywords: ["上型", "スライド側"], explanation: "Cetakan atas (upper die) memang dipasang pada sisi slide mesin press (bagian yang bergerak), sedangkan lower die dipasang pada bolster." },
  "12-1-10": { keywords: ["ストリッパ", "引き離す"], explanation: "Sesuai fungsi dasarnya, stripper memang bertugas melepaskan/menahan material pelat yang menempel di punch setelah proses pemotongan selesai." },
  "12-1-11": { keywords: ["上型", "固定します"], explanation: "Prosedur standar dan aman untuk pemasangan cetakan (die setup) memang dimulai dari upper die (cetakan atas) terlebih dahulu ke slide." },
  "12-1-12": { keywords: ["ダイラジアス"], explanation: "Ini memang istilah teknis standar — radius membulat pada pinggiran lubang cetakan drawing (die) disebut die radius (ダイラジアス)." },
  "12-1-13": { keywords: ["カス上がり", "キズ"], explanation: "Scrap lift-up (kasu-agari) adalah masalah di mana sisa potongan (scrap) ikut tertarik naik bersama punch. Jika scrap ini tertimpa proses berikutnya, produk akan penyok atau tergores." },
  "12-1-14": { keywords: ["ノックアウト", "シワ"], explanation: "Kerutan (wrinkles) pada bagian flange saat proses drawing dicegah dan dikurangi dengan memperkuat gaya BLANK HOLDER (penahan kerutan / shinka-osae), BUKAN gaya knockout. Fungsi knockout hanya mendorong produk keluar di akhir." },
  "12-1-15": { keywords: ["クリアランス"], explanation: "Secara teori dasar pemotongan, mengubah nilai clearance tidak berdampak besar untuk 'mengecilkan' gaya geser (shearing force) secara langsung; gaya potong lebih dipengaruhi ketebalan dan kekuatan tarik material, serta ada/tidaknya shear angle." },
  "12-1-16": { keywords: ["クリアランス", "二次せん断面"], explanation: "Permukaan geser ganda (secondary shear surface) biasanya terbentuk jika clearance terlalu KECIL, bukan terlalu besar. Jika clearance terlalu besar, akan terjadi pembengkokan pelat berlebih dan burr (sisa tajam) yang besar." },
  "12-1-17": { keywords: ["SPHC", "SPCC"], explanation: "Baja SPHC (hot-rolled) dan SPCC (cold-rolled) memang merupakan dua jenis material pelat baja yang paling lazim digunakan di industri sheet metal stamping." },
  "12-1-18": { keywords: ["ジュラルミン"], explanation: "Duralumin (duralumin/2000 series) adalah salah satu jenis paduan aluminium (aluminium alloy) yang sangat terkenal akan kekuatan tingginya." },
  "12-1-19": { keywords: ["ボルスタ", "置いたまま"], explanation: "Alat/perkakas yang dibiarkan di atas bolster sangat berbahaya karena berisiko hancur atau terlempar saat mesin (slide) bergerak turun. Alat harus selalu dibersihkan sebelum mengoperasikan mesin." },
  "12-1-20": { keywords: ["安全一工程運転"], explanation: "Bekerja secara manual memasukkan/mengeluarkan produk memang wajib memakai mode 'Safety One-Stroke' agar mesin otomatis berhenti setelah satu siklus, mencegah stroke tak sengaja saat tangan masih di dalam." },
  "12-2-1": { keywords: ["光線式", "停止性能"], explanation: "Standar desain dan pemasangan jarak aman (safety distance) untuk light curtain (sensor cahaya) memang memperhitungkan kecepatan tangan manusia masuk (umumnya 1.6 m/s) agar slide mesin sempat berhenti sebelum tersentuh." },
  "12-2-2": { keywords: ["ストローク", "自由に"], explanation: "Panjang stroke pada crank press standar adalah KAKU/TETAP, ditentukan secara fisik oleh eksentrisitas poros engkol (crankshaft) bawaan mesin (stroke = 2x eksentrisitas). Tidak bisa diatur 'bebas'." },
  "12-2-3": { keywords: ["スクリュープレス", "高速"], explanation: "Screw press dipakai untuk proses tekan kecepatan RENDAH seperti coining/forging, bukan piercing kecepatan tinggi — itu tugas mechanical/crank press." },
  "12-2-4": { keywords: ["ダイハイト"], explanation: "Sesuai standar penamaan, dimensi (A) pada gambar ilustrasi mesin press yang menunjukkan jarak dari permukaan bolster ke bagian bawah slide (saat di Titik Mati Bawah) memang disebut Die Height." },
  "12-2-5": { keywords: ["フリクションクラッチ", "ローリングキー"], explanation: "Friction clutch meneruskan tenaga melalui gaya GESEKAN pelat/kampas, bukan lewat struktur mekanis pasak/key. Rolling key adalah ciri dari tipe Positive (Mechanical) Clutch." },
  "12-2-6": { keywords: ["せん断加工"], explanation: "Blanking (punching/pelubangan) pada dasarnya beroperasi berdasarkan prinsip pemotongan geser (shearing) material menggunakan batas tajam punch dan die. Prinsip fisiknya sama." },
  "12-2-7": { keywords: ["V曲げ"], explanation: "Bentuk part pada gambar referensi (seperti profil kotak / U / kanal) yang memiliki 2 sudut tegak lurus secara sekaligus lebih cocok dikerjakan dengan proses U-bending (tekuk U) atau L-bend bertahap, bukan V-bend sederhana." },
  "12-2-8": { keywords: ["残った", "面積"], explanation: "Ini adalah prinsip dasar efisiensi material (Yield Rate / Material Utilization). Layout pemotongan (blanking layout) selalu diatur agar sisa scrap (material terbuang) sekecil mungkin." },
  "12-2-9": { keywords: ["L曲げ型", "U曲げ型"], explanation: "Klasifikasi dasar alat pembengkok (bending die) berdasarkan bentuk hasil akhirnya memang mencakup V-bend, L-bend, dan U-bend, dsb." },
  "12-2-10": { keywords: ["パンチラジアス"], explanation: "Istilah teknis untuk radius keliling bawah pada punch pengerjaan drawing memang disebut Punch Radius (Rp)." },
  "12-2-11": { keywords: ["隙間"], explanation: "Definisi baku dari 'clearance' dalam pengerjaan press pemotongan adalah celah (jarak horizontal) antara sisi tajam punch dan sisi tajam die." },
  "12-2-12": { keywords: ["シャー角"], explanation: "Pemberian shear angle (sudut kemiringan) pada ujung punch atau die justru sangat efektif untuk MENGURANGI (mengecilkan) beban potong maksimal karena area pemotongan tidak terjadi serentak, melainkan bertahap/menggunting." },
  "12-2-13": { keywords: ["圧延方向"], explanation: "Arah pengerolan (grain direction) plat logam memiliki anisotropi kekuatan. Menekuk sejajar dengan arah pengerolan berisiko besar memicu retak (crack), jadi harus sangat diperhatikan arah tekuknya (ideal: tegak lurus arah pengerolan)." },
  "12-2-14": { keywords: ["バリ"], explanation: "Bagian A yang lebar dan bertekstur kasar pada penampang irisan produk potong adalah 'Permukaan Patah' (Fracture Zone / 破断面), bukan Burr (バリ). Burr adalah ujung duri tajam di pojok bawah." },
  "12-2-15": { keywords: ["時間が経って"], explanation: "Springback (pemulihan elastis) terjadi SECARA INSTAN tepat pada saat punch naik (tekanan/beban diangkat), material mencoba kembali ke bentuk asal, BUKAN perubahan bertahap karena berjalannya waktu (itu creep/aging)." },
  "12-2-16": { keywords: ["反り", "細長い"], explanation: "Komponen pelat yang berukuran panjang dan sempit akan rentan mengalami lengkungan ke arah memanjang (longitudinal bow/warp atau 反り) ketika dilakukan penekukan V." },
  "12-2-17": { keywords: ["全て", "磁石"], explanation: "Hanya stainless steel tipe Austenitic (seperti SUS304) yang non-magnetik. Stainless tipe Ferritic (SUS430) dan Martensitic (SUS410) TETAP bisa menempel pada magnet, sehingga pernyataan 'semua' itu salah." },
  "12-2-18": { keywords: ["SPHC", "SPCC"], explanation: "Baja SPHC (hot-rolled) dan SPCC (cold-rolled) memang merupakan dua jenis material pelat baja yang paling lazim digunakan di industri sheet metal stamping." },
  "12-2-19": { keywords: ["安全"], explanation: "Rambu segitiga kuning dengan tanda seru adalah rambu universal untuk 'PERINGATAN BAHAYA' (Warning/Caution), jadi tempat tersebut justru memiliki risiko bahaya, BUKAN tempat yang dijamin aman." },
  "12-2-20": { keywords: ["高くします"], explanation: "Menyusun muatan lori/kereta dorong lebih tinggi dari level mata sangat melanggar prosedur K3 karena menutupi jarak pandang operator ke arah depan (blind spot)." },
  "12-3-1": { keywords: ["ポジティブ式", "フリクション式"], explanation: "Secara umum transmisi putaran (clutch) mesin press mekanik terbagi dua tipe utama: Positive (memakai pin/key/pasak mekanis) dan Friction (memakai plat kampas gesek)." },
  "12-3-2": { keywords: ["フレーム"], explanation: "Pada gambar mesin press (biasanya C-frame), jika bagian A menunjuk pada lekukan bawah tempat cetakan, itu adalah bed/bolster area, bukan frame utama atas." },
  "12-3-3": { keywords: ["すべて"], explanation: "Hanya cetakan berukuran KECIL dan RINGAN yang dipasang ke slide menggunakan shank. Cetakan yang berukuran besar atau berat harus dikunci (diklem) secara langsung pada slide mesin karena shank rawan patah." },
  "12-3-4": { keywords: ["優先"], explanation: "Keselamatan adalah prioritas utama. Jika ditemukan kejanggalan/kerusakan saat pemeriksaan awal, operator HARUS STOP, melaporkan ke atasan, dan dilarang mendahulukan penyelesaian kerja." },
  "12-3-5": { keywords: ["パンチ側"], explanation: "Pada proses drawing, bagian punch tidak boleh terlalu licin karena justru harus menahan gaya gesek dasar material agar tidak tipis/sobek. Pelumasan intensif difokuskan pada sisi Die dan Blank Holder (sisi luar pelat)." },
  "12-3-6": { keywords: ["ダイラジアス"], explanation: "Ini memang istilah teknis standar — radius membulat pada pinggiran lubang cetakan drawing (die) disebut die radius (ダイラジアス)." },
  "12-3-7": { keywords: ["破断面", "小さい"], explanation: "Apabila clearance dipasang terlalu besar, rasio permukaan geser (shear surface) halus akan menyempit dan permukaan patahan (fracture zone) yang kasar justru akan semakin besar mendominasi." },
  "12-3-8": { keywords: ["一点鎖線"], explanation: "Berdasarkan standar JIS gambar teknik dasar, garis sumbu/center line memang mutlak harus digambarkan menggunakan garis tipis berantai satu titik (細い一点鎖線)." },
  "12-3-9": { keywords: ["大きくした"], explanation: "Proses Fine Blanking (FB) justru mensyaratkan clearance yang amat SANGAT KECIL (mendekati 0, sekitar 0.5% dari tebal) untuk memaksa area shear surface menutupi 100% sisi irisan. Bukan memperbesarnya." },
  "12-3-10": { keywords: ["潰し"], explanation: "Mekanisme sambungan lutut (knuckle-joint) pada mesin ini menghasilkan tonase sangat besar namun dengan laju yang sangat pelan mendekati Titik Mati Bawah, sehingga amat ideal untuk proses coining/embossing/pressing tebal (潰し)." },
  "12-3-11": { keywords: ["ガイドポスト"], explanation: "Fungsi utama Guide Post (Tiang Pemandu) di set cetakan/die-set adalah memang untuk menyelaraskan kelurusan dan meningkatkan presisi posisi antara upper die dan lower die saat bergerak." },
  "12-3-12": { keywords: ["ノックアウト", "シワ"], explanation: "Kerutan (wrinkles) pada bagian flange saat proses drawing dicegah dan dikurangi dengan memperkuat gaya BLANK HOLDER (penahan kerutan / shinka-osae), BUKAN gaya knockout. Fungsi knockout hanya mendorong produk keluar di akhir." },
  "12-3-13": { keywords: ["メッキ"], explanation: "Pelat baja berlapis (surface-treated sheet), yang banyak dipakai industri otomotif, merujuk pada pelat baja dasar yang permukaannya sudah di-plating (galvanized/zinc), dicat, atau dilapis agar anti karat." },
  "12-3-14": { keywords: ["バリ"], explanation: "Bagian A yang lebar dan bertekstur kasar pada penampang irisan produk potong adalah 'Permukaan Patah' (Fracture Zone / 破断面), bukan Burr (バリ). Burr adalah ujung duri tajam di pojok bawah." },
  "12-3-15": { keywords: ["伸びの小さい"], explanation: "Saat proses bending, sisi luar tekukan akan sangat diregangkan secara elastis & plastis. Jika bahan pelatnya berkarakteristik nilai mulur/regang (elongation/伸び) kecil atau getas, ia akan jauh lebih cepat retak." },
  "12-3-16": { keywords: ["クリアランス", "二次せん断面"], explanation: "Permukaan geser ganda (secondary shear surface) biasanya terbentuk jika clearance terlalu KECIL, bukan terlalu besar. Jika clearance terlalu besar, akan terjadi pembengkokan pelat berlebih dan burr (sisa tajam) yang besar." },
  "12-3-17": { keywords: ["優れています"], explanation: "Baja canai dingin (Cold Rolled / SPCC) secara kualitas di-roll saat suhu ruang, sehingga dimensi tebalnya sangat presisi, permukaannya halus, dan memiliki sifat pembentukan (formability) jauh lebih stabil dibanding baja canai panas (SPHC)." },
  "12-3-18": { keywords: ["吸ってはいけません"], explanation: "Rambu lingkaran bergaris silang merah dengan gambar rokok adalah rambu larangan yang universal yang menginstruksikan area wajib bebas asap rokok." },
  "12-3-19": { keywords: ["ぶら下げて"], explanation: "Dilarang keras memakai pakaian menjuntai atau melilitkan handuk di leher/pinggang saat mengoperasikan mesin industri. Kain tersebut amat sangat mudah terseret poros mesin bergerak & berakibat fatal (tercekik)." },
  "12-3-20": { keywords: ["両手で押して"], explanation: "Safety device tipe dua-tangan (Two-hand control) menjamin tangan operator keluar dari area bahaya cetakan karena kedua tangan HARUS dipakai bersamaan menekan 2 tombol terpisah di panel luar agar mesin mau turun." },
  "12-4-1": { keywords: ["止まることが出来ません"], explanation: "Pada mode aman 'Safety One-Stroke', gerakan turun slide BISA HENTI SEKETIKA bila operasi ditekan emergency stop atau tombol kontrol dilepas mendadak sebelum titik mati bawah tercapai." },
  "12-4-2": { keywords: ["ダイハイト"], explanation: "Sesuai standar penamaan, dimensi (A) pada gambar ilustrasi mesin press yang menunjukkan jarak dari permukaan bolster ke bagian bawah slide (saat di Titik Mati Bawah) memang disebut Die Height." },
  "12-4-3": { keywords: ["潰し"], explanation: "Mekanisme sambungan lutut (knuckle-joint) pada mesin ini menghasilkan tonase sangat besar namun dengan laju yang sangat pelan mendekati Titik Mati Bawah, sehingga amat ideal untuk proses coining/embossing/pressing tebal (潰し)." },
  "12-4-4": { keywords: ["スクリュープレス", "高速"], explanation: "Screw press dipakai untuk proses tekan kecepatan RENDAH seperti coining/forging, bukan piercing kecepatan tinggi — itu tugas mechanical/crank press." },
  "12-4-5": { keywords: ["肩幅"], explanation: "Secara standar perkakas pembengkok V, lebar bahu die (Die Shoulder / W) selalu dirancang jauh lebih besar dibandingkan ketebalan material (biasanya W ≈ 6x s/d 8x ketebalan material)." },
  "12-4-6": { keywords: ["大きいほど"], explanation: "Menurut kunci lembar latihan (Set G dan lembar 12-4), pernyataan ini SALAH. Catatan: secara teori umum springback cenderung membesar jika radius tekuk makin besar, tetapi untuk ujian ikuti kunci jawaban lembar ini." },
  "12-4-7": { keywords: ["四角"], explanation: "Bentuk (A) pada gambar adalah sebuah lubang lingkaran, sehingga harus dipotong dengan punch bulat (silinder), bukan punch berbentuk persegi (四角)." },
  "12-4-8": { keywords: ["ダイラジアス"], explanation: "Ini memang istilah teknis standar — radius membulat pada pinggiran lubang cetakan drawing (die) disebut die radius (ダイラジアス)." },
  "12-4-9": { keywords: ["一点鎖線"], explanation: "Berdasarkan standar JIS gambar teknik dasar, garis sumbu/center line memang mutlak harus digambarkan menggunakan garis tipis berantai satu titik (細い一点鎖線)." },
  "12-4-10": { keywords: ["すべて"], explanation: "Hanya cetakan berukuran KECIL dan RINGAN yang dipasang ke slide menggunakan shank. Cetakan yang berukuran besar atau berat harus dikunci (diklem) secara langsung pada slide mesin karena shank rawan patah." },
  "12-4-11": { keywords: ["摩耗し易い"], explanation: "Selama penekukan U, punggung material pelat digeserkan secara paksa menyapu ujung dan tepi dinding rongga Die sepanjang jarak stroke turun, sementara punch cenderung cuma menempel diam di bagian dasar. Oleh karenanya, Die U-bend aus lebih cepat." },
  "12-4-12": { keywords: ["ノックアウト", "シワ"], explanation: "Kerutan (wrinkles) pada bagian flange saat proses drawing dicegah dan dikurangi dengan memperkuat gaya BLANK HOLDER (penahan kerutan / shinka-osae), BUKAN gaya knockout. Fungsi knockout hanya mendorong produk keluar di akhir." },
  "12-4-13": { keywords: ["寸法に影響します"], explanation: "Dalam piercing (pemotongan/pelubangan), diameter lubang hasil potong tepat sama/mengikuti bentuk ujung PUNCH. Jika punch terkikis/aus ukurannya, lubangnya pun akan menciut/meleset tak presisi." },
  "12-4-14": { keywords: ["バリ"], explanation: "Bagian A yang lebar dan bertekstur kasar pada penampang irisan produk potong adalah 'Permukaan Patah' (Fracture Zone / 破断面), bukan Burr (バリ). Burr adalah ujung duri tajam di pojok bawah." },
  "12-4-15": { keywords: ["できません"], explanation: "Saat ujung punch yang keras pertama kali menabrak dasar pelat material dengan kecepatan saat drawing dimulai, seringkali terjeplak garis lengkung samar di area dasar produk yang disebut shock line / ring mark." },
  "12-4-16": { keywords: ["すべて"], explanation: "Tidak 'semua' paduan aluminium sifatnya ulet dan lunak ditarik. Banyak seri aluminium alloy (misal seri 2000 Duralumin atau 7000 duralumin super) yang sangat kaku, kuat (tensile strength tinggi), dan getas layaknya baja." },
  "12-4-17": { keywords: ["すぐれています"], explanation: "Baja canai dingin (Cold Rolled / SPCC) secara kualitas di-roll saat suhu ruang, sehingga dimensi tebalnya sangat presisi, permukaannya halus, dan memiliki sifat pembentukan (formability) jauh lebih stabil dibanding baja canai panas (SPHC)." },
  "12-4-18": { keywords: ["物を置いても"], explanation: "Menurut aturan K3 dan pemadam kebakaran, area lantai di depan/sekitar APAR (Alat Pemadam) tidak boleh dihalangi barang apa pun sedikipun. Harus bisa diraih secepat mungkin detik itu juga." },
  "12-4-19": { keywords: ["履きます"], explanation: "Syarat K3 paling mendasar di pabrik pengepresan logam: operator wajib memakai Sepatu Safety khusus yang dilengkapi cangkang besi baja di jari depan untuk menahan benda tajam / scrap berat yang jatuh." },
  "12-4-20": { keywords: ["目の高さ"], explanation: "Muatan forklift seharusnya DI BAWAH ketinggian mata supaya pandangan ke depan tidak terhalang." },
};

/* ============================================================
   HELPER
   ============================================================ */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getEntry(setKey, no) {
  return EXPLANATIONS[`${setKey}-${no}`] || null;
}

/**
 * Menandai satu kata kunci di dalam HTML soal (hasil annotateJapanese
 * dari vocab.js). Kalau kata itu sudah dikenali sebagai vocab-word,
 * span-nya ditambah class "kw-mark". Kalau tidak dikenali vocab.js,
 * tetap dibungkus <mark> supaya tetap ter-highlight (tidak bisa diklik).
 */
function markKeywordInHtml(html, keyword) {
  if (!keyword) return html;
  const escaped = escapeRegExp(keyword);

  // Strategi 1: keyword persis sama dengan data-key span vocab-word.
  // Sisipkan class "kw-mark" DI DALAM atribut class="...", bukan
  // menyentuh isi data-key= sama sekali (itu penyebab bug sebelumnya).
  const spanRegex = new RegExp(`(<span class="vocab-word)(" data-key="${escaped}">)`, "g");
  const withSpanMark = html.replace(spanRegex, `$1 kw-mark$2`);
  if (withSpanMark !== html) return withSpanMark;

  // Strategi 2: fallback — cari teks polos di LUAR tag, bungkus <mark>.
  // Cari kandidat posisi satu per satu, lewati kalau posisinya ternyata
  // ada di dalam sebuah tag (mis. nyangkut di atribut) supaya HTML
  // tidak pernah rusak.
  if (keyword.includes("<") || keyword.includes(">") || keyword.includes('"')) return html;
  let searchFrom = 0;
  while (true) {
    const idx = html.indexOf(keyword, searchFrom);
    if (idx === -1) return html; // tidak ditemukan sama sekali, lewati diam-diam
    const before = html.slice(0, idx);
    const lastOpen = before.lastIndexOf("<");
    const lastClose = before.lastIndexOf(">");
    const insideTag = lastOpen > lastClose; // posisi ini ada di dalam sebuah tag
    if (!insideTag) {
      return (
        html.slice(0, idx) +
        `<mark class="kw-mark">${escapeHtml(keyword)}</mark>` +
        html.slice(idx + keyword.length)
      );
    }
    searchFrom = idx + keyword.length; // coba kemunculan berikutnya
  }
}

/* ============================================================
   API PUBLIK
   ============================================================ */

/**
 * Menandai semua kata kunci untuk soal setKey/no di dalam HTML
 * yang sudah dianotasi vocab.js. Kalau soal tidak punya data
 * kata kunci, HTML dikembalikan apa adanya.
 */
export function highlightKeywords(html, setKey, no) {
  const entry = getEntry(setKey, no);
  if (!entry || !entry.keywords || !entry.keywords.length) return html;
  let result = html;
  entry.keywords.forEach((kw) => {
    result = markKeywordInHtml(result, kw);
  });
  return result;
}

/**
 * Menampilkan kartu penjelasan setelah user menjawab.
 * correctAnswer: boolean — apakah pernyataan soal itu BENAR atau SALAH.
 */
export function showExplanation(setKey, no, correctAnswer) {
  const entry = getEntry(setKey, no);
  const panel = ensureExplanationPanel();

  if (!entry) {
    panel.classList.remove("show");
    panel.innerHTML = "";
    return;
  }

  const label = correctAnswer ? "BENAR" : "SALAH";
  const kwList = (entry.keywords || [])
    .map((k) => {
      const word = typeof k === "string" ? k : k.word;
      // Utamakan pemicu ingatan singkat dari keywordhints.js; kalau soal
      // ini belum punya datanya (mis. soal custom baru), pakai penjelasan
      // panjang yang sudah ada di explain.js sebagai cadangan.
      const shortHint = getKeywordHint(setKey, no, word);
      const why = shortHint || (typeof k === "string" ? entry.explanation : k.why || entry.explanation);
      return `<span class="expl-kw-wrap">
        <span class="expl-kw">${escapeHtml(word)}</span>
        <button type="button" class="expl-kw-info" data-why="${escapeHtml(why)}" data-word="${escapeHtml(
        word
      )}" aria-label="Kenapa kata ini jadi penanda?">!</button>
      </span>`;
    })
    .join(" ");

  panel.innerHTML = `
    <div class="expl-head">💡 Kenapa jawabannya <b>${label}</b>?</div>
    ${kwList ? `<div class="expl-kws">Kata kunci: ${kwList}</div>` : ""}
    <div class="expl-body">${escapeHtml(entry.explanation)}</div>
  `;
  // reveal ulang trigger reflow supaya animasi jalan tiap kali dipanggil
  panel.classList.remove("show");
  void panel.offsetWidth;
  panel.classList.add("show");
}

/* ---------- Popup "kenapa kata kunci ini dipilih" ---------- */

let kwWhyPopupEl = null;

function ensureKwWhyPopup() {
  if (kwWhyPopupEl) return kwWhyPopupEl;
  kwWhyPopupEl = document.createElement("div");
  kwWhyPopupEl.className = "kw-why-popup";
  document.body.appendChild(kwWhyPopupEl);
  return kwWhyPopupEl;
}

function showKwWhyPopup(word, why, anchorRect) {
  const popup = ensureKwWhyPopup();
  popup.innerHTML = `
    <span class="kw-why-close" data-close="1">✕</span>
    <div class="kw-why-title">💡 Kenapa "<span>${escapeHtml(word)}</span>" jadi penanda?</div>
    <div class="kw-why-body">${escapeHtml(why)}</div>
  `;
  popup.style.left = "-9999px";
  popup.style.top = "-9999px";
  popup.classList.add("show");

  requestAnimationFrame(() => {
    const pw = popup.offsetWidth;
    const ph = popup.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = anchorRect.left + anchorRect.width / 2 - pw / 2;
    left = Math.max(10, Math.min(left, vw - pw - 10));

    let top = anchorRect.top - ph - 10;
    if (top < 10) top = anchorRect.bottom + 10;
    top = Math.max(10, Math.min(top, vh - ph - 10));

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  });
}

function hideKwWhyPopup() {
  if (kwWhyPopupEl) kwWhyPopupEl.classList.remove("show");
}

document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest && e.target.closest(".kw-why-close");
  if (closeBtn) {
    hideKwWhyPopup();
    return;
  }
  const infoBtn = e.target.closest && e.target.closest(".expl-kw-info");
  if (infoBtn) {
    e.stopPropagation();
    const rect = infoBtn.getBoundingClientRect();
    showKwWhyPopup(infoBtn.dataset.word, infoBtn.dataset.why, rect);
    return;
  }
  if (kwWhyPopupEl && !kwWhyPopupEl.contains(e.target)) {
    hideKwWhyPopup();
  }
});

/** Sembunyikan & kosongkan panel penjelasan (dipanggil saat pindah soal). */
export function hideExplanation() {
  if (!panelEl) return;
  panelEl.classList.remove("show");
  panelEl.innerHTML = "";
}

/* ============================================================
   DOM & STYLE — disuntikkan sendiri oleh file ini
   ============================================================ */

let panelEl = null;

function ensureExplanationPanel() {
  if (panelEl) return panelEl;
  panelEl = document.createElement("div");
  panelEl.id = "explain-panel";
  panelEl.className = "explain-panel";

  const feedbackEl = document.getElementById("feedback");
  if (feedbackEl && feedbackEl.parentNode) {
    feedbackEl.insertAdjacentElement("afterend", panelEl);
  } else {
    document.body.appendChild(panelEl);
  }
  return panelEl;
}

function injectExplainStyles() {
  if (document.getElementById("explain-style")) return;
  const style = document.createElement("style");
  style.id = "explain-style";
  style.textContent = `
    /* Highlight kata kunci — baru terlihat saat .kw-reveal aktif */
    .q-japanese mark.kw-mark,
    .q-japanese .vocab-word.kw-mark{
      background:transparent;
      box-shadow:none;
      font-weight:inherit;
      border-radius:4px;
      transition:background .25s ease, box-shadow .25s ease;
    }
    .q-japanese.kw-reveal mark.kw-mark,
    .q-japanese.kw-reveal .vocab-word.kw-mark{
      background:color-mix(in srgb, var(--sun, #F4D242) 60%, transparent);
      box-shadow:0 0 0 1px color-mix(in srgb, var(--sun, #F4D242) 75%, transparent);
      font-weight:800;
      padding:0 2px;
    }

    .explain-panel{
      max-height:0;opacity:0;overflow:hidden;
      transition:max-height .35s ease, opacity .3s ease, margin .35s ease;
      margin-top:0;
    }
    .explain-panel.show{
      max-height:400px;opacity:1;margin-top:14px;
    }
    .explain-panel .expl-head{
      font-size:13.5px;font-weight:800;color:var(--teal-dark, #045c4d);margin-bottom:6px;
    }
    .explain-panel .expl-kws{
      font-size:11.5px;color:var(--ink-soft, #7A6F5D);margin-bottom:8px;
    }
    .expl-kw-wrap{
      display:inline-flex;align-items:center;gap:3px;margin-right:6px;margin-bottom:4px;
    }
    .explain-panel .expl-kw{
      display:inline-block;background:color-mix(in srgb, var(--sun, #F4D242) 35%, transparent);
      border-radius:6px;padding:1px 7px;font-weight:700;color:var(--ink, #2E2620);
    }
    .expl-kw-info{
      appearance:none;border:none;cursor:pointer;
      width:16px;height:16px;border-radius:50%;flex-shrink:0;
      background:var(--teal, #008471);color:#fff;
      font-size:10px;font-weight:800;line-height:16px;padding:0;
      display:inline-flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px -2px color-mix(in srgb, var(--teal, #008471) 60%, transparent);
      transition:transform .12s ease;
    }
    .expl-kw-info:hover{transform:scale(1.15);}
    .expl-kw-info:active{transform:scale(.9);}

    .kw-why-popup{
      position:fixed;z-index:9999;max-width:270px;min-width:190px;
      background:#FFFFFF;color:#2E2620;
      border-radius:16px;padding:14px 16px;
      box-shadow:0 16px 34px -12px rgba(50,35,15,.35), 0 0 0 1px rgba(50,35,15,.06);
      font-family:'Segoe UI','Noto Sans JP',-apple-system,BlinkMacSystemFont,sans-serif;
      opacity:0;transform:translateY(6px) scale(.97);
      transition:opacity .15s ease, transform .15s ease;
      pointer-events:none;
    }
    .kw-why-popup.show{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}
    .kw-why-title{font-size:13px;font-weight:800;color:var(--ink, #2E2620);margin-bottom:6px;line-height:1.4;}
    .kw-why-title span{color:var(--teal, #008471);}
    .kw-why-body{font-size:12.5px;color:var(--ink-soft, #7A6F5D);line-height:1.55;}
    .kw-why-close{
      position:absolute;top:8px;right:10px;cursor:pointer;font-size:13px;color:#a89a82;
      width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:50%;
    }
    .kw-why-close:hover{background:rgba(50,35,15,.08);color:#2E2620;}

    .explain-panel .expl-body{
      font-size:13px;line-height:1.6;color:var(--ink, #2E2620);
      background:#FFFFFF;border-left:3px solid var(--teal, #008471);
      border-radius:10px;padding:12px 14px;
      box-shadow:0 6px 16px -10px rgba(50,35,15,.3);
    }
  `;
  document.head.appendChild(style);
}

// Suntikkan CSS-nya SEKARANG JUGA (bukan menunggu user menjawab soal
// pertama kali) — supaya highlight kata kunci sudah aktif sejak soal
// pertama dimuat, bukan baru muncul setelah jawaban pertama dikirim.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectExplainStyles);
} else {
  injectExplainStyles();
}
