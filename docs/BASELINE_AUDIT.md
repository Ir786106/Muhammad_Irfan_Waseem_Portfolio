# Baseline audit — November 22, 2026

## Checkout and scope

- Reviewed the editable source checkout at `01_Editable_Source/Muhammad_Irfan_Waseem_Portfolio`, not an unavailable reference ZIP.
- Local branch at review start: `feat/complete-portfolio-2026`, commit `6639d16`; the configured GitHub `main` was at `2ba5ff09`. The feature branch did not yet exist on `origin`.
- An uncommitted whitespace-only change in `CHANGELOG.md` was present before this review and has been preserved.
- The reference ZIPs/videos named in the request were not present; their user-provided descriptions are recorded separately in `REFERENCE_AUDIT.md`.

## Existing implementation to preserve

- Static HTML/CSS/ES modules, with dark/light theme persistence, responsive navigation, keyboard-accessible controls, reduced-motion support, search/filter, dialogs, galleries, and an opt-in Three.js feature.
- `modules/projects.js` is the project data source; it defines ten project records and generates ten static case-study routes.
- Owner profile, portrait and résumé files; existing Formspree contact form; Google/Firebase review submission with explicit publication consent and owner moderation.
- Privacy and standalone 404 pages, sitemap/robots metadata, Firebase Hosting configuration, GitHub Pages workflow, public-only site packager, and local preview server.

## Baseline checks and corrections

- `npm test` passes the static, ten-case-study, editorial, and public-page checks.
- Chromium browser testing found that unknown local routes returned plain text rather than the designed 404 document. `serve.js` now returns the standalone 404 page for unknown and non-public routes while keeping the allowlist and private-file protections; the browser test now asserts the real 404 heading.
- Browser coverage now includes widths 320, 360, 390, 430, 768, 1024, 1440, and 1920 in light and dark themes, with reduced motion and keyboard interaction checks.
- GitHub release API records and public APK checksum sidecars for Food Fight stable `v1.8.0` and preview `preview-1.8.2+19` were checked on 2026-11-22. Asset metadata and exact links are listed in `CONTENT_EVIDENCE.md`; binaries were not downloaded or installed.

## Security and privacy review snapshot

- `modules/firebase.js` contains browser Firebase configuration, which is public client configuration rather than a server credential. Restrict its API key and authorized domains in Firebase Console; App Check is currently not enabled because the site-key setting is empty.
- `firestore.rules` requires Google-authenticated, UID-matched review creation; only allowed fields and unapproved/unpublished values can be submitted. Updates/deletes and contact writes are denied. Reads require both approval and publication permission. `tests/firestore.mjs` passes against the local Firestore emulator.
- The contact form's honeypot and in-browser 30-second cooldown are not server-side rate limiting. Formspree-side spam controls and delivery still need live account verification.
- The local server uses an explicit public-route allowlist, path checks, and symlink checks. Hidden/private project files are not served; unknown paths receive only the public 404 document.
- Static checks validate the CSP and public packaging. No independent penetration test, external dependency audit beyond the installed Playwright package audit, or live Firebase/Formspree assessment was performed.

## Remaining verification and owner input

- Browser automation passed; this is not a substitute for manual cross-browser review, assistive-technology testing, screenshots, Lighthouse, or physical-device checks.
- The external link check returned HTTP 200 for the checked public URLs except LinkedIn, which returned HTTP 999 (likely automated-request filtering; availability remains unverified).
- Live Formspree submission, Google sign-in, actual public review moderation, deployed security headers, and Android/Windows installation remain untested.
- Confirm public identity/contact/resume details and any project-stage changes; provide real project screenshots if desired. Keep Ittehad Food Industries distinct from academic MillX ERP.
- No merge or production deployment is authorized by the audit result alone.
