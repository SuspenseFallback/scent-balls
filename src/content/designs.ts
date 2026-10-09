import type { Design } from './types';

// Colours should match the real prints once they exist.
// Set status: 'ready' to make a design orderable.
export const designs: Design[] = [
  {
    id: 'sleep',
    name: 'Sleep',
    theme: 'Rest',
    color: '#3B9AD9', // sampled from the prototype
    emboss: 'closed eyes, a little zzz and a yawning mouth',
    tagline: 'Always a bit sleepy. Somehow always fresh.', // TODO(content)
    whoItsFor: 'Night owls, morning snoozers and anyone whose shoes live by the door.', // TODO(content)
    status: 'ready',
    // photo: 'sleep.jpg', // TODO(content): add a real photo of the prototype
  },
  {
    id: 'shower',
    name: 'Shower',
    theme: 'Clean',
    color: '#8E7CE8',
    emboss: 'placeholder face', // TODO(content)
    tagline: 'First in the queue for the shower after training.', // TODO(content)
    whoItsFor: 'Swimmers, runners and post-gym rinsers.', // TODO(content)
    status: 'coming-soon',
  },
  {
    id: 'skincare',
    name: 'Skincare',
    theme: 'Glow',
    color: '#F28BA8',
    emboss: 'placeholder face', // TODO(content)
    tagline: 'Ten steps, zero shortcuts.', // TODO(content)
    whoItsFor: 'Anyone with a shelf of serums and a very organised bag.', // TODO(content)
    status: 'coming-soon',
  },
  {
    id: 'hydrate',
    name: 'Hydrate',
    theme: 'Water',
    color: '#38C6D9',
    emboss: 'placeholder face', // TODO(content)
    tagline: 'Carries a two-litre bottle everywhere.', // TODO(content)
    whoItsFor: 'Hikers, cyclists and the friend who reminds everyone to drink water.', // TODO(content)
    status: 'coming-soon',
  },
  {
    id: 'breathe',
    name: 'Breathe',
    theme: 'Calm',
    color: '#6DBE8A',
    emboss: 'placeholder face', // TODO(content)
    tagline: 'In for four, out for four.', // TODO(content)
    whoItsFor: 'Yoga regulars, deep breathers and calm-in-a-crisis types.', // TODO(content)
    status: 'coming-soon',
  },
  {
    id: 'move',
    name: 'Move',
    theme: 'Energy',
    color: '#FF7A45',
    emboss: 'placeholder face', // TODO(content)
    tagline: 'Never sits still. Neither do your shoes.', // TODO(content)
    whoItsFor: 'Footballers, dancers and CCA regulars.', // TODO(content)
    status: 'coming-soon',
  },
];

export const getDesign = (id: string) => designs.find((d) => d.id === id);
export const readyDesigns = () => designs.filter((d) => d.status === 'ready');
