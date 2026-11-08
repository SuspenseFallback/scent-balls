// Brand colour order and section accents. Colours themselves live in src/styles/tokens.css.

export type Accent = 'purple' | 'coral' | 'orange' | 'sky';

/** The order the colours appear in the logo: W E L L. Stripes always use this order. */
export const logoOrder: Accent[] = ['purple', 'coral', 'orange', 'sky'];

/**
 * Section accents (eyebrow, icons, step numbers, chips, tinted backgrounds).
 * The sections below take colours from accentRotation in turn, in page order.
 * Reorder either list to change which section gets which colour.
 * "Meet the crew" is not listed: it always uses the selected design's colour.
 */
export const accentRotation: Accent[] = ['coral', 'orange', 'sky', 'purple'];
export const accentedSections = ['problem', 'how', 'different', 'madeBetter', 'faq', 'order'] as const;

export type AccentedSection = (typeof accentedSections)[number];

export function accentFor(section: AccentedSection): Accent {
  return accentRotation[accentedSections.indexOf(section) % accentRotation.length];
}
