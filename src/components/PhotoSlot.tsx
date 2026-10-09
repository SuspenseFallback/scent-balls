import { photoUrl } from '../lib/photos';

interface Props {
  photo?: string;
  /** Placeholder label, e.g. "photo: ball in a sneaker" */
  label: string;
  alt: string;
  ratio: '4x3' | '16x9' | '1x1';
}

const DIMS = { '4x3': [1200, 900], '16x9': [1600, 900], '1x1': [1200, 1200] } as const;

/** Fixed-ratio frame: a striped placeholder until a real photo is set, so swapping causes no layout shift. */
export function PhotoSlot({ photo, label, alt, ratio }: Props) {
  const src = photoUrl(photo);
  const [w, h] = DIMS[ratio];
  return (
    <div className={`photo-slot ratio-${ratio}`}>
      {src ? (
        <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" />
      ) : (
        <span aria-hidden="true">{label}</span>
      )}
    </div>
  );
}
