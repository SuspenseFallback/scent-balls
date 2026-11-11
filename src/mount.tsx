import { StrictMode, type ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import '@fontsource/anton/latin-400.css';
import '@fontsource-variable/inter';
import './styles/tokens.css';
import './styles/global.css';

/** Hydrates the prerendered HTML in production; renders from scratch in dev. */
export function mount(app: ReactNode) {
  const el = document.getElementById('root')!;
  // Analytics renders nothing, so it can't cause a mismatch with the prerendered HTML.
  const tree = (
    <StrictMode>
      {app}
      <Analytics />
    </StrictMode>
  );
  if (el.hasChildNodes()) hydrateRoot(el, tree);
  else createRoot(el).render(tree);
}
