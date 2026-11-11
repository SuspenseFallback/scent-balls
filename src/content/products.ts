import type { Product } from './types';

const allDesigns: Product['designIds'] = ['snoozie', 'clem', 'mr-move', 'bubbles', 'solace'];

// Sold as blind boxes: buyers choose how many, not which character.
export const products: Product[] = [
  {
    id: 'blind-box',
    type: 'blind-box',
    name: 'Blind box',
    description: 'One sealed box with a surprise Wello character inside. Every ball has activated charcoal and natural lava stone.',
    priceSGD: 12, // TODO(content): placeholder price
    designIds: allDesigns,
    itemsPerPack: 1,
    // checkoutUrl: 'https://buy.stripe.com/...',
  },
  // Pick-your-character options, from before the switch to blind boxes. The order form
  // still supports them: uncomment to sell them alongside (or instead of) blind boxes.
  // {
  //   id: 'single',
  //   type: 'ball',
  //   name: 'Single ball',
  //   description: 'One Wello scent ball, with activated charcoal and natural lava stone inside.',
  //   priceSGD: 12,
  //   designIds: allDesigns,
  //   itemsPerPack: 1,
  // },
  // {
  //   id: 'pouch-3',
  //   type: 'pouch-set',
  //   name: '3-pack in a fabric pouch',
  //   description: 'Three scent balls in a fabric gift pouch.',
  //   priceSGD: 30,
  //   designIds: allDesigns,
  //   itemsPerPack: 3,
  // },
  // Refill packs — uncomment when ready.
  // {
  //   id: 'refill-charcoal',
  //   type: 'refill',
  //   name: 'Charcoal refill',
  //   description: 'Fresh activated charcoal for one ball.',
  //   priceSGD: 4,
  //   designIds: [],
  //   itemsPerPack: 1,
  // },
  // {
  //   id: 'refill-stone',
  //   type: 'refill',
  //   name: 'Lava stone refill',
  //   description: 'A fresh piece of natural volcanic lava stone.',
  //   priceSGD: 4,
  //   designIds: [],
  //   itemsPerPack: 1,
  // },
];
