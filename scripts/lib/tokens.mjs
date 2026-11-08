// Reads colour tokens from src/styles/tokens.css. Shared by check-contrast and brand-assets.
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf8');
const root = css.slice(css.indexOf(':root'), css.indexOf('}', css.indexOf(':root')));
export const tokens = {};
for (const m of root.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) tokens[m[1]] = m[2].replace(/\/\*.*?\*\//g, '').trim();

const NAMED = { white: '#ffffff', black: '#000000' };
const hex = (h) => {
  h = h.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
export const toHex = (rgb) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

/** Resolve a token name, hex, named colour, var() or color-mix(in srgb, A p%, B) to [r, g, b]. */
export function resolve(v, depth = 0) {
  if (depth > 10) throw new Error(`Circular token: ${v}`);
  v = v.trim();
  if (v.startsWith('--')) {
    if (!(v in tokens)) throw new Error(`Unknown token ${v}`);
    return resolve(tokens[v], depth + 1);
  }
  if (NAMED[v]) return hex(NAMED[v]);
  if (v.startsWith('#')) return hex(v);
  let m = v.match(/^var\((--[\w-]+)\)$/);
  if (m) return resolve(m[1], depth + 1);
  m = v.match(/^color-mix\(in srgb,\s*(.+?)\s+([\d.]+)%\s*,\s*(.+?)\)$/);
  if (m) {
    const a = resolve(m[1], depth + 1);
    const b = resolve(m[3], depth + 1);
    const p = Number(m[2]) / 100;
    return a.map((c, i) => c * p + b[i] * (1 - p));
  }
  throw new Error(`Can't resolve colour: ${v}`);
}

export const colour = (v) => toHex(resolve(v));
