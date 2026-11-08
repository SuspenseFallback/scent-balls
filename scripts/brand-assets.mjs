// Generates brand files from the logo geometry (src/lib/welloBall.ts) and tokens.css:
//   src/assets/brand/favicon.svg  the ball mark, square
//   public/og-image.png           1200×630 link preview (WhatsApp/Telegram need PNG/JPG)
// Runs automatically before every build. Run by hand: npm run brand:assets
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { BALL, welloBallSvg } from '../src/lib/welloBall.ts';
import { site } from '../src/content/site.ts';
import { colour } from './lib/tokens.mjs';

import sharp from 'sharp';
import { loadFont } from './lib/glyphs.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const palette = {
  purple: colour('--c-purple'),
  coral: colour('--c-coral'),
  orange: colour('--c-orange'),
  sky: colour('--c-sky'),
  grey: colour('--c-grey'),
};
const ink = colour('--ink');
const bgSoft = colour('--bg-soft');
const logoOrder = ['purple', 'coral', 'orange', 'sky'];

// ---- Favicon: the ball in a square viewBox ----
const favicon = welloBallSvg(palette, { id: 'f' }).replace(`viewBox="${BALL.viewBox}"`, 'viewBox="-6.5 3 113 113"').replace(/ width="\d+" height="\d+"/, '');
writeFileSync(here('../src/assets/brand/favicon.svg'), favicon + '\n');

// ---- OG image ----
// Text is drawn as paths from Anton's own outlines (scripts/lib/glyphs.mjs), so the
// result doesn't depend on fonts installed on the build machine.
const W = 1200;
const H = 630;
const anton = loadFont(readFileSync(here('../node_modules/@fontsource/anton/files/anton-latin-400-normal.woff')));

// Wordmark: "WELL" (0.035em tracking, as in the CSS) + the ball. Proportions from the
// reference: ball diameter 0.91 × cap height, bottom 0.22 × cap height above the
// baseline, left edge 0.14 × cap height before the last L's right edge.
const size = 290;
const word = anton.layout('WELL', size, 0.035);
const cap = word.capHeight;
const lastL = word.glyphs[3];
const D = 0.91 * cap;
const s = D / (2 * BALL.r);
const ballW = BALL.width * s;
const ballH = BALL.height * s;
const ballSvgX = lastL.right - 0.14 * cap - (BALL.cx - BALL.r) * s; // relative to text origin
const inkLeft = word.glyphs[0].left;
const totalW = ballSvgX + ballW - inkLeft;
const ox = (W - totalW) / 2 - inkLeft;
const baseline = 120 + cap; // cap top at y = 120
const ballSvgY = baseline - 0.22 * cap - ballH;

const letters = word.glyphs
  .map((g, i) => `<path transform="translate(${ox.toFixed(1)} ${baseline.toFixed(1)})" fill="${palette[logoOrder[i]]}" d="${g.d}"/>`)
  .join('');
const ball = welloBallSvg(palette, { size: Math.round(ballW), id: 'og' }).replace(
  '<svg ',
  `<svg x="${(ox + ballSvgX).toFixed(1)}" y="${ballSvgY.toFixed(1)}" `,
);

const tag = anton.layout(site.tagline.toUpperCase(), 56, 0.02);
const tagY = baseline + 40 + tag.capHeight;
const tagline = `<path transform="translate(${((W - tag.width) / 2).toFixed(1)} ${tagY.toFixed(1)})" fill="${ink}" d="${tag.glyphs.map((g) => g.d).join('')}"/>`;

// Stripe band across the bottom, logo order, flat colours (same idea as <StripeBand />).
const band = (i) => {
  const t = 540 + i * 20;
  return `<path d="M0 ${t} C 360 ${t - 24}, 780 ${t + 10}, 1200 ${t - 64} L 1200 ${t - 43} C 780 ${t + 31}, 360 ${t - 3}, 0 ${t + 21} Z" fill="${palette[logoOrder[i]]}"/>`;
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${bgSoft}"/>${[0, 1, 2, 3].map(band).join('')}${letters}${ball}${tagline}</svg>`;

mkdirSync(here('../public'), { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(here('../public/og-image.png'));

console.log('brand assets: favicon.svg, og-image.png');
