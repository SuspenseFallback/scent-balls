import { copy } from '../content/copy';
import { site } from '../content/site';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

function Cell({ v }: { v: boolean | string }) {
  if (v === true)
    return (
      <span className="tick" role="img" aria-label="Yes">
        ✓
      </span>
    );
  if (v === false)
    return (
      <span className="cross" role="img" aria-label="No">
        –
      </span>
    );
  return <span className="compare__text">{v}</span>;
}

export function WhyDifferent() {
  const d = copy.different;
  return (
    <section className="section" aria-labelledby="diff-title">
      <div className="container">
        <SectionHead id="diff-title" eyebrow={d.eyebrow} title={d.title} />
        <div className="grid-3">
          {d.usps.map((u, i) => (
            <Reveal as="article" key={u.title} className="card usp">
              <span className="usp__icon" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{u.title}</h3>
              <p className="muted">{u.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="compare">
          <div className="compare__scroll" tabIndex={0} role="region" aria-label={d.tableCaption}>
            <table>
              <caption>{d.tableCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">Feature</span>
                  </th>
                  <th scope="col">{site.brandName}</th>
                  {d.columns.map((c) => (
                    <th scope="col" key={c}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    {r.values.map((v, i) => (
                      <td key={i}>
                        <Cell v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
