import type { DesignId, Review } from './types';
import { site } from './site';

/** "X% recycled PLA" only when the percentage is confirmed. */
export const shellMaterial = () =>
  site.recycledPercent != null ? `${site.recycledPercent}% recycled PLA` : 'recycled PLA';

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

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
    // Options: "Smell fresh. Even your shoes." / "Your gym bag called. It needs help." / "Meet the crew that keeps things fresh."
    headline: 'Smell fresh. Even your shoes.', // TODO(content): pick final headline
    subhead:
      'A little reusable ball with charcoal and a lava stone inside. Spray your own cologne or deodorant on the stone, close it up, and drop it in your shoes, gym bag or locker.',
    primaryCta: 'Reserve yours',
    secondaryCta: 'See how it works',
    chips: ['Reusable', 'Your own scent', 'Replaceable parts', `${cap(shellMaterial())} shell`],
  },
  problem: {
    eyebrow: 'The sticky truth',
    title: 'Singapore weather follows you everywhere.',
    // designId only picks the accent colour
    cards: [
      { designId: 'sleep', title: 'The 6pm MRT', body: 'Thirty-two degrees, one packed carriage, and your bag was there for all of it.' },
      { designId: 'move', title: 'The gym bag', body: "Yesterday's towel and today's shirt have been sharing a zip for a while now." },
      { designId: 'breathe', title: 'Shoes after CCA', body: 'They did their best out there. Now they need a little help before tomorrow.' },
    ] as { designId: DesignId; title: string; body: string }[],
  },
  how: {
    eyebrow: 'How it works',
    title: 'Spray it, close it, drop it in.',
    steps: [
      {
        id: 'spray' as const,
        title: 'Spray the stone',
        body: 'Unscrew the ball, take out the lava stone and give it a spray of your own cologne or deodorant. Let it dry for a minute.',
      },
      {
        id: 'close' as const,
        title: 'Close it up',
        body: 'Pop the stone back in and screw the halves together. The divider keeps the stone and the charcoal apart.',
      },
      {
        id: 'place' as const,
        title: 'Drop it in or hang it',
        body: 'Shoes, bags, lockers, wardrobes, or hang it by its loop. It’s designed for airflow: air comes in the side holes, past the charcoal and your scented stone, and out the top.',
      },
    ],
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
      { title: 'Reusable', body: 'Refresh the stone whenever the scent fades. No more tossing sachets in the bin.' },
      {
        title: 'Charcoal + your scent',
        body: 'Activated charcoal helps absorb odour, while the lava stone carries the fragrance you already like.',
      },
      { title: 'Make it yours', body: 'Six characters, six colours. Pick one for your mood, your bag or your friend.' },
    ],
    tableCaption: 'How it compares',
    columns: ['Disposable sachets', 'Room sprays'],
    rows: [
      { label: 'Use your own fragrance', values: [true, false, false] },
      { label: 'Reusable shell', values: [true, false, false] },
      { label: 'Replaceable parts', values: [true, false, false] },
      { label: 'Fits in shoes and bags', values: [true, true, false] },
      { label: 'Charcoal to help absorb odour', values: [true, 'Some', false] },
    ] as { label: string; values: (boolean | string)[] }[],
  },
  crew: {
    eyebrow: 'Meet the crew',
    title: 'Collect all six. Give one to a friend.',
    body: 'Each ball has its own colour and its own face. Sleep is ready now. The rest of the crew is on the way.',
    pouch: 'Getting one for someone? The 3-pack comes in a fabric pouch, ready to gift.',
    pickerLabel: 'Choose a design',
    whoLabel: 'Who it’s for',
    comingSoon: 'Coming soon',
    orderCta: 'Reserve',
  },
  useCases: {
    eyebrow: 'Where it goes',
    title: 'Small enough for anywhere that gets stuffy.',
    // TODO(content): add photos. photo = filename in src/assets/photos (4:3 works best); slot is the placeholder label until then.
    items: [
      { id: 'shoes', slot: 'ball in a sneaker', dot: 'sleep', label: 'Shoes', body: 'One in each pair overnight.', photo: undefined },
      { id: 'gym', slot: 'gym bag side pocket', dot: 'move', label: 'Gym bag', body: 'Lives in the side pocket.', photo: undefined },
      { id: 'school', slot: 'school bag', dot: 'breathe', label: 'School bag', body: 'Next to the PE kit.', photo: undefined },
      { id: 'locker', slot: 'locker shelf', dot: 'shower', label: 'Locker', body: 'Sits in the corner, quietly.', photo: undefined },
      { id: 'wardrobe', slot: 'hanging in wardrobe', dot: 'skincare', label: 'Wardrobe', body: 'Hang it from the rail.', photo: undefined },
      { id: 'hang', slot: 'hanging from bag zip', dot: 'hydrate', label: 'Hang it on your bag', body: 'Loop it onto a zip or strap.', photo: undefined },
    ] as { id: string; slot: string; dot: DesignId; label: string; body: string; photo?: string }[],
  },
  madeBetter: {
    eyebrow: 'Made a little better',
    facts: [
      { title: `${cap(shellMaterial())} shell`, body: () => `The shell is 3D-printed from ${shellMaterial()}.` },
      { title: 'Natural lava stone', body: () => 'The scent carrier is a piece of natural volcanic lava stone.' },
      { title: 'Replace parts, keep the ball', body: () => 'Swap the charcoal or the stone instead of replacing the whole ball.' },
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
    title: 'Reserve yours',
    body: 'We’re starting small, with friends and family. Build your order, send it on WhatsApp, and we’ll sort out pickup with you.',
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
      empty: 'Add at least one ball to your order.',
      name: 'Add your name so we know who it’s for.',
    },
    copyFailed: 'Couldn’t copy. Select the text below instead.',
    checkoutTitle: 'Buy online',
  },
  footer: {
    privacy: 'Privacy',
    contact: 'Contact',
    safetyTitle: 'Safety',
    // Only shown when site.madeInSingapore is true.
    madeIn: 'Designed in Singapore',
  },
  header: { menu: 'Menu', mainNav: 'Main' },
  stickyCta: 'Reserve yours',
  privacy: {
    back: '← Back to site',
    title: 'Privacy',
    lead: 'Short version: this site doesn’t collect or store your personal data.',
    sections: [
      {
        title: 'What this site stores',
        body: 'Nothing. There are no accounts, no cookies, no analytics and no tracking pixels. The order form runs in your browser, and nothing you type is sent to us or saved.',
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
    updated: 'Last updated October 2026', // TODO(content): update when this page changes
  },
};

// Real reviews only, shown when site.showReviews is true. Never invent names or quotes.
export const reviews: Review[] = [];
