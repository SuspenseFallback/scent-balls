import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { copy } from '../content/copy';
import { designs, getDesign, readyDesigns } from '../content/designs';
import { BallArt } from './BallArt';
import { SectionHead } from './SectionHead';

const HASH = /^#design=([a-z0-9-]+)$/;
const defaultId = (readyDesigns()[0] ?? designs[0]).id;

export function Crew() {
  const [id, setId] = useState<string>(defaultId);
  const groupRef = useRef<HTMLDivElement>(null);
  const cur = getDesign(id) ?? designs[0];
  const ready = cur.status === 'ready';

  // Restore a shared link like /#design=move (client only, so the prerendered HTML matches).
  useEffect(() => {
    const fromHash = () => {
      const m = location.hash.match(HASH);
      if (m && getDesign(m[1])) {
        setId(m[1]);
        const go = () => document.getElementById('crew')?.scrollIntoView();
        // Wait for load, or the browser's own fragment handling can reset the scroll.
        if (document.readyState === 'complete') go();
        else window.addEventListener('load', go, { once: true });
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const pick = (next: string, focus = false) => {
    setId(next);
    try {
      history.replaceState(null, '', `#design=${next}`);
    } catch {
      /* file:// or sandboxed */
    }
    if (focus) groupRef.current?.querySelector<HTMLButtonElement>(`[data-id="${next}"]`)?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let i = designs.findIndex((d) => d.id === cur.id);
    if (e.key in step) i = (i + step[e.key] + designs.length) % designs.length;
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = designs.length - 1;
    else return;
    e.preventDefault();
    pick(designs[i].id, true);
  };

  return (
    <section
      className="section crew"
      id="crew"
      aria-labelledby="crew-title"
      style={{ '--design': cur.color } as CSSProperties}
    >
      <div className="container">
        <SectionHead id="crew-title" eyebrow={copy.crew.eyebrow} title={copy.crew.title}>
          <p>{copy.crew.body}</p>
        </SectionHead>
        <div className="crew__grid">
          <div className="crew__stage">
            <div className="crew__ball">
              <BallArt key={cur.id} design={cur} size={360} />
            </div>
          </div>
          <div className="crew__info">
            <div
              ref={groupRef}
              role="radiogroup"
              aria-label={copy.crew.pickerLabel}
              className="swatches"
              onKeyDown={onKey}
            >
              {designs.map((d) => {
                const on = d.id === cur.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={on ? 0 : -1}
                    data-id={d.id}
                    className="swatch"
                    onClick={() => pick(d.id)}
                  >
                    <span className="swatch__dot" style={{ '--c': d.color } as CSSProperties} aria-hidden="true" />
                    <span>{d.name}</span>
                  </button>
                );
              })}
            </div>
            <div aria-live="polite" className="crew__live">
              <div className="crew__name">
                <h3 className="crew__title">{cur.name}</h3>
                <span className="chip chip--plain">{cur.theme}</span>
                {!ready && <span className="chip chip--soon">{copy.crew.comingSoon}</span>}
              </div>
              <p className="lead crew__tagline">{cur.tagline}</p>
            </div>
            <dl className="crew__who">
              <dt>{copy.crew.whoLabel}</dt>
              <dd>{cur.whoItsFor}</dd>
            </dl>
            {ready && (
              <div>
                <a href="#order" className="btn btn--primary">
                  {copy.crew.orderCta} {cur.name}
                </a>
              </div>
            )}
            <p className="crew__pouch">{copy.crew.pouch}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
