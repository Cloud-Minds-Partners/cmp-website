// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dcplatformcmp.web.app',
  // /privacy is noindex — it exists so Meta App Review can fetch it, not as a
  // site-wide policy. Listing a noindex page in the sitemap contradicts itself.
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/privacy') })],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'es'],
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'rewrite',
    },
    fallback: {
      pt: 'en',
      es: 'en',
    },
  },
});
