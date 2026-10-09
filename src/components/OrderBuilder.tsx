import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { copy } from '../content/copy';
import { site } from '../content/site';
import type { Product } from '../content/types';
import {
  buildOrderText,
  builderProducts,
  checkoutProducts,
  comingSoonDesigns,
  copyOrderText,
  formatPrice,
  orderableDesigns,
  submitOrder,
  subtotal,
  validate,
  type OrderLine,
  type ValidationError,
} from '../lib/orders';

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
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

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

  const details = { name, pickupNote: note };
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
    return !err;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (check()) submitOrder(lines, details);
  };

  const onCopy = async () => {
    if (!check()) return;
    const ok = await copyOrderText(buildOrderText(lines, details));
    setCopyState(ok ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    if (ok) timer.current = window.setTimeout(() => setCopyState('idle'), 2500);
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

      {built.length > 0 && (
        <form className="card builder" onSubmit={onSubmit} noValidate aria-label="Order builder">
          {built.map((p) => {
            const ready = orderableDesigns(p);
            const soon = comingSoonDesigns(p);
            const priceNote = (
              <span className="legend__price">
                {' '}
                · {formatPrice(p.priceSGD)}
                {p.type === 'ball' ? ` ${o.singleSuffix}` : ''}
              </span>
            );

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
                        <span className="line__dot" style={{ '--c': d.color } as CSSProperties} aria-hidden="true" />
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
              <button type="submit" className="btn btn--primary">
                {o.send}
              </button>
              <button type="button" className="btn btn--secondary" onClick={onCopy}>
                {copyState === 'copied' ? o.copied : o.copy}
              </button>
            </div>
            <span className="sr-only" aria-live="polite">
              {copyState === 'copied' ? o.copied : ''}
            </span>
            {copyState === 'failed' && (
              <div className="field">
                <label htmlFor="order-text">{o.copyFailed}</label>
                <textarea id="order-text" readOnly value={buildOrderText(lines, details)} rows={8} onFocus={(e) => e.currentTarget.select()} />
              </div>
            )}
            <p className="note note--xs">{o.storesNothing}</p>
          </div>
        </form>
      )}
    </div>
  );
}
