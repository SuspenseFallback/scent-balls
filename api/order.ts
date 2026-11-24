// Vercel serverless function: receives an order from the site and emails it to you.
// Deployed automatically by Vercel at /api/order (it doesn't run under `npm run preview`).
//
// Set these in Vercel → Project → Settings → Environment Variables, then redeploy:
//   ORDER_EMAIL_TO    where orders go, e.g. orders@yourdomain.com (comma-separate for several)
//   RESEND_API_KEY    from https://resend.com → API Keys
//   ORDER_EMAIL_FROM  optional sender, e.g. "Wello orders <orders@yourdomain.com>". Needs a domain
//                     verified in Resend. Without it, Resend's test sender is used, which can only
//                     deliver to the email address of your own Resend account.
// Explicit .js extensions: Vercel runs this as native ES modules, which need them
// (TypeScript and Vite map them back to the .ts files).
import { products } from '../src/content/products.js';
import { site } from '../src/content/site.js';
import { buildOrderText, formatPrice, subtotal, type OrderLine } from '../src/lib/orders.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const respond = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

interface Incoming {
  name?: unknown;
  email?: unknown;
  note?: unknown;
  website?: unknown; // honeypot: real visitors never fill this in
  items?: unknown;
}

/** Setup check: GET /api/order says whether the email settings are visible (never their values). */
export function GET(): Response {
  return respond(200, {
    configured: Boolean(process.env.ORDER_EMAIL_TO && process.env.RESEND_API_KEY),
    hasRecipient: Boolean(process.env.ORDER_EMAIL_TO),
    hasApiKey: Boolean(process.env.RESEND_API_KEY),
    customSender: Boolean(process.env.ORDER_EMAIL_FROM),
  });
}

export async function POST(request: Request): Promise<Response> {
  let body: Incoming;
  try {
    body = (await request.json()) as Incoming;
  } catch {
    return respond(400, { ok: false, error: 'bad-json' });
  }

  // Bots fill in the hidden field: pretend it worked and send nothing.
  if (typeof body.website === 'string' && body.website.trim()) return respond(200, { ok: true });

  const name = typeof body.name === 'string' ? oneLine(body.name).slice(0, 80) : '';
  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : '';
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 500) : '';
  if (!name) return respond(400, { ok: false, error: 'name' });
  if (!EMAIL.test(email)) return respond(400, { ok: false, error: 'email' });

  // Rebuild the order from our own product data, so prices can't be changed by the browser.
  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 20) {
    return respond(400, { ok: false, error: 'empty' });
  }
  const lines: OrderLine[] = [];
  for (const raw of body.items as Record<string, unknown>[]) {
    const product = products.find((p) => p.id === raw?.productId);
    const qty = Number(raw?.qty);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 99) return respond(400, { ok: false, error: 'item' });
    const designIds = Array.isArray(raw.designIds)
      ? raw.designIds.filter((d): d is string => typeof d === 'string' && product.designIds.includes(d as never)).slice(0, product.itemsPerPack)
      : [];
    lines.push({ product, designIds, qty });
  }

  const to = process.env.ORDER_EMAIL_TO;
  const key = process.env.RESEND_API_KEY;
  if (!to || !key) {
    console.error('Order email not configured: set ORDER_EMAIL_TO and RESEND_API_KEY in Vercel.');
    return respond(503, { ok: false, error: 'not-configured' });
  }

  // Resend's test sender (used until ORDER_EMAIL_FROM is set with a verified domain) refuses any
  // address other than your own Resend account's, and that includes reply-to. So reply-to (the
  // customer) is only added once you have your own sender; until then their email is in the text.
  const sender = process.env.ORDER_EMAIL_FROM;
  const text = `${buildOrderText(lines, { name, email, pickupNote: note })}\n\n${
    sender ? `Reply to this email to reach ${name}.` : `Reply to ${name} at ${email}.`
  }`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: sender || `${site.brandName} orders <onboarding@resend.dev>`,
      to: to.split(',').map((s) => s.trim()).filter(Boolean),
      ...(sender ? { reply_to: email } : {}),
      subject: `New order from ${name} (${formatPrice(subtotal(lines))})`,
      text,
    }),
  });
  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return respond(502, { ok: false, error: 'send-failed' });
  }
  return respond(200, { ok: true });
}
