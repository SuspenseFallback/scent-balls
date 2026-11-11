import { copy } from '../content/copy';
import { designs, getDesign } from '../content/designs';
import { BallArt } from './BallArt';

/** Use-case band. Pauses on hover/focus; becomes a wrapped static list with reduced motion. */
export function Marquee() {
  const items = copy.useCases.items;
  const list = (hidden: boolean) => (
    <ul className="marquee__list" aria-hidden={hidden || undefined}>
      {items.map((u) => (
        <li key={u.id}>
          <BallArt design={getDesign(u.designId) ?? designs[0]} decorative className="marquee__icon" />
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
