import { copy } from '../content/copy';
import { Reveal } from './Reveal';

/** Sustainability is a supporting message: facts only. */
export function MadeBetter() {
  const m = copy.madeBetter;
  return (
    <section className="section section--tight-top" aria-labelledby="better-title">
      <div className="container">
        <Reveal className="band">
          <h2 id="better-title" className="eyebrow eyebrow--green">
            {m.eyebrow}
          </h2>
          <ul className="band__facts">
            {m.facts.map((f) => (
              <li key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.body()}</p>
              </li>
            ))}
          </ul>
          {m.stillWorkingOn && <p className="band__note">{m.stillWorkingOn}</p>}
        </Reveal>
      </div>
    </section>
  );
}
