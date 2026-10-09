import type { Design, Product } from '../content/types';
import { site } from '../content/site';
import { getDesign } from '../content/designs';
import { products } from '../content/products';

/**
 * ALL order submission logic lives here. To add payments later, either paste
 * checkoutUrl values into products.ts, or replace submitOrder() with a
 * Shopify / Stripe Checkout integration. Components only call these exports.
 */

export interface OrderLine {
  product: Product;
  /** For balls: one design. For pouch sets: the designs inside each pouch. */
  designIds: string[];
  qty: number;
}

export interface OrderDetails {
  name: string;
  pickupNote: string;
}

export const formatPrice = (n: number) => `${site.currency}${n.toFixed(2)}`;

export const hasCheckout = (p: Product): p is Product & { checkoutUrl: string } => Boolean(p.checkoutUrl);

export const lineTotal = (l: OrderLine) => l.product.priceSGD * l.qty;

export const subtotal = (lines: OrderLine[]) => lines.reduce((sum, l) => sum + lineTotal(l), 0);

const designNames = (ids: string[]) => ids.map((id) => getDesign(id)?.name ?? id).join(', ');

/** Products ordered through the WhatsApp builder (none in 'checkout-links' mode). */
export const builderProducts = () =>
  site.orderMode === 'whatsapp' ? products.filter((p) => !hasCheckout(p)) : [];

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
    details.pickupNote.trim() ? `Pickup: ${details.pickupNote.trim()}` : null,
    '',
    site.paymentNote,
  ]
    .filter((x): x is string => x !== null)
    .join('\n');
}

export const whatsappUrl = (text: string) =>
  `https://wa.me/${site.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

export type ValidationError = 'empty' | 'name' | null;

export function validate(lines: OrderLine[], details: OrderDetails): ValidationError {
  if (!lines.some((l) => l.qty > 0)) return 'empty';
  if (!details.name.trim()) return 'name';
  return null;
}

/** Opens WhatsApp with the order prefilled. Nothing is stored or sent elsewhere. */
export function submitOrder(lines: OrderLine[], details: OrderDetails): void {
  const url = whatsappUrl(buildOrderText(lines, details));
  // ('noopener' in the features string makes window.open return null, so detach the opener manually.)
  const win = window.open(url, '_blank');
  if (win) win.opener = null;
  // Pop-up blocked (some in-app browsers): go there directly instead.
  else window.location.href = url;
}

export async function copyOrderText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}
