import type { SiteConfig } from './types';

export const site: SiteConfig = {
  brandName: 'Fumi', // TODO(content): final brand name
  logoStyle: 'mark-and-name',
  tagline: 'The reusable scent ball for shoes, bags and lockers', // TODO(content)
  description:
    'A small reusable ball with activated charcoal and a lava stone you scent yourself. For shoes, gym bags, school bags, lockers and wardrobes.', // TODO(content)
  siteUrl: 'https://example.com', // TODO(content): production URL, no trailing slash
  ogImage: null, // TODO(content): add public/og-image.png (1200×630) and set 'og-image.png'
  contactEmail: 'hello@example.com', // TODO(content)
  whatsappNumber: '6500000000', // TODO(content): digits only, with 65 country code
  instagramUrl: 'https://instagram.com/', // TODO(content)
  tiktokUrl: 'https://tiktok.com/', // TODO(content)
  orderMode: 'whatsapp',
  paymentNote: 'Pay by PayNow on collection.', // TODO(content)
  pickupInfo: 'Pickup is arranged in person. Tell us a good MRT station or area and a time that works.', // TODO(content)
  recycledPercent: null, // set e.g. 100 once confirmed with the filament supplier
  testResult: null, // set { method, result, sampleSize, chart? } once you've tested properly
  showReviews: false,
  showBehindTheScenes: false,
  madeInSingapore: false,
  currency: 'S$',
};
