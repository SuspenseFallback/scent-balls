import { StrictMode, type ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource/anton/latin-400.css';
import '@fontsource-variable/inter';
import './styles/tokens.css';
import './styles/global.css';

/** Hydrates the prerendered HTML in production; renders from scratch in dev. */
export function mount(app: ReactNode) {
  const el = document.getElementById('root')!;
  const tree = <StrictMode>{app}</StrictMode>;
  if (el.hasChildNodes()) hydrateRoot(el, tree);
  else createRoot(el).render(tree);
}
