# Revalidation — 19 November 2026

The requested phase commits already existed when this request arrived. This pass preserved those changes, reran checks and refreshed the delivery inventory. No production deployment or cloud configuration change was made.

## Phase history

| Phase | Existing commit |
|---|---|
| 0: verification and plan | 53f96c6 |
| 1: security and correctness | 5244130 |
| 2: content and résumés | ec33151 |
| 3: SEO | 8534091 |
| 4: performance and accessibility | 4124899 |
| 5: modules and CSP | cef174a |

Later commits add EduQuest evidence and consistent hosting packages. The initial audit is in phase-0.md. Its corrections remain relevant: key restrictions cannot be inferred from source; there were nine project overlays rather than eight; all 32 new-tab links needed the full requested rel value, including 19 that already had noopener.

## Finding disposition

Fixed means implemented in this checkout, not confirmed deployed.

| ID | Status | Evidence or remaining work |
|---|---|---|
| A1 | Fixed | DOM nodes, textContent, clamped ratings and allowlisted HTTPS avatars. |
| A2 | Fixed | Versioned rules/indexes; fresh emulator tests pass. Owner deployment remains. |
| A3 | Fixed | Formspree only; awaited request, honeypot, validation, cooldown and error feedback. Client cooldown is not server-side abuse prevention. |
| A4 | Needs owner input | Existing key restrictions are unknown. App Check initialization is prepared but its site key is empty. |
| A5 | Fixed | Public-only release directory, security and cache headers. |
| A6 | Skipped: superseded | Libraries are self-hosted; no static third-party CDN script or stylesheet tags remain to hash. |
| A7 | Fixed | All new-tab anchors carry both rel tokens; static check passes. |
| B1 | Fixed | Devsphere completed 22 October 2026. |
| B2 | Fixed | Development status and project descriptions no longer imply production shipment. |
| B3 | Needs owner input | One shared LinkedIn value and email used; previous audit corroborated profile defaults. LinkedIn blocks the fresh automated request. Confirm ownership. |
| B4 | Fixed | Incorrect destinations removed; available public destinations attached to project data. Missing URLs remain owner inputs. |
| B5 | Needs owner input | Portfolio and EduQuest have three screenshots each; five other project entries have no screenshots. |
| B6 | Fixed | Unsupported metrics and specific unsupported architecture claims removed. Evidence needed before restoring them. |
| B7 | Fixed | Certificate-on-file wording; issuer verification destination retained for OPSWAT. |
| B8 | Fixed | Real networking article linked; fresh HTTP 200. |
| B9 | Fixed | Workshop presentation compacted; instructor/CEO filler removed. |
| B10 | Fixed | One-page PDF and DOCX already present; download extension corrected. Artifacts not regenerated in this pass. |
| B11 | Fixed | Freelance Flutter role from January 2025 present. |
| B12 | Fixed | Flutter headline; supporting skills retained; other experience compressed. |
| B13 | Fixed | Public section appears only with at least three approved reviews. Permissioned recommendations remain optional owner input. |
| B14 | Fixed | README describes implemented features and project-data editing. |
| C1 | Fixed | Absolute 1200 × 630 share-card URL. Public crawler fetch not revalidated. |
| C2 | Fixed | OG/Twitter/canonical/robots/sitemap/Person data present. Share-debugger acceptance remains pending deployment. |
| C3 | Fixed | Firebase web.app chosen consistently as canonical. |
| D1 | Fixed | Optimized WebP assets and explicit image dimensions. |
| D2 | Fixed | Unused originals and duplicate certificates removed. Irfan.webp is now used. |
| D3 | Fixed | Lazy review SDK and desktop-only nearby 3D loading; self-hosted SVG icons; no eager GSAP/Analytics. |
| D4 | Fixed | Blocking preloader removed. |
| D5 | Fixed | No inline HTML style or event attributes; static check passes. |
| E1 | Fixed | Native labeled dialogs; keyboard containment, Escape and focus return checks pass. |
| E2 | Fixed | Gallery buttons open with Enter and restore focus. |
| E3 | Fixed | Labeled rating control and social links. |
| E4 | Fixed | Skip link, descriptive showcase label, gallery navigation and conditional review navigation. |
| E5 | Fixed | Reduced-motion browser checks pass in both themes at requested widths. See Lighthouse results for automated accessibility score; no claim of a full human screen-reader audit. |
| F1 | Fixed | Shared project array drives cards and reusable detail dialog. |
| F2 | Fixed | Showcase derives its items and count from project data. |
| F3 | Fixed | Small feature modules and strict CSP; structured-data hash verified. |

## Fresh verification

- `node tests/static.cjs`: passed.
- Firestore emulator using demo-portfolio: passed approval visibility, signed-in creation, validation and immutable-review checks.
- `node tests/browser.cjs`: six width/theme combinations passed, reduced motion enabled, external requests aborted, no page errors. Dialog/lightbox keyboard open/close/focus and carousel assertions passed.
- `node tests/links.mjs`: 17 destinations returned 200; LinkedIn returned 999 and X timed out. These two links remain unverified, not proven broken. Overall link-check exit code is 1.
- Cloud Console settings, production headers and share-debugger output remain unverified. No live review or contact was submitted.

See files.md for the complete added/changed/deleted inventory, owner-input.md for all content TODOs, and hosting.md for manual deployment and account steps.

## Lighthouse comparison

| Metric | Recorded baseline (13.5.0) | Previous upgrade (13.5.0) | Fresh run (13.6.0) |
|---|---:|---:|---:|
| Performance | 39 | 97 | 90 |
| Accessibility | 87 | 100 | 100 |
| Best Practices | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 |
| LCP | 4.37 s | 2.41 s | 2.42 s |
| CLS | 0.0009 | 0 | 0 |
| Transfer | 1,309,761 B | 208,977 B | 210,631 B |

Fresh mobile simulated throttling run met all requested numerical targets and had no warnings. The historical baseline reported a load timeout and slow-host warning. Lighthouse versions and host load differ, so this is not a controlled benchmark. Historical results remain unchanged in lighthouse.json; fresh settings are in lighthouse-revalidation.json.
