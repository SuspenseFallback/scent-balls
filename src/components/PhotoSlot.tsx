import type { Design } from '../content/types';
import { photoUrl } from '../lib/photos';
import { BallArt } from './BallArt';

interface Props {
  photo?: string;
  /** Placeholder label, e.g. "photo: ball in a sneaker" */
  label: string;
  alt: string;
  ratio: '4x3' | '16x9' | '1x1';
  /** Character shown in the placeholder until there's a real photo. */
  design?: Design;
}

const DIMS = { '4x3': [1200, 900], '16x9': [1600, 900], '1x1': [1200, 1200] } as const;

/** Fixed-ratio frame: a striped placeholder until a real photo is set, so swapping causes no layout shift. */
export function PhotoSlot({ photo, label, alt, ratio, design }: Props) {
  const src = photoUrl(photo);
  const [w, h] = DIMS[ratio];
  return (
    <div className={`photo-slot ratio-${ratio}`}>
      {src ? (
        <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" />
      ) : (
        <>
          {design && <BallArt design={design} decorative className="photo-slot__icon" />}
          <span aria-hidden="true">{label}</span>
        </>
      )}
    </div>
  );
}
