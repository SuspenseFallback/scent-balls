import { Logo } from '../components/Logo';
import { copy } from '../content/copy';
import { site } from '../content/site';

export function Privacy() {
  const p = copy.privacy;
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="header header--static">
        <div className="container container--narrow header__inner">
          <a href="./" className="header__home" aria-label={`${site.brandName} home`}>
            <Logo />
          </a>
          <a href="./" className="privacy__back">
            {p.back}
          </a>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="container container--narrow privacy">
        <div className="privacy__head">
          <h1>{p.title}</h1>
          <p className="lead">{p.lead}</p>
        </div>
        {p.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </section>
        ))}
        <section>
          <h2>{p.contactTitle}</h2>
          <p>
            {p.contactBody} <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
        </section>
        <p className="privacy__updated">{p.updated}</p>
      </main>
    </>
  );
}
