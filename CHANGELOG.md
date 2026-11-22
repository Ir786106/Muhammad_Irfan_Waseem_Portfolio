# Portfolio Change Log

## v3.0 — Complete editorial portfolio update (2026-11-22)

### Website and visual design
- Rebuilt the hero layout with a new editorial headline, practical CTAs, authentic owner portrait, CSS artwork and a restrained cyan/blue palette.
- Added a data-driven Selected Work layout and a four-step software development approach section.
- Improved dark/light themes, responsive CSS, visual hierarchy, mobile typography, touch sizing, skill cards, contact panels and gallery presentation.
- Simplified mobile and desktop navigation to six primary destinations without removing the underlying sections.

### Engineering and accessibility
- Preserved all 10 real project data records and generated standalone case studies.
- Implemented visible project-search result counts and a clear no-match message.
- Added WAI-ARIA tab semantics and arrow/Home/End keyboard support to skills.
- Made the heavy Three.js orbit optional by a desktop user action; retained accessible project links on unsupported devices.
- Improved modal focus restoration from optional 3D interactions.
- Retained contact/Formspree, Firebase authentication and review moderation without risky migration.

### Reliability and deployment
- Extended release packaging to include `editorial.css` and `modules/featured.js` along with all project media.
- Added `tests/editorial.cjs`, updated CI static checks, upgraded README, design notes, QA report and a Roman Urdu getting-started file.
- Local static tests, CSS/HTML integrity checks, HTTP checks and ZIP integrity tests passed.

### Remaining production validation
- Browser screenshots and full Playwright navigation were blocked by the container policy and must be run on Windows or CI with browser access.
- Live contact delivery, Google sign-in/Firestore moderation, Lighthouse scores, external links and social media previews need real environment tests.
- No live GitHub or Firebase deployment was performed.
