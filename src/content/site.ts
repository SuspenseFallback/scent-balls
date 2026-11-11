import type { SiteConfig } from './types';

export const site: SiteConfig = {
  // Running text says "Wello"; the wordmark (Logo.tsx) is uppercase WELLO.
  brandName: 'Wello',
  tagline: 'Say Wello to fresh.', // TODO(content): confirm tagline
  description:
    'A small reusable ball with activated charcoal and a lava stone you scent yourself. For shoes, gym bags, school bags, lockers and wardrobes.', // TODO(content)
  siteUrl: 'https://example.com', // TODO(content): production URL, no trailing slash
  // Generated on every build by scripts/brand-assets.mjs (wordmark + ball, 1200×630 PNG).
  // Set to a different file in /public to use your own, or null for none.
  ogImage: 'og-image.png',
  contactEmail: 'hello@example.com', // TODO(content)
  whatsappNumber: '6500000000', // TODO(content): digits only, with 65 country code
  instagramUrl: 'https://instagram.com/', // TODO(content)
  tiktokUrl: 'https://tiktok.com/', // TODO(content)
  orderMode: 'whatsapp',
  paymentNote: 'Pay by PayNow on collection.', // TODO(content)
  pickupInfo: 'Pickup is arranged in person. Tell us a good MRT station or area and a time that works.', // TODO(content)
  shellMaterial: 'PETG', // what the shell is printed from; used across the page copy and JSON-LD
  testResult: null, // set { method, result, sampleSize, chart? } once you've tested properly
  showReviews: false,
  showBehindTheScenes: false,
  madeInSingapore: false,
  currency: 'S$',
};
