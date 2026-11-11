// Prepares the character icons for the web.
// Reads the source SVGs in src/assets/balls/*.svg and writes cleaned copies to
// src/assets/balls/web/<id>.svg, plus src/assets/balls/web/manifest.json.
//
// For each icon it:
//  - removes hidden layers (e.g. the reference image the art was traced from),
//  - turns <text> into paths, since an SVG shown with <img> can't load web fonts,
//  - makes the loop's opening see-through, so the page colour shows through it,
//  - crops to a canvas shared by all icons, centred on the loop, so every ball shows at the
//    same size and hangs straight from the hero string.
// Run after adding or replacing an icon: npm run balls:icons
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { loadFont } from './lib/glyphs.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

const ICONS = [
  { id: 'snoozie', file: 'snoozie.svg' },
  { id: 'clem', file: 'clem.svg' },
  { id: 'mr-move', file: 'mrmove.svg' },
  { id: 'bubbles', file: 'bubbles.svg' },
  { id: 'solace', file: 'solace.svg' },
];

// Fonts used by <text> in the source art (font-family, bold?) → self-hosted font file.
const FONTS = {
  'Source Sans 3|700': '@fontsource/source-sans-3/files/source-sans-3-latin-700-normal.woff',
  'Nanum Pen Script|400': '@fontsource/nanum-pen-script/files/nanum-pen-script-latin-400-normal.woff',
};
const fontCache = {};
const font = (family, weight) => {
  const key = `${family}|${weight}`;
  if (!FONTS[key]) throw new Error(`No font file for "${key}". Add it to FONTS in scripts/ball-icons.mjs.`);
  return (fontCache[key] ??= loadFont(readFileSync(here(`../node_modules/${FONTS[key]}`))));
};

// A white ellipse whose centre is in the top third is the opening of the hanging loop.
const LOOP_ZONE = 330;

const outDir = here('../src/assets/balls/web/');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const manifest = {};
const measured = [];

