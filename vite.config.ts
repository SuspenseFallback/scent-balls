import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { injectMeta, preloadFonts } from './vite-plugins/injectMeta';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // GitHub Pages project sites need e.g. VITE_BASE=/repo-name/
  const base = env.VITE_BASE || '/';
  return {
    base,
    plugins: [react(), injectMeta({ base }), preloadFonts(base)],
    build: isSsrBuild
      ? // Build-time prerender bundle (see scripts/prerender.mjs). Never deployed.
        { outDir: 'dist-ssr', emptyOutDir: true, copyPublicDir: false, rollupOptions: { input: `${root}src/entry-server.tsx` } }
      : {
          target: 'es2020',
          cssCodeSplit: false,
          rollupOptions: {
            input: {
              main: `${root}index.html`,
              privacy: `${root}privacy.html`,
            },
            output: {
              manualChunks: (id) => (id.includes('node_modules/react') ? 'react' : undefined),
            },
          },
        },
  };
});
