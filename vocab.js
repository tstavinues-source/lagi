/* ============================================================
   VOCAB.JS — Kamus kosakata klik untuk soal berbahasa Jepang
   ============================================================
   File ini BERDIRI SENDIRI (tidak menambah beban script.js):
   - Menyimpan kamus kata (kotoba dasar + arti Indonesia)
   - Menyediakan annotateJapanese(text) -> HTML dengan kata yang
     dikenali dibungkus <span class="vocab-word"> supaya bisa diklik
   - Otomatis menyuntikkan CSS & popup-nya sendiri ke halaman

   Cara pakai di script.js (sudah ditambahkan):
     import { annotateJapanese } from "./vocab.js";
     els.qJapanese.innerHTML = annotateJapanese(current.ja);

   Cara menambah kosakata baru: cukup tambah baris baru di objek
   VOCAB di bawah, format:
     "kata_yang_muncul_di_soal": { base:"bentuk kamus", pos:"jenis", id:"arti" }
   - base: bentuk kamus/dasar SEBELUM konjugasi (untuk kata kerja/sifat).
     Kalau kata bendanya sudah bentuk dasar, isi sama seperti key.
   - pos: "benda" | "kerja" | "sifat-i" | "sifat-na" | "partikel" | "lainnya"
   - id: terjemahan Indonesia singkat
   - reading (opsional): cara baca hiragana, dipakai untuk kata berkanji
   ============================================================ */

