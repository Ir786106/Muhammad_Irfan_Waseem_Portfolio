# Reference audit — November 22, 2026

Sources: eleven ZIP files supplied by the owner, plus seven videos in one ZIP. Archive inventories and license filenames were inspected without executing third-party code. The pre-existing reference inspection notes in the master prompt supplied stack and interaction summaries. Selected patterns were **re-implemented originally**; no third-party source, artwork, fonts, personal images, or 3D models were imported.

| ZIP | Supplied stack/type | License in archive | Relevant idea | Decision / risk |
|---|---|---|---|---|
| vincentdenil-site-main | Experimental creative website | All rights reserved | Minimal editorial layout, strong work presentation | Inspiration only. Copy nothing. |
| ChanMeng666-main | GitHub profile and evidence/CV build tooling | GPL-3.0 | Evidence-backed storytelling | Inspiration only; incompatible copying/reuse requires a separate license analysis. |
| lokendra.tech-main | Creative web and 3D/dither interactions | No top-level license found | Controlled visual texture, premium project panels | Inspiration only; do not import assets. |
| claude-app-portfolio-template-main | Astro conversational portfolio | MIT | Guided navigation and explanatory Q&A | Omit imitation chatbot; static case studies offer more credible depth. |
| portfolio-website-template-main | Astro static portfolio | MIT | SEO-friendly project routes and concise case studies | **Selected**: static, linkable project pages; implemented independently. |
| folioweave-main | Next.js multi-theme portfolio | MIT | Case-study structure, accessible galleries, tests | **Selected**: editorial layouts and media labels, without framework migration. |
| Kukzze-main | GitHub profile SVG graphics | MIT | Technical personal brand | **Selected**: restrained wordmark styling; no borrowed identity assets. |
| personal-website-customize-your-own-master | Vite/React, GSAP design | MIT | Polished transitions, reusable components | **Selected**: understated hover and reveal styling; no heavy dependency. |
| malikrajat.github.io-main | Static Bootstrap personal site | MIT | Clear résumé information hierarchy | **Selected**: evidence-first content structure. |
| Hemansh-X797-main | GitHub profile metrics/SVG | MIT | Developer credibility | Omit fake skill radar and unverified numerical metrics. |
| husanbek-coder.uz-3d-web-app-main | Next.js, Three.js/Spline site | No top-level license found | Immersive hero | Omit heavy 3D models; preserve existing conditional orbit scene. |

## Seven video motion references

The videos were provided as visual **motion references**, not licensed web media. Descriptions map the visible design direction recorded in the supplied master prompt / prior video review, not a claimed code implementation.

| Video (time suffix) | Theme | Implementation decision |
|---|---|---|
| 3.22.54 PM | Dark 3D cinematic introduction | Borrow dramatic page hierarchy but keep portfolio usable. |
| 3.22.55 PM | Atmospheric, character-driven hero | Reject third-party character art. Preserve authorized portrait. |
| 3.23.21 PM | Game-like 3D scenery / motion | Reject WebGL-heavy environment for mobile performance. |
| 3.23.22 PM | Cursor-tracking interactions | Keep native cursor; hover affordances without tracking/accessibility cost. |
| 3.23.23 PM | Developer UI / animated text | Use original headline and editorial hierarchy. |
| 3.23.23 PM (1) | Oversized type, near-black theme | Selected for modern headline typography and reduced clutter. |
| 3.23.30 PM | Editorial transitions and projects | Selected for independent, scrollable, linkable case studies. |

## Decision matrix

- **KEEP** original HTML/CSS/ES modules, Firebase security, Formspree/Google sign-in integration, active project data, profile links and résumé.
- **ENHANCE** visual tokens, hero hierarchy, work summaries, mobile legibility and accessibility.
- **IMPLEMENT** ten static case-study routes, real media labels, next/previous navigation, theme persistence and route tests.
- **FIX** missing `assets/` directory in the release packager, deep-route local serving and clean GitHub Pages artifact publishing.
- **OMIT for now** framework migration, AI chatbot, third-party hero art, third-party video playback, synthetic awards/testimonials and large 3D imports.

If an asset was licensed MIT and is used directly in a future update, preserve its copyright/notice. This release reuses none of the 11 templates' source assets.
