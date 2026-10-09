import { useEffect, useState } from 'react';
import { copy } from '../content/copy';

/** Mobile only (hidden ≥768px in CSS). Shows once the hero has scrolled away, hides over the order section. */
export function StickyBar() {
  const [pastHero, setPastHero] = useState(false);
  const [atOrder, setAtOrder] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    const order = document.getElementById('order');
    if (!hero || !order || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0);
        if (e.target === order) setAtOrder(e.isIntersecting || e.boundingClientRect.top < 0);
      }
    });
    io.observe(hero);
    io.observe(order);
    return () => io.disconnect();
  }, []);

  const visible = pastHero && !atOrder;
  return (
    <div className="sticky-bar" data-visible={visible} aria-hidden={!visible}>
      <a href="#order" className="btn btn--primary btn--block" tabIndex={visible ? 0 : -1}>
        {copy.stickyCta}
      </a>
    </div>
  );
}
