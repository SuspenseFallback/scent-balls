/** Mix two #rrggbb colours. amt 0 = a, 1 = b. */
export function mix(a: string, b: string, amt: number): string {
  const p = (h: string) => [0, 2, 4].map((i) => parseInt(h.replace('#', '').slice(i, i + 2), 16));
  const x = p(a);
  const y = p(b);
  return '#' + x.map((c, i) => Math.round(c + (y[i] - c) * amt).toString(16).padStart(2, '0')).join('');
}

export const INK = '#1b1d1f';