const VOCAB = {
  /* ---------- Partikel (kata bantu) ---------- */
  "は": { base: "は", pos: "partikel", id: "penanda topik kalimat" },
  "が": { base: "が", pos: "partikel", id: "penanda subjek" },
  "を": { base: "を", pos: "partikel", id: "penanda objek" },
  "に": { base: "に", pos: "partikel", id: "ke / pada / di (arah, waktu, target)" },
  "で": { base: "で", pos: "partikel", id: "di / dengan (tempat aksi, alat/cara)" },
  "と": { base: "と", pos: "partikel", id: "dan / dengan" },
  "も": { base: "も", pos: "partikel", id: "juga" },
  "の": { base: "の", pos: "partikel", id: "kepunyaan / penghubung kata benda" },
  "から": { base: "から", pos: "partikel", id: "dari / karena" },
  "まで": { base: "まで", pos: "partikel", id: "sampai" },
  "より": { base: "より", pos: "partikel", id: "daripada / dari" },
  "へ": { base: "へ", pos: "partikel", id: "ke (arah tujuan)" },
  "など": { base: "など", pos: "partikel", id: "dan lain-lain, dsb." },
  "や": { base: "や", pos: "partikel", id: "dan (menyebut sebagian contoh)" },
  "ば": { base: "ば", pos: "partikel", id: "kalau / jika (bentuk pengandaian)" },
  "し": { base: "し", pos: "partikel", id: "penghubung alasan/daftar" },

  /* ---------- Kata kerja & kata sifat inti + bentuk konjugasinya ---------- */
  "つかいます": { base: "つかう (使う)", pos: "kerja", id: "memakai / menggunakan" },
  "つかう": { base: "つかう (使う)", pos: "kerja", id: "memakai / menggunakan" },
  "おなじです": { base: "おなじ (同じ)", pos: "sifat-na", id: "sama" },
  "おなじ": { base: "おなじ (同じ)", pos: "sifat-na", id: "sama" },
  "します": { base: "する", pos: "kerja", id: "melakukan (kata kerja bantu)" },
  "できません": { base: "できる", pos: "kerja", id: "tidak bisa / tidak dapat" },
  "できます": { base: "できる", pos: "kerja", id: "bisa / dapat" },
  "できる": { base: "できる", pos: "kerja", id: "bisa / dapat" },
  "あります": { base: "ある", pos: "kerja", id: "ada (untuk benda mati)" },
  "ある": { base: "ある", pos: "kerja", id: "ada (untuk benda mati)" },
  "けいさんします": { base: "けいさんする (計算する)", pos: "kerja", id: "menghitung" },
  "つよくする": { base: "つよい (強い)", pos: "sifat-i", id: "kuat → memperkuat" },
  "つよく": { base: "つよい (強い)", pos: "sifat-i", id: "kuat (bentuk keterangan)" },
  "すくなく": { base: "すくない (少ない)", pos: "sifat-i", id: "sedikit (bentuk keterangan)" },
  "すくなくできます": { base: "すくない (少ない)", pos: "sifat-i", id: "bisa dikurangi (dibuat sedikit)" },
  "おおきく": { base: "おおきい (大きい)", pos: "sifat-i", id: "besar (bentuk keterangan)" },
  "おおきくします": { base: "おおきい (大きい)", pos: "sifat-i", id: "membuat besar / memperbesar" },
  "おおきくなります": { base: "おおきい (大きい)", pos: "sifat-i", id: "menjadi besar" },
  "おおきい": { base: "おおきい (大きい)", pos: "sifat-i", id: "besar" },
  "せまく": { base: "せまい (狭い)", pos: "sifat-i", id: "sempit (bentuk keterangan)" },
  "せまくなります": { base: "せまい (狭い)", pos: "sifat-i", id: "menjadi sempit" },
  "ちいさく": { base: "ちいさい (小さい)", pos: "sifat-i", id: "kecil (bentuk keterangan)" },
  "ちいさくなります": { base: "ちいさい (小さい)", pos: "sifat-i", id: "menjadi kecil" },
  "ちいさくなりません": { base: "ちいさい (小さい)", pos: "sifat-i", id: "tidak menjadi kecil" },
  "たかい": { base: "たかい (高い)", pos: "sifat-i", id: "tinggi" },
  "たかく": { base: "たかい (高い)", pos: "sifat-i", id: "tinggi (bentuk keterangan)" },
  "たかくします": { base: "たかい (高い)", pos: "sifat-i", id: "membuat tinggi / menaikkan" },
  "たかさ": { base: "たかい (高い)", pos: "benda", id: "ketinggian" },
  "あつい": { base: "あつい (厚い)", pos: "sifat-i", id: "tebal" },
  "あつく": { base: "あつい (厚い)", pos: "sifat-i", id: "tebal (bentuk keterangan)" },
  "あつくなります": { base: "あつい (厚い)", pos: "sifat-i", id: "menjadi tebal" },
  "あつくなりました": { base: "あつい (厚い)", pos: "sifat-i", id: "sudah menjadi tebal" },
  "ほそい": { base: "ほそい (細い)", pos: "sifat-i", id: "tipis / kurus (untuk benda memanjang)" },
  "ほそながい": { base: "ほそながい (細長い)", pos: "sifat-i", id: "panjang dan sempit" },
  "ながい": { base: "ながい (長い)", pos: "sifat-i", id: "panjang" },
  "ながさ": { base: "ながい (長い)", pos: "benda", id: "panjang (ukuran)" },
  "よい": { base: "よい (良い)", pos: "sifat-i", id: "baik" },
  "よいです": { base: "よい (良い)", pos: "sifat-i", id: "baik" },
  "おく": { base: "おく (置く)", pos: "kerja", id: "meletakkan" },
  "おいた": { base: "おく (置く)", pos: "kerja", id: "sudah meletakkan (bentuk lampau)" },
  "おいたまま": { base: "おく (置く)", pos: "kerja", id: "dibiarkan tergeletak" },
  "たもつ": { base: "たもつ (保つ)", pos: "kerja", id: "menjaga / mempertahankan" },
  "たもつための": { base: "たもつ (保つ)", pos: "kerja", id: "untuk menjaga" },
  "はいる": { base: "はいる (入る)", pos: "kerja", id: "masuk" },
  "はいっては": { base: "はいる (入る)", pos: "kerja", id: "kalau masuk" },
  "いけません": { base: "いけない", pos: "lainnya", id: "tidak boleh" },
  "ちゅうだんして": { base: "ちゅうだんする (中断する)", pos: "kerja", id: "menghentikan sementara" },
  "はなれる": { base: "はなれる (離れる)", pos: "kerja", id: "menjauh / meninggalkan" },
  "はなれるとき": { base: "はなれる (離れる)", pos: "kerja", id: "saat menjauh/meninggalkan" },
  "きります": { base: "きる (切る)", pos: "kerja", id: "memutus / mematikan" },
  "ちかづけば": { base: "ちかづく (近づく)", pos: "kerja", id: "kalau mendekat" },
  "ちかづく": { base: "ちかづく (近づく)", pos: "kerja", id: "mendekat" },
  "きゅうていしが": { base: "きゅうていしする (急停止する)", pos: "kerja", id: "berhenti mendadak" },
  "きゅうていしします": { base: "きゅうていしする (急停止する)", pos: "kerja", id: "berhenti mendadak" },
  "はっせいしない": { base: "はっせいする (発生する)", pos: "kerja", id: "tidak terjadi/muncul" },
  "はっせいします": { base: "はっせいする (発生する)", pos: "kerja", id: "terjadi / muncul" },
  "はりだしかこうすると": { base: "はりだしかこうする (張り出し加工する)", pos: "kerja", id: "kalau melakukan proses pembentukan tonjolan" },
  "なりたって": { base: "なりたつ (成り立つ)", pos: "kerja", id: "terdiri dari / terbentuk dari" },
  "とりつける": { base: "とりつける (取り付ける)", pos: "kerja", id: "memasang" },
  "とりつけるとき": { base: "とりつける (取り付ける)", pos: "kerja", id: "saat memasang" },
  "こていします": { base: "こていする (固定する)", pos: "kerja", id: "memfiksasi / mengunci" },
  "ひきはなす": { base: "ひきはなす (引き離す)", pos: "kerja", id: "melepaskan / memisahkan" },
  "ひきはなすための": { base: "ひきはなす (引き離す)", pos: "kerja", id: "untuk melepaskan" },
  "でにくい": { base: "でる (出る) + にくい", pos: "lainnya", id: "sulit muncul / sulit terjadi" },
  "でやすい": { base: "でる (出る) + やすい", pos: "lainnya", id: "mudah muncul / mudah terjadi" },
  "でます": { base: "でる (出る)", pos: "kerja", id: "muncul / keluar" },
  "でる": { base: "でる (出る)", pos: "kerja", id: "muncul / keluar" },
  "とじる": { base: "とじる (閉じる)", pos: "kerja", id: "menutup" },
  "ちがいます": { base: "ちがう (違う)", pos: "kerja", id: "berbeda" },
  "ちがう": { base: "ちがう (違う)", pos: "kerja", id: "berbeda" },
  "きをつけます": { base: "きをつける (気を付ける)", pos: "kerja", id: "memperhatikan / berhati-hati" },
  "じかんがたって": { base: "じかんがたつ (時間が経つ)", pos: "kerja", id: "waktu berlalu" },
  "へんけいすること": { base: "へんけいする (変形する)", pos: "kerja", id: "berubah bentuk / deformasi" },
  "はく": { base: "はく (履く)", pos: "kerja", id: "memakai (sepatu)" },
  "はきます": { base: "はく (履く)", pos: "kerja", id: "memakai (sepatu)" },
  "うんてんするとき": { base: "うんてんする (運転する)", pos: "kerja", id: "saat mengoperasikan/mengemudikan" },
  "うんてん": { base: "うんてんする (運転する)", pos: "benda", id: "operasi / cara menjalankan" },
  "ふくんだ": { base: "ふくむ (含む)", pos: "kerja", id: "mencakup / termasuk" },
  "てきしています": { base: "てきする (適する)", pos: "kerja", id: "cocok / sesuai" },
  "まもうしやすい": { base: "まもうする (摩耗する)", pos: "kerja", id: "mudah aus" },
  "つきません": { base: "つく (付く)", pos: "kerja", id: "tidak menempel" },
  "つきます": { base: "つく (付く)", pos: "kerja", id: "menempel" },
  "つけます": { base: "つける (付ける)", pos: "kerja", id: "memasang / menempelkan" },
  "つけても": { base: "つける (付ける)", pos: "kerja", id: "meskipun dipasang" },
  "のこった": { base: "のこる (残る)", pos: "kerja", id: "yang tersisa" },
  "なりますように": { base: "なる", pos: "kerja", id: "menjadi (harapan)" },
  "ちいさくなるように": { base: "ちいさい (小さい)", pos: "sifat-i", id: "supaya menjadi kecil" },
  "うけなければ": { base: "うける (受ける)", pos: "kerja", id: "harus menerima / mengikuti" },
  "すぐれています": { base: "すぐれる (優れる)", pos: "kerja", id: "unggul / lebih baik" },
  "くらべて": { base: "くらべる (比べる)", pos: "kerja", id: "dibandingkan dengan" },
  "のびやすい": { base: "のびる (伸びる)", pos: "kerja", id: "mudah mulur / mudah ditarik" },
  "えいきょうします": { base: "えいきょうする (影響する)", pos: "kerja", id: "mempengaruhi" },
  "ひれいします": { base: "ひれいする (比例する)", pos: "kerja", id: "sebanding / proporsional" },
  "かくほしなげれば": { base: "かくほする (確保する)", pos: "kerja", id: "harus memastikan/menjamin" },

  /* ---------- Kata benda teknis (metal press) ---------- */
  "スクリュープレス": { base: "スクリュープレス", pos: "benda", id: "screw press" },
  "こうそくど": { base: "こうそくど (高速度)", pos: "benda", id: "kecepatan tinggi" },
  "うちぬきかこう": { base: "うちぬきかこう (打ち抜き加工)", pos: "benda", id: "proses pukul lubang (blanking/piercing)" },
  "うちぬき": { base: "うちぬき (打ち抜き)", pos: "benda", id: "pemotongan/pelubangan" },
  "うちぬきりょく": { base: "うちぬきりょく (打ち抜き力)", pos: "benda", id: "gaya pemotongan (blanking force)" },
  "うちぬきかじゅう": { base: "うちぬきかじゅう (打ち抜き荷重)", pos: "benda", id: "beban pemotongan" },
  "うちぬきがた": { base: "うちぬきがた (打ち抜き型)", pos: "benda", id: "cetakan pemotongan" },
  "うちぬきせいひん": { base: "うちぬきせいひん (打ち抜き製品)", pos: "benda", id: "produk hasil pemotongan" },
  "クランクプレス": { base: "クランクプレス", pos: "benda", id: "crank press" },
  "ストローク": { base: "ストローク", pos: "benda", id: "stroke (langkah gerak slide)" },
  "クランク": { base: "クランク", pos: "benda", id: "crank (poros engkol)" },
  "はんけい": { base: "はんけい (半径)", pos: "benda", id: "jari-jari / radius" },
  "トランスファプレス": { base: "トランスファプレス", pos: "benda", id: "transfer press" },
  "たこうてい": { base: "たこうてい (多工程)", pos: "benda", id: "multi-tahap / multi-station" },
  "れんぞくかこう": { base: "れんぞくかこう (連続加工)", pos: "benda", id: "proses berkelanjutan" },
  "フレーム": { base: "フレーム", pos: "benda", id: "rangka / frame" },
  "プレスきかい": { base: "プレスきかい (プレス機械)", pos: "benda", id: "mesin press" },
  "きかいプレス": { base: "きかいプレス (機械プレス)", pos: "benda", id: "mesin press mekanis" },
  "フリクションクラッチ": { base: "フリクションクラッチ", pos: "benda", id: "friction clutch" },
  "すんどううんてん": { base: "すんどううんてん (寸動運転)", pos: "benda", id: "operasi inching (gerak sedikit demi sedikit)" },
  "せんだんながさ": { base: "せんだんながさ (せん断長さ)", pos: "benda", id: "panjang geser (shear length)" },
  "せんだんめん": { base: "せんだんめん (せん断面)", pos: "benda", id: "permukaan geser (shear surface)" },
  "にじせんだんめん": { base: "にじせんだんめん (二次せん断面)", pos: "benda", id: "permukaan geser ganda" },
  "せんだんかこう": { base: "せんだんかこう (せん断加工)", pos: "benda", id: "proses pemotongan geser (shearing)" },
  "いたあつ": { base: "いたあつ (板厚)", pos: "benda", id: "ketebalan pelat" },
  "ざいしつ": { base: "ざいしつ (材質)", pos: "benda", id: "jenis bahan" },
  "ざいりょう": { base: "ざいりょう (材料)", pos: "benda", id: "bahan / material" },
  "まげ": { base: "まげ (曲げ)", pos: "benda", id: "tekuk / bending" },
  "まげかこう": { base: "まげかこう (曲げ加工)", pos: "benda", id: "proses penekukan" },
  "まげがた": { base: "まげがた (曲げ型)", pos: "benda", id: "cetakan tekuk" },
  "まげダイ": { base: "まげダイ (曲げダイ)", pos: "benda", id: "die tekuk" },
  "せいけい": { base: "せいけい (成形)", pos: "benda", id: "pembentukan / forming" },
  "せいけいせい": { base: "せいけいせい (成形性)", pos: "benda", id: "sifat mampu bentuk (formability)" },
  "しぼり": { base: "しぼり (絞り)", pos: "benda", id: "penarikan / drawing" },
  "しぼりかこう": { base: "しぼりかこう (絞り加工)", pos: "benda", id: "proses penarikan" },
  "しぼりダイ": { base: "しぼりダイ (絞りダイ)", pos: "benda", id: "drawing die" },
  "しぼりがた": { base: "しぼりがた (絞り型)", pos: "benda", id: "cetakan penarikan" },
  "しぼりパンチ": { base: "しぼりパンチ (絞りパンチ)", pos: "benda", id: "drawing punch" },
  "しぼりせいけいせい": { base: "しぼりせいけいせい (絞り成形性)", pos: "benda", id: "sifat mampu tarik (drawability)" },
  "しぼりりつ": { base: "しぼりりつ (絞り率)", pos: "benda", id: "rasio penarikan (drawing ratio)" },
  "がいけいぬき": { base: "がいけいぬき (外形抜き)", pos: "benda", id: "pemotongan bentuk luar" },
  "かながた": { base: "かながた (金型)", pos: "benda", id: "cetakan / mold" },
  "クッションピン": { base: "クッションピン", pos: "benda", id: "cushion pin" },
  "あな": { base: "あな (穴)", pos: "benda", id: "lubang" },
  "したあな": { base: "したあな (下穴)", pos: "benda", id: "lubang awal (pilot hole)" },
  "けい": { base: "けい (径)", pos: "benda", id: "diameter" },
  "ストリッパー": { base: "ストリッパー", pos: "benda", id: "stripper" },
  "パンチ": { base: "パンチ", pos: "benda", id: "punch" },
  "パンチラジアス": { base: "パンチラジアス", pos: "benda", id: "punch radius" },
  "うわがた": { base: "うわがた (上型)", pos: "benda", id: "cetakan atas (upper die)" },
  "したがた": { base: "したがた (下型)", pos: "benda", id: "cetakan bawah (lower die)" },
  "ダイラジアス": { base: "ダイラジアス", pos: "benda", id: "die radius" },
  "ぬきかこう": { base: "ぬきかこう (抜き加工)", pos: "benda", id: "proses pemotongan/pelubangan" },
  "せいひん": { base: "せいひん (製品)", pos: "benda", id: "produk" },
  "キズ": { base: "キズ (傷)", pos: "benda", id: "cacat / goresan" },
  "げんいん": { base: "げんいん (原因)", pos: "benda", id: "penyebab" },
  "かすあがり": { base: "かすあがり (カス上がり)", pos: "benda", id: "naiknya sisa potongan (scrap lift-up)" },
  "フランジ": { base: "フランジ", pos: "benda", id: "flange" },
  "えんとうしぼり": { base: "えんとうしぼり (円筒絞り)", pos: "benda", id: "penarikan silinder" },
  "しわ": { base: "しわ", pos: "benda", id: "kerutan" },
  "しわおさえ": { base: "しわおさえ (しわ押さえ)", pos: "benda", id: "penahan kerutan (blank holder)" },
  "しわおさえりょく": { base: "しわおさえりょく (しわ押さえ力)", pos: "benda", id: "gaya penahan kerutan" },
  "ノックアウト": { base: "ノックアウト", pos: "benda", id: "knockout" },
  "りょく": { base: "りょく (力)", pos: "benda", id: "gaya / tenaga" },
  "ちから": { base: "ちから (力)", pos: "benda", id: "gaya / tenaga" },
  "クリアランス": { base: "クリアランス", pos: "benda", id: "clearance (celah punch-die)" },
  "ねっかんあつえん": { base: "ねっかんあつえん (熱間圧延)", pos: "benda", id: "canai panas (hot rolled)" },
  "れいかんあつえん": { base: "れいかんあつえん (冷間圧延)", pos: "benda", id: "canai dingin (cold rolled)" },
  "なんこうはん": { base: "なんこうはん (軟鋼板)", pos: "benda", id: "pelat baja lunak" },
  "こうはん": { base: "こうはん (鋼板)", pos: "benda", id: "pelat baja (steel sheet)" },
  "じゅんど": { base: "じゅんど (純度)", pos: "benda", id: "kemurnian" },
  "アルミニウム": { base: "アルミニウム", pos: "benda", id: "aluminium" },
  "とりはずし": { base: "とりはずし (取り外し)", pos: "benda", id: "pelepasan" },
  "こうぐ": { base: "こうぐ (工具)", pos: "benda", id: "alat / tool" },
  "ボルスタ": { base: "ボルスタ", pos: "benda", id: "bolster" },
  "てさぎょう": { base: "てさぎょう (手作業)", pos: "benda", id: "kerja manual" },
  "プレスさぎょう": { base: "プレスさぎょう (プレス作業)", pos: "benda", id: "pekerjaan press" },
  "さぎょうせい": { base: "さぎょうせい (作業性)", pos: "benda", id: "kemudahan kerja (workability)" },
  "あんぜんいちこうてい": { base: "あんぜんいちこうてい (安全一工程)", pos: "benda", id: "mode operasi satu-siklus aman" },
  "じゅうりょう": { base: "じゅうりょう (重量)", pos: "benda", id: "berat (weight)" },
  "バランス": { base: "バランス", pos: "benda", id: "keseimbangan" },
  "そうち": { base: "そうち (装置)", pos: "benda", id: "alat / perangkat" },
  "あんぜんそうち": { base: "あんぜんそうち (安全装置)", pos: "benda", id: "alat pengaman" },
  "ガードしき": { base: "ガードしき (ガード式)", pos: "benda", id: "tipe pelindung (guard type)" },
  "こうせんしき": { base: "こうせんしき (光線式)", pos: "benda", id: "tipe sinar (photoelectric type)" },
  "りょうてそうさしき": { base: "りょうてそうさしき (両手操作式)", pos: "benda", id: "tipe kontrol dua tangan" },
  "てびきしき": { base: "てびきしき (手引き式)", pos: "benda", id: "tipe penarik tangan" },
  "てばらいしき": { base: "てばらいしき (手払い式)", pos: "benda", id: "tipe penyapu tangan" },
  "おしボタン": { base: "おしボタン (押しボタン)", pos: "benda", id: "tombol tekan" },
  "かんかく": { base: "かんかく (間隔)", pos: "benda", id: "jarak / interval" },
  "いじょう": { base: "いじょう (以上)", pos: "benda", id: "atau lebih / lebih dari" },
  "ダイクッション": { base: "ダイクッション", pos: "benda", id: "die cushion" },
  "うえほうこう": { base: "うえほうこう (上方向)", pos: "benda", id: "arah atas" },
  "ぎゃくしぼりかこう": { base: "ぎゃくしぼりかこう (逆絞り加工)", pos: "benda", id: "proses penarikan terbalik" },
  "シャーかく": { base: "シャーかく (シャー角)", pos: "benda", id: "sudut geser (shear angle)" },
  "けいしゃかく": { base: "けいしゃかく (傾斜角)", pos: "benda", id: "sudut kemiringan" },
  "かえり": { base: "かえり (返り)", pos: "benda", id: "burr / sisa tajam" },
  "バリ": { base: "バリ", pos: "benda", id: "burr / sisa tajam" },
  "バリがわ": { base: "バリがわ (バリ側)", pos: "benda", id: "sisi burr" },
  "かたはば": { base: "かたはば (肩幅)", pos: "benda", id: "lebar bahu (shoulder width)" },
  "ばい": { base: "ばい (倍)", pos: "benda", id: "kali (lipat)" },
  "ていど": { base: "ていど (程度)", pos: "benda", id: "kira-kira / sekitar" },
  "われ": { base: "われ (割れ)", pos: "benda", id: "retak" },
  "そとがわ": { base: "そとがわ (外側)", pos: "benda", id: "sisi luar" },
  "うちがわ": { base: "うちがわ (内側)", pos: "benda", id: "sisi dalam" },
  "ひじゅう": { base: "ひじゅう (比重)", pos: "benda", id: "berat jenis" },
  "ひっぱりおうりょく": { base: "ひっぱりおうりょく (引っ張り応力)", pos: "benda", id: "tegangan tarik (tensile stress)" },
  "ひょうしき": { base: "ひょうしき (標識)", pos: "benda", id: "tanda / simbol" },
  "でんげん": { base: "でんげん (電源)", pos: "benda", id: "sumber listrik / power" },
  "でんげんばん": { base: "でんげんばん (電源盤)", pos: "benda", id: "panel listrik" },
  "スライド": { base: "スライド", pos: "benda", id: "slide (bagian mesin press yang bergerak)" },
  "かこうちゅう": { base: "かこうちゅう (加工中)", pos: "benda", id: "sedang diproses" },
  "きゅうていし": { base: "きゅうていし (急停止)", pos: "benda", id: "berhenti mendadak (emergency stop)" },
  "てやゆび": { base: "てやゆび (手や指)", pos: "benda", id: "tangan atau jari" },
  "ダイハイト": { base: "ダイハイト", pos: "benda", id: "die height (tinggi cetakan)" },
  "さいてい": { base: "さいてい (最低)", pos: "benda", id: "minimum" },
  "さいしょう": { base: "さいしょう (最小)", pos: "benda", id: "paling kecil / minimum" },
  "さいしょうまげはんけい": { base: "さいしょうまげはんけい (最小曲げ半径)", pos: "benda", id: "radius tekuk minimum" },
  "はりだしかこう": { base: "はりだしかこう (張り出し加工)", pos: "benda", id: "proses pembentukan tonjolan (stretch forming)" },
  "しゅようぶ": { base: "しゅようぶ (主要部)", pos: "benda", id: "bagian utama" },
  "バーリングかこう": { base: "バーリングかこう (バーリング加工)", pos: "benda", id: "proses burring" },
  "ストレートサイドがた": { base: "ストレートサイドがた (ストレートサイド型)", pos: "benda", id: "tipe rangka straight-side" },
  "spm": { base: "spm", pos: "benda", id: "jumlah stroke per menit" },
  "フライホイール": { base: "フライホイール", pos: "benda", id: "flywheel" },
  "かいてんすう": { base: "かいてんすう (回転数)", pos: "benda", id: "jumlah putaran" },
  "かいてんそくど": { base: "かいてんそくど (回転速度)", pos: "benda", id: "kecepatan putar" },
  "くどうじく": { base: "くどうじく (駆動軸)", pos: "benda", id: "poros penggerak (drive shaft)" },
  "じょうしてん": { base: "じょうしてん (上死点)", pos: "benda", id: "titik mati atas" },
  "かしてん": { base: "かしてん (下死点)", pos: "benda", id: "titik mati bawah" },
  "ローリングキー": { base: "ローリングキー", pos: "benda", id: "rolling key" },
  "どうりょく": { base: "どうりょく (動力)", pos: "benda", id: "tenaga penggerak" },
  "ぶひん": { base: "ぶひん (部品)", pos: "benda", id: "komponen / part" },
  "めんせき": { base: "めんせき (面積)", pos: "benda", id: "luas (area)" },
  "じゅんおくりがた": { base: "じゅんおくりがた (順送り型)", pos: "benda", id: "cetakan progresif (progressive die)" },
  "じゅんそうがた": { base: "じゅんそうがた (順送型)", pos: "benda", id: "cetakan progresif (progressive die)" },
  "かくこうてい": { base: "かくこうてい (各工程)", pos: "benda", id: "setiap tahap proses" },
  "いちせいど": { base: "いちせいど (位置精度)", pos: "benda", id: "akurasi posisi" },
  "スライドがわ": { base: "スライドがわ (スライド側)", pos: "benda", id: "sisi slide" },
  "じょうたい": { base: "じょうたい (状態)", pos: "benda", id: "kondisi / keadaan" },
  "スプリングゴー": { base: "スプリングゴー", pos: "benda", id: "spring-go" },
  "スプリングバック": { base: "スプリングバック", pos: "benda", id: "spring back" },
  "あつえんほうこう": { base: "あつえんほうこう (圧延方向)", pos: "benda", id: "arah pengerolan (rolling direction)" },
  "そり": { base: "そり (反り)", pos: "benda", id: "kelengkungan / warp" },
  "ステンレスこうはん": { base: "ステンレスこうはん (ステンレス鋼板)", pos: "benda", id: "pelat baja tahan karat (stainless)" },
  "じしゃく": { base: "じしゃく (磁石)", pos: "benda", id: "magnet" },
  "しょうかき": { base: "しょうかき (消火器)", pos: "benda", id: "alat pemadam kebakaran" },
  "あんぜんぐつ": { base: "あんぜんぐつ (安全靴)", pos: "benda", id: "sepatu keselamatan" },
  "フォークリフト": { base: "フォークリフト", pos: "benda", id: "forklift" },
  "パレット": { base: "パレット", pos: "benda", id: "palet (pallet)" },
  "めのたかさ": { base: "めのたかさ (目の高さ)", pos: "benda", id: "tinggi mata (eye level)" },
  "ナックルプレス": { base: "ナックルプレス", pos: "benda", id: "knuckle press" },
  "つぶし": { base: "つぶし (潰し)", pos: "benda", id: "penekanan padat (coining)" },
  "きかいせいず": { base: "きかいせいず (機械製図)", pos: "benda", id: "gambar teknik mesin" },
  "ちゅうしんせん": { base: "ちゅうしんせん (中心線)", pos: "benda", id: "garis sumbu (center line)" },
  "いってんさせん": { base: "いってんさせん (一点鎖線)", pos: "benda", id: "garis putus-titik" },
  "シャンク": { base: "シャンク", pos: "benda", id: "shank" },
  "おおきさ": { base: "おおきさ (大きさ)", pos: "benda", id: "ukuran" },
  "おもさ": { base: "おもさ (重さ)", pos: "benda", id: "berat" },
  "すんぽう": { base: "すんぽう (寸法)", pos: "benda", id: "dimensi / ukuran" },
  "ショックマーク": { base: "ショックマーク", pos: "benda", id: "shock mark" },
  "リングマーク": { base: "リングマーク", pos: "benda", id: "ring mark" },

  /* ---------- Kata sifat-na & lainnya ---------- */
  "じゅうよう": { base: "じゅうよう (重要)", pos: "sifat-na", id: "penting" },
  "せいみつな": { base: "せいみつ (精密)", pos: "sifat-na", id: "presisi" },
  "かんけいなく": { base: "かんけい (関係) + なく", pos: "lainnya", id: "tanpa memandang / terlepas dari" },
  "すべて": { base: "すべて (全て)", pos: "lainnya", id: "semua" },

  /* ---------- Alias bentuk KANJI (dipakai khusus di Set G) ----------
     Set G ditulis dengan kanji, bukan hiragana seperti Set A-F,
     jadi kata yang sama perlu didaftarkan ulang dalam bentuk kanjinya
     supaya tetap bisa diklik & dikenali. */
  "絞りダイ": { base: "しぼりダイ (絞りダイ)", pos: "benda", id: "drawing die" },
  "肩幅": { base: "かたはば (肩幅)", pos: "benda", id: "lebar bahu (shoulder width)" },
  "板厚": { base: "いたあつ (板厚)", pos: "benda", id: "ketebalan pelat" },
  "曲げ加工": { base: "まげかこう (曲げ加工)", pos: "benda", id: "proses penekukan" },
  "曲げ": { base: "まげ (曲げ)", pos: "benda", id: "tekuk / bending" },
  "曲げダイ": { base: "まげダイ (曲げダイ)", pos: "benda", id: "die tekuk" },
  "曲げ半径": { base: "まげはんけい (曲げ半径)", pos: "benda", id: "radius tekuk" },
  "最小曲げ半径": { base: "さいしょうまげはんけい (最小曲げ半径)", pos: "benda", id: "radius tekuk minimum" },
  "打ち抜き": { base: "うちぬき (打ち抜き)", pos: "benda", id: "pemotongan / pelubangan" },
  "潰し": { base: "つぶし (潰し)", pos: "benda", id: "penekanan padat (coining)" },
  "含んだ": { base: "ふくむ (含む)", pos: "kerja", id: "mencakup / termasuk" },
  "加工": { base: "かこう (加工)", pos: "benda", id: "proses pengerjaan" },
  "適しています": { base: "てきする (適する)", pos: "kerja", id: "cocok / sesuai" },
  "機械製図": { base: "きかいせいず (機械製図)", pos: "benda", id: "gambar teknik mesin" },
  "中心線": { base: "ちゅうしんせん (中心線)", pos: "benda", id: "garis sumbu (center line)" },
  "細い": { base: "ほそい (細い)", pos: "sifat-i", id: "tipis / kurus (untuk benda memanjang)" },
  "一点鎖線": { base: "いってんさせん (一点鎖線)", pos: "benda", id: "garis putus-titik" },
  "金型": { base: "かながた (金型)", pos: "benda", id: "cetakan / mold" },
  "大きさ": { base: "おおきさ (大きさ)", pos: "benda", id: "ukuran" },
  "重さ": { base: "おもさ (重さ)", pos: "benda", id: "berat" },
  "関係なく": { base: "かんけい (関係) + なく", pos: "lainnya", id: "tanpa memandang / terlepas dari" },
  "全て": { base: "すべて (全て)", pos: "lainnya", id: "semua" },
  "上型": { base: "うわがた (上型)", pos: "benda", id: "cetakan atas (upper die)" },
  "下型": { base: "したがた (下型)", pos: "benda", id: "cetakan bawah (lower die)" },
  "摩耗しやすい": { base: "まもうする (摩耗する)", pos: "kerja", id: "mudah aus" },
  "摩耗": { base: "まもう (摩耗)", pos: "benda", id: "keausan" },
  "精密な": { base: "せいみつ (精密)", pos: "sifat-na", id: "presisi" },
  "穴抜き加工": { base: "あなぬきかこう (穴抜き加工)", pos: "benda", id: "proses pelubangan (piercing)" },
  "寸法": { base: "すんぽう (寸法)", pos: "benda", id: "dimensi / ukuran" },
  "影響します": { base: "えいきょうする (影響する)", pos: "kerja", id: "mempengaruhi" },
  "板金": { base: "ばんきん (板金)", pos: "benda", id: "pelat logam (sheet metal)" },
  "材料": { base: "ざいりょう (材料)", pos: "benda", id: "bahan / material" },
  "伸びやすい": { base: "のびる (伸びる)", pos: "kerja", id: "mudah mulur / mudah ditarik" },
  "冷間圧延": { base: "れいかんあつえん (冷間圧延)", pos: "benda", id: "canai dingin (cold rolled)" },
  "熱間圧延": { base: "ねっかんあつえん (熱間圧延)", pos: "benda", id: "canai panas (hot rolled)" },
  "鋼板": { base: "こうはん (鋼板)", pos: "benda", id: "pelat baja (steel sheet)" },
  "整形性": { base: "せいけいせい (成形性/整形性)", pos: "benda", id: "sifat mampu bentuk (formability)" },
  "優れています": { base: "すぐれる (優れる)", pos: "kerja", id: "unggul / lebih baik" },
  "置いても": { base: "おく (置く)", pos: "kerja", id: "meskipun diletakkan" },
  "履きます": { base: "はく (履く)", pos: "kerja", id: "memakai (sepatu)" },
  "運転する": { base: "うんてんする (運転する)", pos: "kerja", id: "mengoperasikan / mengemudikan" },
  "目の高さ": { base: "めのたかさ (目の高さ)", pos: "benda", id: "tinggi mata (eye level)" },
  "高くします": { base: "たかい (高い)", pos: "sifat-i", id: "membuat tinggi / menaikkan" },
};

