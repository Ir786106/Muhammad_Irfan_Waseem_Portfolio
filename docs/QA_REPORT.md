# QA report — portfolio refresh

## Checks performed on 2026-11-22

- `node tests/static.cjs` — **PASS** (image dimensions, inline script policy, no inline HTML handlers, safe links, CSP hash).
- `node tests/case-studies.cjs` — **PASS** (10 generated routes, sitemap, every referenced local media item, theme CSS, route packaging).
- `node --check` on edited JavaScript modules — **PASS**.
- Python `tinycss2` parse of `style.css`, `premium.css`, and `case-studies.css` — **PASS**, 0 top-level parse errors (448 + 44 + 77 CSS rules).
- HTML extraction via BeautifulSoup — **PASS**, one `<h1>` per page and no missing local linked stylesheet, images or scripts.
- HTTP smoke GET against `node serve.js` — **PASS**, root, Food Fight, TeamSync, cover WebP and case-study stylesheet returned 200 with expected media types.
- GitHub API release records — `v1.8.0` stable and `preview-1.8.2+19` release assets verified as listed (actual downloads not executed).
- Browser Playwright execution attempted with `/usr/bin/chromium` — **BLOCKED BY ENVIRONMENT** with `net::ERR_BLOCKED_BY_ADMINISTRATOR` for both HTTP localhost and file URLs. This is not a successful browser regression test; it must be rerun on a local developer machine or CI runner that permits browser navigation.

No Lighthouse scores, automatic accessibility scores, Firebase emulator claims or live deployment claims were fabricated. Target test widths for the browser suite are 320, 768 and 1440 pixels in dark/light and reduced-motion. Edge cases 360/390/430/1024px remain manual recommendations.

## Known boundaries

- Browser console for third-party Firebase and Formspree integrations may show network errors when offline; these are not evidence of successful external delivery.
- Browser screenshots in test report are local only; no publication or live-domain check implied.
- Full WCAG 2.2 AA or Lighthouse 90+ cannot be claimed without actual independent audits of every representative page and interaction.
