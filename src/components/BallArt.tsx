import type { Design } from '../content/types';
import { ballIcon } from '../lib/ballIcons';
import { photoUrl } from '../lib/photos';

interface Props {
  design: Design;
  loading?: 'eager' | 'lazy';
  /** Next to the character's name already, so screen readers can skip it. */
  decorative?: boolean;
  className?: string;
}

/** Product image: the real photo if there is one, otherwise the character icon. */
export function BallArt({ design, loading = 'lazy', decorative, className = '' }: Props) {
  const photo = photoUrl(design.photo);
  const icon = ballIcon(design.id);
  const described = `${design.name} scent ball with ${design.emboss}`;

  if (photo || icon) {
    return (
      <img
        src={photo ?? icon?.src}
        alt={decorative ? '' : photo ? described : `${described}, illustration`}
        width={photo ? 1200 : icon?.width}
        height={photo ? 1200 : icon?.height}
        loading={loading}
        decoding="async"
        className={`${photo ? 'ball-photo' : 'ball-icon'} ${className}`}
      />
    );
  }

  // No icon yet (the ultra rare one): a hidden silhouette.
  return (
    <svg
      viewBox="0 0 200 240"
      width="200"
      height="240"
      className={`ball-icon ${className}`}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': `${described}, illustration` })}
    >
      <circle cx="100" cy="30" r="20" fill="none" style={{ stroke: 'var(--ink)' }} strokeWidth="9" />
      <circle cx="100" cy="140" r="92" style={{ fill: 'var(--ink)' }} />
      <text x="100" y="185" textAnchor="middle" fontSize="120" fill="#fff" style={{ fontFamily: 'var(--font-display)' }}>
        ?
      </text>
    </svg>
  );
}
