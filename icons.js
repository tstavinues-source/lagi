/* =====================================================================
   icons.js — Set ikon SVG (menggantikan emoji/emoticon)
   Semua ikon: viewBox 24x24, memakai currentColor sehingga otomatis
   mengikuti warna tema (terang maupun cyberpunk/neon).
   Pemakaian:  import { icon } from "./icons.js";  el.innerHTML = icon("check");
   ===================================================================== */

const S = 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
const F = 'fill="currentColor"';

const PATHS = {
  check:   `<g ${S}><path d="M4.5 12.5l5 5L19.5 6.5"/></g>`,
  cross:   `<g ${S}><path d="M6 6l12 12M18 6L6 18"/></g>`,
  close:   `<g ${S}><path d="M6 6l12 12M18 6L6 18"/></g>`,
  arrowRight: `<g ${S}><path d="M4 12h15M13 6l6 6-6 6"/></g>`,
  arrowLeft:  `<g ${S}><path d="M20 12H5M11 6l-6 6 6 6"/></g>`,
  swap:    `<g ${S}><path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4"/></g>`,
  up:      `<g ${F}><path d="M12 5l8 12H4z"/></g>`,
  down:    `<g ${F}><path d="M12 19L4 7h16z"/></g>`,
  /* bohlam / ide */
  bulb:    `<g ${S}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></g>`,
  /* petir / mode neon */
  bolt:    `<g ${F}><path d="M13.5 2L5 13.5h6L10 22l9-12h-6z"/></g>`,
  /* grafik batang / riwayat */
  chart:   `<g ${S}><path d="M4 20h16"/><rect x="5.5" y="11" width="3.4" height="6" rx=".6"/><rect x="10.3" y="6" width="3.4" height="11" rx=".6"/><rect x="15.1" y="9" width="3.4" height="8" rx=".6"/></g>`,
  /* buku / kosakata */
  book:    `<g ${S}><path d="M4 5.5C6.5 4.4 9.5 4.4 12 6c2.5-1.6 5.5-1.6 8-.5V19c-2.5-1.1-5.5-1.1-8 .5-2.5-1.6-5.5-1.6-8-.5z"/><path d="M12 6v13.5"/></g>`,
  user:    `<g ${S}><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c.6-4 3.7-6 7.5-6s6.9 2 7.5 6"/></g>`,
  pencil:  `<g ${S}><path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 0l0 0a2 2 0 0 1 0 3L8 19z"/><path d="M14.5 6.5l3 3"/></g>`,
  camera:  `<g ${S}><path d="M4 8h3l1.6-2.5h6.8L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.4"/></g>`,
  star:    `<g ${F}><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"/></g>`,
  sparkle: `<g ${F}><path d="M12 2l2.2 7.3L21.5 12l-7.3 2.7L12 22l-2.2-7.3L2.5 12l7.3-2.7z"/></g>`,
  /* baut/gear untuk lencana "sempurna" */
  gear:    `<g ${S}><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8l1.3 2.4 2.7-.5.9 2.6 2.6.9-.5 2.7L21.2 12l-2.2 1.3.5 2.7-2.6.9-.9 2.6-2.7-.5L12 21.2l-1.3-2.2-2.7.5-.9-2.6-2.6-.9.5-2.7L2.8 12 5 10.7l-.5-2.7 2.6-.9.9-2.6 2.7.5z"/></g>`,
  trophy:  `<g ${S}><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5c0 3 1.2 4.5 3.7 5M16 6h3.5c0 3-1.2 4.5-3.7 5M12 13v4M8.5 20h7M10 17h4"/></g>`,
  /* Musim: sakura, matahari, daun momiji, kristal salju */
  sakura:  `<g ${F}><g id="ip">` +
           [0,72,144,216,288].map(a=>`<path transform="rotate(${a} 12 12)" d="M12 11.2C9.6 9 9.6 4.8 10.9 3.2c.5-.6 1.1-.3 1.1.3.0-.6.6-.9 1.1-.3 1.3 1.6 1.3 5.8-1.1 8z" opacity=".92"/>`).join("") +
           `</g><circle cx="12" cy="12" r="1.4" fill="#fff" opacity=".85"/></g>`,
  sun:     `<g ${S}><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/></g>`,
  maple:   `<g ${F}><path d="M12 2.5l1.8 3.3 2.3-1-.7 4.2 2.6-1.6-.4 2.7 2.4.7-3.7 3.4.6 1.6-4.2-.8V21h-1.8v-4.7l-4.2.8.6-1.6L3.7 12.1l2.4-.7-.4-2.7 2.6 1.6-.7-4.2 2.3 1z"/></g>`,
  snow:    `<g ${S}><path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8L20.2 7.2M9.5 4L12 6.5 14.5 4M9.5 20L12 17.5 14.5 20"/></g>`,
  petal:   `<g ${F}><path d="M12 3c4 3 5 8 0 15-5-7-4-12 0-15z"/></g>`,
  dot:     `<g ${F}><circle cx="12" cy="12" r="5"/></g>`,
  leaf:    `<g ${F}><path d="M5 19C4 10 9 4 20 4c0 11-6 16-13 15z"/><path d="M5 19L14 10" stroke="#0003" stroke-width="1.2" fill="none"/></g>`,
};

export function icon(name, opts = {}) {
  const p = PATHS[name];
  if (!p) return "";
  const cls = "ico ico-" + name + (opts.cls ? " " + opts.cls : "");
  const size = opts.size ? ` style="width:${opts.size}px;height:${opts.size}px"` : "";
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"${size}>${p}</svg>`;
}

/* Ikon di dalam teks: mis. iconText("check", " Benar!") */
export const withIcon = (name, text, opts) => icon(name, opts) + `<span class="ico-txt">${text}</span>`;

(function injectIconCss() {
  if (typeof document === "undefined" || document.getElementById("icons-css")) return;
  const st = document.createElement("style");
  st.id = "icons-css";
  st.textContent = `
    .ico{width:1.05em;height:1.05em;display:inline-block;vertical-align:-.16em;flex:none;overflow:visible}
    .ico-txt{margin-left:.35em}
    .ico + .ico-txt:empty{margin:0}
  `;
  document.head.appendChild(st);
})();
