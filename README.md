# Muhammad Irfan Waseem — Developer Portfolio (v4.0)

This repository contains the **actual source code** for the updated portfolio, not a mockup. It is a static HTML/CSS/ES module site with a refined cinematic/editorial landing page, genuine portrait from the supplied original portfolio, source-backed project records, ten generated case-study pages, and accessible interactive controls. The design is original and does not copy the code, images, videos or distinctive branding from the reference templates.

## What changed in v4.0 (building on v3)

- Added clear `privacy.html` information for Formspree contact submissions, Google/Firebase reviews, browser theme storage, and data requests.
- Rebuilt the 404 page for independent GitHub Pages/Firebase compatibility and better mobile presentation.
- Hardened `serve.js` so local previews do not serve private repository files or development-only documents.
- Added no-JavaScript links to five real project case studies, and added privacy to sitemap and public packaging.
- Preserved v3 features and existing owner media and links.

## Previous v3.0 redesign

- Completely redesigned homepage hero: original responsive photo/workflow composition, clearer positioning, direct GitHub/LinkedIn/résumé/contact links and responsive mobile behavior.
- Editorial **Selected Work** area that uses a single `modules/projects.js` source of truth for Food Fight, Ittehad and TeamSync; direct links to full case studies.
- New **How I build** process section and more consistent dark/light theme with accessible contrast and keyboard focus styles.
- Reduced desktop/mobile navigation to six high-value sections while keeping gallery, certifications, writing, reviews and optional orbit accessible by scrolling/links.
- Improved project search and filtering with visible result count and a helpful empty state.
- Skills use ARIA tab semantics with left/right/Home/End keyboard support.
- 3D orbit is **opt-in**, never an automatic heavy WebGL load; functional static case-study links remain available on all devices and reduced-motion setups.
- Fixed deploy packaging to include `editorial.css`, source-backed static case studies, `assets/projects/` artwork, and other public assets.
- Preserved existing Formspree contact integration, Firebase sign-in/review moderation, public CV, project releases, and GitHub Pages/Firebase hosting infrastructure.

**Limits:** Chromium browser checks now pass at eight viewport widths (320–1920 px), in both themes and with reduced motion; this is not a substitute for manual screenshots, cross-browser/physical-device, screen-reader, or Lighthouse testing. External Formspree delivery and production Firebase moderation have not been exercised. No production deployment has been performed.

## Local setup and release

```bash
node tools/generate-case-studies.mjs
npm test
node serve.js
# visit http://127.0.0.1:8080/

# After reviewing and committing the public source files:
node tools/package-site.cjs
# deploy release/site (or use the GitHub Pages workflow on main)
```

To run Playwright browser tests locally, install dependencies with `npm install`, start the development server, and then run `npm run test:browser`. On Windows, set `CHROME_PATH` to your installed Chrome/Chromium executable if necessary.

## Update portfolio content

- Projects: `modules/projects.js` (one source of truth; rerun `node tools/generate-case-studies.mjs`).
- Public email and LinkedIn: `modules/profile.js`, with a matching update to verified metadata and any static hero links.
- Theme and page composition: `editorial.css` (new design), `premium.css`, `style.css` (legacy components), `case-studies.css`.
- Main public media: `Images/` (owner portrait and résumé), `assets/projects/` (repository art).
- Contact provider: existing form `action` in `index.html` and `modules/contact.js`.
- Reviews: `modules/firebase.js`, `modules/reviews.js`, `firestore.rules`. Test rule updates with Firebase emulator before deploying.

---

## Previous version: original Flutter portfolio and case-study foundation

Vanilla HTML, CSS and ES modules for a mobile development portfolio with dark and light themes, original editorial styling, and ten searchable project case-study pages. Run `node serve.js` and open http://localhost:8080. Both Firebase Hosting and GitHub Pages can serve these files. Project detail routes live in `projects/<id>/` and are generated from `modules/projects.js`.

