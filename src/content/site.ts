import type { SiteConfig } from './types';

export const site: SiteConfig = {
  // Running text says "Wello"; the wordmark (Logo.tsx) is uppercase WELLO.
  brandName: 'Wello',
  tagline: 'Collect a fresher life.',
  description:
    'A 100% reusable scent ball with activated charcoal that helps absorb odour and a natural lava stone you scent with your own fragrance. Comes in a blind box with one of five characters inside. For shoes, gym bags, lockers and wardrobes.',
  siteUrl: 'https://wellosg.vercel.app',
  // Generated on every build by scripts/brand-assets.mjs (wordmark + ball, 1200×630 PNG).
  // Set to a different file in /public to use your own, or null for none.
  ogImage: 'og-image.png',
  contactEmail: 'WellOFellow.28@gmail.com',
  instagramUrl: 'https://www.instagram.com/wello.officialsg?psln=cDRuanQ5dWtjdDhv', 
  tiktokUrl: 'https://www.tiktok.com/@wello.official.sg?is_from_webapp=1&sender_device=pc', 
  // Orders are emailed to you by api/order.ts. Set ORDER_EMAIL_TO and RESEND_API_KEY in Vercel.
  orderMode: 'email',
  orderEndpoint: '/api/order',
  paymentNote: 'Pay by PayNow on collection.', // TODO(content)
  pickupInfo: 'Pickup is arranged in person. Tell us a good MRT station or area and a time that works.', // TODO(content)
  shellMaterial: 'PETG', // what the shell is printed from; used across the page copy and JSON-LD
  testResult: null, // set { method, result, sampleSize, chart? } once you've tested properly
  showReviews: false,
  showBehindTheScenes: false,
  madeInSingapore: false,
  currency: 'S$',
};
