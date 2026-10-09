import { copy } from '../content/copy';
import { faq } from '../content/faq';
import { SectionHead } from './SectionHead';

export function Faq() {
  return (
    <section className="section section--white" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <SectionHead id="faq-title" eyebrow={copy.faq.eyebrow} title={copy.faq.title} center />
        <div className="faq">
          {faq.map((f) => (
            <details key={f.id} id={`faq-${f.id}`}>
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
          ))}
        </div>
      </div>
    </section>
  );
}