Public contact: muhammadirfan.infosec@gmail.com · [LinkedIn](https://www.linkedin.com/in/muhammad-irfan-waseem-48226b297/). The one-page résumé is available in PDF and Word under Images.

## Verified project priority

The showcase prioritizes Food Fight, Ittehad Food Industries and this portfolio repository. Food Fight is linked to verified v1.8.0 stable APK and Windows assets and separate v1.8.2 Build 19 preview assets. Ittehad's public repository is presented as a working rice-industry source repository, not as a separately verified MillX ERP release.

Genuine repository artwork is stored under `assets/projects/food-fight/` and `assets/projects/ittehad-food/`. Food Fight's repository states that application screenshots are not currently available; 3–5 privacy-safe application screenshots can later be added to `docs/screenshots/` there. Ittehad's onboarding images are genuine repository assets, not application screenshots.

## How to add a project

Add one object to modules/projects.js with a unique id, title, category, status, description, problem, role, result and tags. Leave unknown links out of links. For a screenshot carousel, add three to five approved WebP files and enter their src, alt, width and height in images. Use repo, demo, store or apk for public destinations. Optional architecture and implementation links can point to a published diagram or a specific source file. Check the filter, project dialog, gallery controls and showcase after adding the entry.

The contact form uses Formspree. Reviews require Google sign-in and owner moderation. Three genuine reviews with owner approval and confirmed publication permission reveal the public section. New submissions collect explicit consent and remain private until both moderation flags are set. See [deployment notes](audit/hosting.md) for rules tests and console settings. The original review is in [Phase 0](audit/phase-0.md).

## Preview and package a release

After committing site changes, run `node tools/package-site.cjs` from the checkout. It uses Node and Git to produce `release/site/` for Firebase Hosting and `release/portfolio.zip` for GitHub Pages. Both contain only the committed public entry points, images, modules and vendored libraries. The generated output is ignored by Git.

Run `firebase emulators:start --only hosting --project demo-portfolio` to preview the packaged files. The browser still uses the public Firebase and Formspree configuration, so use the separate Firestore rules tests for moderation checks. After deployment check the security and cache response headers on the live host. The local Hosting emulator used in release verification omitted those response headers.

## Premium portfolio refresh (2026-11-22)

- `theme-init.js` applies dark/light preference before first paint; `premium.css` refines the homepage hero, layout and project CTAs without replacing the existing site logic.
- `tools/generate-case-studies.mjs` generates ten static accessible `projects/<id>/index.html` pages, including accurate labels and evidence links, and updates the sitemap. Run it after changing project records.
- `case-studies.css` / `case-studies.js` implement standalone route styling and shared theme preference with no runtime framework.
- `node tests/static.cjs` and `node tests/case-studies.cjs` verify essential security/route behavior. `node tests/browser.cjs` requires Playwright and a Chrome executable; start `node serve.js` first.
- `node tools/package-site.cjs` must run from a **clean committed** public source and includes all `assets/`, generated projects, styles, modules, images and vendor files. GitHub Pages CI uploads `release/site`, not the source directory.
- Reference, baseline, content, design, QA and deployment records are under `docs/`. Do not use borrowed videos or template imagery as production assets.

### Quick start

```bash
# Node.js 22 recommended
node tools/generate-case-studies.mjs
node serve.js                       # http://127.0.0.1:8080
node tests/static.cjs
node tests/case-studies.cjs

# Optional browser tests: npm install; set CHROME_PATH to installed Chrome/Chromium
# PowerShell example: $env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
# Run a separate terminal with the local server first, then:
npm run test:browser

# After committing all public changes (packager builds exclusively from Git HEAD):
node tools/package-site.cjs
```

When port 8080 is taken, start with `PORT=18300 node serve.js` on Linux/macOS or `$env:PORT=18300; node serve.js` in PowerShell; set `PORTFOLIO_TEST_URL=http://127.0.0.1:18300/` for the browser suite.
