// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site: served at https://sotoer.github.io/abner/,
  // not the domain root, so every internal link needs the `/abner` prefix
  // (see src/lib/url.ts's withBase helper).
  site: 'https://sotoer.github.io',
  base: '/abner',
});
