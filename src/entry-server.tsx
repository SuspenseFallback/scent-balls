// Build-time only: renders each page to static HTML (see scripts/prerender.mjs),
// so the content shows before JavaScript loads and without it.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { Home } from './pages/Home';
import { Privacy } from './pages/Privacy';

export const render = {
  'index.html': () => renderToString(<StrictMode><Home /></StrictMode>),
  'privacy.html': () => renderToString(<StrictMode><Privacy /></StrictMode>),
};
