// WCAG contrast check for the colour pairs the site actually uses.
// Reads tokens from src/styles/tokens.css and design colours from src/content/designs.ts.
// Fails below 4.5:1 for normal text and 3:1 for large text / UI.
// Run: npm run check:contrast
import { readFileSync } from 'node:fs';
import { resolve, toHex } from './lib/tokens.mjs';

// ---- Declared pairs: [foreground, background, 'text' | 'large', where it's used] ----
const tints = ['purple', 'coral', 'orange', 'sky'];
const PAIRS = [
  ['--ink', '--bg', 'text', 'body text'],
  ['--ink', '--bg-soft', 'text', 'body text on soft sections'],
  ['--ink-soft', '--bg', 'text', 'secondary text'],
  ['--ink-soft', '--bg-soft', 'text', 'secondary text on soft sections'],
  ['--on-brand', '--brand', 'text', 'primary button'],
  ['--on-brand', '--brand-hover', 'text', 'primary button hover'],
  ['--brand', '--bg', 'text', 'links'],
  ['--brand', '--bg-soft', 'text', 'links on soft sections'],
  ['--brand', '--brand-soft', 'text', 'selected step / stepper hover'],
  ['--brand', '--bg', 'large', 'focus ring'],
  ['--brand', '--bg-soft', 'large', 'focus ring on soft sections'],
  ['#ffffff', '--c-purple-deep', 'text', 'made-better band'],
  ...tints.flatMap((t) => [
    [`--c-${t}-deep`, '--bg', 'text', `${t} eyebrow / icon text`],
    [`--c-${t}-deep`, '--bg-soft', 'text', `${t} eyebrow on soft section`],
    [`--c-${t}-deep`, `--c-${t}-tint`, 'text', `${t} eyebrow on its tint`],
    ['--on-brand', `--c-${t}-deep`, 'text', `white on ${t}-deep (step numbers, ticks)`],
    ['--ink', `--c-${t}-tint`, 'text', `body text on ${t} tint`],
    ['--ink-soft', `--c-${t}-tint`, 'text', `secondary text on ${t} tint`],
    ['--ink', `--c-${t}`, 'text', `ink on ${t} pastel fill`],
    ['--brand', `--c-${t}-tint`, 'large', `focus ring on ${t} tint`],
  ]),
];

const lum = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// ---- Design colours (data in designs.ts): ink on the colour and on its 14% crew tint ----
const designsSrc = readFileSync(new URL('../src/content/designs.ts', import.meta.url), 'utf8');
const designPairs = [];
for (const m of designsSrc.matchAll(/name:\s*'([^']+)'[\s\S]*?color:\s*'(#[0-9a-fA-F]{3,6})'/g)) {
  const [, name, color] = m;
  designPairs.push(['--ink', color, 'text', `ink on ${name} ball colour`]);
  designPairs.push(['--ink', `color-mix(in srgb, ${color} 14%, white)`, 'text', `ink on ${name} crew tint`]);
}

// ---- Check ----
let failed = 0;
const rows = [...PAIRS, ...designPairs].map(([fg, bg, kind, where]) => {
  const r = ratio(resolve(fg), resolve(bg));
  const min = kind === 'text' ? 4.5 : 3;
  const ok = r >= min;
  if (!ok) failed++;
  return { ok, r, min, fg, bg, where };
});

const pad = (s, n) => String(s).padEnd(n);
for (const x of rows) {
  const fgHex = toHex(resolve(x.fg));
  const bgHex = toHex(resolve(x.bg));
  const label = (t, h) => (t.startsWith('--') ? `${t} ${h}` : h);
  console.log(
    `${x.ok ? 'ok  ' : 'FAIL'} ${pad(x.r.toFixed(2), 6)} (min ${x.min})  ${pad(label(x.fg, fgHex), 30)} on ${pad(label(x.bg, bgHex), 30)} ${x.where}`,
  );
}
console.log(`\n${rows.length - failed}/${rows.length} pairs pass.`);
if (failed) {
  console.error(`${failed} pair(s) below WCAG AA. Adjust tokens.css (or designs.ts) and re-run.`);
  process.exit(1);
}
