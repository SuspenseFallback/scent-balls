import { copy, safetyLines } from '../content/copy';
import { site } from '../content/site';
import { Logo } from './Logo';

export function Footer({ home = '#top', privacy = 'privacy.html' }: { home?: string; privacy?: string }) {
  const f = copy.footer;
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <a href={home} className="header__home" aria-label={`${site.brandName} home`}>
            <Logo />
          </a>
          <ul className="footer__links">
            <li>
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </li>
            <li>
              <a href={site.instagramUrl} rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href={site.tiktokUrl} rel="noopener noreferrer">
                TikTok
              </a>
            </li>
            <li>
              <a href={privacy}>{f.privacy}</a>
            </li>
          </ul>
          <p className="footer__small">
            © {new Date().getFullYear()} {site.brandName}
            {site.madeInSingapore ? ` · ${f.madeIn}` : ''}
          </p>
        </div>
        <div className="footer__safety-wrap">
          <h2 className="footer__title">{f.safetyTitle}</h2>
          <ul className="footer__safety">
            {safetyLines.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
