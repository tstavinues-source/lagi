<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Quiz Kotoba — (Fixed Conjugation)</title>
<style>
:root{
  --bg:#041026; --card:#0b1220; --muted:#9aa6b2; --accent:#ff7a2d; --accent-2:#ffb077; --ok:#22c55e; --bad:#ef4444;
  --glass: rgba(255,255,255,0.03);
}
*{box-sizing:border-box}
body{margin:0;font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto; background:linear-gradient(180deg,#041022 0%, #071026 60%); color:#eaf2ff; -webkit-font-smoothing:antialiased;}
.app{max-width:920px;margin:18px auto;padding:12px;}
.hero{display:flex;flex-direction:column;align-items:center;gap:12px;background:linear-gradient(180deg, rgba(255,255,255,0.02), transparent);border-radius:14px;padding:16px;border:1px solid rgba(255,255,255,0.04);box-shadow:0 10px 30px rgba(2,6,23,0.6); margin-bottom:16px;}
.title{font-size:1.25rem;font-weight:700;}
.subtitle{font-size:0.92rem;color:var(--muted);text-align:center;max-width:88%}
.controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center;margin-top:8px;}
.select, input[type=number]{background:var(--glass);border:1px solid rgba(255,255,255,0.04);padding:10px 12px;border-radius:10px;color:inherit;font-size:0.95rem;min-width:120px;}
.btn{padding:10px 14px;border-radius:12px;border:none;cursor:pointer;font-weight:700}
.btn-primary{background:linear-gradient(90deg,var(--accent),var(--accent-2));color:#081026;box-shadow:0 8px 18px rgba(255,122,45,0.12)}
.btn-ghost{background:transparent;border:1px solid rgba(255,255,255,0.06);color:inherit}
.card{background:var(--card);border-radius:12px;padding:14px;margin-bottom:12px;border:1px solid rgba(255,255,255,0.03);box-shadow:0 6px 18px rgba(2,6,23,0.5);}
.verb{font-size:1.5rem;font-weight:700;margin-bottom:6px}
.hint{color:var(--muted);font-size:0.9rem;margin-bottom:12px}
.input-block{display:flex;flex-direction:column;gap:8px}
.input-row{display:flex;gap:8px;align-items:center}
.input-row input{flex:1;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.04);background:var(--glass);font-size:1.05rem;color:inherit}
.small-btn{padding:8px 10px;border-radius:10px;border:none;background:transparent;color:inherit;cursor:pointer}
.feedback{margin-top:8px;font-size:0.95rem}
.card-correct{background:linear-gradient(90deg, rgba(34,197,94,0.08), rgba(255,255,255,0.02));border-color:rgba(34,197,94,0.14)}
.card-wrong{background:linear-gradient(90deg, rgba(239,68,68,0.06), rgba(255,255,255,0.02));border-color:rgba(239,68,68,0.12)}
.result-bar{display:flex;gap:8px;justify-content:center;margin:10px 0;flex-wrap:wrap}
.chip{padding:8px 12px;border-radius:999px;background:rgba(255,255,255,0.02);font-weight:700;color:var(--muted)}
.table{width:100%;border-collapse:collapse;font-size:0.95rem}
.table th,.table td{padding:10px;border-bottom:1px solid rgba(255,255,255,0.03);text-align:left}
.table th{color:var(--muted);font-weight:700;font-size:0.88rem}
@media (max-width:540px){ .verb{font-size:1.35rem} .title{font-size:1.12rem} .select{min-width:110px} .hero{padding:14px} }
</style>
</head>
<body>
  <div class="app">
    <section class="hero" role="banner">
      <div class="title">Quiz Kotoba — Bentuk て / ない (Perbaikan Konjugasi)</div>
      <div class="subtitle">Perbaikan konversi untuk Gol I/II/III — kini menangani します/きます/compound dengan benar.</div>
      <div class="controls">
        <select id="start-gol" class="select"><option value="ALL">Semua Golongan</option><option value="I">Golongan I</option><option value="II">Golongan II</option><option value="III">Golongan III</option></select>
        <select id="start-form" class="select"><option value="te">て</option><option value="nai">ない</option><option value="both">て & ない</option></select>
        <input id="start-count" type="number" class="select" min="1" max="50" value="10">
        <button id="btn-start" class="btn btn-primary">Mulai</button>
        <button id="btn-list" class="btn btn-ghost">Daftar</button>
      </div>
    </section>

    <main id="main"></main>

    <div id="result-bar" class="result-bar" style="display:none;">
      <div class="chip">Benar: <span id="score-true">0</span></div>
      <div class="chip">Salah: <span id="score-false">0</span></div>
      <div class="chip">Sisa: <span id="remaining">0</span></div>
      <div style="display:flex;gap:8px">
        <button id="btn-checkall" class="btn btn-ghost">Periksa Semua</button>
        <button id="btn-showanswers" class="btn btn-ghost">Tampilkan Jawaban</button>
        <button id="btn-new" class="btn btn-ghost">Buat Baru</button>
      </div>
    </div>

    <section id="list-panel" class="card" style="display:none;">
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px">
        <label style="color:var(--muted);font-weight:700">Tampilkan:</label>
        <select id="list-filter" class="select" style="min-width:130px"><option value="ALL">Semua Golongan</option><option value="I">Golongan I</option><option value="II">Golongan II</option><option value="III">Golongan III</option></select>
        <div style="margin-left:auto;display:flex;gap:8px">
          <button id="btn-export" class="btn btn-ghost">Copy</button>
          <button id="btn-close-list" class="btn btn-ghost">Tutup</button>
        </div>
      </div>

      <table class="table"><thead><tr><th style="width:54px">#</th><th>ます形</th><th>Arti</th><th style="width:64px">Gol</th></tr></thead><tbody id="table-body"></tbody></table>
    </section>
  </div>

<script>
/* ---------- Improved conjugation logic (reliable) ---------- */

/* mapping i-row kana -> u-row kana (untuk membuat bentuk kamus dari stem-ます) */
const I_TO_U = {
  'い':'う','き':'く','し':'す','ち':'つ','に':'ぬ','ひ':'ふ','み':'む','り':'る',
  'ぎ':'ぐ','じ':'ず','ぢ':'づ','び':'ぶ','ぴ':'ぷ'
};

/* mapping u-row -> a-row (untuk nai-form godan) */
const U_TO_A = {
  'う':'わ','く':'か','す':'さ','つ':'た','ぬ':'な','ふ':'は','む':'ま','る':'ら',
  'ぐ':'が','ぶ':'ば','ぷ':'ぱ','ず':'ざ'
};

function trimStr(s){ return (s||'').trim(); }

/* convert masu-form -> dictionary (kamus) form, using golongan when available */
function masuToDictionary(masu, gol){
  masu = trimStr(masu);
  if(!masu) return '';

  // 1) handle します family (べんきょうします, じゅんびします, etc.)
  if(masu.endsWith('します')){
    // remove the trailing 'します' (3 chars) and add 'する'
    const base = masu.slice(0, masu.length - 3); // before 'します'
    return base + 'する'; // e.g., じゅんびする
  }

  // 2) exact きます (kuru) or compounds with kuru (if labeled III)
  if(masu === 'きます') return 'くる';

  if(gol === 'III' && masu.endsWith('きます')){
    // compound like もってきます -> 基本 = 'もって' + 'くる'
    const base = masu.slice(0, masu.length - 3);
    return base + 'くる';
  }

  // 3) If Golongan II (ichidan) -> stem + 'る'
  if(gol === 'II'){
    const stem = masu.endsWith('ます') ? masu.slice(0, -2) : masu;
    return stem + 'る';
  }

  // 4) If Golongan I (godan) -> replace final i-row kana with u-row
  if(gol === 'I'){
    if(!masu.endsWith('ます')) return masu;
    const stem = masu.slice(0, -2); // remove ます => e.g., かき
    if(stem.length === 0) return masu;
    const last = stem[stem.length - 1];
    const base = stem.slice(0, -1);
    const u = I_TO_U[last];
    if(u) return base + u;
    // fallback: append る
    return stem + 'る';
  }

  // 5) Unknown golongan: try heuristics
  if(masu.endsWith('ます')){
    const stem = masu.slice(0, -2);
    // heuristic: if stem ends with e-row (え) or i-row (い) kana -> likely ichidan
    const eRow = ['え','け','せ','て','ね','へ','め','れ','げ','ぜ','で','べ','ぺ'];
    const last = stem[stem.length-1];
    if(!last) return masu;
    if(['え','け','せ','て','ね','へ','め','れ','げ','ぜ','で','べ','ぺ'].includes(last)) {
      return stem + 'る'; // guess ichidan
    }
    // otherwise guess godan
    const lastI = last;
    const u = I_TO_U[lastI];
    if(u) return stem.slice(0,-1) + u;
    return stem + 'る';
  }

  // fallback
  return masu;
}

/* from dictionary form -> te-form */
function dictToTe(dic, gol){
  if(!dic) return '';
  // handle 'くる' (kuru) irregular and compounds ending with 'くる'
  if(dic.endsWith('くる')){
    const base = dic.slice(0, dic.length - 2); // remove くる
    return base + 'きて'; // e.g., もってくる -> もってきて
  }
  // handle 'する' and compounds
  if(dic.endsWith('する')){
    const base = dic.slice(0, dic.length - 2);
    return base + 'して';
  }

  // special-case 'いく' -> 'いって'
  if(dic === 'いく') return 'いって';

  const last = dic[dic.length - 1];
  const body = dic.slice(0, -1);

  // rules for u-ending verbs:
  if(['う','つ','る'].includes(last)) return body + 'って';
  if(['ぬ','ぶ','む'].includes(last)) return body + 'んで';
  if(last === 'く') return body + 'いて';
  if(last === 'ぐ') return body + 'いで';
  if(last === 'す') return body + 'して';

  // fallback
  return dic + 'て';
}

/* from dictionary form -> nai-form */
function dictToNai(dic, gol){
  if(!dic) return '';
  // handle 'くる' (kuru)
  if(dic.endsWith('くる')){
    const base = dic.slice(0, dic.length - 2);
    return base + 'こない'; // もってくる -> もってこない
  }
  // handle 'する'
  if(dic.endsWith('する')){
    const base = dic.slice(0, dic.length - 2);
    return base + 'しない';
  }
  // ichidan simple
  if(gol === 'II' || dic.endsWith('る') && isLikelyIchidan(dic)){
    if(dic.endsWith('る')) return dic.slice(0, -1) + 'ない';
  }
  // godan: replace last u with a-row + ない
  const last = dic[dic.length - 1];
  const body = dic.slice(0, -1);
  const a = U_TO_A[last];
  if(a) return body + a + 'ない';
  // fallback: if ends with 'る' and not matched above
  if(dic.endsWith('る')) return dic.slice(0,-1) + 'らない';
  return dic + 'ない';
}

/* small heuristic: check if a dictionary form ending with る is likely ichidan
   (only used as a safe fallback when golongan is unknown).
   This is imperfect but avoids breaking many verbs: if preceding vowel is e-row or i-row -> ichidan likely.
*/
function isLikelyIchidan(dic){
  if(!dic.endsWith('る')) return false;
  const prev = dic[dic.length-2];
  // list of i-row / e-row kana preceding る that often indicate ichidan
  const eRow = ['え','け','せ','て','ね','へ','め','れ','げ','ぜ','で','べ','ぺ'];
  const iRow = ['い','き','し','ち','に','ひ','み','り','ぎ','じ','ぢ','び','ぴ'];
  return eRow.includes(prev) || iRow.includes(prev);
}

/* wrapper: given masu-form + golongan -> return {te, nai, dict} */
function conjugateFromMasu(masu, gol){
  const dic = masuToDictionary(masu, gol);
  const te = dictToTe(dic, gol);
  const nai = dictToNai(dic, gol);
  return { dict, te, nai };
}

/* ---------- Basic app (UI) using the improved conjugator ---------- */

let DB = [];
const FALLBACK = [
  {id:1,verba_masu:'かきます',hiragana:'かきます',arti:'Menulis',golongan:'I'},
  {id:2,verba_masu:'たべます',hiragana:'たべます',arti:'Makan',golongan:'II'},
  {id:3,verba_masu:'きます',hiragana:'きます',arti:'Datang',golongan:'III'},
  {id:4,verba_masu:'します',hiragana:'します',arti:'Melakukan',golongan:'III'},
  {id:5,verba_masu:'のります',hiragana:'のります',arti:'Naik',golongan:'I'}
];

async function loadDB(){
  try{
    const res = await fetch('kotoba_database.json', {cache:'no-store'});
    if(!res.ok) throw new Error('not found');
    const json = await res.json();
    if(Array.isArray(json) && json.length) DB = json.map((x,idx)=>({ id: x.id ?? idx+1, verba_masu: x.verba_masu || x.hiragana || '', hiragana: x.hiragana || x.verba_masu || '', arti: x.arti || x.arti || '', golongan: (x.golongan||'') }));
    else DB = FALLBACK.slice();
  }catch(e){
    console.warn('Gagal load kotoba_database.json, pakai fallback', e);
    DB = FALLBACK.slice();
  }
}

/* QUIZ state and rendering (same UI pattern as sebelumnya) */
let QUIZ = [];
const mainEl = document.getElementById('main');
const resultBar = document.getElementById('result-bar');
const scoreTrue = document.getElementById('score-true');
const scoreFalse = document.getElementById('score-false');
const remainingEl = document.getElementById('remaining');
const tableBody = document.getElementById('table-body');

function pickSample(pool,n){
  const arr = pool.slice(); const out=[];
  while(out.length < n && arr.length){
    const i = Math.floor(Math.random()*arr.length);
    out.push(arr.splice(i,1)[0]);
  }
  return out;
}

function startQuiz(){
  const g = document.getElementById('start-gol').value;
  const form = document.getElementById('start-form').value;
  let count = parseInt(document.getElementById('start-count').value) || 10;
  const pool = (g === 'ALL') ? DB.slice() : DB.filter(x => String(x.golongan) === String(g));
  if(pool.length === 0){ alert('Tidak ada data untuk pilihan golongan ini.'); return; }
  const sample = pickSample(pool, Math.min(count, pool.length));
  QUIZ = sample.map(it => ({
    item: it,
    expected: { te: dictToTe(masuToDictionary(it.hiragana || it.verba_masu, it.golongan), it.golongan), nai: dictToNai(masuToDictionary(it.hiragana || it.verba_masu, it.golongan), it.golongan) },
    user: { te:'', nai:'' },
    status: 'unanswered'
  }));
  renderQuiz(form);
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderQuiz(form){
  mainEl.innerHTML = '';
  QUIZ.forEach((q,idx) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.idx = idx;
    card.innerHTML = `
      <div class="verb">${q.item.hiragana || q.item.verba_masu}</div>
      <div class="hint">${q.item.arti || ''} — Gol ${q.item.golongan || ''}</div>
      <div class="input-block">
        ${ (form==='te' || form==='both') ? `<div class="input-row"><input inputmode="kana" autocomplete="off" data-role="te" placeholder="Bentuk て (hiragana)"></div>` : '' }
        ${ (form==='nai' || form==='both') ? `<div class="input-row"><input inputmode="kana" autocomplete="off" data-role="nai" placeholder="Bentuk ない (hiragana)"></div>` : '' }
        <div style="display:flex;justify-content:flex-end;margin-top:6px"><button class="small-btn" data-action="check">Cek</button></div>
        <div class="feedback" id="fb-${idx}"></div>
      </div>
    `;
    card.querySelectorAll('input[data-role]').forEach(inp=>{
      inp.addEventListener('input', ()=>{ q.user[inp.dataset.role] = inp.value.trim(); });
      inp.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); checkSingle(idx); }});
    });
    card.querySelector('button[data-action="check"]').addEventListener('click', ()=>checkSingle(idx));
    mainEl.appendChild(card);
  });
  resultBar.style.display = 'flex';
  updateScores();
}

