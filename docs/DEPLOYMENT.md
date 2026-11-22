# Deployment / developer commands

No deployment or GitHub push was performed in this offline environment. The original `.git` history is kept and the branch is `feat/premium-portfolio-redesign`.

```bash
node tools/generate-case-studies.mjs
node tests/static.cjs
node tests/case-studies.cjs
node tests/browser.cjs  # only with Playwright + CHROME_PATH and local server
node tools/package-site.cjs  # requires all public assets committed in HEAD
node serve.js
```

The **public artifact** is generated in `release/site/`, and an independent `release/portfolio.zip` is created by the same packaging command. The GitHub Pages workflow on `main` now uses this public-only artifact instead of uploading the repository root. Pages URLs use `https://ir786106.github.io/Muhammad_Irfan_Waseem_Portfolio/` and static `projects/<slug>/` routes; no framework router or server rewrites required.

Firebase Hosting uses `release/site` per `firebase.json`; deploy only after testing the live Google sign-in, reviews moderation, contacts and CSP/security headers. Any changes to Firebase hosting or Auth domains must be approved and separately checked before enabling production.

To publish: review changes → commit on feature branch → push branch → open PR → run CI and browser review → merge after approval. This file is **not** evidence that any live URL was deployed or updated.


## v3.0 release note

Run `npm test` to include the new editorial structure checks. `editorial.css` and `modules/featured.js` are bundled in `release/site` by the versioned packaging script. The `main` Pages deployment workflow checks the new editorial assertions. Once the feature branch is reviewed and merged, the existing GitHub Pages action can deploy the public-only artifact; verify actual site availability, resource paths, accessible navigation, contact delivery and review moderation afterward.
