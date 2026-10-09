export type DesignId = 'sleep' | 'shower' | 'skincare' | 'hydrate' | 'breathe' | 'move';

export interface Design {
  id: DesignId;
  name: string;
  /** Short theme word shown as a chip, e.g. "Rest" */
  theme: string;
  /** Hex colour of the print. Tint is derived automatically. */
  color: string;
  /** Plain-language description of the embossed face (used in alt text). */
  emboss: string;
  tagline: string;
  whoItsFor: string;
  status: 'ready' | 'coming-soon';
  /** Filename inside src/assets/photos, e.g. "sleep.jpg". Square images, 1200×1200 recommended. */
  photo?: string;
}

export type ProductType = 'ball' | 'pouch-set' | 'refill';

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  description: string;
  priceSGD: number;
  /** Designs this product can be ordered in. */
  designIds: DesignId[];
  /** Balls per pack (1 for a single ball, 3 for the pouch set). */
  itemsPerPack: number;
  /** Paste a Stripe Payment Link (or similar) to show "Buy now" instead of the WhatsApp builder. */
  checkoutUrl?: string;
}

export interface TestResult {
  method: string;
  result: string;
  sampleSize: number;
  /** Optional bars for the chart, e.g. [{ label: 'Day 1', value: 9 }] */
  chart?: { label: string; value: number }[];
  chartUnit?: string;
  chartMax?: number;
}

export interface Review {
  quote: string;
  /** Real first name or initials, with permission. Never invent. */
  name: string;
  context?: string;
}

export interface FaqItem {
  id: string;
  q: string;
  /** Paragraphs */
  a: string[];
  /** Optional bullet list shown after the paragraphs */
  list?: string[];
}

export interface SiteConfig {
  brandName: string;
  /**
   * 'mark-and-name': logo-mark.svg + brandName as live text (default while the name is undecided).
   * 'full-logo': use logo.svg on its own once a real logo exists.
   */
  logoStyle: 'mark-and-name' | 'full-logo';
  tagline: string;
  description: string;
  /** Absolute production URL without trailing slash, used for canonical + OG. */
  siteUrl: string;
  /** Path inside /public, e.g. "og-image.png" (1200×630 PNG/JPG). null = no image tag. */
  ogImage: string | null;
  contactEmail: string;
  /** International format, digits only, e.g. "6591234567". */
  whatsappNumber: string;
  instagramUrl: string;
  tiktokUrl: string;
  orderMode: 'whatsapp' | 'checkout-links';
  paymentNote: string;
  pickupInfo: string;
  recycledPercent: number | null;
  testResult: TestResult | null;
  showReviews: boolean;
  showBehindTheScenes: boolean;
  madeInSingapore: boolean;
  currency: 'S$';
}
