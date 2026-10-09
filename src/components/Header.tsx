import { useEffect, useRef, useState } from 'react';
import { copy } from '../content/copy';
import { site } from '../content/site';
import { Logo } from './Logo';

export function Header() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 900 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="header" id="top">
      <div className="container header__inner">
        <a href="#top" className="header__home" aria-label={`${site.brandName} home`}>
          <Logo />
        </a>
        <nav className="header__nav" aria-label={copy.header.mainNav}>
          <ul className="header__links">
            {copy.nav.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#order" className="btn btn--primary btn--small header__cta">
          {copy.hero.primaryCta}
        </a>
        <button
          ref={burgerRef}
          type="button"
          className="header__burger"
          aria-label={copy.header.menu}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="burger" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <ul>
          {copy.nav.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={close}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#order" className="btn btn--primary btn--block" onClick={close}>
          {copy.hero.primaryCta}
        </a>
      </div>
    </header>
  );
}
