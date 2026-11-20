import type { FaqItem } from './types';
import { site } from './site';
import { safetyLines } from './copy';

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
      'It depends on your fragrance, how much you spray and where you keep the ball.',
      'Whenever you notice the scent fading, give the stone a fresh spritz and it’s good to go again. Every few months, recharge the charcoal in the sun, and the whole ball keeps going.',
    ],
  },
  {
    id: 'fragrances',
    q: 'Which fragrances work?',
    a: [
      'Most spray colognes, perfumes, body sprays and deodorant sprays. A spritz or two is plenty.',
      'Let the stone dry before closing so the charcoal stays dry.',
    ],
  },
  {
    id: 'replace',
    q: 'Will I ever need to replace the charcoal or stone?',
    a: [
      'No. Wello is 100% reusable. Respray the lava stone whenever the scent fades.',
      'For the charcoal: every few months, lift out the divider, take out the charcoal sachet and leave it in the sun to dry. That recharges it. Only the sachet goes in the sun, so keep the ball itself in the shade.',
    ],
  },
  {
    id: 'safe',
    q: 'Is it safe?',
    a: ['A few simple guidelines:'],
    list: safetyLines,
  },
  {
    id: 'inside',
    q: 'What’s inside?',
    a: [
      'One half holds a sachet of activated charcoal, which helps absorb odour. The other half holds a piece of porous lava stone that carries your scent.',
      'A removable divider with small holes sits between them so they don’t touch. Lift it out when it’s time to recharge the charcoal.',
    ],
  },
  {
    id: 'material',
    q: 'What’s it made of?',
    a: [
      `The shell is 3D-printed from ${site.shellMaterial}, which is 100% recyclable. Inside: activated charcoal and natural volcanic lava stone.`,
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
      'Choose how many boxes you’d like below and send your order. It comes straight to us by email, and we’ll reply to arrange pickup. Nothing is charged on this site.',
      `${site.pickupInfo} ${site.paymentNote}`,
    ],
  },
  {
    id: 'gift',
    q: 'Is it a good gift?',
    a: ['We think so. Every ball comes in a blind box, so neither of you knows which character is inside until it’s opened.'],
  },
  {
    id: 'blind-box',
    q: 'Can I choose which character I get?',
    a: [
      'Not right now. Every Wello comes in a blind box, so each one is a surprise: Snoozie, Clem, Mr. Move, Bubbles, Solace, or, if you’re lucky, the ultra rare one.',
      'You might get a double. That’s half the fun: swap with a friend.',
    ],
  },
  {
    id: 'themes',
    q: 'Do the themes mean it helps with my sleep or mental health?',
    a: [
      'No. Snoozie, Clem, Mr. Move, Bubbles and Solace are characters, and their themes are just for fun. It’s a scent ball for your shoes and bags, not a health product.',
      'If you’re having a hard time, please talk to someone you trust or a professional.',
    ],
  },
];
