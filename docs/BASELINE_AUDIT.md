# Supplied portfolio baseline — source review

**Archive**: `Muhammad_Irfan_Waseem_Portfolio-main.7z`, including `.git`, README, JS/CSS/HTML, Firestore rules, hosting config and tests. Baseline commit in this archive: `2ba5ff0` (`release: complete portfolio upgrade and GitHub Pages deployment`). New work was made on `feat/premium-portfolio-redesign`; original archive remains untouched.

## Already present and preserved

- Vanilla HTML/CSS/ES module portfolio with dark/light themes, mobile drawer, scroll progress and optional lazily-loaded Three.js orbit showcase.
- Project source of truth: `modules/projects.js`, 10 records including Food Fight, Ittehad Food Industries, Mandi Pro ERP, TeamSync, HireReady, Saqib Shop, developer portfolio, EduQuest, Python and Dart repositories.
- Project search/filter, accessible details dialogs and galleries.
- Public CV PDF/DOCX under `Images/`; Formspree contact submission; Firebase/Firestore consent-gated, owner-moderated reviews.
- SEO metadata, public profile and social links; Google Pages and Firebase Hosting configuration; static and browser test files.

## Corrected defects

1. `tools/package-site.cjs` previously omitted **`assets/`**, even though several project covers reference paths under `assets/projects/`; fixed in release source list.
2. GitHub Pages workflow uploaded the repository root (`path: .`) rather than a public-only generated site; changed to `release/site` produced by the committed-tree packager.
3. Standalone case-study URLs did not exist; added ten accessible static routes generated from the existing data ledger.
4. The local dev server returned 404 for directory URLs like `/projects/foodfight/`; fixed directory index routing and URL/path sanitization.

## Unverified or deferred

- Do not treat the uploaded repository's project descriptions, experience dates, internship history, current public deployment as independently verified: the archive records are the source here. Owner should confirm publication and outdated status changes.
- Live Formspree delivery, Google sign-in, Firestore App Check, deployment headers and third-party source URLs need networked, configured end-to-end testing.
- Existing heavy orbit code, contact service and review security were **not** rewritten; require separate controlled regression tests before production release.
- No repository migration to Astro/React; the original site was already operational and migration risk outweighed immediate benefit.

## Performance/safety priorities

Retain a static baseline, keep optional WebGL deferred, avoid copied design assets, test at small/mobile widths, and do not show AI-generated artwork as genuine application UI. Do not publish unsupported metrics or testimonials.

**Release-link verification:** connected GitHub release records confirm `v1.8.0` (stable APK, Windows installer, SHA256) and `preview-1.8.2+19` (preview APK, Windows installer, SHA256) have public asset entries as of 2026-11-22. Actual binary downloads and device installs were not run.
