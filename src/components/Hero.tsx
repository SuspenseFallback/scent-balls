import { copy } from '../content/copy';
import { designs, readyDesigns } from '../content/designs';
import { Fragment, type CSSProperties } from 'react';
import { ballIcon } from '../lib/ballIcons';
import { BallArt } from './BallArt';
import { StripeBand } from './StripeBand';

export function Hero() {
  const star = readyDesigns()[0] ?? designs[0];
  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <StripeBand variant="hero" className="hero__stripes" />
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hero__badge">{copy.hero.badge}</p>
          <h1 id="hero-title" className="hero__title">
            {/* Each word rises in on load (CSS); the heading still reads as one sentence. */}
            {copy.hero.headline.split(' ').map((word, i) => (
              <Fragment key={i}>
                <span className="hero__word" style={{ '--w': i } as CSSProperties}>
                  <span>{word}</span>
                </span>{' '}
              </Fragment>
            ))}
          </h1>
          <p className="lead hero__lead">{copy.hero.subhead}</p>
          <div className="hero__actions">
            <a href="#order" className="btn btn--primary">
              {copy.hero.primaryCta}
            </a>
            <a href="#how" className="btn btn--secondary">
              {copy.hero.secondaryCta}
            </a>
          </div>
        </div>
        <div className="hero__stage">
          <div className="hero__halo" aria-hidden="true" />
          <div className="hero__drop">
          <div className="hanger" style={{ '--loop': star.photo ? 0 : (ballIcon(star.id)?.loop ?? 0) } as CSSProperties}>
            <div className="hanger__string" aria-hidden="true" />
            <BallArt design={star} loading="eager" />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