/* ============================================================
   TOKENIZER — pencocokan kata terpanjang (greedy longest-match)
   ============================================================ */

// Urutkan key kamus dari yang terpanjang ke terpendek supaya
// pencocokan selalu mengambil kata paling spesifik dulu.
const VOCAB_KEYS = Object.keys(VOCAB).sort((a, b) => b.length - a.length);
const MAX_KEY_LEN = VOCAB_KEYS.length ? VOCAB_KEYS[0].length : 0;

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Mengubah teks Jepang menjadi HTML dengan kata-kata yang dikenali
 * dibungkus <span class="vocab-word" data-key="..."> supaya bisa diklik.
 * Karakter/kata yang tidak dikenali tetap tampil apa adanya.
 */
export function annotateJapanese(text) {
  if (!text) return "";
  let html = "";
  let i = 0;
  while (i < text.length) {
    let matched = null;
    const maxLen = Math.min(MAX_KEY_LEN, text.length - i);
    for (let len = maxLen; len >= 1; len--) {
      const candidate = text.substr(i, len);
      if (VOCAB.hasOwnProperty(candidate)) {
        matched = candidate;
        break;
      }
    }
    if (matched) {
      const safe = escapeHtml(matched);
      html += `<span class="vocab-word" data-key="${safe}">${safe}</span>`;
      i += matched.length;
    } else {
      html += escapeHtml(text[i]);
      i += 1;
    }
  }
  return html;
}

