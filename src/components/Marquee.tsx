import type { CSSProperties } from 'react';
import { copy } from '../content/copy';
import { getDesign } from '../content/designs';

/** Use-case band. Pauses on hover/focus; becomes a wrapped static list with reduced motion. */
export function Marquee() {
  const items = copy.useCases.items;
  const list = (hidden: boolean) => (
    <ul className="marquee__list" aria-hidden={hidden || undefined}>
      {items.map((u) => (
        <li key={u.id} style={{ '--dot': getDesign(u.dot)?.color } as CSSProperties}>
          {u.label}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee" role="region" aria-label={copy.useCases.eyebrow} tabIndex={0}>
      <div className="marquee__track">
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
