# Wello

Single-page marketing site for Wello, the reusable scent ball. Vite + React 18 + TypeScript, plain CSS, no backend, no cookies of its own, and privacy-friendly visit counts from Vercel Web Analytics. Pages are prerendered to static HTML at build time, so the content and link previews work before (and without) JavaScript.

```bash
npm install
npm run dev            # local dev server
npm run build          # type-check, build, prerender → dist/
npm run preview        # serve dist/ locally
npm run check:content  # list every TODO(content) placeholder; fails if any remain
npm run check:contrast # WCAG contrast of every colour pair the site uses; fails below AA
npm run brand:assets   # regenerate favicon.svg + og-image.png (also runs on every build)
npm run balls:icons    # cut the character icons out of their white backgrounds
```

## Editing content (no component changes needed)

Everything you'd normally change lives in `src/content/`:

| File | What's in it |
| --- | --- |
| `site.ts` | Brand name, tagline, description, URL, contact email, socials, order mode and endpoint, payment note, and the feature flags below |
| `designs.ts` | The five characters and the ultra rare teaser: name, theme, colour, face description, tagline, who it's for, `status`, `photo` |
| `products.ts` | What can be ordered: the blind box (live), plus commented-out pick-your-character, 3-pack pouch and refill options; prices, optional `checkoutUrl` |
| `faq.ts` | FAQ questions and answers |
| `copy.ts` | All other page text: hero, sections, comparison table, order form labels, privacy page, safety lines, reviews |
| `theme.ts` | Logo colour order and which section gets which accent colour |
| `types.ts` | Shapes of the above (only touch if you add a new field) |

Every placeholder is marked `TODO(content)`. Run `npm run check:content` to see what's left.

### Making a design orderable

In `designs.ts`, change a design's `status` from `'coming-soon'` to `'ready'`. It then gets an order button in "Meet the crew", a quantity row in the order form, and appears in the 3-pack design pickers. While a design is coming soon it shows a "Coming soon" chip and can't be ordered. The ultra rare entry (`status: 'ultra-rare'`) is a teaser: it appears in the crew with a hidden silhouette and can never be ordered. When it's ready to reveal, give it a real name, details and icon, and set its status.

### Blind boxes

Wello is sold in blind boxes: customers choose how many boxes, not which character. The only live product is `blind-box` in `products.ts`; its `designIds` are the characters a box might contain, shown as "Could be any of these" in the order form. The order email lists "N × Blind box".

The order form still supports picking characters (`type: 'ball'`) and the 3-pack pouch (`type: 'pouch-set'`). They're commented out in `products.ts`, so you can bring either back alongside blind boxes later. With a character product live, a design's `status` decides whether it's orderable (`'ready'`) or shows "Coming soon".

### Character icons

The source art is the SVGs in `src/assets/balls/` (`snoozie.svg`, `clem.svg`, `mrmove.svg`, `bubbles.svg`, `solace.svg`). `npm run balls:icons` prepares web copies in `src/assets/balls/web/<id>.svg` plus `manifest.json`. For each icon it:

