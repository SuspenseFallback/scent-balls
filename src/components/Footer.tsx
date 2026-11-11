import { copy, safetyLines } from '../content/copy';
import { site } from '../content/site';
import { CrewRow } from './CrewRow';
import { Logo } from './Logo';
import { StripeBand } from './StripeBand';
import { WelloBall } from './WelloBall';

export function Footer({ home = '#top', privacy = 'privacy.html' }: { home?: string; privacy?: string }) {
  const f = copy.footer;
  const wa = `https://wa.me/${site.whatsappNumber.replace(/\D/g, '')}`;
  return (
    <footer className="footer">
      <StripeBand variant="thin" className="footer__stripe" />
      <div className="container footer__grid">
        <div className="footer__brand">
          <a href={home} className="header__home">
            <Logo variant="ink" />
          </a>
          <div className="footer__signoff">
            <p className="footer__hello">
              <WelloBall size={30} animate className="footer__ball" />
              {f.signOff}
            </p>
            <p className="footer__small">{f.signOffBody}</p>
          </div>
          <CrewRow />
          <ul className="footer__links">
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
              <a href={wa} rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </li>
          </ul>
        </div>
        <div className="footer__safety-wrap">
          <h2 className="footer__title">{f.safetyTitle}</h2>
          <ul className="footer__safety">
            {safetyLines.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="footer__small footer__legal">
            <a href={privacy}>{f.privacy}</a>
            <span aria-hidden="true"> · </span>© {new Date().getFullYear()} {site.brandName}
            {site.madeInSingapore ? ` · ${f.madeIn}` : ''}
          </p>
        </div>
      </div>
    </footer>
  );
}