function checkSingle(i){
  const q = QUIZ[i];
  const form = document.getElementById('start-form').value;
  const card = document.querySelector(`article[data-idx="${i}"]`);
  // ensure read latest inputs
  card.querySelectorAll('input[data-role]').forEach(inp => { q.user[inp.dataset.role] = inp.value.trim(); });
  let ok = true; const parts = [];
  if(form === 'te' || form === 'both'){
    const got = (q.user.te||'').trim(); const exp = (q.expected.te||'').trim();
    if(got === exp) parts.push('て ✅'); else { parts.push(`て ❌ (${exp})`); ok = false; }
  }
  if(form === 'nai' || form === 'both'){
    const got = (q.user.nai||'').trim(); const exp = (q.expected.nai||'').trim();
    if(got === exp) parts.push('ない ✅'); else { parts.push(`ない ❌ (${exp})`); ok = false; }
  }
  const fb = document.getElementById(`fb-${i}`);
  fb.textContent = parts.join(' • ');
  fb.className = 'feedback ' + (ok ? 'card-correct' : 'card-wrong');
  card.classList.remove('card-correct','card-wrong');
  if(ok) card.classList.add('card-correct'); else card.classList.add('card-wrong');
  q.status = ok ? 'correct' : 'wrong';
  updateScores();
}

