# Project architecture

Astro renders pages and case studies into static HTML. Project metadata lives in `src/data/projects.ts`, while the profile and timeline live in `src/data/profile.ts`. The shared layout supplies navigation, metadata and theme controls. `src/lib/url.ts` builds internal URLs under the configured hosting base path.

The HTML contains the project gallery, contact form and scene illustration. Browser scripts enhance the gallery with filtering and defer the Three.js scene on supported devices. The contact form posts to Formspree. Markdown articles generate individual routes when article files exist.