- removes hidden layers (such as the reference image the art was traced from),
- turns text (the Z's, "1 kg") into shapes, since an SVG shown as an image can't load fonts (the fonts come from `@fontsource/source-sans-3` and `@fontsource/nanum-pen-script`),
- makes the loop's opening see-through so the section colour shows through it,
- puts every icon on the same canvas size, centred on its loop and aligned at the bottom. The source art is drawn at one scale, so every ball shows at the same size wherever icons share a box (Snoozie's Z's and Mr. Move's tall handle just use the spare room), and each hangs straight from the hero string.

The site only uses the web copies: hero, scrolling band, "Make it yours", crew picker, where-it-goes placeholders, order form and footer. To replace an icon, overwrite its SVG and run the script. To add one, add it to `ICONS` in `scripts/ball-icons.mjs`. If new art uses another font, add that font to `FONTS` there.

A `photo` on a design takes priority over its icon.

## Brand

The brand is **Wello**: a wordmark "WELLO" in Anton where the O is a striped ball with a hanging loop (reference: `src/assets/brand/reference/wello-logo.png`). In running text, write "Wello". The striped ball is the brand mascot (header, favicon, footer, dividers). It is **not** a product picture: the products are the character balls.

Tone: friendly and a little cheeky. The name hints at wellness, but make **no health, hygiene-benefit or wellness claims**. The self-care themes of the characters (sleep, nutrition, exercise, hygiene, mental health) are a vibe, not a promise. Keep taglines about the character's personality, never about what the ball does for the person.

### Palette (`src/styles/tokens.css`)

Find the block **BRAND PALETTE: CHANGE HERE**. Each logo colour has three tokens:

| Token | Use |
| --- | --- |
| `--c-purple`, `--c-coral`, `--c-orange`, `--c-sky` | Pastel. Fills, large display type, illustrations, stripes. Never body text on white. |
| `--c-X-deep` | Text, links, icons, and buttons with white text. Each is at least 4.5:1 on white. |
| `--c-X-tint` | 14% tint for section backgrounds. Text on a tint is always `--ink`. |

Plus `--c-grey` (the ball's loop), neutrals (`--ink`, `--ink-soft`, `--bg`, `--bg-soft`, `--line`) and roles: `--brand` (= purple-deep: primary buttons, links, focus ring) and `--on-brand` (white).

After changing any colour, run `npm run check:contrast`. It reads `tokens.css` and the design colours in `designs.ts`, works out the WCAG ratio for every pair the site uses (declared at the top of `scripts/check-contrast.mjs`), and fails below 4.5:1 for text or 3:1 for large text and UI. If you add a new colour combination to the CSS, add it to that list too. The browser theme colour comes from `--brand` automatically.

### Section accents (`src/content/theme.ts`)

Sections rotate through the logo colours for their eyebrow, icons, step numbers, chips and tinted backgrounds. `accentRotation` is the colour order and `accentedSections` is the list of sections, in page order, that take colours from it. Reorder either array to change which section gets which colour. "Meet the crew" always uses the selected design's colour. In CSS, a section's colours are `--accent`, `--accent-deep` and `--accent-tint`.

### Logo

- `src/components/Logo.tsx` is the **one place the logo is drawn**. Variants: `full` (coloured, header), `mark` (ball only), `ink` (one colour, footer). It's built from live text: "WELL" in Anton, plus `<WelloBall />` as the O, sized in em so it scales with `font-size`. The proportions (ball 0.91 × cap height, raised 0.22 × cap height, tucked over the last L) are in the `.wordmark` rules in `global.css`.
- When the final vector logo arrives, replace the inside of `Logo.tsx` (for example with an inline `<svg>` or an `<img>` of the file). Nothing else needs to change. Keep `role="img"` and `aria-label={site.brandName}` on the outer element.
- The ball's shapes live in `src/lib/welloBall.ts` and are shared by `<WelloBall />`, the favicon and the OG image, so editing them updates all three. `<WelloBall animate />` swings gently from the loop (static with reduced motion).
- **Name:** `brandName` in `src/content/site.ts` flows into the page text, comparison table, order emails, titles, Open Graph and JSON-LD. The wordmark letters themselves are in `Logo.tsx`.

### Favicon and OG image

`scripts/brand-assets.mjs` runs before every build (or `npm run brand:assets`) and writes:

- `src/assets/brand/favicon.svg`: the ball mark, from `welloBall.ts` and the palette.
- `public/og-image.png`: 1200×630 link preview (wordmark, tagline and stripes on `--bg-soft`). WhatsApp and Telegram need PNG or JPG, so it's rendered with `sharp`. The text is drawn from Anton's own glyph outlines (`scripts/lib/glyphs.mjs`), so it doesn't depend on fonts installed on the build machine. `site.ogImage` points at it; set it to another file in `public/` to use your own design instead (and remove the OG part of the script).

### Type

Display is **Anton** (`@fontsource/anton`, Latin subset): uppercase, slightly tracked, only for h1/h2 and short labels, never paragraphs or long headlines. Body and UI is **Inter Variable**. Both are self-hosted with `font-display: swap`, and the Latin files are preloaded. To change a family, install another `@fontsource` package, swap the imports in `src/mount.tsx`, update `--font-display` / `--font-body` in `tokens.css`, and update the file-name patterns in `preloadFonts()` (`vite-plugins/injectMeta.ts`). The OG image script and the `.wordmark` em values assume Anton's metrics, so re-check those if the display font changes.

### Stripes

`<StripeBand />` draws curved bands in the four colours in logo order: `variant="hero"` (hero background), `"divider"` (between sections, placed in `src/pages/Home.tsx`; `flip` mirrors it) and `"thin"` (footer accent). Flat colours only.

## Adding real photos

The "Where it goes" grid already has photos: free Unsplash photos with a Wello character placed into each scene (`src/assets/photos/<scene>.webp`). They're built by `npm run photos:uses` (`scripts/use-case-photos.mjs`) from the originals in `src/assets/photos/source/`. Each scene's position, size, tilt and "tuck" shape (the part of the photo drawn over the ball, so it sits inside a shoe or pocket) are plain numbers at the top of that script. Credits and licence notes are in `src/assets/photos/source/CREDITS.md`. To use your own photo for a scene instead, drop it in `src/assets/photos/` and point that item's `photo` at it in `copy.ts`.

1. Drop images into `src/assets/photos/` (`.jpg`, `.webp`, `.avif` or `.png`).
   - Design photos: square, about 1200×1200, ball on a plain or transparent background.
   - Use-case photos: 4:3, about 1200×900.
2. Reference them by file name:
   - `designs.ts`: `photo: 'snoozie.jpg'`. The photo replaces the icon wherever that character appears.
   - `copy.ts` → `useCases.items`: `photo: 'shoes.jpg'`. Replaces the striped placeholder.
   - `copy.ts` → `proof.btsPhoto` for the behind-the-scenes photo.
3. For the how-it-works video, put a short muted MP4 in `public/` and set `copy.how.video.src` (and optionally `poster`).
4. The link-preview image is generated for you (see **Favicon and OG image**). Product photos aren't used in it.

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
- **Made in Singapore:** `madeInSingapore: true` adds "Designed in Singapore" to the footer (wording in `copy.footer.madeIn`).
- **"What we're still working on"** note: set `copy.madeBetter.stillWorkingOn`.

## Ordering and payments

v1 has no payments on the site. People choose how many blind boxes they want, add their name, email and an optional note, and tap **Send order**. The order is emailed to you automatically; the customer's address is set as reply-to, so you just hit reply to get back to them. The site itself stores nothing.

How it works: the form POSTs to `/api/order` (`site.orderEndpoint`). That's a Vercel serverless function in `api/order.ts`. It re-checks the order against `products.ts` so prices can't be tampered with, ignores bots that fill a hidden field, and sends the email through [Resend](https://resend.com) using a plain HTTPS call (no extra packages).

**Setting it up (once):**

1. Create a free Resend account and an API key.
2. In Vercel, open the project, go to **Settings → Environment Variables**, and add:
   - `ORDER_EMAIL_TO`: the address orders go to (comma-separate several).
   - `RESEND_API_KEY`: the key from step 1.
   - `ORDER_EMAIL_FROM` (optional): for example `Wello orders <orders@yourdomain.com>`. Verify that domain in Resend first. Without it, Resend's test sender is used, and that can only deliver to the email address of your own Resend account.
3. Redeploy, then place a test order on the live site.

If sending fails (not configured yet, Resend down, or a host without the function), the form says so and offers **Email your order**, which opens the visitor's own email app addressed to `site.contactEmail` with the order filled in. `/api/order` only exists on Vercel: `npm run preview` (and GitHub Pages or Netlify) will always show that fallback. To test sending locally, put the variables in `.env.local` (or run `npx vercel env pull`) and start the site with `npm run dev:api`. It loads `.env.local` and runs `vercel dev`, because plain `vercel dev` doesn't pass `.env.local` to the function. Open http://localhost:3000/api/order to check: it shows `"configured": true` once the function can see both settings (never their values).

All order logic is in **`src/lib/orders.ts`** (plus the function in `api/order.ts`).

- **Links only:** set `orderMode: 'checkout-links'` in `site.ts` to hide the order form completely and show only products that have a `checkoutUrl`.
- **Full checkout later (Shopify, Stripe Checkout):** replace `submitOrder()` in `orders.ts`. Components only call the functions exported from that file.
- **Refills:** uncomment the refill entries in `products.ts`; they appear in the order form automatically.

## Deploying

`npm run build` writes a static site to `dist/`. Set `siteUrl` in `site.ts` first, since it's used for canonical and Open Graph URLs.

- **Cloudflare Pages:** build command `npm run build`, output directory `dist`.
- **Netlify:** build command `npm run build`, publish directory `dist`.
- **GitHub Pages:** a project site lives under `/<repo>/`, so build with `VITE_BASE=/<repo>/ npm run build` (for example in a GitHub Actions workflow) and publish `dist/`. A user or custom-domain site doesn't need `VITE_BASE`.

## How it's put together

- `src/pages/Home.tsx` lists the sections in order; each section is a component in `src/components/`.
- `src/components/BallArt.tsx` shows a character: its photo if there is one, otherwise its icon (alt text says "illustration"), or a silhouette for the ultra rare ball.
- `vite-plugins/injectMeta.ts` writes the title, description, canonical, Open Graph, Twitter tags and JSON-LD Product schema (no ratings or reviews) into the HTML at build time, because WhatsApp and Telegram link previews don't run JavaScript. It also sets the theme colour from `--brand` and preloads the two font files.
- `src/entry-server.tsx` + `scripts/prerender.mjs` render each page to static HTML after the build; the browser then hydrates it.
- Motion is CSS only, plus one IntersectionObserver hook (`src/lib/useInView.ts`). Everything is static with `prefers-reduced-motion`.

## Motion

All CSS, and all of it is switched off with `prefers-reduced-motion`.

- **Landing intro:** the header slides down, the headline rises word by word, then the text and buttons, then the ball drops in on its string and the hero stripes sweep across. It's in the "Landing intro" block of `global.css`.
- **Scroll reveals:** `<Reveal index={n}>` delays each item by n × 90 ms, so cards, steps and FAQ items appear one after another. Section headings reveal eyebrow, then title, then intro.
- **Buttons:** the primary lifts off a stack of the four logo stripes with a shine sweep, and the secondary fills with ink from the left. Both squash when pressed.

## Analytics

Vercel Web Analytics is added once, in `src/mount.tsx`, so it covers every page. Use the `@vercel/analytics/react` entry point: the `/next` and `/nuxt` ones are for other frameworks, and `/nuxt` breaks this build because it needs Vue.

- It only reports on Vercel, and only after you enable Web Analytics for the project in the Vercel dashboard. Then redeploy.
- With `npm run preview` or on another host, `/_vercel/insights/script.js` returns a 404. That's expected on those hosts.
- Never put personal details in URLs or custom events, since those get sent to Vercel. If you add analytics data or change provider, update the privacy page (`copy.privacy`).

## Copy rules (keep these when editing)

- Say "helps absorb" and "designed for airflow". Never "eliminates", "kills germs", "non-toxic", "biodegradable", "compostable", an unqualified "eco-friendly", or "pushes out air".
- Reusability is a headline message, sustainability supports it. Facts only: Wello is 100% reusable (respray the stone; recharge the charcoal sachet in the sun every few months; no disposable parts), with natural volcanic lava stone. Don't add unqualified "eco-friendly", "sustainable" or waste comparisons without evidence. The shell is PETG (`shellMaterial` in `site.ts`). No claims about where the charcoal comes from.
- No durations ("lasts a week") or comparisons ("better than…") until `testResult` is set.
- Never invent reviews or names. "Made/Designed in Singapore" only with the flag on.
- Keep the safety lines in the FAQ and footer (`safetyLines` in `copy.ts`).
- Friendly, a little cheeky, Singapore-aware (S$, MRT, CCA, gym bag, sticky weather), no Singlish slang.
- "Wello" hints at wellness: no health, hygiene-benefit or wellness claims.

## Launch checklist

- [x] Tagline and description final (`site.ts`)
- [x] Final logo confirmed (current `Logo.tsx`); palette confirmed and `npm run check:contrast` passes
- [x] Final hero headline chosen (`copy.hero.headline`)
- [x] `siteUrl`, `contactEmail`, Instagram and TikTok URLs set
- [x] Order emails working on the live site: changes pushed, `/api/order` shows `"configured": true`
- [x] Order email delivery: orders go to the Resend login email (`ORDER_EMAIL_TO`) and Gmail auto-forwards them to the shop inbox. Optional later: verify a domain in Resend and set `ORDER_EMAIL_FROM` for better deliverability and one-click replies
- [x] Blind box prices and payment note confirmed (`products.ts`, `site.ts`)
- [x] Ultra rare wording confirmed (it can come in a blind box; rarity isn't published)
- [x] Character icons, names, taglines and colours final (`designs.ts`, `src/assets/balls/`)
- [x] Recyclability claim removed; the site says every part is reusable
- [x] "Where it goes" photos (mock-ups, kept for now)
- [x] Link preview checked by pasting the URL into WhatsApp or Telegram
- [x] Proof section and how-it-works video stay hidden until there's real content
- [x] Privacy page "Last updated" date correct (update it whenever that page changes)
- [x] `npm run check:content` passes (no `TODO(content)` left)
- [x] `npm run build` passes; spot-checked at 375, 768 and 1280px
