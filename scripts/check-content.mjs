// Lists every placeholder marker and exits non-zero if any remain.
// Run before launch: npm run check:content
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const MARKER = 'TODO' + '(content)';
const ROOT = process.cwd();
const TARGETS = ['src', 'vite-plugins', 'index.html', 'privacy.html', 'public'];
const EXT = /\.(ts|tsx|css|html|svg|json|txt)$/;

const hits = [];
function walk(p) {
  let st;
  try { st = statSync(p); } catch { return; }
  if (st.isDirectory()) {
    for (const f of readdirSync(p)) if (f !== 'node_modules') walk(join(p, f));
  } else if (EXT.test(p)) {
    readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
      if (line.includes(MARKER)) hits.push(`${relative(ROOT, p)}:${i + 1}  ${line.trim()}`);
    });
  }
}
TARGETS.forEach((t) => walk(join(ROOT, t)));

if (hits.length) {
  console.log(`\n${hits.length} content placeholder(s) left:\n`);
  hits.forEach((h) => console.log('  ' + h));
  console.log('');
  process.exit(1);
}
console.log('No content placeholders left. Ready to launch.');
