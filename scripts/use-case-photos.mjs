// Builds the "Where it goes" photos: a real photo with a Wello character icon placed in it.
// Sources: src/assets/photos/source/<scene>.jpg (free Unsplash photos, see CREDITS.md there).
// Output:  src/assets/photos/<scene>.webp (1200×900), used by copy.useCases.items[].photo.
// Run after changing a placement or an icon: npm run photos:uses
//
// Each scene places one icon (src/assets/balls/web/<design>.svg). Coordinates are in the
// source photo's pixels:
//   sit:  [x, y]  bottom-centre of the ball, where it rests on something
//   hang: [x, y]  top of the ball's loop, where it hangs from; optional `string` draws a
//                 cord of that length straight up from the loop
//   width         icon width in px (the ball itself is about 79% of this)
//   tilt          degrees, rotates around the loop (hanging) or the ball's base (sitting)
//   tuck          polygon of the PHOTO redrawn over the icon, so it sits inside things
//                 (a pocket, a shoe, behind a rail)
//   crop          [left, top, width, height] of the final 4:3 frame
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const manifest = JSON.parse(readFileSync(here('../src/assets/balls/web/manifest.json'), 'utf8'));

const SCENES = [
  {
    id: 'shoes',
    design: 'snoozie',
    sit: [776, 410],
    width: 360,
    tilt: -6,
    // the front of the shoe, below the opening's edge
    tuck: [[560, 337], [640, 330], [700, 336], [780, 360], [850, 346], [905, 300], [960, 330], [980, 520], [560, 520]],
    crop: [88, 0, 1423, 1067],
  },
  {
    id: 'gym',
    design: 'mr-move',
    sit: [348, 448],
    width: 300,
    tilt: -4,
    crop: [40, 0, 1423, 1067],
  },
  {
    id: 'school',
    design: 'clem',
    sit: [835, 1488],
    width: 320,
    tilt: -5,
    // the pocket front, below the zip
    tuck: [[700, 1371], [800, 1374], [900, 1370], [1000, 1364], [1125, 1356], [1135, 1640], [690, 1640]],
    crop: [300, 760, 1200, 900],
  },
  {
    id: 'locker',
    design: 'bubbles',
    hang: [812, 598],
    width: 380,
    tilt: 4,
    // the handle plate, so the loop looks hooked behind it
    tuck: [[777, 528], [847, 528], [845, 618], [779, 618]],
    crop: [0, 0, 1600, 1200],
  },
  {
    id: 'wardrobe',
    design: 'bloom',
    hang: [1182, 380],
    width: 340,
    tilt: -3,
    // the rail, drawn in front of the loop so it looks threaded on
    tuck: [[1125, 405], [1255, 383], [1258, 402], [1125, 424]],
    crop: [88, 0, 1423, 1067],
  },
  {
    id: 'hang',
    design: 'snoozie',
    hang: [688, 846],
    string: 46,
    width: 420,
    tilt: 5,
    crop: [0, 300, 1600, 1200],
  },
];

const OUT_W = 1200;
const OUT_H = 900;

for (const s of SCENES) {
  const { data: photo, info } = await sharp(here(`../src/assets/photos/source/${s.id}.jpg`))
    .rotate()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;

  // Icon placement: the icon canvas is centred on its loop and its bottom is the ball's bottom.
  const m = manifest[s.design];
  const iw = s.width;
  const ih = (iw * m.height) / m.width;
  const loopTop = m.loop * iw;
  const x = (s.hang ?? s.sit)[0] - iw / 2;
  const y = s.hang ? s.hang[1] - loopTop : s.sit[1] - ih;
  const pivot = s.hang ? `${s.hang[0]} ${s.hang[1]}` : `${s.sit[0]} ${s.sit[1]}`;

  const iconSvg = readFileSync(here(`../src/assets/balls/web/${s.design}.svg`), 'utf8')
    .replace(/<\?xml[^>]*>/, '')
    .replace(/\swidth="[\d.]+"\s+height="[\d.]+"/, ` x="${x}" y="${y}" width="${iw}" height="${ih}"`);
  const string = s.hang && s.string
    ? `<line x1="${s.hang[0]}" y1="${s.hang[1] - s.string}" x2="${s.hang[0]}" y2="${s.hang[1] + loopTop + 6}" stroke="#2b2622" stroke-width="3" stroke-linecap="round"/>`
    : '';
  const overlay = await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
        `<g transform="rotate(${s.tilt ?? 0} ${pivot})">${string}${iconSvg}</g></svg>`,
    ),
  )
    .resize(W, H)
    .png()
    .toBuffer();

  // Soft shadow from the icon's own shape, nudged down and right.
  const alpha = await sharp(overlay).extractChannel(3).blur(s.hang ? 14 : 9).linear(0.38, 0).toBuffer();
  const shadowFull = await sharp({ create: { width: W, height: H, channels: 3, background: '#000' } })
    .joinChannel(alpha)
    .png()
    .toBuffer();
  const [dx, dy] = s.hang ? [16, 18] : [6, 10];
  // (two steps: in one pipeline sharp would crop before extending)
  const shifted = await sharp(shadowFull).extend({ top: dy, left: dx, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const shadow = await sharp(shifted).extract({ left: 0, top: 0, width: W, height: H }).png().toBuffer();

  // Contact shadow under a sitting ball.
  const layers = [{ input: shadow }];
  if (s.sit) {
    const contact = await sharp(
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><ellipse cx="${s.sit[0]}" cy="${s.sit[1] - 4}" rx="${iw * 0.3}" ry="${iw * 0.05}" fill="#000" fill-opacity="0.45"/></svg>`,
      ),
    )
      .resize(W, H)
      .blur(6)
      .png()
      .toBuffer();
    layers.push({ input: contact });
  }
  layers.push({ input: overlay });

  // Tuck: redraw part of the photo on top.
  if (s.tuck) {
    const mask = await sharp(
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><polygon points="${s.tuck.map((p) => p.join(',')).join(' ')}" fill="#fff"/></svg>`,
      ),
    )
      .resize(W, H)
      .blur(1.2)
      .png()
      .toBuffer();
    const patch = await sharp(photo).ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
    layers.push({ input: patch });
  }

  const composed = await sharp(photo).composite(layers).png().toBuffer();
  const [cl, ct, cw, ch] = s.crop;
  const out = `src/assets/photos/${s.id}.webp`;
  await sharp(composed)
    .extract({ left: cl, top: ct, width: cw, height: ch })
    .resize(OUT_W, OUT_H, { fit: 'cover' })
    .webp({ quality: 78 })
    .toFile(here(`../${out}`));
  console.log(`${out}  (${s.design})`);
}
