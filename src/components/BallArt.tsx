import { useId } from 'react';
import type { Design } from '../content/types';
import { INK, mix } from '../lib/color';
import { photoUrl } from '../lib/photos';

interface Props {
  design: Design;
  /** Rendered width in px; height is 1.2× */
  size?: number;
  /** Use a real photo when design.photo is set (default true) */
  allowPhoto?: boolean;
  loading?: 'eager' | 'lazy';
}

/** Product image: the real photo if there is one, otherwise an SVG illustration. */
export function BallArt({ design, size = 240, allowPhoto = true, loading = 'lazy' }: Props) {
  const gid = 'ball' + useId().replace(/:/g, '');
  const src = allowPhoto ? photoUrl(design.photo) : undefined;
  if (src) {
    return (
      <img
        src={src}
        alt={`${design.name} scent ball with ${design.emboss}`}
        width={1200}
        height={1200}
        loading={loading}
        decoding="async"
        className="ball-photo"
      />
    );
  }

  const c = design.color;
  const dark = mix(c, INK, 0.5);
  const light = mix(c, '#ffffff', 0.55);
  const shade = mix(c, INK, 0.18);

  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={Math.round(size * 1.2)}
      role="img"
      aria-label={`${design.name} scent ball with ${design.emboss}, illustration`}
      className="ball-art"
    >
      <defs>
        <radialGradient id={gid} cx="36%" cy="30%" r="78%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={c} />
          <stop offset="1" stopColor={shade} />
        </radialGradient>
      </defs>
      {/* hanging loop */}
      <circle cx="100" cy="24" r="15" fill="none" stroke={dark} strokeWidth="6" />
      <rect x="91" y="36" width="18" height="18" rx="5" fill={dark} />
      {/* sphere */}
      <circle cx="100" cy="140" r="88" fill={`url(#${gid})`} />
      {/* screw seam */}
      <path d="M13 150 Q100 184 187 150" fill="none" stroke={dark} strokeWidth="2.5" opacity=".5" />
      {/* 3 top holes (air out), 6 side holes (air in) */}
      <g fill={dark} opacity=".42">
        <circle cx="66" cy="76" r="4.5" />
        <circle cx="100" cy="64" r="4.5" />
        <circle cx="134" cy="76" r="4.5" />
        <circle cx="30" cy="176" r="4.5" />
        <circle cx="46" cy="198" r="4.5" />
        <circle cx="68" cy="214" r="4.5" />
        <circle cx="170" cy="176" r="4.5" />
        <circle cx="154" cy="198" r="4.5" />
        <circle cx="132" cy="214" r="4.5" />
      </g>
      <g fill="none" stroke={dark} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <Face id={design.id} dark={dark} />
      </g>
    </svg>
  );
}

function Face({ id, dark }: { id: Design['id']; dark: string }) {
  const dot = (cx: number) => <circle cx={cx} cy="106" r="6" fill={dark} stroke="none" />;
  switch (id) {
    case 'sleep':
      // The real prototype: closed eyes, zzz, yawning mouth.
      return (
        <>
          <path d="M62 106 Q72 115 82 106" />
          <path d="M118 106 Q128 115 138 106" />
          <ellipse cx="100" cy="135" rx="9" ry="12" fill={dark} stroke="none" />
          <g fill={dark} stroke="none" fontFamily="var(--font-display)" fontWeight="800">
            <text x="146" y="80" fontSize="20">z</text>
            <text x="161" y="62" fontSize="15">z</text>
            <text x="172" y="47" fontSize="11">z</text>
          </g>
        </>
      );
    // TODO(content): the five faces below are placeholders until the real designs are final.
    case 'shower':
      return (
        <>
          {dot(72)}
          {dot(128)}
          <path d="M84 128 Q100 142 116 128" />
        </>
      );
    case 'skincare':
      return (
        <>
          <path d="M62 109 L72 100 L82 109" />
          <path d="M118 109 L128 100 L138 109" />
          <ellipse cx="60" cy="126" rx="10" ry="6" fill="#fff" stroke="none" opacity=".45" />
          <ellipse cx="140" cy="126" rx="10" ry="6" fill="#fff" stroke="none" opacity=".45" />
          <path d="M86 128 Q100 140 114 128" />
        </>
      );
    case 'hydrate':
      return (
        <>
          {dot(72)}
          {dot(128)}
          <circle cx="100" cy="134" r="7" />
        </>
      );
    case 'breathe':
      return (
        <>
          <path d="M62 108 Q72 99 82 108" />
          <path d="M118 108 Q128 99 138 108" />
          <path d="M90 130 Q100 137 110 130" />
        </>
      );
    case 'move':
      return (
        <>
          {dot(72)}
          <path d="M118 106 L138 106" />
          <path d="M80 124 Q100 152 120 124 Z" fill={dark} />
        </>
      );
    default:
      return (
        <>
          {dot(72)}
          {dot(128)}
          <path d="M86 128 Q100 138 114 128" />
        </>
      );
  }
}
