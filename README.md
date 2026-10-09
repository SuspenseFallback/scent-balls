# Scent ball site

Single-page marketing site for the reusable scent ball. Vite + React 18 + TypeScript, plain CSS, no backend, no cookies, no analytics. Pages are prerendered to static HTML at build time, so the content and link previews work before (and without) JavaScript.

```bash
npm install
npm run dev            # local dev server
npm run build          # type-check, build, prerender → dist/
npm run preview        # serve dist/ locally
npm run check:content  # list every TODO(content) placeholder; fails if any remain
```

## Editing content (no component changes needed)

Everything you'd normally change lives in `src/content/`:

| File | What's in it |
| --- | --- |
| `site.ts` | Brand name, tagline, description, URL, contact email, WhatsApp number, socials, order mode, payment note, pickup info, and the feature flags below |
| `designs.ts` | The six designs: name, theme, colour, face description, tagline, who it's for, `status`, `photo` |
| `products.ts` | What can be ordered: single ball, 3-pack pouch, (commented-out) refills, prices, optional `checkoutUrl` |
| `faq.ts` | FAQ questions and answers |
| `copy.ts` | All other page text: hero, sections, comparison table, order form labels, privacy page, safety lines, reviews |
| `types.ts` | Shapes of the above (only touch if you add a new field) |

Every placeholder is marked `TODO(content)`. Run `npm run check:content` to see what's left.

### Making a design orderable

In `designs.ts`, change a design's `status` from `'coming-soon'` to `'ready'`. It then gets an order button in "Meet the crew", a quantity row in the order form, and appears in the 3-pack design pickers. While a design is coming soon it shows a "Coming soon" chip and its placeholder face (the faces live in `src/components/BallArt.tsx`).

## Swapping brand name, logo and colour

- **Name:** `brandName` in `src/content/site.ts`. It flows into the header, footer, comparison table, WhatsApp message, page titles, Open Graph tags and JSON-LD.
- **Logo:** replace the placeholder SVGs in `src/assets/brand/`:
  - `logo-mark.svg` (the icon shown next to the name),
  - `logo.svg` (a full logo; used only when `logoStyle: 'full-logo'` in `site.ts`),
  - `favicon.svg`.
  `src/components/Logo.tsx` is the only component that references them. If your mark isn't roughly 30×34, update the width/height there.
- **Colour:** in `src/styles/tokens.css`, find **CHANGE BRAND COLOUR HERE** and set `--brand-h`, `--brand-s`, `--brand-l`. Every other brand shade (buttons, links, tints, focus ring) is derived from those three. Filled buttons use `--brand-strong` (12% darker) for contrast; if you pick a very light colour, set `--on-brand: var(--ink)`. Check contrast of `--brand-strong` against white (≥ 4.5:1) after changing it. Also update the hard-coded blue in the placeholder SVGs, since SVG files can't read CSS variables.
- **Fonts:** `--font-display` / `--font-body` in `tokens.css`. To change the family, install another `@fontsource-variable/*` package, swap the imports in `src/mount.tsx`, and update the file-name patterns in `preloadFonts()` (`vite-plugins/injectMeta.ts`).

## Adding real photos

1. Drop images into `src/assets/photos/` (`.jpg`, `.webp`, `.avif` or `.png`).
   - Design photos: square, about 1200×1200, ball on a plain or transparent background.
   - Use-case photos: 4:3, about 1200×900.
2. Reference them by file name:
   - `designs.ts`: `photo: 'sleep.jpg'`. The photo replaces the illustration in the hero and in "Meet the crew".
   - `copy.ts` → `useCases.items`: `photo: 'shoes.jpg'`. Replaces the striped placeholder.
   - `copy.ts` → `proof.btsPhoto` for the behind-the-scenes photo.
3. For the how-it-works video, put a short muted MP4 in `public/` and set `copy.how.video.src` (and optionally `poster`).
4. For link previews, add `public/og-image.png` (1200×630) and set `ogImage: 'og-image.png'` in `site.ts`.

Slots have fixed aspect ratios, so adding photos causes no layout shift. Images below the fold lazy-load automatically. Compress photos before adding them (for example with squoosh.app); aim for under 200 KB each.

## Turning on proof sections

All of these stay hidden until you turn them on. Never publish made-up results or reviews.

- **Test results:** set `testResult` in `site.ts`:
  ```ts
  testResult: {
    method: 'Blind sniff test, ball in gym shoes overnight',
    sampleSize: 12,
    result: '10 of 12 preferred the shoes with the ball',
    chart: [{ label: 'Day 1', value: 9 }, { label: 'Day 3', value: 7 }], // optional
    chartUnit: '/10',  // optional
    chartMax: 10,      // optional
  },
  ```
  Only once this is set should copy anywhere mention durations or comparisons.
