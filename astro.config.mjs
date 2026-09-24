import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { SITE } from './src/consts.ts';

export default defineConfig({
  site: SITE.url,
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
    smartypants: false,
  },
});
