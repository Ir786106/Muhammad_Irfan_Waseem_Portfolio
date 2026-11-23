import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
const site = process.env.SITE_URL;
export default defineConfig({ site, base: process.env.BASE_PATH || '/', output: 'static', trailingSlash: 'always', integrations: site ? [sitemap()] : [], vite: { build: { assetsInlineLimit: 0 } } });
