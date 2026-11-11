import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';
import { site } from '../src/content/site';
import { products } from '../src/content/products';

/** Resolve a colour token from tokens.css (follows var() references), so the theme colour has one source. */
function tokenColour(name: string): string {
  const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
  let v = name;
  for (let i = 0; i < 5 && v.startsWith('--'); i++) {
    const m = css.match(new RegExp(`${v}\\s*:\\s*([^;]+);`));
    if (!m) break;
    v = m[1].trim().replace(/^var\((--[\w-]+)\)$/, '$1');
  }
  return v;
}

/**
 * Writes SEO / social meta into the built HTML. WhatsApp, Telegram and most
 * link-preview crawlers don't run JavaScript, so this must be static.
 * Product schema deliberately has NO ratings or reviews.
 */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const join = (a: string, b: string) => a.replace(/\/+$/, '') + '/' + b.replace(/^\/+/, '');

export function injectMeta({ base }: { base: string }): Plugin {
  return {
    name: 'inject-meta',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const isPrivacy = ctx.filename.endsWith('privacy.html');
        const pageUrl = join(join(site.siteUrl, base), isPrivacy ? 'privacy.html' : '');
        const title = isPrivacy ? `Privacy · ${site.brandName}` : `${site.brandName} · ${site.tagline}`;
        const image = site.ogImage ? join(join(site.siteUrl, base), site.ogImage) : null;
        const themeColour = tokenColour('--brand');

        const tags = [
          `<meta name="theme-color" content="${esc(themeColour)}" />`,
          `<title>${esc(title)}</title>`,
          `<meta name="description" content="${esc(site.description)}" />`,
          `<link rel="canonical" href="${esc(pageUrl)}" />`,
          `<link rel="icon" type="image/svg+xml" href="/src/assets/brand/favicon.svg" />`,
          `<meta property="og:type" content="website" />`,
          `<meta property="og:site_name" content="${esc(site.brandName)}" />`,
          `<meta property="og:title" content="${esc(title)}" />`,
          `<meta property="og:description" content="${esc(site.description)}" />`,
          `<meta property="og:url" content="${esc(pageUrl)}" />`,
          `<meta property="og:locale" content="en_SG" />`,
          `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
          `<meta name="twitter:title" content="${esc(title)}" />`,
          `<meta name="twitter:description" content="${esc(site.description)}" />`,
        ];
        if (image) {
          tags.push(`<meta property="og:image" content="${esc(image)}" />`);
          tags.push(`<meta property="og:image:type" content="image/png" />`);
          tags.push(`<meta property="og:image:width" content="1200" />`);
          tags.push(`<meta property="og:image:height" content="630" />`);
          tags.push(`<meta property="og:image:alt" content="${esc(`${site.brandName}: ${site.tagline}`)}" />`);
          tags.push(`<meta name="twitter:image" content="${esc(image)}" />`);
        }

        if (!isPrivacy) {
          const schema = products.map((p) => ({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: `${site.brandName} ${p.name}`,
            description: p.description,
            brand: { '@type': 'Brand', name: site.brandName },
            material: site.shellMaterial,
            offers: {
              '@type': 'Offer',
              price: p.priceSGD.toFixed(2),
              priceCurrency: 'SGD',
              availability: 'https://schema.org/PreOrder',
              url: p.checkoutUrl ?? join(pageUrl, '#order'),
            },
          }));
          const json = JSON.stringify(schema).replace(/</g, '\\u003c');
          tags.push(`<script type="application/ld+json">${json}</script>`);
        }

        return html
          .replace('<!--inject-meta-->', tags.join('\n    '))
          .replace(/%BRAND_NAME%/g, esc(site.brandName))
          .replace(/%CONTACT_EMAIL%/g, esc(site.contactEmail))
          .replace(/%BASE%/g, base);
      },
    },
  };
}

/**
 * Preloads the Latin subsets of the two self-hosted fonts so text renders in its
 * final font on first paint (avoids the hero reflowing when fonts swap in).
 */
export function preloadFonts(base: string): Plugin {
  const WANTED = [/anton-latin-400-normal-[\w-]+\.woff2$/, /inter-latin-wght-normal-[\w-]+\.woff2$/];
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((f) => WANTED.some((re) => re.test(f)));
        return files.map((f) => ({
          tag: 'link',
          attrs: { rel: 'preload', href: base + f, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head' as const,
        }));
      },
    },
  };
}
