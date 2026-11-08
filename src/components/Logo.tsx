import { site } from '../content/site';
import { logoOrder } from '../content/theme';
import { WelloBall } from './WelloBall';

interface Props {
  /** 'full' = coloured wordmark, 'mark' = ball only, 'ink' = one-colour wordmark. */
  variant?: 'full' | 'mark' | 'ink';
  className?: string;
}

/**
 * The Wello logo. This is the ONE place the logo is drawn: when the final vector
 * logo arrives, replace the internals of this component (e.g. with an inline SVG
 * or an <img>) and everything else picks it up.
 *
 * Built from live text so it stays sharp at any size: "WELL" in Anton, each letter
 * in the logo colours, then the striped ball as the "O". Proportions (in em, from
 * Anton's 0.859em cap height) match src/assets/brand/reference/wello-logo.png.
 */
export function Logo({ variant = 'full', className = '' }: Props) {
  if (variant === 'mark') {
    return (
      <span className={`logo logo--mark ${className}`} role="img" aria-label={site.brandName}>
        <WelloBall />
      </span>
    );
  }
  const ink = variant === 'ink';
  return (
    <span className={`logo wordmark${ink ? ' wordmark--ink' : ''} ${className}`} role="img" aria-label={site.brandName}>
      <span aria-hidden="true" className="wordmark__letters">
        {'WELL'.split('').map((ch, i) => (
          <span key={i} style={ink ? undefined : { color: `var(--c-${logoOrder[i]})` }}>
            {ch}
          </span>
        ))}
      </span>
      <WelloBall tone={ink ? 'ink' : 'color'} className="wordmark__o" />
    </span>
  );
}
