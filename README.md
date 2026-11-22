# Muhammad Irfan Waseem · Flutter Developer

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
