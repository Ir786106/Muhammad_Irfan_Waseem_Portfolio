# Portfolio audit · 18 November 2026

The supplied snapshot is baseline commit `2a147d4`. It had no Git metadata or remote. This assessment concerns the source and supplied assets. Live Firestore permissions, API restrictions, link ownership and client publication rights require separate evidence.

| Findings | Baseline evidence |
|---|---|
| A1–A3 | Review names and messages enter an HTML template. No local rules or indexes. Contact submission starts a Firestore write and then sends to Formspree. |
| A4–A7 | Browser key present, App Check absent. Cloud Console restrictions unknown. Hosting serves the repository root without security/cache headers. CDN tags lack SRI. Of 32 new-tab links, 13 lack rel entirely and 19 specify only noopener. |
| B1–B3 | Devsphere still active after 22 October. Hero implies delivery while two cards describe development. Three LinkedIn slugs across artifacts. The same email already appears on the site and résumé. |
| B4–B6 | InterviewMate links to the portfolio and profile. Four named projects lack evidence links. Numbered gallery images are design pieces. No project screenshots or substantiation of numerical business results supplied. |
| B7–B9 | Six verification badges, one issuer verification link. Four Nexa images, no Sololearn attachment. Static article list includes a certificate. Three workshop cards repeat issuer and presenter details. |
| B10–B14 | PDF has the old objective, duplicated country, missing recent work and different LinkedIn slug. Download filename lacks extension. Flutter freelance role absent. Titles drift and school roles compete with development experience. Google sign-in is described as verification. README differs on award, project spelling, internship, certifications, icon license and server routing. |
| C1–C3 | Relative portrait OG image, incomplete Twitter and OG tags, no canonical, sitemap, robots file or Person data. Two hosting configurations, only Pages named in OG. |
| D1–D5 | Ten images lack dimensions. Large originals, unused assets and four byte-identical certificate copies. Three, GSAP, icons and Firebase including Analytics loaded eagerly. Overlay waits for window load. 86 inline styles and 33 click attributes. |
| E1–E5 | Nine project overlays plus feedback and lightbox, not eight. Missing dialog labels, focus behavior and gallery/rating keyboard controls. Missing skip link, gallery/review navigation and social labels. Some canvas code respects reduced motion but GSAP and Three do not. |
| F1–F3 | Repeated project markup and separate 10-item orbit array. Its portfolio item even opens feedback. One large entry module. |

## Implementation order

1. Protect Firestore reads and submissions, test in emulator, choose one contact path and tighten hosting.
2. Rewrite copy, hide unconfirmed destinations and evidence, prepare a one-page résumé in both formats.
3. Choose the canonical URL, create a share card, align metadata and crawler files.
4. Reduce initial transfer, improve keyboard navigation and contrast, exercise both themes at three widths and measure mobile.
5. Consolidate project data, separate feature modules, enforce CSP and repeat integration checks.

Owner inputs requested at this boundary cover public contacts, approved projects and URLs, screenshots, metric evidence, real articles, permissioned recommendations and featured selection. Missing materials stay off the published interface.
