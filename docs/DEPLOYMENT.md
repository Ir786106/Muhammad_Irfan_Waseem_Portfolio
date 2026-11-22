# Deployment / developer commands

No production deployment has been performed. The source checkout preserves its Git history and work is on `feat/complete-portfolio-2026`; review the branch/PR state before pushing or publishing.

```bash
node tools/generate-case-studies.mjs
npm test
npm install  # once, for the declared Playwright browser-test dependency
$env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run test:browser
firebase emulators:exec --only firestore --project demo-portfolio "node tests/firestore.mjs"
node tools/package-site.cjs  # requires all public assets committed in HEAD
node serve.js
```

The **public artifact** is generated in `release/site/`, and an independent `release/portfolio.zip` is created by the same packaging command. The GitHub Pages workflow on `main` now uses this public-only artifact instead of uploading the repository root. Pages URLs use `https://ir786106.github.io/Muhammad_Irfan_Waseem_Portfolio/` and static `projects/<slug>/` routes; no framework router or server rewrites required.

Firebase Hosting uses `release/site` per `firebase.json`; deploy only after testing the live Google sign-in, reviews moderation, contacts and CSP/security headers. Any changes to Firebase hosting or Auth domains must be approved and separately checked before enabling production.

To publish: review changes → commit on feature branch → push branch → open PR → run CI and browser review → merge after approval. This file is **not** evidence that any live URL was deployed or updated.

The browser suite covers desktop/mobile widths, both color schemes, reduced motion, keyboard navigation, case-study deep links, and the standalone 404 route. The Firestore rules test runs locally against the configured emulator; it does not touch production data. Contact delivery, Google sign-in, and live moderation still require a separately authorized test account.


## v3.0 release note

Run `npm test` to include the new editorial structure checks. `editorial.css` and `modules/featured.js` are bundled in `release/site` by the versioned packaging script. The `main` Pages deployment workflow checks the new editorial assertions. Once the feature branch is reviewed and merged, the existing GitHub Pages action can deploy the public-only artifact; verify actual site availability, resource paths, accessible navigation, contact delivery and review moderation afterward.
