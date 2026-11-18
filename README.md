# Muhammad Irfan Waseem · Flutter Developer

Vanilla HTML, CSS and ES modules for a mobile development portfolio with dark and light themes. Run `node serve.js` and open http://localhost:8080. Both Firebase Hosting and GitHub Pages can serve these files.

Public contact: muhammadirfan.infosec@gmail.com · [LinkedIn](https://www.linkedin.com/in/muhammad-irfan-waseem-48226b297/). The one-page résumé is available in PDF and Word under Images.

## How to add a project

Add one object to modules/projects.js with a unique id, title, category, status, description, problem, role, result and tags. Leave unknown links out of links. For a screenshot carousel, add three to five approved WebP files and enter their src, alt, width and height in images. Use repo, demo, store or apk for public destinations. Optional architecture and implementation links can point to a published diagram or a specific source file. Check the filter, project dialog, gallery controls and showcase after adding the entry.

The contact form uses Formspree. Reviews require Google sign-in and owner moderation. Three approved reviews reveal the public section. See [deployment notes](audit/hosting.md) for rules tests and console settings. The original review is in [Phase 0](audit/phase-0.md).

## Preview and package a release

After committing site changes, run `node tools/package-site.cjs` from the checkout. It uses Node and Git to produce `release/site/` for Firebase Hosting and `release/portfolio.zip` for GitHub Pages. Both contain only the committed public entry points, images, modules and vendored libraries. The generated output is ignored by Git.

Run `firebase emulators:start --only hosting --project demo-portfolio` to preview the packaged files. The browser still uses the public Firebase and Formspree configuration, so use the separate Firestore rules tests for moderation checks. After deployment check the security and cache response headers on the live host. The local Hosting emulator used in release verification omitted those response headers.
