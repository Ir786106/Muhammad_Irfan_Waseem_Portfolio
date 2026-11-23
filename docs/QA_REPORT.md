# QA report

## Mobile homepage measurement

Lighthouse 13.6.0 measured the local production homepage in headless Chrome with its default mobile settings. Performance scored 94, accessibility 100, best practices 100 and SEO 100. Largest contentful paint was 2.0 seconds, total blocking time was 280 milliseconds and cumulative layout shift was zero. Lighthouse flagged a slower-than-expected host CPU. These figures cover one local homepage run.

## Final local release

Astro check returned zero errors, lint passed, and Vitest passed both unit tests. Production generated 20 HTML pages and the artifact validator passed. All 10 Playwright tests passed against the local preview. This includes the new gallery regression check for four distinct images at 1440px and 390px. Browser test captures now write to ignored `test-results/`, preserving the historical screenshots.

The repository has no deployment remote configured. The GitHub Pages workflow and release instructions are present. Public hosting and real Formspree receipt remain unverified.

The isolated GitHub Pages build under `/portfolio-next/` generated 19 pages and a sitemap. An artifact check verified local links, image and script URLs, and fragment targets, and now runs in the Pages workflow. It exposed a canonical URL for a nonexistent `/404/` route, which was removed. Chromium verified navigation to the résumé page and both résumé downloads under the prefix.

Two additional Chromium checks passed on the local production preview. The first crawled at least 18 linked internal page routes and checked their fragment targets. The second verified the PDF and Word file signatures and completed both downloads. External URLs and the live deployment were outside this check.

The rendering optimization passed Astro type checking, lint, the 19-page production build and all seven Playwright tests. A separate Chromium SwiftShader check counted WebGL draw calls and verified that drawing stopped after scrolling past the sculpture and resumed on return. Hidden-tab scheduling is handled by `visibilitychange` and was not separately measured.

The follow-up Chromium run passed both targeted journeys. Gallery filtering showed an empty state and led to the Food Fight case study and its source link. A mocked Formspree rejection preserved the message, and a mocked acceptance cleared it. No live inquiry was sent.

At 1440 × 900, Chromium using SwiftShader rendered the active WebGL canvas in [Origin](screenshots/awakening-webgl.png) and [TeamSync](screenshots/awakening-webgl-teamsync.png). This verifies software WebGL rendering, not hardware GPU performance or Lighthouse scores.

Astro type check returned zero errors. ESLint passed. Vitest passed 2 tests. Chromium Playwright passed 4 tests covering keyboard access, theme persistence, the homepage axe scan, responsive layout at eight widths, image loading, static navigation without JavaScript and the reduced-motion fallback. Screenshots are in `docs/screenshots/`.

Astro generated 19 static pages. The GitHub Pages configuration was built separately with a project prefix and sitemap enabled. The live deployment, inbox delivery, full-site accessibility conformance and Lighthouse scores remain unverified.
