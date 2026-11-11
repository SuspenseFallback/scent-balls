import type { DesignId, Review, WeatherIconName } from './types';

export const safetyLines = [
  'Not a toy. Keep away from young children and pets.',
  "Don't spray fragrance onto skin, eyes or food with the ball.",
  'Spray away from flame and let the stone dry before closing.',
  'Keep out of hot cars and direct sun.',
];

export const copy = {
  nav: [
    { href: '#how', label: 'How it works' },
    { href: '#crew', label: 'The crew' },
    { href: '#faq', label: 'FAQ' },
    { href: '#order', label: 'Order' },
  ],
  hero: {
    // Shown uppercase in Anton. Keep it short: long display headlines get hard to read.
    headlineOptions: ['Say Wello to freshness.', 'Say Wello to a fresher gym bag.', 'Meet the crew that keeps things fresh.'],
    headline: 'Say Wello to freshness.', // TODO(content): pick final headline (one of headlineOptions, or your own)
    subhead:
      'A reusable scent ball with activated charcoal that helps absorb odour and a natural lava stone that diffuses your scent. Customise it with your own cologne or perfume, then simply drop it in your shoes, gym bag or locker!',
    // Small line above the headline.
    badge: 'Blind box · 5 characters to collect',
    primaryCta: 'Reserve a blind box',
    secondaryCta: 'See how it works',
  },
  problem: {
    eyebrow: 'The sticky truth',
    title: 'Singapore weather follows you everywhere.',
    cards: [
      { icon: 'temperature', title: 'Unbearable heat', body: 'You deal with thirty-five degree weather all day long. So does your bag.' },
      { icon: 'sun', title: 'Sweltering sun', body: 'Your gym bag soaks up every sweaty session.' },
      { icon: 'humidity', title: 'Heavy humidity', body: "High humidity levels can make your belongings feel sticky and uncomfortable." },
    ] as { icon: WeatherIconName; title: string; body: string }[],
  },
  how: {
    eyebrow: 'The secret behind the magic',
    title: 'Spray. Close. Repeat.',
    steps: [
      {
        id: 'spray' as const,
        title: 'Spray the stone',
        body: 'Unscrew the ball, take out the lava stone and give it 1–2 sprays of your favourite cologne or deodorant. Let it dry for a minute.',
      },
      {
        id: 'close' as const,
        title: 'Close it up',
        body: 'Pop the stone back in and twist the halves together. A built-in divider keeps the stone and the charcoal apart.',
      },
      {
        id: 'place' as const,
        title: 'Drop it in or hang it',
        body: 'Shoes, bags, lockers, wardrobes, or hang it by its loop. It’s designed for airflow: air comes in the side holes, past the charcoal and your scented stone, and out the top.',
      },
      {
        id: 'refresh' as const,
        title: 'Fading? Spray again',
        body: 'When the scent starts to fade, give the stone a fresh spritz and it’s back to full strength. Same scent or a new one: it’s up to you.',
      },
    ],
    loopNote: 'Then back to step 1. One ball, refreshed as often as you like.',
    diagramCaption: 'Illustrative diagram',
    video: {
      src: null as string | null, // TODO(content): e.g. a 6–10s muted MP4 in /public, 'spray-close.mp4'
      poster: null as string | null,
      label: 'Short loop: spray the stone, close the ball',
    },
  },
  different: {
    eyebrow: 'Why it’s different',
    title: 'Keep the ball. Change the scent whenever.',
    usps: [
      { title: 'Refreshable', body: 'When the scent fades, a quick spritz brings it right back. One ball, again and again, and no more sachets in the bin.' },
      {
        title: 'Activated carbon + signature scent',
        body: 'Activated charcoal helps absorb odour, while natural lava stone carries the fragrance you already love.',
      },
      { title: 'A surprise in every box', body: 'Every Wello comes in a blind box. Five characters to collect, doubles to swap with friends, and an ultra rare to hunt for.' },
    ],
    tableCaption: 'How it compares',
    columns: ['Disposable sachets', 'Room sprays'],
    rows: [
      { label: 'Your signature scent', values: [true, false, false] },
      { label: 'Built to be reused', values: [true, false, false] },
      { label: 'Refillable charcoal and stone', values: [true, false, false] },
      { label: 'Pocket-sized for shoes and bags', values: [true, true, false] },
      { label: 'Charcoal to help absorb odour', values: [true, 'Some', false] },
    ] as { label: string; values: (boolean | string)[] }[],
  },
  crew: {
    eyebrow: 'Meet the crew',
    title: 'Which one will you get?',
    body: 'Every Wello comes in a blind box with one of five characters inside, picked at random. Collect them all, swap your doubles, and if you’re lucky, find the ultra rare one.',
    pouch: 'Getting one for someone? A blind box makes the gift a surprise for both of you.',
    pickerLabel: 'Choose a design',
    whoLabel: 'Who it’s for',
    comingSoon: 'Coming soon',
    orderCta: 'Reserve a blind box',
  },
  useCases: {
    eyebrow: 'Where it goes',
    title: 'Small enough for anywhere that gets stuffy.',
    // TODO(content): add photos. photo = filename in src/assets/photos (4:3 works best); slot is the placeholder label until then.
    items: [
      { id: 'shoes', slot: 'ball in a sneaker', designId: 'snoozie', label: 'Shoes', body: 'One in each pair overnight.', photo: undefined },
      { id: 'gym', slot: 'gym bag side pocket', designId: 'mr-move', label: 'Gym bag', body: 'Lives in the side pocket.', photo: undefined },
      { id: 'school', slot: 'school bag', designId: 'clem', label: 'School bag', body: 'Next to the PE kit.', photo: undefined },
      { id: 'locker', slot: 'locker shelf', designId: 'bubbles', label: 'Locker', body: 'Sits in the corner, quietly.', photo: undefined },
      { id: 'wardrobe', slot: 'hanging in wardrobe', designId: 'solace', label: 'Wardrobe', body: 'Hang it from the rail.', photo: undefined },
      { id: 'hang', slot: 'hanging from bag zip', designId: 'snoozie', label: 'Hang it on your bag', body: 'Loop it onto a zip or strap.', photo: undefined },
    ] as { id: string; slot: string; designId: DesignId; label: string; body: string; photo?: string }[],
  },
  madeBetter: {
    eyebrow: 'Made to last',
    facts: [
      { title: 'Natural volcanic stone', body: () => 'Every ball carries a piece of natural lava stone, porous enough to soak up your fragrance.' },
      { title: 'Refillable by design', body: () => 'Fresh charcoal and stone slot right in, so the ball you love keeps going.' },
    ],
    stillWorkingOn: null as string | null, // e.g. 'Plastic-free packaging for refills.'
  },
  proof: {
    eyebrow: 'Proof',
    title: 'What we’ve tested',
    testTitle: 'Our test',
    reviewsTitle: 'From people who’ve used it',
    btsTitle: 'Behind the scenes',
    btsPhoto: undefined as string | undefined,
    btsCaption: 'Printing a batch.', // TODO(content)
  },
  faq: { eyebrow: 'FAQ', title: 'Questions, answered.' },
  order: {
    eyebrow: 'Order',
    title: 'Reserve a blind box',
    body: 'Be first in line for our first batch. Each box holds one of five characters, picked at random. Choose how many you’d like, send your order on WhatsApp, and we’ll arrange pickup with you.',
    boxesLabel: 'Boxes',
    couldBe: 'Could be any of these, or the ultra rare one:',
    nameLabel: 'Your name',
    noteLabel: 'Pickup note',
    notePlaceholder: 'e.g. Weekday evenings near Bishan MRT',
    subtotal: 'Subtotal',
    send: 'Send order on WhatsApp',
    copy: 'Copy order text',
    copied: 'Copied',
    buyNow: 'Buy now',
    pouchDesignsLabel: 'Designs in each pouch',
    storesNothing: 'This site doesn’t store your details. Your order is only sent when you tap send.',
    followUs: 'Follow the crew',
    pickupLabel: 'Pickup',
    paymentLabel: 'Payment',
    singleSuffix: 'each',
    pouchesLabel: 'Pouches',
    pouchLabel: 'Pouch',
    ballLabel: 'Ball',
    comingSoonNote: (names: string[]) => (names.length ? `${names.join(', ').replace(/, ([^,]*)$/, ' and $1')} ${names.length === 1 ? 'is' : 'are'} coming soon.` : ''),
    optional: '(optional)',
    errors: {
      empty: 'Add at least one blind box to your order.',
      name: 'Add your name so we know who it’s for.',
    },
    copyFailed: 'Couldn’t copy. Select the text below instead.',
    checkoutTitle: 'Buy online',
  },
  footer: {
    privacy: 'Privacy',
    contact: 'Contact',
    safetyTitle: 'Safety',
    signOff: 'Say Wello',
    signOffBody: 'Questions, custom orders or just saying hi? Find us here.',
    // Only shown when site.madeInSingapore is true.
    madeIn: 'Designed in Singapore',
  },
  header: { menu: 'Menu', mainNav: 'Main' },
  stickyCta: 'Reserve a blind box',
  privacy: {
    back: '← Back to site',
    title: 'Privacy',
    lead: 'Short version: nothing you type here is sent to us or saved, and we only measure visits in aggregate.',
    sections: [
      {
        title: 'What this site stores',
        body: 'No accounts and no tracking pixels. The order form runs in your browser, and nothing you type is sent to us or saved.',
      },
      {
        title: 'Visit statistics',
        body: 'We use Vercel Web Analytics to see how many people visit and which pages they view. For each visit it records the page address, the referring site, your approximate location, and your device and browser type. It uses no third-party cookies. It recognises a visit using a hash of the request, and that visitor session is discarded after 24 hours. We only look at the totals, and your order details are never included.',
      },
      {
        title: 'How orders work',
        body: 'When you tap “Send order on WhatsApp”, WhatsApp opens with your order text filled in. Your name and pickup note only reach us if you choose to send that message. From then on, WhatsApp’s own privacy policy applies to the chat.',
      },
      {
        title: 'What we do with your message',
        body: 'We use your name and pickup note only to arrange your order and collection. We don’t share them, and we don’t add you to any mailing list. If you’d like us to delete our chat history with you, just ask.',
      },
      {
        title: 'Hosting',
        body: 'This site is a set of static files on a web host. Like any web server, the host may keep standard technical logs, such as IP addresses, for security. We don’t use those logs to identify you.',
      },
    ],
    contactTitle: 'Contact',
    contactBody: 'Questions about your data under Singapore’s PDPA? Email',
    updated: 'Last updated November 2026', // TODO(content): update when this page changes
  },
};

// Real reviews only, shown when site.showReviews is true. Never invent names or quotes.
export const reviews: Review[] = [];
