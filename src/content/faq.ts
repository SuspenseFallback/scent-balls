import type { FaqItem } from './types';
import { site } from './site';
import { safetyLines, shellMaterial } from './copy';

export const faq: FaqItem[] = [
  {
    id: 'add-scent',
    q: 'How do I add scent?',
    a: [
      'Unscrew the ball and take out the lava stone. Spray it once or twice with your cologne, perfume or deodorant spray, away from any flame.',
      'Let the stone dry for a minute, put it back and screw the halves together.',
    ],
  },
  {
    id: 'how-long',
    q: 'How long does it last?',
    a: [
      'We’re still testing this properly, so we won’t put a number on it yet.',
      'It depends on your fragrance, how much you spray and where you keep the ball. When the scent fades, spray the stone again.',
    ],
  },
  {
    id: 'fragrances',
    q: 'Which fragrances work?',
    a: [
      'Most spray colognes, perfumes, body sprays and deodorant sprays. Spray lightly; more isn’t better.',
      'Let the stone dry before closing so the charcoal stays dry.',
    ],
  },
  {
    id: 'replace',
    q: 'Can I replace the charcoal or the stone?',
    a: ['Yes. Both are replaceable, so you keep the ball and swap the parts. Refill packs are coming; until then, message us.'],
  },
  {
    id: 'safe',
    q: 'Is it safe?',
    a: ['Please use it sensibly:'],
    list: safetyLines,
  },
  {
    id: 'inside',
    q: 'What’s inside?',
    a: [
      'One half holds activated charcoal, which helps absorb odour. The other half holds a piece of porous lava stone that carries your scent.',
      'A divider with small holes sits between them so they don’t touch.',
    ],
  },
  {
    id: 'material',
    q: 'What’s it made of?',
    a: [
      `The shell is 3D-printed from ${shellMaterial()}. Inside: activated charcoal and natural volcanic lava stone.`,
    ],
  },
  {
    id: 'hang',
    q: 'Can I hang it?',
    a: ['Yes. Every ball has a loop at the top, so you can hang it in a wardrobe or a locker, or clip it to a bag.'],
  },
  {
    id: 'ordering',
    q: 'How do ordering and pickup work?',
    a: [
      'Build your order below and send it to us on WhatsApp. Nothing is charged on this site.',
      `${site.pickupInfo} ${site.paymentNote}`,
    ],
  },
  {
    id: 'gift',
    q: 'Is it a good gift?',
    a: ['We think so. The 3-pack comes in a fabric pouch, and there are six characters to collect.'],
  },
];
