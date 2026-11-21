import type { Design } from './types';

// The crew. Colours were sampled from the icons in src/assets/balls; any hex works.
// Icons: src/assets/balls/cutout/<id>.webp (see scripts/ball-icons.mjs).
// status: 'ready' = orderable, 'coming-soon' = shown with a chip, 'ultra-rare' = teaser only.
export const designs: Design[] = [
  {
    id: 'snoozie',
    name: 'Snoozie',
    theme: 'Sleep',
    color: '#76569E',
    emboss: 'closed eyes, a yawning mouth and a trail of zzz',
    tagline: 'Always a bit sleepy. Somehow always fresh.',
    whoItsFor: 'Night owls, morning snoozers and anyone whose shoes live by the door.',
    status: 'ready',
    // photo: 'snoozie.jpg', // TODO(content): add a real photo of the prototype
  },
  {
    id: 'clem',
    name: 'Clem',
    theme: 'Nutrition',
    color: '#EA8533', 
    emboss: 'big round eyes and its tongue poking out',
    tagline: 'Thinks about snacks more than you do.',
    whoItsFor: 'Foodies, meal-preppers and anyone with a lunchbox in their bag.', 
    status: 'ready',
  },
  {
    id: 'mr-move',
    name: 'Mr. Move',
    theme: 'Exercise',
    color: '#5E6264',
    emboss: 'a kettlebell shape, a red headband, a moustache and a 100 kg label',
    tagline: 'Never skips leg day. Has no legs.',
    whoItsFor: 'Gym-goers, footballers, dancers and the whole CCA team.',
    status: 'ready',
  },
  {
    id: 'bubbles',
    name: 'Bubbles',
    theme: 'Hygiene',
    color: '#52B6B3',
    emboss: 'a calm, sleepy smile and soap bubbles',
    tagline: 'First in the queue for the shower after training.',
    whoItsFor: 'Swimmers, runners and post-gym rinsers.',
    status: 'ready',
  },
  {
    id: 'solace',
    name: 'Solace',
    theme: 'Mental health',
    color: '#EFA0BA',
    emboss: 'a big smile, a plaster and a green ribbon',
    tagline: 'A little patched up. Still smiling.',
    whoItsFor: 'Anyone who’s had a long week and turned up anyway.',
    status: 'ready',
  },
  {
    // Teaser only: never orderable, and no details until there's a name and an icon.
    id: 'ultra-rare',
    name: 'Ultra rare',
    theme: 'Top secret',
    color: '#1B1D1F',
    emboss: 'its design hidden behind a question mark',
    tagline: 'There’s one more out there. That’s all we’re saying for now.',
    whoItsFor: 'Anyone lucky enough to spot one.',
    status: 'ultra-rare',
  },
];

export const getDesign = (id: string) => designs.find((d) => d.id === id);
export const readyDesigns = () => designs.filter((d) => d.status === 'ready');
