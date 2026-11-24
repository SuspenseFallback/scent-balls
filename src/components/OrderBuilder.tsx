import { useRef, useState, type FormEvent } from 'react';
import { copy } from '../content/copy';
import { site } from '../content/site';
import type { Product } from '../content/types';
import {
  buildOrderText,
  builderProducts,
  checkoutProducts,
  comingSoonDesigns,
  formatPrice,
  mailtoUrl,
  orderableDesigns,
  submitOrder,
  subtotal,
  validate,
  type OrderLine,
  type ValidationError,
} from '../lib/orders';
import { BallArt } from './BallArt';
import { CrewRow } from './CrewRow';

function Stepper({ label, value, onStep }: { label: string; value: number; onStep: (delta: 1 | -1) => void }) {
  return (
    <span className="stepper" role="group" aria-label={label}>
      <button type="button" aria-label={`Remove one, ${label}`} disabled={value === 0} onClick={() => onStep(-1)}>
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" aria-label={`Add one, ${label}`} disabled={value >= MAX} onClick={() => onStep(1)}>
        +
      </button>
    </span>
  );
}

const MAX = 99;
const clamp = (n: number) => Math.max(0, Math.min(MAX, n));

const key = (productId: string, designId = '') => `${productId}:${designId}`;

export function OrderBuilder() {
  const o = copy.order;
  const built = builderProducts();
  const links = checkoutProducts();

  /** Quantities for balls (per design) and refills. */
  const [qty, setQty] = useState<Record<string, number>>({});
  /** For pouch sets: one array of design ids per pouch. */
  const [packs, setPacks] = useState<Record<string, string[][]>>({});
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<ValidationError>(null);
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // hidden anti-spam field
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const resultRef = useRef<HTMLDivElement>(null);

  const lines: OrderLine[] = [];
  for (const p of built) {
    if (p.type === 'pouch-set') {
      for (const picks of packs[p.id] ?? []) lines.push({ product: p, designIds: picks, qty: 1 });
    } else if (p.type === 'ball') {
      for (const d of orderableDesigns(p)) {
        const q = qty[key(p.id, d.id)] ?? 0;
        if (q) lines.push({ product: p, designIds: [d.id], qty: q });
      }
    } else {
      const q = qty[key(p.id)] ?? 0;
      if (q) lines.push({ product: p, designIds: [], qty: q });
    }
  }

  const details = { name, email, pickupNote: note };
  const total = subtotal(lines);

  const stepQty = (k: string, delta: number) => {
    setQty((s) => ({ ...s, [k]: clamp((s[k] ?? 0) + delta) }));
    setError(null);
  };

  const stepPacks = (p: Product, delta: number) => {
    const first = orderableDesigns(p)[0]?.id ?? '';
    setPacks((s) => {
      const cur = s[p.id] ?? [];
      const n = clamp(cur.length + delta);
      const next = cur.slice(0, n);
      while (next.length < n) next.push(Array.from({ length: p.itemsPerPack }, () => first));
      return { ...s, [p.id]: next };
    });
    setError(null);
  };

  const setPick = (pid: string, packIdx: number, slot: number, designId: string) =>
    setPacks((s) => ({
      ...s,
      [pid]: (s[pid] ?? []).map((picks, i) => (i === packIdx ? picks.map((d, j) => (j === slot ? designId : d)) : picks)),
    }));

  const check = () => {
    const err = validate(lines, details);
    setError(err);
    if (err === 'name') document.getElementById('order-name')?.focus();
    if (err === 'email') document.getElementById('order-email')?.focus();
    return !err;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending' || !check()) return;
    setStatus('sending');
    const result = await submitOrder(lines, details, website);
    setStatus(result);
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const reset = () => {
    setQty({});
    setPacks({});
    setNote('');
    setStatus('idle');
  };

  return (
    <div className="order__forms">
      {links.length > 0 && (
        <div className="card builder buy-links">
          <h3>{o.checkoutTitle}</h3>
          <ul className="buy-links__list" role="list">
            {links.map((p) => (
              <li key={p.id} className="line">
                <span className="line__label">
                  {p.name} <span className="line__price">· {formatPrice(p.priceSGD)}</span>
                </span>
                <a className="btn btn--primary btn--small" href={p.checkoutUrl} target="_blank" rel="noopener noreferrer">
                  {o.buyNow}
                  <span className="sr-only">: {p.name} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {built.length > 0 && status === 'sent' && (
        <div className="card builder builder__done" ref={resultRef} tabIndex={-1} role="status">
          <h3>{o.sentTitle}</h3>
          <p>{o.sentBody(email.trim())}</p>
          <div>
            <button type="button" className="btn btn--secondary" onClick={reset}>
              {o.another}
            </button>
          </div>
        </div>
      )}

      {built.length > 0 && status !== 'sent' && (
        <form className="card builder" onSubmit={onSubmit} noValidate aria-label="Order builder" aria-busy={status === 'sending'}>
          {built.map((p) => {
            const ready = orderableDesigns(p);
            const soon = comingSoonDesigns(p);
            const priceNote = (
              <span className="legend__price">
                {' '}
                · {formatPrice(p.priceSGD)}
                {p.type === 'ball' || p.type === 'blind-box' ? ` ${o.singleSuffix}` : ''}
              </span>
            );

            if (p.type === 'blind-box') {
              // Show "could be any of these" once, under the last blind-box product.
              const lastBlind = built.filter((b) => b.type === 'blind-box').slice(-1)[0] === p;
              return (
                <fieldset key={p.id}>
                  <legend>
                    {p.name}
                    {priceNote}
                  </legend>
                  <div className="line line--plain">
                    <span className="line__label">{p.itemsPerPack > 1 ? o.pouchesLabel : o.boxesLabel}</span>
                    <Stepper label={`${p.name} quantity`} value={qty[key(p.id)] ?? 0} onStep={(d) => stepQty(key(p.id), d)} />
                  </div>
                  {lastBlind && (
                    <div className="blindbox__odds">
                      <p className="note">{o.couldBe}</p>
                      <CrewRow />
                    </div>
                  )}
                </fieldset>
              );
            }

            if (p.type === 'pouch-set') {
              const myPacks = packs[p.id] ?? [];
              return (
                <fieldset key={p.id}>
                  <legend>
                    {p.name}
                    {priceNote}
                  </legend>
                  <div className="line line--plain">
                    <span className="line__label">{o.pouchesLabel}</span>
                    <Stepper label={`${p.name} quantity`} value={myPacks.length} onStep={(d) => stepPacks(p, d)} />
                  </div>
                  {myPacks.map((picks, i) => (
                    <div className="pack" key={i}>
                      <span className="pack__title">
                        {myPacks.length > 1 ? `${o.pouchLabel} ${i + 1}: ` : ''}
                        {o.pouchDesignsLabel}
                      </span>
                      <div className="pouch-picks">
                        {picks.map((d, j) => (
                          <label key={j}>
                            {o.ballLabel} {j + 1}
                            <select value={d} onChange={(e) => setPick(p.id, i, j, e.target.value)}>
                              {ready.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </fieldset>
              );
            }

            if (p.type === 'ball') {
              return (
                <fieldset key={p.id}>
                  <legend>
                    {p.name}
                    {priceNote}
                  </legend>
                  {ready.map((d) => (
                    <div className="line" key={d.id}>
                      <span className="line__label">
                        <BallArt design={d} decorative className="line__icon" />
                        {d.name}
                      </span>
                      <Stepper
                        label={`${d.name} quantity`}
                        value={qty[key(p.id, d.id)] ?? 0}
                        onStep={(delta) => stepQty(key(p.id, d.id), delta)}
                      />
                    </div>
                  ))}
                  {soon.length > 0 && <p className="note">{o.comingSoonNote(soon.map((d) => d.name))}</p>}
                </fieldset>
              );
            }

            return (
              <fieldset key={p.id}>
                <legend className="sr-only">{p.name}</legend>
                <div className="line">
                  <span className="line__label">
                    {p.name}
                    {priceNote}
                  </span>
                  <Stepper label={`${p.name} quantity`} value={qty[key(p.id)] ?? 0} onStep={(d) => stepQty(key(p.id), d)} />
                </div>
              </fieldset>
            );
          })}

          <div className="builder__fields">
            <div className="field">
              <label htmlFor="order-name">{o.nameLabel}</label>
              <input
                id="order-name"
                type="text"
                autoComplete="given-name"
                value={name}
                aria-invalid={error === 'name' || undefined}
                aria-describedby={error === 'name' ? 'order-error' : undefined}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="order-email">{o.emailLabel}</label>
              <input
                id="order-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                aria-invalid={error === 'email' || undefined}
                aria-describedby={error === 'email' ? 'order-error order-email-hint' : 'order-email-hint'}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
              />
              <span className="field__hint" id="order-email-hint">
                {o.emailHint}
              </span>
            </div>
            {/* Anti-spam: hidden from people, but bots tend to fill it in. */}
            <div className="hp" aria-hidden="true">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>
            <div className="field">
              <label htmlFor="order-note">
                {o.noteLabel} <span className="field__opt">{o.optional}</span>
              </label>
              <textarea id="order-note" value={note} placeholder={o.notePlaceholder} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>

          <div className="summary">
            <div className="summary__total">
              <span>{o.subtotal}</span>
              <span aria-live="polite">{formatPrice(total)}</span>
            </div>
            <p className="note">{site.paymentNote}</p>
            <div role="alert" className="form-error" id="order-error">
              {error ? o.errors[error] : ''}
            </div>
            <div className="summary__actions">
              <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                {status === 'sending' ? o.sending : o.send}
              </button>
            </div>
            {status === 'failed' && (
              <div className="builder__failed" ref={resultRef} tabIndex={-1} role="alert">
                <p>
                  <strong>{o.failedTitle}</strong> {o.failedBody}
                </p>
                <a className="btn btn--secondary btn--small" href={mailtoUrl(buildOrderText(lines, details))}>
                  {o.emailInstead}
                </a>
                <div className="field">
                  <label htmlFor="order-text">{o.orderTextLabel}</label>
                  <textarea id="order-text" readOnly value={buildOrderText(lines, details)} rows={8} onFocus={(e) => e.currentTarget.select()} />
                </div>
              </div>
            )}
            <p className="note note--xs">
              {o.storesNothing} <a href="privacy.html">Privacy</a>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
