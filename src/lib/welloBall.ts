// Geometry of the Wello ball mark (the "O" in the logo). Shared by <WelloBall />,
// the favicon and the OG image script, so all three always match.
// Measured from src/assets/brand/reference/wello-logo.png.

export type PaletteKey = 'purple' | 'coral' | 'orange' | 'sky' | 'grey';

export const BALL = {
  viewBox: '0 3 100 113', // tight to the loop top and ball bottom
  width: 100,
  height: 113,
  cx: 50,
  cy: 70,
  r: 46,
  /** Hanging loop; its centre is the swing pivot. Sits off-centre like the reference. */
  loop: { cx: 37.3, cy: 24, r: 15.6, stroke: 9.4 },
  /** Painted in order over a purple base, each filling everything below its curve. */
  bands: [
    { color: 'coral', d: 'M0 49 C 25 58, 60 56, 100 14 V 120 H 0 Z' },
    { color: 'orange', d: 'M0 81 C 30 84, 66 78, 100 50 V 120 H 0 Z' },
    { color: 'sky', d: 'M0 94 C 28 104, 70 102, 100 72 V 120 H 0 Z' },
  ] as { color: PaletteKey; d: string }[],
  base: 'purple' as PaletteKey,
  /**
   * The air holes: a white disc split by a curved crossbar, which leaves two
   * white elliptical cut-outs (reads a little like an "e", as in the reference).
   */
  hole: { cx: 50.6, cy: 68.2, r: 22 },
  crossbar: { color: 'coral' as PaletteKey, d: 'M24 69.5 Q48.75 68.95 74 52.5 L77 66.5 Q53.75 81.1 28 82.5 Z' },
};

/** The ball as a standalone SVG string (favicon, OG image). */
export function welloBallSvg(colors: Record<PaletteKey, string>, opts: { size?: number; id?: string } = {}): string {
  const id = opts.id ?? 'wb';
  const w = opts.size ?? BALL.width;
  const h = Math.round((w * BALL.height) / BALL.width);
  const { cx, cy, r, loop, hole } = BALL;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BALL.viewBox}" width="${w}" height="${h}">`,
    `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>`,
    `<circle cx="${loop.cx}" cy="${loop.cy}" r="${loop.r}" fill="none" stroke="${colors.grey}" stroke-width="${loop.stroke}"/>`,
    `<g clip-path="url(#${id})">`,
    `<rect x="0" y="0" width="100" height="120" fill="${colors[BALL.base]}"/>`,
    ...BALL.bands.map((b) => `<path d="${b.d}" fill="${colors[b.color]}"/>`),
    `<circle cx="${hole.cx}" cy="${hole.cy}" r="${hole.r}" fill="#fff"/>`,
    `</g>`,
    `<defs><clipPath id="${id}h"><circle cx="${hole.cx}" cy="${hole.cy}" r="${hole.r}"/></clipPath></defs>`,
    `<path d="${BALL.crossbar.d}" fill="${colors[BALL.crossbar.color]}" clip-path="url(#${id}h)"/>`,
    `</svg>`,
  ].join('');
}
