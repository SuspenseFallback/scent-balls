import type { Product } from './types';

const allDesigns: Product['designIds'] = ['sleep', 'shower', 'skincare', 'hydrate', 'breathe', 'move'];

export const products: Product[] = [
  {
    id: 'single',
    type: 'ball',
    name: 'Single ball',
    description: 'One scent ball with activated charcoal and a lava stone inside.',
    priceSGD: 12, // TODO(content): placeholder price
    designIds: allDesigns,
    itemsPerPack: 1,
    // checkoutUrl: 'https://buy.stripe.com/...',
  },
  {
    id: 'pouch-3',
    type: 'pouch-set',
    name: '3-pack in a fabric pouch',
    description: 'Three scent balls in a fabric pouch. Good for gifting, or for both shoes and your bag.', // TODO(content): pouch details
    priceSGD: 30, // TODO(content): placeholder price
    designIds: allDesigns,
    itemsPerPack: 3,
  },
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
