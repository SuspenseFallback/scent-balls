import { copy } from '../content/copy';
import { designs, readyDesigns } from '../content/designs';
import { BallArt } from './BallArt';

export function Hero() {
  const star = readyDesigns()[0] ?? designs[0];
  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title">{copy.hero.headline}</h1>
          <p className="lead hero__lead">{copy.hero.subhead}</p>
          <div className="hero__actions">
            <a href="#order" className="btn btn--primary">
              {copy.hero.primaryCta}
            </a>
            <a href="#how" className="btn btn--secondary">
              {copy.hero.secondaryCta}
            </a>
          </div>
          <ul className="chips hero__chips">
            {copy.hero.chips.map((c) => (
              <li key={c} className="chip">
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="hero__stage">
          <div className="hero__halo" aria-hidden="true" />
          <div className="hanger">
            <div className="hanger__string" aria-hidden="true" />
            <BallArt design={star} size={340} loading="eager" />
          </div>
        </div>
      </div>
    </section>
  );
}
