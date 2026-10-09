import { useEffect, useState } from 'react';
import { copy } from '../content/copy';
import { publicUrl } from '../lib/photos';
import { prefersReducedMotion } from '../lib/useInView';
import { AirflowDiagram, type StepId } from './AirflowDiagram';
import { PhotoSlot } from './PhotoSlot';
import { SectionHead } from './SectionHead';

export function HowItWorks() {
  const [step, setStep] = useState<StepId | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const { video } = copy.how;

  useEffect(() => setAutoPlay(!prefersReducedMotion()), []);

  return (
    <section className="section section--white" id="how" aria-labelledby="how-title">
      <div className="container how__grid">
        <div className="how__copy">
          <SectionHead id="how-title" eyebrow={copy.how.eyebrow} title={copy.how.title}>
            <p className="muted">Tap a step to see that part of the ball.</p>
          </SectionHead>
          <ol className="steps">
            {copy.how.steps.map((s, i) => {
              const on = step === s.id;
              return (
                <li key={s.id}>
                  <button type="button" className="step" aria-pressed={on} onClick={() => setStep(on ? null : s.id)}>
                    <span className="step__num" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="step__body">
                      <span className="step__title">{s.title}</span>
                      <span className="step__text">{s.body}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
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
