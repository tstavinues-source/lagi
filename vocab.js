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
import { icon } from "./icons.js";


export const VOCAB = {
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
  "とき": { base: "とき (時)", pos: "benda", id: "waktu / saat" },
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
  "たいしょくせい": { base: "たいしょくせい (耐食性)", pos: "benda", id: "ketahanan korosi (corrosion resistance)" },
  "しぎょうまえてんけん": { base: "しぎょうまえてんけん (始業前点検)", pos: "benda", id: "pemeriksaan sebelum mulai bekerja (pre-operation check)" },
  "四角": { base: "しかく (四角)", pos: "benda", id: "persegi / segi empat" },

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

  /* ---------- Kata dasar umum yang sering muncul (ditambah karena
     sebelumnya banyak terlewat — lihat catatan revisi) ---------- */
  "する": { base: "する", pos: "kerja", id: "melakukan" },
  "いいます": { base: "いう (言う)", pos: "kerja", id: "disebut / dikatakan" },
  "ような": { base: "よう", pos: "lainnya", id: "seperti / semacam" },
  "ように": { base: "よう", pos: "lainnya", id: "supaya / seperti" },
  "よう": { base: "よう", pos: "lainnya", id: "seperti / tampaknya" },
  "かこう": { base: "かこう (加工)", pos: "benda", id: "proses pengerjaan" },
  "かこうする": { base: "かこうする (加工する)", pos: "kerja", id: "melakukan proses pengerjaan" },
  "かこうすると": { base: "かこうする (加工する)", pos: "kerja", id: "kalau melakukan proses pengerjaan" },
  "ダイ": { base: "ダイ", pos: "benda", id: "die (cetakan bagian bawah)" },
  "図": { base: "ず (図)", pos: "benda", id: "gambar / diagram" },
  "ず": { base: "ず (図)", pos: "benda", id: "gambar / diagram" },
  "プレス": { base: "プレス", pos: "benda", id: "press (mesin/proses tekan)" },
  "つき": { base: "つき (付き)", pos: "lainnya", id: "dengan / dilengkapi" },
  "きじゅん": { base: "きじゅん (基準)", pos: "benda", id: "standar / basis acuan" },
  "おこなう": { base: "おこなう (行う)", pos: "kerja", id: "melakukan" },
  "ぶぶん": { base: "ぶぶん (部分)", pos: "benda", id: "bagian" },
  "なります": { base: "なる", pos: "kerja", id: "menjadi" },
  "なりません": { base: "なる", pos: "kerja", id: "tidak menjadi / harus (dalam bentuk larangan)" },
  "せい": { base: "せい (性)", pos: "benda", id: "sifat / karakteristik (akhiran kata)" },
  "いっぱん": { base: "いっぱん (一般)", pos: "benda", id: "umum" },
  "いっぱんに": { base: "いっぱん (一般)", pos: "benda", id: "secara umum / umumnya" },
  "さきに": { base: "さき (先)", pos: "benda", id: "duluan / lebih dulu" },
  "きかい": { base: "きかい (機械)", pos: "benda", id: "mesin" },
  "まいにち": { base: "まいにち (毎日)", pos: "benda", id: "setiap hari" },
  "さぎょうかいし": { base: "さぎょうかいし (作業開始)", pos: "benda", id: "mulai bekerja" },
  "まえ": { base: "まえ (前)", pos: "benda", id: "sebelum / depan" },
  "ひつよう": { base: "ひつよう (必要)", pos: "sifat-na", id: "perlu" },
  "ひつようが": { base: "ひつよう (必要)", pos: "sifat-na", id: "perlu" },
  "うごく": { base: "うごく (動く)", pos: "kerja", id: "bergerak" },
  "うごきます": { base: "うごく (動く)", pos: "kerja", id: "bergerak" },
  "がた": { base: "がた (型)", pos: "benda", id: "tipe / jenis (akhiran kata)" },
  "SPHC": { base: "SPHC", pos: "benda", id: "kode baja canai panas lunak (hot rolled)" },
  "SPCC": { base: "SPCC", pos: "benda", id: "kode baja canai dingin (cold rolled)" },
  "ています": { base: "ている", pos: "lainnya", id: "sedang / dalam keadaan (bentuk aspek berlanjut)" },
  "ている": { base: "ている", pos: "lainnya", id: "sedang / dalam keadaan (bentuk aspek berlanjut)" },
  "です": { base: "です", pos: "lainnya", id: "adalah (kata penghubung sopan)" },
  "下": { base: "した (下)", pos: "benda", id: "bawah" },
  "大きく": { base: "おおきい (大きい)", pos: "sifat-i", id: "besar (bentuk keterangan)" },
  "ところ": { base: "ところ (所)", pos: "benda", id: "tempat" },
  "アルミニウムばん": { base: "アルミニウムばん (アルミニウム板)", pos: "benda", id: "pelat aluminium" },
  "消火器": { base: "しょうかき (消火器)", pos: "benda", id: "alat pemadam kebakaran" },
  "電源盤": { base: "でんげんばん (電源盤)", pos: "benda", id: "panel listrik" },
  "前": { base: "まえ (前)", pos: "benda", id: "sebelum / depan" },

  /* ---------- Partikel gabungan (fusi 2 partikel jadi 1 unit makna) ----------
     Ditambahkan setelah audit ketat: sebelumnya は/で/に/と dsb ke-detect
     terpisah padahal seharusnya jadi SATU unit gabungan dengan arti sendiri. */
  "とは": { base: "とは", pos: "partikel", id: "adalah (menandai definisi: 'yang dimaksud dengan X adalah...')" },
  "では": { base: "では", pos: "partikel", id: "dalam hal ini / pada (topik) + di (tempat/kondisi)" },
  "には": { base: "には", pos: "partikel", id: "di / pada / untuk (topik) — gabungan に + は" },
  "とも": { base: "とも", pos: "partikel", id: "juga (dipakai di 'juga disebut' / '〜とも言う')" },
  "として": { base: "として", pos: "partikel", id: "sebagai" },
  "しても": { base: "しても", pos: "lainnya", id: "meskipun melakukan / walau begitu" },

  /* ---------- Kata dasar tambahan hasil audit (sebelumnya ke-pecah oleh
     partikel pendek yang kebetulan sama huruf awalnya) ---------- */
  "もっとも": { base: "もっとも (最も)", pos: "lainnya", id: "paling / yang paling" },
  "ひとつ": { base: "ひとつ (一つ)", pos: "benda", id: "satu / salah satu" },
  "こと": { base: "こと (事)", pos: "benda", id: "hal / fakta (menjadikan kata kerja sebagai kata benda)" },
  "もの": { base: "もの (物)", pos: "benda", id: "benda / hal / sesuatu" },
  "して": { base: "する", pos: "kerja", id: "melakukan (bentuk -te)" },
  "はやさ": { base: "はやさ (速さ)", pos: "benda", id: "kecepatan" },
  "だいしゃ": { base: "だいしゃ (台車)", pos: "benda", id: "kereta dorong / trolley" },
  "ていしせいのう": { base: "ていしせいのう (停止性能)", pos: "benda", id: "kemampuan berhenti" },
  "しぼる": { base: "しぼる (絞る)", pos: "kerja", id: "menarik / mengecilkan (bentuk kamus dari proses drawing)" },
  "よりも": { base: "よりも", pos: "partikel", id: "lebih dari (penekanan perbandingan)" },
  "おもに": { base: "おもに (主に)", pos: "lainnya", id: "terutama / mayoritas" },
  "おとします": { base: "おとす (落とす)", pos: "kerja", id: "menjatuhkan / melepaskan" },
  "とりつけます": { base: "とりつける (取り付ける)", pos: "kerja", id: "memasang" },
  "にもつ": { base: "にもつ (荷物)", pos: "benda", id: "muatan / barang bawaan" },
  "ぬきかこうした": { base: "ぬきかこうする (抜き加工する)", pos: "kerja", id: "sudah melakukan proses pemotongan/pelubangan" },

  /* ---------- Kata kunci yang belum sempat masuk kamus (audit vocabquiz.js) ---------- */
  "安全靴": { base: "あんぜんぐつ (安全靴)", pos: "benda", id: "sepatu keselamatan" },
  "あんぜんきょういく": { base: "あんぜんきょういく (安全教育)", pos: "benda", id: "pelatihan keselamatan" },
  "急停止": { base: "きゅうていし (急停止)", pos: "benda", id: "berhenti mendadak (emergency stop)" },
  "おおきくなる": { base: "おおきい (大きい)", pos: "sifat-i", id: "menjadi besar" },
  "安全一工程": { base: "あんぜんいちこうてい (安全一工程)", pos: "benda", id: "mode operasi satu-siklus aman" },
  "バラツキ": { base: "バラツキ", pos: "benda", id: "variasi / dispersi (sifat tidak seragam)" },
  "ダレ": { base: "ダレ", pos: "benda", id: "bagian membulat di tepi hasil potong (rollover)" },
  "そざい": { base: "そざい (素材)", pos: "benda", id: "bahan mentah / material dasar" },
  "円筒絞り": { base: "えんとうしぼり (円筒絞り)", pos: "benda", id: "penarikan silinder" },
  "付き": { base: "つき (付き)", pos: "lainnya", id: "dengan / dilengkapi" },
  "穴": { base: "あな (穴)", pos: "benda", id: "lubang" },

  /* ---------- Tambahan untuk Set 12-1 s/d 12-4 ---------- */
  "高速": { base: "こうそく (高速)", pos: "benda", id: "kecepatan tinggi" },
  "打ち抜き加工": { base: "うちぬきかこう (打ち抜き加工)", pos: "benda", id: "proses pemotongan/blanking" },
  "使います": { base: "つかいます (使います)", pos: "kerja", id: "memakai/menggunakan" },
  "ストローク長さ": { base: "ながさ (ストローク長さ)", pos: "benda", id: "panjang stroke" },
  "半径": { base: "はんけい (半径)", pos: "benda", id: "jari-jari/radius" },
  "同じです": { base: "おなじです (同じです)", pos: "sifat-na", id: "sama" },
  "トランスファープレス": { base: "トランスファープレス", pos: "benda", id: "transfer press" },
  "2つ以上": { base: "ふたついじょう (2つ以上)", pos: "benda", id: "2 atau lebih" },
  "工程": { base: "こうてい (工程)", pos: "benda", id: "proses/tahap" },
  "連続して": { base: "れんぞくして (連続して)", pos: "kerja", id: "secara berurutan/berkelanjutan" },
  "加工するため": { base: "かこうするため (加工するため)", pos: "kerja", id: "untuk memproses" },
  "プレスです": { base: "プレスです", pos: "benda", id: "adalah mesin press" },
  "C型フレーム": { base: "シーがたフレーム (C型フレーム)", pos: "benda", id: "rangka bentuk C" },
  "プレス機械": { base: "きかい (プレス機械)", pos: "benda", id: "mesin press" },
  "寸動運転": { base: "すんどううんてん (寸動運転)", pos: "benda", id: "operasi inching (sedikit-sedikit)" },
  "打ち抜き力": { base: "うちぬきりょく (打ち抜き力)", pos: "benda", id: "gaya pemotongan" },
  "せん断長さ": { base: "せんだんながさ (せん断長さ)", pos: "benda", id: "panjang geseran (keliling)" },
  "材質": { base: "ざいしつ (材質)", pos: "benda", id: "jenis/kualitas material" },
  "を基準に": { base: "をきじゅんに (を基準に)", pos: "lainnya", id: "berdasarkan / sebagai standar" },
  "計算します": { base: "けいさんします (計算します)", pos: "kerja", id: "menghitung" },
  "プレス加工": { base: "かこう (プレス加工)", pos: "benda", id: "proses press" },
  "主に": { base: "おもに (主に)", pos: "lainnya", id: "terutama / utamanya" },
  "成形": { base: "せいけい (成形)", pos: "benda", id: "pembentukan/forming" },
  "絞り": { base: "しぼり (絞り)", pos: "benda", id: "penarikan/drawing" },
  "部分": { base: "ぶぶん (部分)", pos: "benda", id: "bagian" },
  "抜きます": { base: "ぬきます (抜きます)", pos: "kerja", id: "memotong/melubangi" },
  "スライド側": { base: "がわ (スライド側)", pos: "benda", id: "sisi slide" },
  "取り付けます": { base: "とりつけます (取り付けます)", pos: "kerja", id: "memasang" },
  "打ち抜き型": { base: "がた (打ち抜き型)", pos: "benda", id: "cetakan potong" },
  "ストリッパ": { base: "ストリッパ", pos: "benda", id: "stripper" },
  "パンチから": { base: "パンチから", pos: "partikel", id: "dari punch (から = dari)" },
  "引き離す": { base: "ひきはなす (引き離す)", pos: "kerja", id: "melepaskan/memisahkan" },
  "ための物": { base: "もの (ための物)", pos: "lainnya", id: "alat untuk (tujuan)" },
  "時": { base: "とき (時)", pos: "benda", id: "saat / ketika" },
  "上型から": { base: "うわがたから (上型から)", pos: "partikel", id: "dari cetakan atas (から = dari/mulai)" },
  "固定します": { base: "こていします (固定します)", pos: "kerja", id: "memfiksasi / mengunci / memasang" },
  "R": { base: "R", pos: "benda", id: "radius" },
  "ともいいます": { base: "ともいいます", pos: "lainnya", id: "juga disebut (と = partikel kutipan, も = juga, いいます = berkata/disebut)" },
  "抜き加工": { base: "ぬきかこう (抜き加工)", pos: "benda", id: "proses pemotongan" },
  "した時": { base: "した時", pos: "lainnya", id: "saat melakukan (lampau + toki)" },
  "カス上がり": { base: "あがり (カス上がり)", pos: "benda", id: "scrap lift-up (sisa potongan naik/menempel ke atas)" },
  "起きると": { base: "おきると (起きると)", pos: "kerja", id: "kalau terjadi (と = kalau/jika)" },
  "製品": { base: "せいひん (製品)", pos: "benda", id: "produk hasil" },
  "キズが付く": { base: "つく (キズが付く)", pos: "kerja", id: "timbul cacat/goresan" },
  "ことがあります": { base: "ことがあります", pos: "lainnya", id: "ada kalanya / terkadang terjadi" },
  "フランジ付き": { base: "つき (フランジ付き)", pos: "benda", id: "dilengkapi flange (bibir)" },
  "シワ": { base: "シワ", pos: "benda", id: "kerutan" },
  "ノックアウト力": { base: "りょく (ノックアウト力)", pos: "benda", id: "gaya knockout (alat pendorong keluar)" },
  "強くすると": { base: "つよくすると (強くすると)", pos: "lainnya", id: "kalau diperkuat/diperbesar" },
  "少なくなります": { base: "すくなくなります (少なくなります)", pos: "lainnya", id: "menjadi sedikit/berkurang" },
  "一般に": { base: "いっぱんに (一般に)", pos: "lainnya", id: "secara umum" },
  "せん断力": { base: "せんだんりょく (せん断力)", pos: "benda", id: "gaya geser (potong)" },
  "大きくすると": { base: "大きくすると", pos: "lainnya", id: "jika diperbesar" },
  "小さくなります": { base: "ちいさくなります (小さくなります)", pos: "lainnya", id: "menjadi kecil/menurun" },
  "大きいと": { base: "おおきいと (大きいと)", pos: "lainnya", id: "kalau besar (と = jika)" },
  "様に": { base: "ように (様に)", pos: "lainnya", id: "seperti" },
  "二次せん断面": { base: "にじせんだんめん (二次せん断面)", pos: "benda", id: "secondary shear surface (permukaan geser ganda)" },
  "材料として": { base: "ざいりょうとして (材料として)", pos: "partikel", id: "sebagai material (として = sebagai)" },
  "多く使われている": { base: "おおくつかわれている (多く使われている)", pos: "lainnya", id: "yang banyak digunakan" },
  "熱間圧延軟鋼板": { base: "熱間圧延軟鋼板", pos: "benda", id: "pelat baja lunak canai panas (SPHC)" },
  "冷間圧延鋼板": { base: "冷間圧延鋼板", pos: "benda", id: "pelat baja canai dingin (SPCC)" },
  "ジュラルミン": { base: "ジュラルミン", pos: "benda", id: "Duralumin (paduan Al-Cu-Mg)" },
  "合金": { base: "ごうきん (合金)", pos: "benda", id: "logam paduan (alloy)" },
  "一つ": { base: "ひとつ (一つ)", pos: "benda", id: "satu / salah satu" },
  "取り外し": { base: "とりはずし (取り外し)", pos: "benda", id: "pelepasan/pembongkaran" },
  "工具": { base: "こうぐ (工具)", pos: "benda", id: "perkakas/alat" },
  "ボルスタの上に": { base: "うえに (ボルスタの上に)", pos: "benda", id: "di atas bolster (meja press)" },
  "置いたまま": { base: "おいたまま (置いたまま)", pos: "lainnya", id: "dibiarkan terletak begitu saja (まま = membiarkan kondisi)" },
  "作業をしても良い": { base: "さぎょうをしてもよい (作業をしても良い)", pos: "lainnya", id: "boleh melakukan pekerjaan (てもいい = boleh)" },
  "手作業": { base: "てさぎょう (手作業)", pos: "benda", id: "kerja manual (tangan operator yang masuk area mesin)" },
  "での": { base: "での", pos: "partikel", id: "pada/dalam (menunjukkan konteks)" },
  "安全一工程運転": { base: "安全一工程運転", pos: "benda", id: "operasi satu siklus aman (mesin berhenti otomatis setiap 1 langkah selesai)" },
  "光線式安全装置": { base: "こうせんしきあんぜんそうち (光線式安全装置)", pos: "benda", id: "alat pengaman tipe sensor cahaya/photoelectric" },
  "停止性能": { base: "ていしせいのう (停止性能)", pos: "benda", id: "performa/kemampuan berhenti" },
  "人間": { base: "にんげん (人間)", pos: "benda", id: "manusia" },
  "動く速さ": { base: "うごくはやさ (動く速さ)", pos: "benda", id: "kecepatan gerak" },
  "基準にしています": { base: "きじゅんにしています (基準にしています)", pos: "lainnya", id: "menjadikan sebagai acuan/standar" },
  "自由に": { base: "じゆうに (自由に)", pos: "lainnya", id: "dengan bebas" },
  "設定できます": { base: "せっていできます (設定できます)", pos: "kerja", id: "bisa disetel/diatur" },
  "により": { base: "により", pos: "partikel", id: "melalui / menggunakan (cara/alat)" },
  "動力": { base: "どうりょく (動力)", pos: "benda", id: "tenaga / daya gerak" },
  "伝えます": { base: "つたえます (伝えます)", pos: "kerja", id: "meneruskan/menyalurkan" },
  "せん断加工": { base: "せんだんかこう (せん断加工)", pos: "benda", id: "shearing / pemotongan geser" },
  "原理": { base: "げんり (原理)", pos: "benda", id: "prinsip" },
  "部品": { base: "ぶひん (部品)", pos: "benda", id: "komponen/part" },
  "◯の部分": { base: "ぶぶん (◯の部分)", pos: "benda", id: "bagian yang dilingkari ◯" },
  "V曲げ": { base: "ブイまげ (V曲げ)", pos: "benda", id: "V-bending (tekuk bentuk V)" },
  "残った": { base: "のこった (残った)", pos: "kerja", id: "yang tersisa" },
  "面積": { base: "めんせき (面積)", pos: "benda", id: "area / luasan" },
  "できるだけ": { base: "できるだけ", pos: "lainnya", id: "sebisa mungkin / sedapat mungkin" },
  "小さくなるように": { base: "ちいさくなるように (小さくなるように)", pos: "lainnya", id: "supaya menjadi kecil" },
  "曲げ型": { base: "まげがた (曲げ型)", pos: "benda", id: "cetakan tekuk/bending die" },
  "等": { base: "など (等)", pos: "partikel", id: "dan lain-lain" },
  "絞りパンチ": { base: "しぼりパンチ (絞りパンチ)", pos: "benda", id: "punch penarikan / drawing punch" },
  "隙間": { base: "すきま (隙間)", pos: "benda", id: "celah / ruang kosong" },
  "言います": { base: "いいます (言います)", pos: "kerja", id: "disebut / diartikan" },
  "打ち抜き過重": { base: "かじゅう (打ち抜き過重)", pos: "benda", id: "beban blanking/tonase" },
  "シャー角": { base: "かく (シャー角)", pos: "benda", id: "shear angle (sudut potong/miring)" },
  "傾斜角": { base: "けいしゃかく (傾斜角)", pos: "benda", id: "sudut kemiringan (sinonim)" },
  "付けても": { base: "つけても (付けても)", pos: "lainnya", id: "meskipun ditambahkan/diberikan" },
  "小さくなりません": { base: "小さくなりません", pos: "kerja", id: "tidak menjadi kecil (tidak berkurang)" },
  "圧延方向": { base: "あつえんほうこう (圧延方向)", pos: "benda", id: "arah pengerolan pelat baja (rolling direction)" },
  "注意します": { base: "ちゅういします (注意します)", pos: "kerja", id: "memperhatikan / berhati-hati" },
  "時間が経って": { base: "じかんがたって (時間が経って)", pos: "lainnya", id: "seiring berjalannya waktu (waktu berlalu)" },
  "変形する": { base: "へんけいする (変形する)", pos: "kerja", id: "berubah bentuk" },
  "ことです": { base: "ことです", pos: "partikel", id: "adalah proses/hal" },
  "細長い": { base: "ほそながい (細長い)", pos: "sifat-i", id: "panjang dan sempit" },
  "反り": { base: "そり (反り)", pos: "benda", id: "lengkungan memanjang / warping" },
  "出やすい": { base: "でやすい (出やすい)", pos: "lainnya", id: "mudah muncul/terjadi" },
  "全ての": { base: "すべての (全ての)", pos: "lainnya", id: "semua / seluruh" },
  "ステンレス": { base: "ステンレス", pos: "benda", id: "stainless steel (baja anti karat)" },
  "磁石": { base: "じしゃく (磁石)", pos: "benda", id: "magnet" },
  "付きません": { base: "つきません (付きません)", pos: "kerja", id: "tidak menempel" },
  "標識": { base: "ひょうしき (標識)", pos: "benda", id: "tanda/rambu/simbol peringatan" },
  "有る所": { base: "あるところ (有る所)", pos: "lainnya", id: "tempat di mana ... berada/ada" },
  "安全": { base: "あんぜん (安全)", pos: "sifat-na", id: "aman" },
  "台車": { base: "だいしゃ (台車)", pos: "benda", id: "kereta dorong / lori / trolley" },
  "押すとき": { base: "おすとき (押すとき)", pos: "lainnya", id: "saat mendorong" },
  "荷物": { base: "にもつ (荷物)", pos: "benda", id: "muatan / barang bawaan" },
  "ポジティブ式": { base: "ポジティブ式", pos: "benda", id: "tipe positive/mechanical" },
  "噛動式": { base: "かくどうしき (噛動式)", pos: "benda", id: "tipe positif / gigit (positive clutch)" },
  "フリクション式": { base: "フリクション式", pos: "benda", id: "tipe friction" },
  "摩擦式": { base: "まさつしき (摩擦式)", pos: "benda", id: "tipe gesekan" },
  "付けます": { base: "つけます (付けます)", pos: "kerja", id: "dipasang" },
  "作業開始前": { base: "さぎょうかいしまえ (作業開始前)", pos: "benda", id: "sebelum mulai kerja" },
  "点検": { base: "てんけん (点検)", pos: "benda", id: "pemeriksaan / inspeksi" },
  "異常": { base: "いじょう (異常)", pos: "benda", id: "kelainan / keabnormalan / rusak" },
  "あっても": { base: "あっても", pos: "lainnya", id: "meskipun ada (bentuk te-mo)" },
  "優先します": { base: "ゆうせんします (優先します)", pos: "kerja", id: "memprioritaskan / mendahulukan" },
  "ダイより": { base: "ダイより", pos: "partikel", id: "daripada Die (dari)" },
  "側": { base: "がわ (側)", pos: "benda", id: "sisi / bagian" },
  "潤滑油": { base: "じゅんかつゆ (潤滑油)", pos: "benda", id: "oli pelumas / pelicin" },
  "塗ると良い": { base: "ぬるとよい (塗ると良い)", pos: "lainnya", id: "bagus bila diolesi" },
  "適正な": { base: "てきせいな (適正な)", pos: "sifat-na", id: "yang tepat / wajar / optimal" },
  "数値": { base: "すうち (数値)", pos: "benda", id: "nilai/angka" },
  "場合": { base: "ばあい (場合)", pos: "benda", id: "jika / kasus" },
  "破断面": { base: "はだんめん (破断面)", pos: "benda", id: "permukaan patahan (fracture zone)" },
  "表します": { base: "あらわします (表します)", pos: "kerja", id: "merepresentasikan / digambarkan dengan" },
  "大きくした": { base: "おおきくした (大きくした)", pos: "lainnya", id: "yang dibesarkan/diperlebar" },
  "ファインブランキング": { base: "ファインブランキング", pos: "benda", id: "fine blanking (pemotongan presisi muka halus penuh)" },
  "ガイドポスト": { base: "ガイドポスト", pos: "benda", id: "tiang pemandu (guide post / guide pillar) cetakan" },
  "位置": { base: "いち (位置)", pos: "benda", id: "posisi" },
  "精度": { base: "せいど (精度)", pos: "benda", id: "presisi / akurasi" },
  "上げる": { base: "あげる (上げる)", pos: "kerja", id: "meningkatkan/menaikkan" },
  "ために": { base: "ために", pos: "partikel", id: "untuk tujuan" },
  "表面処理鋼板": { base: "ひょうめんしょりこうはん (表面処理鋼板)", pos: "benda", id: "pelat baja berlapis/perlakuan permukaan (surface-treated steel sheet)" },
  "表面": { base: "ひょうめん (表面)", pos: "benda", id: "permukaan" },
  "メッキ": { base: "メッキ", pos: "benda", id: "pelapisan logam elektrokimia (plating) seperti seng/galvanis" },
  "した物": { base: "したもの (した物)", pos: "benda", id: "benda yang dikenakan proses tersebut" },
  "亀裂": { base: "きれつ (亀裂)", pos: "benda", id: "keretakan / crack" },
  "伸び": { base: "のび (伸び)", pos: "benda", id: "keuletan/daya regang/elongation" },
  "小さい": { base: "ちいさい (小さい)", pos: "sifat-i", id: "kecil/rendah" },
  "多いです": { base: "おおいです (多いです)", pos: "sifat-i", id: "sering terjadi/banyak" },
  "熱間圧延鋼板": { base: "ねっかん (熱間圧延鋼板)", pos: "benda", id: "pelat baja canai panas (SPHC dll)" },
  "に比べて": { base: "にくらべて (に比べて)", pos: "lainnya", id: "dibandingkan dengan" },
  "成形性": { base: "せいけいせい (成形性)", pos: "benda", id: "kualitas kemampuan dibentuk (formability)" },
  "たばこ": { base: "たばこ", pos: "benda", id: "rokok" },
  "吸ってはいけません": { base: "すってはいけません (吸ってはいけません)", pos: "lainnya", id: "tidak boleh merokok (bentuk larangan mutlak -te wa ikemasen)" },
  "暑いとき": { base: "あついとき (暑いとき)", pos: "sifat-i", id: "saat suhu panas (musim panas/berkeringat)" },
  "首や腰": { base: "くびやこし (首や腰)", pos: "benda", id: "leher atau pinggang" },
  "タオルを": { base: "タオルを", pos: "benda", id: "handuk" },
  "ぶら下げて": { base: "ぶらさげて (ぶら下げて)", pos: "kerja", id: "digantung menjuntai" },
  "作業しても良い": { base: "さぎょうしてもよい (作業しても良い)", pos: "lainnya", id: "boleh melakukan pekerjaan" },
  "両手操作式": { base: "りょうてそうさしき (両手操作式)", pos: "benda", id: "tipe pengoperasian wajib dua-tangan" },
  "押しボタン": { base: "おしボタン (押しボタン)", pos: "benda", id: "tombol tekan (push button)" },
  "両手で": { base: "りょうてで (両手で)", pos: "benda", id: "dengan kedua tangan sekaligus" },
  "押して": { base: "おして (押して)", pos: "kerja", id: "menekan lalu" },
  "動かします": { base: "うごかします (動かします)", pos: "kerja", id: "menggerakkan (slide mesin turun)" },
  "加工中": { base: "かこうちゅう (加工中)", pos: "benda", id: "saat proses pengerjaan (mesin bergerak)" },
  "止まること": { base: "とまること (止まること)", pos: "kerja", id: "hal berhenti" },
  "出来ません": { base: "できません (出来ません)", pos: "kerja", id: "tidak bisa (dilarang/tak mungkin)" },
  "大きくなります": { base: "おおきくなります (大きくなります)", pos: "lainnya", id: "menjadi besar / lebih lebar dibanding tebal plat" },
  "大きいほど": { base: "～おおきいほど (大きいほど)", pos: "lainnya", id: "semakin besar ~ maka" },
  "U曲げ型": { base: "ユーまげがた (U曲げ型)", pos: "benda", id: "cetakan tekuk U" },
  "パンチより": { base: "パンチより", pos: "partikel", id: "dibandingkan punch (より = dari)" },
  "ダイの方が": { base: "ダイのほうが (ダイの方が)", pos: "lainnya", id: "sisi die-nya (lebih)" },
  "摩耗し易い": { base: "まもうしやすい (摩耗し易い)", pos: "kerja", id: "mudah aus/terkikis (mudah = yasui)" },
  "穴加工": { base: "あなかこう (穴加工)", pos: "benda", id: "proses pembuatan lubang" },
  "棒金材料": { base: "ぼうきんざいりょう (棒金材料)", pos: "benda", id: "material logam batangan/pelat logam mentah" },
  "周りに": { base: "まわりに (周りに)", pos: "benda", id: "di sekitar/keliling" },
  "物を置いても": { base: "ものをおいても (物を置いても)", pos: "lainnya", id: "meski menaruh barang..." },
  "良いです": { base: "よいです (良いです)", pos: "sifat-i", id: "boleh / tidak apa-apa" },
  "運ぶ": { base: "はこぶ (運ぶ)", pos: "kerja", id: "mengangkut / membawa" },
  "L曲げ型": { base: "エルまげがた (L曲げ型)", pos: "benda", id: "cetakan tekuk L (L-bend die)" },
  "パンチ側": { base: "パンチがわ (パンチ側)", pos: "benda", id: "sisi punch" },
  "伸びの小さい": { base: "のびのちいさい (伸びの小さい)", pos: "lainnya", id: "elongasi (kemuluran) kecil" },
  "両手で押して": { base: "りょうてでおして (両手で押して)", pos: "lainnya", id: "menekan dengan kedua tangan" },
  "止まることが出来ません": { base: "とまることができません (止まることが出来ません)", pos: "lainnya", id: "tidak bisa berhenti" },
  "寸法に影響します": { base: "すんぽうにえいきょうします (寸法に影響します)", pos: "lainnya", id: "berpengaruh pada dimensi" },
  "一般": { base: "いっぱん (一般)", pos: "lainnya", id: "umum / pada umumnya" },
  "せん断": { base: "せんだん (せん断)", pos: "benda", id: "geser / shearing" },
  "自由": { base: "じゆう (自由)", pos: "sifat-na", id: "bebas" },
  "設定": { base: "せってい (設定)", pos: "benda", id: "pengaturan / setting" },
  "機械": { base: "きかい (機械)", pos: "benda", id: "mesin" },
  "クラッチ": { base: "クラッチ", pos: "benda", id: "clutch (kopling)" },
  "作業開始": { base: "さぎょうかいし (作業開始)", pos: "benda", id: "mulai kerja" },
  "作業": { base: "さぎょう (作業)", pos: "benda", id: "pekerjaan / kerja" },
  "優先": { base: "ゆうせん (優先)", pos: "benda", id: "diprioritaskan / didahulukan" },
  "塗る": { base: "ぬる (塗る)", pos: "kerja", id: "mengoleskan" },
  "適正": { base: "てきせい (適正)", pos: "sifat-na", id: "tepat / sesuai" },
  "表面処理": { base: "ひょうめんしょり (表面処理)", pos: "benda", id: "perlakuan permukaan" },
  "吸って": { base: "すう (吸う)", pos: "kerja", id: "menghisap / merokok (bentuk te)" },
  "首": { base: "くび (首)", pos: "benda", id: "leher" },
  "腰": { base: "こし (腰)", pos: "benda", id: "pinggang" },
  "タオル": { base: "タオル", pos: "benda", id: "handuk" },
  "両手操作式安全装置": { base: "りょうてそうさしきあんぜんそうち (両手操作式安全装置)", pos: "benda", id: "alat pengaman kontrol dua tangan" },
  "両手": { base: "りょうて (両手)", pos: "benda", id: "kedua tangan" },
  "運転": { base: "うんてん (運転)", pos: "benda", id: "operasi / pengoperasian" },
  "棒金": { base: "ぼうきん (棒金)", pos: "benda", id: "logam batang (bar)" },
  "周り": { base: "まわり (周り)", pos: "benda", id: "sekitar" },
  "止まる": { base: "とまる (止まる)", pos: "kerja", id: "berhenti" },
  "良い": { base: "よい (良い)", pos: "sifat-i", id: "baik / boleh" },
  "大きい": { base: "おおきい (大きい)", pos: "sifat-i", id: "besar" },
  "多い": { base: "おおい (多い)", pos: "sifat-i", id: "banyak" },
  "暑い": { base: "あつい (暑い)", pos: "sifat-i", id: "panas (cuaca)" },
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
const KANJI_RE = /[\u4e00-\u9fff々〆]+/g;

/** Uraikan "高速(こうそく)の…" menjadi daftar {s,e,r} (posisi pada teks polos).
 *  Mengembalikan null jika furi tidak cocok dengan teks (maka furigana dilewati). */
function parseFuri(furi, text) {
  if (!furi) return null;
  const ranges = [];
  let plain = "";
  const re = /([\u4e00-\u9fff々〆]+)\(([^)]*)\)/g;
  let last = 0, m;
  while ((m = re.exec(furi))) {
    plain += furi.slice(last, m.index).replace(/\([^)]*\)/g, "");
    ranges.push({ s: plain.length, e: plain.length + m[1].length, r: m[2] });
    plain += m[1];
    last = m.index + m[0].length;
  }
  plain += furi.slice(last);
  return plain === text ? ranges : null;
}

