# QA report — final packaged portfolio v4.0 (November 22, 2026)

## Verified in this environment

- `npm test`: static markup/security checks, all 10 generated case studies, design integration tests and public-page regressions — PASS.
- `node --check` on the JavaScript source files: PASS (see release validation).
- Browser/CSS parser and internal URL integrity tests: static validation only; not equivalent to browser visual QA.
- Local HTTP smoke: homepage, privacy page and project route return HTTP 200. `.git/config` and other developer-only paths return HTTP 404.
- Package generation builds the public website from the committed source only and includes all 10 case-study pages, artwork, styles, privacy information, and error page.

## Not independently verified

- Automated Playwright Chromium run is blocked in this environment with `net::ERR_BLOCKED_BY_ADMINISTRATOR`. Responsive screenshots and keyboard/browser interaction testing were NOT completed here.
- Live Formspree submission, Firebase sign-in, Firestore security rules in a connected project, consent-gated moderation and live downloads have NOT been exercised here.
- Lighthouse field/mobile performance numbers, Google indexing, actual Chrome/Firefox/Safari rendering and production-domain hosting checks have NOT been executed.
- No GitHub push, merge, or production deployment has been performed.

## Final release readiness

Static source and public files are packaged. Before publishing to a public production site, run `npm run test:browser` on a Windows machine with Chrome installed, verify both color themes at mobile and desktop sizes, exercise the contact form and moderated reviews with test accounts, and check deployed asset paths on GitHub Pages or Firebase Hosting. Owner-provided claims, images, CV and LinkedIn access should be reviewed before publication.

