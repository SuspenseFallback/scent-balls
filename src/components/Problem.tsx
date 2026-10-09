import type { CSSProperties } from 'react';
import { copy } from '../content/copy';
import { getDesign } from '../content/designs';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

export function Problem() {
  return (
    <section className="section" aria-labelledby="problem-title">
      <div className="container">
        <SectionHead id="problem-title" eyebrow={copy.problem.eyebrow} title={copy.problem.title} />
        <div className="grid-3">
          {copy.problem.cards.map((p, i) => (
            <Reveal
              as="article"
              key={p.title}
              className="card problem-card"
            >
              <div className="problem-card__top">
                <span
                  className="problem-card__icon"
                  aria-hidden="true"
                  style={{ '--c': getDesign(p.designId)?.color } as CSSProperties}
                />
                <span className="problem-card__num">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3>{p.title}</h3>
              <p className="muted">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