/* ============================================================
   POPUP UI — dibuat & disuntikkan sendiri oleh file ini
   ============================================================ */

const POS_LABEL = {
  benda: "Kata Benda",
  kerja: "Kata Kerja",
  "sifat-i": "Kata Sifat (i-keiyoushi)",
  "sifat-na": "Kata Sifat (na-keiyoushi)",
  partikel: "Partikel",
  lainnya: "Lainnya",
};

function injectVocabStyles() {
  if (document.getElementById("vocab-style")) return;
  const style = document.createElement("style");
  style.id = "vocab-style";
  style.textContent = `
    .vocab-word{
      cursor:pointer;
      border-bottom:2px dotted color-mix(in srgb, var(--teal, #008471) 55%, transparent);
      transition:background .15s ease, color .15s ease;
      border-radius:3px;
      padding:0 1px;
    }
    .vocab-word:hover, .vocab-word:focus{
      background:color-mix(in srgb, var(--teal, #008471) 16%, transparent);
      color:var(--teal-dark, #045c4d);
      outline:none;
    }
    .vocab-popup{
      position:fixed;z-index:9999;max-width:280px;min-width:200px;
      background:#FFFFFF;color:#2E2620;
      border-radius:16px;padding:14px 16px;
      box-shadow:0 16px 34px -12px rgba(50,35,15,.35), 0 0 0 1px rgba(50,35,15,.06);
      font-family:'Segoe UI','Noto Sans JP',-apple-system,BlinkMacSystemFont,sans-serif;
      opacity:0;transform:translateY(6px) scale(.97);
      transition:opacity .15s ease, transform .15s ease;
      pointer-events:none;
    }
    .vocab-popup.show{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}
    .vocab-popup .vp-word{font-size:17px;font-weight:800;margin-bottom:2px;color:#008471;}
    .vocab-popup .vp-pos{
      display:inline-block;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
      color:#C45F3F;background:rgba(196,95,63,.1);padding:2px 8px;border-radius:999px;margin-bottom:8px;
    }
    .vocab-popup .vp-base{font-size:12.5px;color:#7A6F5D;margin-bottom:6px;}
    .vocab-popup .vp-base b{color:#2E2620;}
    .vocab-popup .vp-id{font-size:13.5px;color:#2E2620;line-height:1.5;}
    .vocab-popup .vp-close{
      position:absolute;top:8px;right:10px;cursor:pointer;font-size:14px;color:#a89a82;
      width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:50%;
    }
    .vocab-popup .vp-close:hover{background:rgba(50,35,15,.08);color:#2E2620;}
  `;
  document.head.appendChild(style);
}

