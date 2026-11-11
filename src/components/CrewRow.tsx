import { designs } from '../content/designs';
import { BallArt } from './BallArt';

/** The whole crew in a little row. Decorative: their names appear elsewhere on the page. */
export function CrewRow({ className = '' }: { className?: string }) {
  return (
    <div className={`crew-row ${className}`} aria-hidden="true">
      {designs.map((d) => (
        <BallArt key={d.id} design={d} decorative />
      ))}
    </div>
  );
}