for (const icon of ICONS) {
  let svg = readFileSync(here(`../src/assets/balls/${icon.file}`), 'utf8');
  const styles = {};
  for (const m of svg.matchAll(/\.(cls-\d+)\{([^}]*)\}/g)) styles[m[1]] = m[2];
  const classOf = (attrs) => (attrs.match(/class="([^"]+)"/) || [])[1];
  const hidden = (attrs) => /display:\s*none/.test(styles[classOf(attrs)] ?? '');

  // 1. Hidden layers.
  svg = svg.replace(/<image\b[^>]*>/g, (tag) => (hidden(tag) ? '' : tag));

  // 2. Text → paths.
  svg = svg.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/g, (_, attrs, inner) => {
    const cls = classOf(attrs);
    const style = styles[cls] ?? '';
    const family = (style.match(/font-family:\s*(?:&apos;|')?([^,;&']+)/) || [])[1]?.trim();
    const size = parseFloat((style.match(/font-size:\s*([\d.]+)px/) || [])[1] ?? '16');
    const weight = /font-weight:\s*(bold|[6-9]00)/.test(style) ? 700 : 400;
    const text = inner.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
    const transform = (attrs.match(/transform="([^"]+)"/) || [])[1] ?? '';
    const d = font(family, weight)
      .layout(text, size)
      .glyphs.map((g) => g.d)
      .join('');
    return `<path transform="${transform}" class="${cls}" d="${d}"/>`;
  });

  // 3. See-through loop opening. The loop is a filled shape with a white oval on top, so
  //    the oval is cut out with a mask. The mask only covers what's drawn up to and
  //    including the oval; the ball body, drawn later and overlapping it, is untouched.
  //    The oval's outline is redrawn in the same place so the drawing looks the same.
  const hole = [...svg.matchAll(/<ellipse\b([^>]*?)\/>/g)].find(([, attrs]) => {
    const cy = parseFloat((attrs.match(/\bcy="([\d.]+)"/) || [])[1] ?? '1e9');
    return cy < LOOP_ZONE && /fill:\s*#fff(fff)?\b/i.test(styles[classOf(attrs)] ?? '');
  });
  if (!hole) throw new Error(`${icon.file}: no white loop opening found`);
  const layerOpen = svg.indexOf('>', svg.indexOf('<g id="Layer_1"')) + 1;
  const before = svg.slice(layerOpen, hole.index);
  if ((before.match(/<g\b/g) || []).length !== (before.match(/<\/g>/g) || []).length) {
    throw new Error(`${icon.file}: the loop opening is inside a group; flatten it in the source file`);
  }
  const shape = hole[1].replace(/\s*class="[^"]*"/, '');
  const maskId = `${icon.id}-loop`;
  svg =
    svg.slice(0, layerOpen) +
    `<mask id="${maskId}" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="10000" height="10000"><rect x="-5000" y="-5000" width="10000" height="10000" fill="#fff"/><ellipse${shape} fill="#000"/></mask>` +
    `<g mask="url(#${maskId})">${before}</g>` +
    `<ellipse${hole[1]} style="fill:none"/>` +
    svg.slice(hole.index + hole[0].length);

  // 4. Crop to the character, centred on the loop. Render at 1 unit = 1 px to measure.
  const vb = svg.match(/viewBox="([\d.\s-]+)"/)[1].split(/\s+/).map(Number);
  const { data, info } = await sharp(Buffer.from(svg), { density: 72 })
    .resize(Math.round(vb[2]), Math.round(vb[3]))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const solid = (i) => data[i * 4 + 3] > 8;
  let [minX, minY, maxX, maxY] = [w, h, 0, 0];
  for (let i = 0; i < w * h; i++) {
    if (!solid(i)) continue;
    const x = i % w, y = (i / w) | 0;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  // Loop opening = the transparent pocket enclosed by the loop: not reachable from the edges.
  const outside = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop();
    if (outside[i] || solid(i)) continue;
    outside[i] = 1;
    const x = i % w;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (i >= w) stack.push(i - w);
    if (i < w * (h - 1)) stack.push(i + w);
  }
  let hx0 = w, hx1 = 0, hy0 = h;
  for (let i = 0; i < w * LOOP_ZONE; i++) {
    if (solid(i) || outside[i]) continue;
    const x = i % w, y = (i / w) | 0;
    if (x < hx0) hx0 = x;
    if (x > hx1) hx1 = x;
    if (y < hy0) hy0 = y;
  }
  if (hx1 < hx0) throw new Error(`${icon.file}: couldn't find the loop opening`);
  const cx = Math.round((hx0 + hx1) / 2);
  let loopTop = hy0;
  while (loopTop > 0 && solid((loopTop - 1) * w + cx)) loopTop--;

  const pad = 6;
  measured.push({
    icon,
    svg: svg
      .replace(/<\?xml[^>]*>\s*/, '')
      .replace(/<title>[^<]*<\/title>\s*/, '')
      .replace(/\n\s*/g, '\n'),
    // In the source's own units: loop centre, loop top, and the drawing's edges.
    cx: vb[0] + cx,
    loopTop: vb[1] + loopTop,
    half: Math.max(cx - minX, maxX - cx) + pad,
    top: vb[1] + minY - pad,
    bottom: vb[1] + maxY + pad,
  });
}

// Every icon gets the SAME canvas size (the largest needed), centred on its loop and
// aligned at the bottom. The source art is drawn at a consistent scale, so the balls then
// show at the same size wherever icons share a box, even though some (Snoozie's Z's,
// Mr. Move's tall handle) need more room than others.
const cw = Math.max(...measured.map((m) => m.half * 2));
const ch = Math.max(...measured.map((m) => m.bottom - m.top));
for (const m of measured) {
  const x0 = m.cx - cw / 2;
  const y0 = m.bottom - ch;
  const svg = m.svg.replace(/viewBox="[^"]*"/, `viewBox="${x0} ${y0} ${cw} ${ch}" width="${cw}" height="${ch}"`);
  writeFileSync(`${outDir}${m.icon.id}.svg`, svg);
  // loop = how far down the image the top of the loop is, as a share of its width.
  manifest[m.icon.id] = { width: cw, height: ch, loop: +((m.loopTop - y0) / cw).toFixed(4) };
  console.log(`${m.icon.id}.svg  ${cw}×${ch}  ${(svg.length / 1024).toFixed(1)} KB  loop ${manifest[m.icon.id].loop}`);
}

writeFileSync(`${outDir}manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
