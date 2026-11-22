# QA report — portfolio v4.1 worktree (November 22, 2026)

## Passed in this workspace

- `npm test` — PASS: static security/CSP/download checks, all 10 generated case studies, editorial integration, privacy/404/public-only packaging assertions.
- `npm run test:browser` — PASS with installed Chrome and `CHROME_PATH` configured. Chromium tested 320, 360, 390, 430, 768, 1024, 1440, and 1920 px in both light/dark themes with reduced motion. The suite exercised theme switching, mobile menu keyboard behavior, project dialog/lightbox focus and Escape handling, deep-linked case studies, horizontal overflow, browser errors, and unknown-route 404.
- `firebase emulators:exec --only firestore --project demo-portfolio "node tests/firestore.mjs"` — PASS: published review reads allowed only with both flags; pending/private reads, listing, contact access, invalid submissions, self-publishing, edits, and deletes denied.
- `node --check serve.js` and `node --check tests/browser.cjs` — PASS.
- Local HTTP smoke — homepage, privacy page and a project case study return 200. Unknown route returns the standalone 404 with status 404. `/.git/config` and `/docs/BASELINE_AUDIT.md` return 404 without exposing their contents.
- Public-link check (`node tests/links.mjs`) — 28 checked URLs returned HTTP 200; LinkedIn returned HTTP 999, so that destination remains unverified by this automated check.
- Food Fight release API and APK checksum sidecar requests — both release records/assets and sidecar responses were available. APK binaries were not downloaded, hashed locally, or installed.
- `npm install --no-package-lock` installed the declared Playwright test dependency; npm reported 0 vulnerabilities in the 3-package installed dependency tree. No package manifest or lockfile change was made.

The browser suite first exposed the local server's plain-text response for unknown routes and an outdated 404 heading assertion. Both were corrected, and the complete responsive browser suite then passed.

## Not run / not claimed

- No screenshots reviewed across all browsers or physical devices; automated Chromium coverage does not replace manual visual, keyboard-only, screen-reader, or touch QA.
- No Lighthouse scores, Core Web Vitals field data, axe/WCAG audit, or full accessibility conformance claim.
- Live Formspree delivery, Google/Firebase sign-in, actual production review moderation, deployed CSP/security headers, and GitHub Pages/Firebase production deployment were not exercised.
- No APK/EXE installation or local recomputation of release binary hashes.
- The reference ZIPs/videos were not available, so they were not inspected (see `REFERENCE_AUDIT.md`).

## Release status

Static, browser, local server, and Firestore emulator checks pass. The local feature branch is not production deployment evidence. Confirm owner-provided identity/resume details and live service configuration, then review and merge through the repository's normal approval process before publishing.
