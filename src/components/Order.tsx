import { copy } from '../content/copy';
import { site } from '../content/site';
import { OrderBuilder } from './OrderBuilder';

export function Order() {
  const o = copy.order;
  return (
    <section className="section" id="order" aria-labelledby="order-title">
      <div className="container order__grid">
        <div className="order__side">
          <span className="eyebrow">{o.eyebrow}</span>
          <h2 id="order-title">{o.title}</h2>
          <p className="lead">{o.body}</p>
          <dl className="order__info">
            <div>
              <dt>{o.pickupLabel}</dt>
              <dd>{site.pickupInfo}</dd>
            </div>
            <div>
              <dt>{o.paymentLabel}</dt>
              <dd>{site.paymentNote}</dd>
            </div>
          </dl>
          <div className="order__follow">
            <span className="order__follow-title">{o.followUs}</span>
            <div className="socials">
              <a className="btn btn--secondary btn--small" href={site.instagramUrl} rel="noopener noreferrer">
                Instagram
              </a>
              <a className="btn btn--secondary btn--small" href={site.tiktokUrl} rel="noopener noreferrer">
                TikTok
              </a>
            </div>
          </div>
        </div>
        <OrderBuilder />
      </div>
    </section>
  );
}
