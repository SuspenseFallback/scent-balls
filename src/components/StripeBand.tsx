import { logoOrder } from '../content/theme';

interface Props {
  /** 'divider' between sections, 'hero' background sweep, 'thin' footer accent. */
  variant?: 'divider' | 'hero' | 'thin';
  /** Mirror horizontally, so consecutive dividers don't all lean the same way. */
  flip?: boolean;
  className?: string;
}

// Each band is the area between two wavy curves. Flat colours, logo order, no gradients.
function bands(width: number, top: number, thickness: number, lift: number, wave: number) {
  return logoOrder.map((c, i) => {
    const y0 = top + i * thickness;
    const y1 = y0 + thickness + 0.5; // tiny overlap avoids hairline gaps
    const curve = (y: number) => `C ${width * 0.3} ${y - wave}, ${width * 0.65} ${y + wave - lift * 0.5}, ${width} ${y - lift}`;
    const back = (y: number) =>
      `C ${width * 0.65} ${y + wave - lift * 0.5}, ${width * 0.3} ${y - wave}, 0 ${y}`;
    return { c, d: `M0 ${y0} ${curve(y0)} L ${width} ${y1 - lift} ${back(y1)} Z` };
  });
}

const SHAPES = {
  divider: { vb: '0 0 1440 48', paths: bands(1440, 10, 7, 0, 10) },
  thin: { vb: '0 0 1440 16', paths: bands(1440, 3, 2.5, 0, 3) },
  hero: { vb: '0 0 1440 300', paths: bands(1440, 210, 26, 150, 34) },
};

export function StripeBand({ variant = 'divider', flip, className = '' }: Props) {
  const s = SHAPES[variant];
  return (
    <svg
      className={`stripe-band stripe-band--${variant}${flip ? ' stripe-band--flip' : ''} ${className}`}
      viewBox={s.vb}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {s.paths.map((p) => (
        <path key={p.c} d={p.d} style={{ fill: `var(--c-${p.c})` }} />
      ))}
    </svg>
  );
}
