# Recruiter portfolio QA

## Build and navigation

Astro check returned zero errors. ESLint and both Vitest tests passed. The prefixed GitHub Pages production build generated 20 HTML pages, the sitemap index and robots.txt. The artifact validator passed for local links, fragments and asset references. Chrome also passed the internal route crawl. Outbound links were not exhaustively rechecked for this release.

## Browser and accessibility

All 13 Chrome tests passed. The suite covered keyboard lightbox opening and Escape dismissal with focus restoration, the single PDF download, project filtering, mocked Formspree outcomes, theme persistence, mobile layout from 320px through desktop, JavaScript-free content and reduced motion. The homepage axe scan found no violations in the tested state. Real Formspree inbox delivery remains unverified.

## Mobile Lighthouse

One lab run against the local prefixed production homepage scored 96 Performance, 100 Accessibility, 100 Best Practices and 100 SEO. Largest Contentful Paint was 1.0 seconds and Cumulative Layout Shift was 0. The raw result is in test-results/lighthouse-recruiter-mobile.json. These scores do not measure the public host.

## Remaining content

The homepage and case studies mark missing evidence with [ADD: ...] prompts. The checklist enumerates screenshots, demos and captions, architecture, technical challenges, measurable highlights, the VeilGuard publication URL, tool confirmation and approved testimonials.

The robots file is included under the project prefix. Host-wide crawler directives belong to the origin-level robots file. The production sitemap is published under the project prefix.
