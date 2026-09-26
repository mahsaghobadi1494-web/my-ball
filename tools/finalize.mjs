/* tools/finalize.mjs — make the single-file build actually boot.
 *
 * Why this exists
 * ---------------
 * `vite build` emits `<script type="module">` in the <head>.
 *
 *  - Module scripts are DEFERRED, so the bundle runs after the DOM is parsed.
 *  - The old build step rewrote `<script type="module"` to `<script>` for
 *    `file://` support. A classic script is NOT deferred: it executed in <head>,
 *    ~900 KB of markup before <div id="root"> was parsed, so
 *    createRoot(document.getElementById("root")) got null and threw React error
 *    #299 ("Target container is not a DOM element"). Completely blank page.
 *    Verified in a real browser.
 *  - The bundle can also end with a real ESM statement (`export default X;`).
 *    That is a hard SyntaxError in a classic script, so "just strip type=module"
 *    is not enough on its own.
 *
 * What this does
 * --------------
 * 1. Neutralises the ESM syntax so the bundle is valid as a CLASSIC script:
 *    `export default X` -> `void X`, `export{...}` -> removed, and
 *    `export const|let|var|function|class` -> the declaration alone.
 * 2. Moves every inline script to the very end of <body>, after the root
 *    element. A classic script there runs once the DOM is parsed, over http://
 *    AND file:// (module scripts are blocked under file:// by CORS).
 * 3. Validates before writing and refuses to emit a broken file.
 *
 * TRAP - never pass a bundle as a string replacement
 * --------------------------------------------------
 * `str.replace(re, bundleAsString)` interprets `$&`, `$'`, `` $` `` and `$1` in
 * the REPLACEMENT. The minified React bundle contains `$&` (its DOM escaping
 * helpers). Inserting it as a plain replacement string silently rewrote every
 * `$&` into `</body>`, injecting `</body>` into the middle of the JavaScript:
 * "SyntaxError: Unexpected token '<'" - a blank page again, for a completely
 * different reason. Every insertion below uses a FUNCTION replacement, which
 * disables `$` pattern expansion.
 *
 *   node tools/finalize.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'dist', 'index.html');

let html = readFileSync(SRC, 'utf8');
const fail = (msg) => { console.error('finalize: ' + msg); process.exit(1); };

// 1. Pull out every inline <script>...</script> (no src=). External scripts keep
//    their position. Function replacement => no `$` expansion.
const inline = [];
html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (whole, attrs, body) => {
  if (/\bsrc\s*=/i.test(attrs)) return whole;
  inline.push(body);
  return '';
});
if (!inline.length) fail('no inline scripts found in dist/index.html');

// 2. Make each block classic-script safe. `export default <expr>;` still has to
//    evaluate <expr>, so it becomes `void <expr>;`.
function deEsm(src) {
  return src
    .replace(/\bexport\s+default\s+/g, () => 'void ')
    .replace(/\bexport\s*\{[^}]*\}\s*;?/g, () => '')
    .replace(/\bexport\s+(?=(const|let|var|function|class|async)\b)/g, () => '');
}

// 3. Re-insert them at the end of <body>, after the root element. Function
//    replacement again - this is the line that used to corrupt the bundle.
const tags = inline
  .map((body) => '<script>' + deEsm(body) + '</script>')
  .join('\n');
if (!/<\/body>/i.test(html)) fail('no </body> in dist/index.html');
html = html.replace(/<\/body>/i, () => tags + '\n</body>');

// 4. `type="module"` must not survive anywhere, or the file breaks over file://.
html = html.replace(/<script\s+type="module"/gi, () => '<script');

// ---- verify before writing -------------------------------------------------
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.indexOf('</script>', scriptStart);
const rootAt = html.indexOf('id="root"');
if (scriptStart < 0 || scriptEnd < 0) fail('could not find the inlined script after the move');
if (scriptStart < rootAt) fail('inline script still runs before the root element exists');
if (/<script\s+type="module"/i.test(html)) fail('a type="module" script survived');

const js = html.slice(scriptStart + '<script>'.length, scriptEnd);
if (js.indexOf('</body>') >= 0) fail('corrupted bundle: a literal </body> leaked into the JavaScript');
try {
  // Parses the bundle without executing it. Catches leftover import/export and
  // any other syntax damage in one shot.
  new Function(js);
} catch (e) {
  fail('inlined bundle does not parse: ' + e.message);
}

// ---- write -----------------------------------------------------------------
for (const f of [join(ROOT, 'dist', 'index.html'), join(ROOT, 'game.html')]) {
  writeFileSync(f, html);
}
console.log('finalize: moved ' + inline.length + ' inline script block(s) to the end of <body>');
console.log('finalize: bundle parses (' + js.length + ' bytes of JS), script sits after #root');
console.log('finalize: wrote dist/index.html and game.html  (' + html.length + ' bytes)');