/** Cetak text[from,to) — sisipkan <ruby> untuk range yang berada di dalamnya. */
function renderSlice(text, from, to, ranges) {
  let out = "";
  let i = from;
  while (i < to) {
    const rg = ranges.find((x) => x.s === i && x.e <= to);
    if (rg) {
      out += `<ruby>${escapeHtml(text.slice(rg.s, rg.e))}<rt>${escapeHtml(rg.r)}</rt></ruby>`;
      i = rg.e;
    } else {
      out += escapeHtml(text[i]);
      i += 1;
    }
  }
  return out;
}

/**
 * Mengubah teks Jepang menjadi HTML dengan kata-kata yang dikenali
 * dibungkus <span class="vocab-word" data-key="..."> supaya bisa diklik.
 * Karakter/kata yang tidak dikenali tetap tampil apa adanya.
 * Parameter opsional `furi` (string "kanji(bacaan)"): jika ada dan cocok,
 * kanji diberi furigana <ruby> yang selalu terlihat.
 */
export function annotateJapanese(text, furi) {
  if (!text) return "";
  const ranges = parseFuri(furi, text) || [];
  const cutsRange = (pos) => ranges.some((x) => x.s < pos && pos < x.e);
  let html = "";
  let i = 0;
  while (i < text.length) {
    let matched = null;
    const maxLen = Math.min(MAX_KEY_LEN, text.length - i);
    for (let len = maxLen; len >= 1; len--) {
      const candidate = text.substr(i, len);
      if (VOCAB.hasOwnProperty(candidate) && !cutsRange(i + len)) {
        matched = candidate;
        break;
      }
    }
    if (matched) {
      html += `<span class="vocab-word" data-key="${escapeHtml(matched)}">${renderSlice(text, i, i + matched.length, ranges)}</span>`;
      i += matched.length;
    } else {
      const rg = ranges.find((x) => x.s === i);
      if (rg) {
        html += renderSlice(text, rg.s, rg.e, ranges);
        i = rg.e;
      } else {
        html += escapeHtml(text[i]);
        i += 1;
      }
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
    ruby{ruby-position:over;ruby-align:center;}
    ruby rt{font-size:.56em;font-weight:600;letter-spacing:0;color:var(--teal, #008471);line-height:1;user-select:none;}
    .cyberpunk-mode ruby rt{color:var(--teal);text-shadow:0 0 6px var(--teal);}
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
    <span class="vp-close" data-close="1">${icon("close")}</span>
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
