// Runs after `vite build` + the SSR build: writes each page's HTML into dist/*.html.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('dist');
const ssrDir = resolve('dist-ssr');
const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);

for (const [file, fn] of Object.entries(render)) {
  const path = resolve(dist, file);
  const html = readFileSync(path, 'utf8');
  if (!html.includes('<div id="root"></div>')) throw new Error(`No empty #root in ${file}`);
  writeFileSync(path, html.replace('<div id="root"></div>', `<div id="root">${fn()}</div>`));
  console.log(`prerendered ${file}`);
}
rmSync(ssrDir, { recursive: true, force: true });
