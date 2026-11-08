import { useId, type CSSProperties } from 'react';
import { BALL, type PaletteKey } from '../lib/welloBall';

interface Props {
  /** Width in px. Leave out to size it with CSS. */
  size?: number;
  /** Gentle swing from the loop (off under prefers-reduced-motion). */
  animate?: boolean;
  /** 'ink' = one-colour version (footer). */
  tone?: 'color' | 'ink';
  className?: string;
  /** Accessible name. Without it the ball is decorative (aria-hidden). */
  title?: string;
  style?: CSSProperties;
}

const fill = (key: PaletteKey, tone: Props['tone']) =>
  tone === 'ink' ? 'var(--ink)' : key === 'grey' ? 'var(--c-grey)' : `var(--c-${key})`;

/** The Wello brand mascot: striped ball with a hanging loop. Not a product picture. */
export function WelloBall({ size, animate, tone = 'color', className = '', title, style }: Props) {
  const id = 'wb' + useId().replace(/:/g, '');
  const { cx, cy, r, loop, hole, crossbar } = BALL;
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true as const, focusable: 'false' as const };
  return (
    <svg
      viewBox={BALL.viewBox}
      width={size}
      height={size ? Math.round((size * BALL.height) / BALL.width) : undefined}
      className={`wello-ball${animate ? ' wello-ball--swing' : ''}${className ? ' ' + className : ''}`}
      style={style}
      {...a11y}
    >
      <defs>
        <clipPath id={id}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <clipPath id={id + 'h'}>
          <circle cx={hole.cx} cy={hole.cy} r={hole.r} />
        </clipPath>
      </defs>
      <circle
        cx={loop.cx}
        cy={loop.cy}
        r={loop.r}
        fill="none"
        style={{ stroke: fill('grey', tone) }}
        strokeWidth={loop.stroke}
      />
      <g clipPath={`url(#${id})`}>
        <rect x="0" y="0" width="100" height="120" style={{ fill: fill(BALL.base, tone) }} />
        {BALL.bands.map((b) => (
          <path key={b.d} d={b.d} style={{ fill: fill(b.color, tone) }} />
        ))}
        <circle cx={hole.cx} cy={hole.cy} r={hole.r} fill="#fff" />
      </g>
      <path d={crossbar.d} clipPath={`url(#${id}h)`} style={{ fill: fill(crossbar.color, tone) }} />
    </svg>
  );
}
