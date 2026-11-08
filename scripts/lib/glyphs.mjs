// Minimal TrueType reader: turns text into SVG path data using a font's glyph outlines.
// Used for the OG image so the build doesn't depend on system fonts or fontconfig.
// Supports WOFF 1.0 / TTF, cmap format 4, simple and composite glyphs. No kerning.
import { inflateSync } from 'node:zlib';

function tablesOf(buf) {
  const t = {};
  if (buf.toString('latin1', 0, 4) === 'wOFF') {
    const n = buf.readUInt16BE(12);
    for (let i = 0; i < n; i++) {
      const o = 44 + i * 20;
      const [off, comp, orig] = [4, 8, 12].map((k) => buf.readUInt32BE(o + k));
      const raw = buf.subarray(off, off + comp);
      t[buf.toString('latin1', o, o + 4)] = comp < orig ? inflateSync(raw) : raw;
    }
  } else {
    const n = buf.readUInt16BE(4);
    for (let i = 0; i < n; i++) {
      const r = 12 + i * 16;
      const off = buf.readUInt32BE(r + 8);
      t[buf.toString('latin1', r, r + 4)] = buf.subarray(off, off + buf.readUInt32BE(r + 12));
    }
  }
  return t;
}

export function loadFont(buf) {
  const t = tablesOf(buf);
  const upm = t.head.readUInt16BE(18);
  const longLoca = t.head.readInt16BE(50) === 1;
  const numHMetrics = t.hhea.readUInt16BE(34);
  const capHeight = t['OS/2'].readInt16BE(88);

  // cmap format 4
  const cmap = t.cmap;
  let sub = -1;
  for (let i = 0; i < cmap.readUInt16BE(2); i++) {
    const r = 4 + i * 8;
    const pid = cmap.readUInt16BE(r), eid = cmap.readUInt16BE(r + 2), off = cmap.readUInt32BE(r + 4);
    if (cmap.readUInt16BE(off) === 4 && (pid === 3 || pid === 0) && (eid === 1 || pid === 0)) sub = off;
  }
  if (sub < 0) throw new Error('No cmap format 4 table');
  const segX2 = cmap.readUInt16BE(sub + 6);
  const ends = sub + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ranges = deltas + segX2;
  function glyphId(code) {
    for (let i = 0; i < segX2 / 2; i++) {
      const end = cmap.readUInt16BE(ends + i * 2);
      if (code > end) continue;
      const start = cmap.readUInt16BE(starts + i * 2);
      if (code < start) return 0;
      const delta = cmap.readInt16BE(deltas + i * 2);
      const ro = cmap.readUInt16BE(ranges + i * 2);
      if (!ro) return (code + delta) & 0xffff;
      const g = cmap.readUInt16BE(ranges + i * 2 + ro + (code - start) * 2);
      return g ? (g + delta) & 0xffff : 0;
    }
    return 0;
  }

  const advance = (g) => t.hmtx.readUInt16BE(4 * Math.min(g, numHMetrics - 1));
  const loca = (g) => (longLoca ? t.loca.readUInt32BE(g * 4) : t.loca.readUInt16BE(g * 2) * 2);

  /** Contours of glyph g as arrays of {x, y, on}. */
  function contours(g) {
    const start = loca(g), end = loca(g + 1);
    if (start === end) return [];
    const d = t.glyf.subarray(start, end);
    const n = d.readInt16BE(0);
    if (n < 0) return composite(d);
    const endPts = [];
    for (let i = 0; i < n; i++) endPts.push(d.readUInt16BE(10 + i * 2));
    const count = endPts[n - 1] + 1;
    let p = 10 + n * 2;
    p += 2 + d.readUInt16BE(p); // skip instructions
    const flags = [];
    while (flags.length < count) {
      const f = d[p++];
      flags.push(f);
      if (f & 8) for (let r = d[p++]; r > 0; r--) flags.push(f);
    }
    const read = (short, same) => {
      const out = [];
      let v = 0;
      for (const f of flags) {
        if (f & short) v += f & same ? d[p++] : -d[p++];
        else if (!(f & same)) (v += d.readInt16BE(p)), (p += 2);
        out.push(v);
      }
      return out;
    };
    const xs = read(2, 16), ys = read(4, 32);
    const res = [];
    let s = 0;
    for (const e of endPts) {
      res.push(xs.slice(s, e + 1).map((x, i) => ({ x, y: ys[s + i], on: !!(flags[s + i] & 1) })));
      s = e + 1;
    }
    return res;
  }

  function composite(d) {
    const res = [];
    let p = 10, more = true;
    while (more) {
      const flags = d.readUInt16BE(p), gi = d.readUInt16BE(p + 2);
      p += 4;
      let dx, dy;
      if (flags & 1) (dx = d.readInt16BE(p)), (dy = d.readInt16BE(p + 2)), (p += 4);
      else (dx = d.readInt8(p)), (dy = d.readInt8(p + 1)), (p += 2);
      if (flags & 8) p += 2;
      else if (flags & 0x40) p += 4;
      else if (flags & 0x80) p += 8;
      for (const c of contours(gi)) res.push(c.map((pt) => ({ ...pt, x: pt.x + dx, y: pt.y + dy })));
      more = !!(flags & 0x20);
    }
    return res;
  }

  /** SVG path for one glyph at (ox, baseline) with scale s (y flipped). */
  function glyphPath(g, ox, base, s) {
    const X = (v) => +(ox + v * s).toFixed(2), Y = (v) => +(base - v * s).toFixed(2);
    let out = '';
    for (const c of contours(g)) {
      if (!c.length) continue;
      // start on an on-curve point (or the midpoint of two off-curve points)
      let i0 = c.findIndex((q) => q.on);
      const pts = i0 < 0 ? c : [...c.slice(i0), ...c.slice(0, i0)];
      const first = i0 < 0 ? { x: (c[0].x + c[1].x) / 2, y: (c[0].y + c[1].y) / 2, on: true } : pts[0];
      out += `M${X(first.x)} ${Y(first.y)}`;
      const ring = i0 < 0 ? [...pts, pts[0]] : [...pts.slice(1), pts[0]];
      let ctrl = null;
      for (const q of ring) {
        if (q.on) {
          out += ctrl ? `Q${X(ctrl.x)} ${Y(ctrl.y)} ${X(q.x)} ${Y(q.y)}` : `L${X(q.x)} ${Y(q.y)}`;
          ctrl = null;
        } else if (ctrl) {
          const mx = (ctrl.x + q.x) / 2, my = (ctrl.y + q.y) / 2;
          out += `Q${X(ctrl.x)} ${Y(ctrl.y)} ${X(mx)} ${Y(my)}`;
          ctrl = q;
        } else ctrl = q;
      }
      if (ctrl) out += `Q${X(ctrl.x)} ${Y(ctrl.y)} ${X(first.x)} ${Y(first.y)}`;
      out += 'Z';
    }
    return out;
  }

  /**
   * Lay out text with the baseline at y = 0. Returns one path per character (with its ink
   * left/right edges) plus metrics, all in px.
   * size = font size in px; tracking = letter-spacing in em.
   */
  function layout(text, size, tracking = 0) {
    const s = size / upm;
    let x = 0;
    const glyphs = [];
    for (const ch of text) {
      const g = glyphId(ch.codePointAt(0));
      const gd = loca(g) === loca(g + 1) ? null : t.glyf.subarray(loca(g));
      const ink = gd ? { left: x + gd.readInt16BE(2) * s, right: x + gd.readInt16BE(6) * s } : { left: x, right: x };
      glyphs.push({ ch, d: glyphPath(g, x, 0, s), x, ...ink });
      x += advance(g) * s + tracking * size;
    }
    return { glyphs, width: x - tracking * size, capHeight: capHeight * s };
  }

  return { layout, upm, capHeight };
}
