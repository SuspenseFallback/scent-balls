import { copy, reviews } from '../content/copy';
import { site } from '../content/site';
import { PhotoSlot } from './PhotoSlot';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

/**
 * Each part renders only when its data/flag is set; the whole section is hidden when all are empty.
 * Never invent test results or reviews.
 */
export function Proof() {
  const test = site.testResult;
  const showReviews = site.showReviews && reviews.length > 0;
  const showBts = site.showBehindTheScenes;
  if (!test && !showReviews && !showBts) return null;
  const p = copy.proof;
  const max = test?.chartMax ?? Math.max(1, ...(test?.chart ?? []).map((b) => b.value));

  return (
    <section className="section section--tight-top" aria-labelledby="proof-title">
      <div className="container">
        <SectionHead id="proof-title" eyebrow={p.eyebrow} title={p.title} />
        <div className="grid-3 proof__grid">
          {test && (
            <Reveal as="article" className="card">
              <h3>{p.testTitle}</h3>
              <dl className="test-meta">
                <dt>Method</dt>
                <dd>{test.method}</dd>
                <dt>Sample size</dt>
                <dd>{test.sampleSize}</dd>
                <dt>Result</dt>
                <dd>{test.result}</dd>
              </dl>
              {test.chart && test.chart.length > 0 && (
                <div className="chart" role="list" aria-label="Test results chart">
                  {test.chart.map((b) => (
                    <div className="chart__row" role="listitem" key={b.label}>
                      <span>{b.label}</span>
                      <span className="chart__bar" aria-hidden="true">
                        <span style={{ width: `${Math.min(100, (b.value / max) * 100)}%` }} />
                      </span>
                      <span>
                        {b.value}
                        {test.chartUnit ?? ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          )}
          {showReviews &&
            reviews.slice(0, 3).map((r) => (
              <Reveal as="figure" key={r.quote} className="card review">
                <blockquote>“{r.quote}”</blockquote>
                <figcaption>
                  {r.name}
                  {r.context ? `, ${r.context}` : ''}
                </figcaption>
              </Reveal>
            ))}
          {showBts && (
            <Reveal as="figure" className="bts">
              <PhotoSlot ratio="4x3" photo={p.btsPhoto} label="photo: behind the scenes" alt={p.btsCaption} />
              <figcaption className="note">{p.btsCaption}</figcaption>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
