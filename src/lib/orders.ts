import type { Design, Product } from '../content/types';
import { site } from '../content/site';
import { getDesign } from '../content/designs';
import { products } from '../content/products';

/**
 * ALL order submission logic lives here. Orders are POSTed to site.orderEndpoint
 * (the Vercel function in api/order.ts), which emails them to you. To add payments later,
 * paste checkoutUrl values into products.ts, or replace submitOrder() with a Shopify /
 * Stripe Checkout integration. Components only call these exports.
 */

export interface OrderLine {
  product: Product;
  /** For balls: one design. For pouch sets: the designs inside each pouch. */
  designIds: string[];
  qty: number;
}

export interface OrderDetails {
  name: string;
  email: string;
  pickupNote: string;
}

export const formatPrice = (n: number) => `${site.currency}${n.toFixed(2)}`;

export const hasCheckout = (p: Product): p is Product & { checkoutUrl: string } => Boolean(p.checkoutUrl);

export const lineTotal = (l: OrderLine) => l.product.priceSGD * l.qty;

export const subtotal = (lines: OrderLine[]) => lines.reduce((sum, l) => sum + lineTotal(l), 0);

const designNames = (ids: string[]) => ids.map((id) => getDesign(id)?.name ?? id).join(', ');

/** Products ordered through the order form (none in 'checkout-links' mode). */
export const builderProducts = () =>
  site.orderMode === 'email' ? products.filter((p) => !hasCheckout(p)) : [];

/** Products with a checkoutUrl get a "Buy now" link instead of the builder. */
export const checkoutProducts = () => products.filter(hasCheckout);

/** Designs of a product that can be ordered now (status 'ready'). */
export const orderableDesigns = (p: Product): Design[] =>
  p.designIds.map((id) => getDesign(id)).filter((d): d is Design => d?.status === 'ready');

export const comingSoonDesigns = (p: Product): Design[] =>
  p.designIds.map((id) => getDesign(id)).filter((d): d is Design => d?.status === 'coming-soon');

export function buildOrderText(lines: OrderLine[], details: OrderDetails): string {
  const items = lines
    .filter((l) => l.qty > 0)
    .map((l) => {
      const designs = l.designIds.length ? ` (${designNames(l.designIds)})` : '';
      return `• ${l.qty} × ${l.product.name}${designs} – ${formatPrice(lineTotal(l))}`;
    });
  return [
    `Hi ${site.brandName}! I'd like to reserve:`,
    ...items,
    '',
    `Subtotal: ${formatPrice(subtotal(lines))}`,
    `Name: ${details.name.trim()}`,
    `Email: ${details.email.trim()}`,
    details.pickupNote.trim() ? `Pickup: ${details.pickupNote.trim()}` : null,
    '',
    site.paymentNote,
  ]
    .filter((x): x is string => x !== null)
    .join('\n');
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidationError = 'empty' | 'name' | 'email' | null;

export function validate(lines: OrderLine[], details: OrderDetails): ValidationError {
  if (!lines.some((l) => l.qty > 0)) return 'empty';
  if (!details.name.trim()) return 'name';
  if (!EMAIL.test(details.email.trim())) return 'email';
  return null;
}

/**
 * Sends the order to site.orderEndpoint, which emails it to you.
 * `website` is the hidden anti-spam field; real visitors leave it empty.
 */
export async function submitOrder(lines: OrderLine[], details: OrderDetails, website = ''): Promise<'sent' | 'failed'> {
  try {
    const res = await fetch(site.orderEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: details.name.trim(),
        email: details.email.trim(),
        note: details.pickupNote.trim(),
        website,
        items: lines.filter((l) => l.qty > 0).map((l) => ({ productId: l.product.id, qty: l.qty, designIds: l.designIds })),
      }),
    });
    return res.ok ? 'sent' : 'failed';
  } catch {
    return 'failed';
  }
}

/** Fallback if sending fails: opens the visitor's own email app with the order filled in. */
export const mailtoUrl = (text: string) =>
  `mailto:${site.contactEmail}?subject=${encodeURIComponent(`Order for ${site.brandName}`)}&body=${encodeURIComponent(text)}`;