function checkAll(){ for(let i=0;i<QUIZ.length;i++) checkSingle(i); }

let answersShown = false;
function showAnswers(){
  answersShown = !answersShown;
  document.getElementById('btn-showanswers').textContent = answersShown ? 'Sembunyikan Jawaban' : 'Tampilkan Jawaban';
  QUIZ.forEach((q,i)=>{ const fb=document.getElementById(`fb-${i}`); if(!fb) return; if(answersShown) fb.textContent = `Ans → て: ${q.expected.te}　|　ない: ${q.expected.nai}`; else fb.textContent = (q.status==='correct') ? 'Sudah benar ✅' : '' ; });
}

function updateScores(){
  const t = QUIZ.filter(x=>x.status==='correct').length;
  const f = QUIZ.filter(x=>x.status==='wrong').length;
  const u = QUIZ.filter(x=>x.status==='unanswered').length;
  scoreTrue.textContent = t; scoreFalse.textContent = f; remainingEl.textContent = u;
}

function newQuiz(){ QUIZ=[]; mainEl.innerHTML=''; resultBar.style.display='none'; answersShown=false; document.getElementById('btn-showanswers').textContent='Tampilkan Jawaban'; }

/* List panel rendering (renumbering 1..N, no hiragana column) */
function renderList(filter='ALL'){
  const pool = (filter === 'ALL') ? DB.slice() : DB.filter(x => String(x.golongan) === String(filter));
  tableBody.innerHTML = '';
  pool.forEach((it,idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td style="width:54px">${idx+1}</td><td>${it.verba_masu}</td><td>${it.arti || ''}</td><td style="width:64px">${it.golongan || ''}</td>`;
    tableBody.appendChild(tr);
  });
}
async function copyList(filter='ALL'){
  const pool = (filter === 'ALL') ? DB.slice() : DB.filter(x => String(x.golongan) === String(filter));
  const lines = pool.map((it,idx)=>`${idx+1}. ${it.verba_masu} — ${it.arti || ''} — Gol ${it.golongan || ''}`);
  try{ await navigator.clipboard.writeText(lines.join('\n')); alert('Daftar disalin ke clipboard'); }catch(e){ prompt('Salin manual:', lines.join('\n')); }
}

/* UI wiring */
document.getElementById('btn-start').addEventListener('click', ()=>startQuiz());
document.getElementById('btn-list').addEventListener('click', ()=>{ renderList(document.getElementById('list-filter').value); document.getElementById('list-panel').style.display='block'; window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'}); });
document.getElementById('btn-close-list').addEventListener('click', ()=>{ document.getElementById('list-panel').style.display='none'; });
document.getElementById('btn-checkall').addEventListener('click', checkAll);
document.getElementById('btn-showanswers').addEventListener('click', showAnswers);
document.getElementById('btn-new').addEventListener('click', newQuiz);
document.getElementById('list-filter').addEventListener('change', (e)=>renderList(e.target.value));
document.getElementById('btn-export').addEventListener('click', ()=>copyList(document.getElementById('list-filter').value));

/* init */
(async function init(){
  await loadDB();
  renderList('ALL');
  // quick console tests (lihat console browser untuk verifikasi beberapa kasus penting)
  console.group('Conjugation samples (debug)');
  const sample = ['かきます','たべます','いきます','もってきます','じゅんびします','します','きます','よみます'];
  sample.forEach(s=>{
    const it = DB.find(x => (x.hiragana===s || x.verba_masu===s));
    const g = it ? it.golongan : undefined;
    const dic = masuToDictionary(s, g);
    console.log(s, '-> dict:', dic, 'te:', dictToTe(dic,g), 'nai:', dictToNai(dic,g));
  });
  console.groupEnd();
})();
</script>
</body>
</html>