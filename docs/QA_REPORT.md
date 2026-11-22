# QA report — complete portfolio redesign v3.0 (2026-11-22)

## Checks performed

- `npm test` — PASS: static security, résumé link, image sizes, Firebase CSP hash, case-study generator/assets/sitemap, editorial components, focused navigation, search/result feedback, ARIA tabs, opt-in 3D structure and packaging.
- `node --check` on all changed JavaScript modules — PASS.
- HTML integrity: duplicate IDs, H1 count, local image/script/style references, fragment links — verified separately in release script.
- CSS syntax: checked with tinycss2 in release validation.
- Local HTTP smoke: homepage, 10 case-study routes and representative local assets — checked with curl.
- Browser regression: Chromium in this environment blocks navigation with `net::ERR_BLOCKED_BY_ADMINISTRATOR`. This is NOT a passing visual/browser test.
- Live Formspree submission, Google sign-in, Firestore owner moderation and Google indexing: NOT VERIFIED. Existing integrations and rules are preserved.
- GitHub push, PR merge and live deployment: NOT PERFORMED.

## Release additions

1. New editorial hero featuring the original portfolio portrait and CSS-built workflow composition.
2. Data-driven selected work (Food Fight, Ittehad, TeamSync), including direct links to in-depth case studies.
3. New four-step development approach, refined theme and accessible focus states.
4. Six-link responsive navigation and searchable 10-project library with result counts.
5. Keyboard ARIA technology tabs and optional, explicitly launched 3D orbit with usable static alternative.
6. Updated package/CI includes all public project artwork and v3 files.

## Owner / production sign-off

1. On local Windows Chrome, test 320/360/390/430/768/1024/1440px, both themes and reduced motion; run `npm run test:browser`.
2. Run Lighthouse; record REAL performance/accessibility/SEO scores. No numerical scores are asserted here.
3. Complete an authorized real Formspree contact submission and test failure state.
4. Test Firebase Google sign-in, Firestore rules and consent-gated moderation using a test identity/emulators.
5. Recheck current LinkedIn access, CV details, certifications, project claims, and publication permissions.
6. Verify live GitHub Pages deep links, mobile menu and public APK/Windows release downloads after deployment.