- **Reviews:** add real quotes (with permission) to `reviews` in `copy.ts`, then set `showReviews: true`. Up to three are shown.
- **Behind the scenes:** set `showBehindTheScenes: true` and add `proof.btsPhoto`.
- **Recycled percentage:** set `recycledPercent: 100` (or the confirmed figure) and the copy changes to "100% recycled PLA" everywhere.
- **Made in Singapore:** `madeInSingapore: true` adds "Designed in Singapore" to the footer (wording in `copy.footer.madeIn`).
- **"What we're still working on"** note: set `copy.madeBetter.stillWorkingOn`.

## Ordering and payments

v1 has no payments on the site. People build an order, then "Send order on WhatsApp" opens `wa.me/<whatsappNumber>` with the order pre-filled; "Copy order text" is the fallback. The site stores nothing.

All order logic is in **`src/lib/orders.ts`**.

- **Payment links:** paste a Stripe Payment Link (or similar) into a product's `checkoutUrl` in `products.ts`. That product then shows a "Buy now" button instead of a row in the WhatsApp builder.
- **Links only:** set `orderMode: 'checkout-links'` in `site.ts` to hide the WhatsApp builder completely and show only products that have a `checkoutUrl`.
- **Full checkout later (Shopify, Stripe Checkout):** replace `submitOrder()` in `orders.ts`. Components only call the functions exported from that file.
- **Refills:** uncomment the refill entries in `products.ts`; they appear in the order form automatically.

## Deploying

`npm run build` writes a static site to `dist/`. Set `siteUrl` in `site.ts` first, since it's used for canonical and Open Graph URLs.

- **Cloudflare Pages:** build command `npm run build`, output directory `dist`.
- **Netlify:** build command `npm run build`, publish directory `dist`.
- **GitHub Pages:** a project site lives under `/<repo>/`, so build with `VITE_BASE=/<repo>/ npm run build` (for example in a GitHub Actions workflow) and publish `dist/`. A user or custom-domain site doesn't need `VITE_BASE`.

## How it's put together

- `src/pages/Home.tsx` lists the sections in order; each section is a component in `src/components/`.
- `src/components/BallArt.tsx` draws the ball as an inline SVG (sphere, loop, seam, holes and face in the design's colour) whenever there's no photo. Its alt text says "illustration".
- `vite-plugins/injectMeta.ts` writes the title, description, canonical, Open Graph, Twitter tags and JSON-LD Product schema (no ratings or reviews) into the HTML at build time, because WhatsApp and Telegram link previews don't run JavaScript. It also preloads the two font files.
- `src/entry-server.tsx` + `scripts/prerender.mjs` render each page to static HTML after the build; the browser then hydrates it.
- Motion is CSS only, plus one IntersectionObserver hook (`src/lib/useInView.ts`). Everything is static with `prefers-reduced-motion`.

## Copy rules (keep these when editing)

- Say "helps absorb" and "designed for airflow". Never "eliminates", "kills germs", "non-toxic", "biodegradable", "compostable", an unqualified "eco-friendly", or "pushes out air".
- Sustainability is a supporting message, facts only: recycled PLA shell, natural volcanic lava stone, replaceable parts. No claims about where the charcoal comes from.
- No durations ("lasts a week") or comparisons ("better than…") until `testResult` is set.
- Never invent reviews or names. "Made/Designed in Singapore" only with the flag on.
- Keep the safety lines in the FAQ and footer (`safetyLines` in `copy.ts`).
- Friendly, a little cheeky, Singapore-aware (S$, MRT, CCA, gym bag, sticky weather), no Singlish slang.

## Launch checklist

- [ ] Brand name, tagline and description final (`site.ts`)
- [ ] Logo, mark and favicon replaced (`src/assets/brand/`); brand colour set (`tokens.css`) and contrast checked
- [ ] Final hero headline chosen (`copy.hero.headline`)
- [ ] `siteUrl`, `contactEmail`, `whatsappNumber` (with 65 country code), Instagram and TikTok URLs set
- [ ] WhatsApp order tested on a real phone, and the message arrives on the right number
- [ ] Prices, pouch details, payment note and pickup info confirmed (`products.ts`, `site.ts`)
- [ ] Design colours matched to the real prints; taglines and "who it's for" final (`designs.ts`)
- [ ] Faces drawn for any design switched to `ready`
- [ ] Real photos added (at least Sleep + the use-case grid); `og-image.png` added and `ogImage` set
- [ ] `recycledPercent` set only if confirmed by the filament supplier
- [ ] Any test results, reviews or behind-the-scenes content is real before turning it on
- [ ] Privacy page "Last updated" date correct
- [ ] `npm run check:content` passes (no `TODO(content)` left)
- [ ] `npm run build` passes; spot-check at 375, 768 and 1280px
- [ ] Link preview checked by pasting the URL into WhatsApp or Telegram
