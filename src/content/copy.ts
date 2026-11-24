import type { DesignId, Review, WeatherIconName } from './types';

export const safetyLines = [
  'Not a toy. Keep away from young children and pets.',
  "Don't spray fragrance onto skin, eyes or food with the ball.",
  'Spray away from flame and let the stone dry before closing.',
  'Keep the ball out of hot cars and direct sun (only the charcoal sachet goes in the sun, to recharge).',
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
    headline: 'Say Wello to freshness.',
    subhead:
      'A 100% reusable scent ball with activated charcoal that helps absorb odour and a natural lava stone that diffuses your scent. Customise it with your own cologne or perfume, then simply drop it in your shoes, gym bag or locker!',
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
        body: 'Pop the stone back in and twist the halves together. A removable divider keeps the stone and the charcoal apart.',
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
    care: {
      title: 'Every few months: recharge the charcoal',
      body: 'The divider lifts out. Take out the charcoal sachet and leave it in the sun to dry, and it’s recharged and ready to go again. Just the sachet: keep the ball itself out of direct sun.',
    },
    diagramCaption: 'Illustrative diagram',
    video: {
      src: null as string | null, // optional: a 6–10s muted MP4 in /public, e.g. 'spray-close.mp4'. Hidden while null.
      poster: null as string | null,
      label: 'Short loop: spray the stone, close the ball',
    },
  },
  different: {
    eyebrow: 'Why it’s different',
    title: 'Keep the ball. Change the scent whenever.',
    usps: [
      { title: '100% reusable', body: 'Respray the stone when the scent fades, and recharge the charcoal in the sun every few months. No disposable parts, and no more sachets in the bin.' },
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
      { label: '100% reusable', values: [true, false, false] },
      { label: 'Charcoal you recharge in the sun', values: [true, false, false] },
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
    // photo = filename in src/assets/photos (4:3). These are built by scripts/use-case-photos.mjs
    // (free Unsplash photos + the character icons); replace with your own photos any time.
    items: [
      { id: 'shoes', slot: 'ball in a sneaker', designId: 'snoozie', label: 'Shoes', body: 'One in each pair overnight.', photo: 'shoes.webp', alt: 'Snoozie scent ball tucked into a red canvas sneaker' },
      { id: 'gym', slot: 'gym bag side pocket', designId: 'mr-move', label: 'Gym bag', body: 'Lives in the side pocket.', photo: 'gym.webp', alt: 'Mr. Move scent ball sitting on a canvas duffel bag' },
      { id: 'school', slot: 'school bag', designId: 'clem', label: 'School bag', body: 'Next to the PE kit.', photo: 'school.webp', alt: 'Clem scent ball peeking out of a backpack pocket next to some pencils' },
      { id: 'locker', slot: 'locker shelf', designId: 'bubbles', label: 'Locker', body: 'Sits in the corner, quietly.', photo: 'locker.webp', alt: 'Bubbles scent ball hanging from a locker handle' },
      { id: 'wardrobe', slot: 'hanging in wardrobe', designId: 'solace', label: 'Wardrobe', body: 'Hang it from the rail.', photo: 'wardrobe.webp', alt: 'Solace scent ball hanging from a clothes rail' },
      { id: 'hang', slot: 'hanging from bag zip', designId: 'snoozie', label: 'Hang it on your bag', body: 'Loop it onto a zip or strap.', photo: 'hang.webp', alt: 'Snoozie scent ball hanging from a backpack zip' },
    ] as { id: string; slot: string; designId: DesignId; label: string; body: string; photo?: string; alt?: string }[],
  },
  madeBetter: {
    eyebrow: 'Made to last',
    facts: [
      { title: '100% reusable', body: () => 'The ball, the stone and the charcoal are all made to be used again and again. No disposable parts.' },
      { title: 'Recharged by the sun', body: () => 'Every few months, set the charcoal sachet out in the sun to dry. That recharges it, so there’s nothing to buy again.' },
      { title: 'Natural volcanic stone', body: () => 'Every ball carries a piece of natural lava stone, porous enough to soak up your fragrance spray after spray.' },
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
    btsCaption: 'Printing a batch.', // only shown if site.showBehindTheScenes is turned on
  },
  faq: { eyebrow: 'FAQ', title: 'Questions, answered.' },
  order: {
    eyebrow: 'Order',
    title: 'Reserve a blind box',
    body: 'Be first in line for our first batch. Every ball is one of five characters, picked at random: it’s a blind box, so no choosing! Pick a single box or a 2-pack pouch, send your order, and we’ll get back to you about it by email.',
    boxesLabel: 'Boxes',
    couldBe: 'Every ball could be any of these, or the ultra rare one:',
    nameLabel: 'Your name',
    emailLabel: 'Your email',
    emailHint: 'We’ll get back to you here about your order.',
    noteLabel: 'Note',
    notePlaceholder: 'e.g. A question, or anything we should know',
    subtotal: 'Subtotal',
    send: 'Send order',
    sending: 'Sending…',
    sentTitle: 'Order sent!',
    sentBody: (email: string) => `Thanks! We’ve got your order and will get back to you at ${email} about it.`,
    another: 'Place another order',
    failedTitle: 'That didn’t send.',
    failedBody: 'Something went wrong on our side. You can email your order to us instead:',
    emailInstead: 'Email your order',
    orderTextLabel: 'Your order',
    buyNow: 'Buy now',
    pouchDesignsLabel: 'Designs in each pouch',
    storesNothing: 'We only use your details to arrange this order.',
    followUs: 'Follow the crew',
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
      email: 'Add your email so we can get back to you.',
    },
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
    lead: 'Short version: we only use your order details to arrange your order, and we only measure visits in aggregate.',
    sections: [
      {
        title: 'What this site stores',
        body: 'No accounts, no cookies of our own and no tracking pixels. The site doesn’t keep anything you type: your order is only sent when you tap “Send order”.',
      },
      {
        title: 'Visit statistics',
        body: 'We use Vercel Web Analytics to see how many people visit and which pages they view. For each visit it records the page address, the referring site, your approximate location, and your device and browser type. It uses no third-party cookies. It recognises a visit using a hash of the request, and that visitor session is discarded after 24 hours. We only look at the totals, and your order details are never included.',
      },
      {
        title: 'How orders work',
        body: 'When you tap “Send order”, your order, name, email address and note are sent through our website host (Vercel) and our email provider (Resend), which deliver them to us as an email. They aren’t stored on this website.',
      },
      {
        title: 'What we do with your details',
        body: 'We use your name, email address and note only to get back to you about your order. We don’t share them, and we don’t add you to any mailing list. If you’d like us to delete your order emails, just ask.',
      },
      {
        title: 'Hosting',
        body: 'This site is a set of static files on a web host. Like any web server, the host may keep standard technical logs, such as IP addresses, for security. We don’t use those logs to identify you.',
      },
    ],
    contactTitle: 'Contact',
    contactBody: 'Questions about your data under Singapore’s PDPA? Email',
    updated: 'Last updated November 2026', // update when this page changes
  },
};

// Real reviews only, shown when site.showReviews is true. Never invent names or quotes.
export const reviews: Review[] = [];
