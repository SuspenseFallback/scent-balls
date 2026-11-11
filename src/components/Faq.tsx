import { copy } from '../content/copy';
import { faq } from '../content/faq';
import { accentFor } from '../content/theme';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

export function Faq() {
  return (
    <section className="section section--tint" data-accent={accentFor('faq')} id="faq" aria-labelledby="faq-title">
      <div className="container">
        <SectionHead id="faq-title" eyebrow={copy.faq.eyebrow} title={copy.faq.title} center />
        <div className="faq">
          {faq.map((f, i) => (
            <Reveal key={f.id} index={i + 1}>
            <details id={`faq-${f.id}`}>
              <summary>{f.q}</summary>
              <div className="faq__answer">
                {f.a.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {f.list && (
                  <ul>
                    {f.list.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