let popupEl = null;

function ensurePopup() {
  if (popupEl) return popupEl;
  popupEl = document.createElement("div");
  popupEl.className = "vocab-popup";
  popupEl.setAttribute("role", "dialog");
  document.body.appendChild(popupEl);
  return popupEl;
}

function hidePopup() {
  if (popupEl) popupEl.classList.remove("show");
}

function showPopupFor(word, anchorRect) {
  const entry = VOCAB[word];
  if (!entry) return;
  const popup = ensurePopup();

  const posLabel = POS_LABEL[entry.pos] || "Kosakata";
  const showBase = entry.base && entry.base !== word;

  popup.innerHTML = `
    <span class="vp-close" data-close="1">✕</span>
    <div class="vp-word">${escapeHtml(word)}</div>
    <div class="vp-pos">${escapeHtml(posLabel)}</div>
    ${showBase ? `<div class="vp-base">Bentuk kamus: <b>${escapeHtml(entry.base)}</b></div>` : ""}
    <div class="vp-id">${escapeHtml(entry.id)}</div>
  `;

  // Tampilkan dulu (tersembunyi secara visual) supaya ukurannya bisa diukur
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
    if (top < 10) top = anchorRect.bottom + 10; // taruh di bawah kalau tidak muat di atas
    top = Math.max(10, Math.min(top, vh - ph - 10));

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  });
}

function handleDocumentClick(e) {
  const closeBtn = e.target.closest && e.target.closest("[data-close]");
  if (closeBtn) {
    hidePopup();
    return;
  }
  const word = e.target.closest && e.target.closest(".vocab-word");
  if (word) {
    e.stopPropagation();
    const rect = word.getBoundingClientRect();
    showPopupFor(word.dataset.key, rect);
    return;
  }
  if (popupEl && !popupEl.contains(e.target)) {
    hidePopup();
  }
}

function initVocabPopup() {
  injectVocabStyles();
  document.addEventListener("click", handleDocumentClick);
  window.addEventListener("scroll", hidePopup, true);
  window.addEventListener("resize", hidePopup);
}

// Jalan otomatis begitu file ini di-import — script.js tidak perlu
// memanggil fungsi init apa pun secara manual.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initVocabPopup);
} else {
  initVocabPopup();
}
