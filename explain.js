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
  "G-6": { keywords: ["曲げ半径", "スプリングバック"], explanation: "Semakin besar radius tekuk, semakin sedikit deformasi plastis yang terjadi sehingga springback makin besar." },
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
    .map((k) => `<span class="expl-kw">${escapeHtml(k)}</span>`)
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
    .explain-panel .expl-kw{
      display:inline-block;background:color-mix(in srgb, var(--sun, #F4D242) 35%, transparent);
      border-radius:6px;padding:1px 7px;margin-right:4px;font-weight:700;color:var(--ink, #2E2620);
    }
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
