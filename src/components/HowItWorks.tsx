import { useEffect, useState } from 'react';
import { copy } from '../content/copy';
import { accentFor } from '../content/theme';
import { publicUrl } from '../lib/photos';
import { prefersReducedMotion } from '../lib/useInView';
import { AirflowDiagram, type StepId } from './AirflowDiagram';
import { PhotoSlot } from './PhotoSlot';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

export function HowItWorks() {
  const [step, setStep] = useState<StepId | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const { video } = copy.how;

  useEffect(() => setAutoPlay(!prefersReducedMotion()), []);

  return (
    <section className="section section--tint" data-accent={accentFor('how')} id="how" aria-labelledby="how-title">
      <div className="container how__grid">
        <div className="how__copy">
          <SectionHead id="how-title" eyebrow={copy.how.eyebrow} title={copy.how.title}>
            <p className="muted">Tap a step to see that part of the ball.</p>
          </SectionHead>
          <ol className="steps">
            {copy.how.steps.map((s, i) => {
              const on = step === s.id;
              return (
                <Reveal as="li" key={s.id} index={i + 1}>
                  <button type="button" className="step" aria-pressed={on} onClick={() => setStep(on ? null : s.id)}>
                    {s.id === 'refresh' ? (
                      <span className="step__num step__num--loop" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 12a8 8 0 1 1-2.3-5.7" />
                          <path d="M20 4v4.5h-4.5" />
                        </svg>
                      </span>
                    ) : (
                      <span className="step__num" aria-hidden="true">
                        {i + 1}
                      </span>
                    )}
                    <span className="step__body">
                      <span className="step__title">{s.title}</span>
                      <span className="step__text">{s.body}</span>
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </ol>
          <Reveal className="steps__loop" index={copy.how.steps.length + 1}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 14 4 9l5-5" />
              <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
            </svg>
            <span>{copy.how.loopNote}</span>
          </Reveal>
        </div>
        <div className="how__visual">
          <AirflowDiagram step={step} />
          {video.src ? (
            <div className="photo-slot ratio-16x9">
              <video
                src={publicUrl(video.src)}
                poster={video.poster ? publicUrl(video.poster) : undefined}
                aria-label={video.label}
                width={1600}
                height={900}
                muted
                loop
                playsInline
                autoPlay={autoPlay}
                controls={!autoPlay}
                preload="none"
              />
            </div>
          ) : (
            <PhotoSlot ratio="16x9" label="video: spray-and-close loop (muted, 6–10s)" alt={video.label} />
          )}
        </div>
      </div>
    </section>
  );
}
