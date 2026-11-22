# Design system — portfolio refresh

- **Direction**: technical editorial / luminous cyan on charcoal, with a complementary quiet light mode. Typography is system-based: Inter when installed, Segoe UI and system UI as fallbacks. No third-party fonts or visual assets are imported.
- **Main page**: original CSS remains in `style.css`, enhancement tokens and editorial refinements in `premium.css`. Deliberate progressive enhancement, minimal regression risk.
- **Case studies**: isolated `case-studies.css` design and `case-studies.js` for theme persistence; no React, build-time CSS service, GSAP or runtime 3D.
- **Colors**: dark background #071018, dark foreground #f5f8fa, mint emphasis #82e4e1; light background #f6f8fa, light foreground #152638, teal emphasis #067e88. Contrast requires periodic browser/axe verification.
- **Structure**: generous whitespace, two-column hero, semantic article panels, labelled media and a clear next-project link.
- **Motion**: only small hover transforms, transitions disabled by `prefers-reduced-motion` and no auto audio/video.
- **Mobile**: case study stacks at <=900px; single-column content <=580px, native scrolling, visible focus and skip navigation.


## v3.0 editorial design layer

`editorial.css` is the last loaded stylesheet and supplies the unified final dark/light palette, homepage portrait/workflow composition, modular flagship project cards, approach grid, opt-in orbit fallback and stronger mobile responsive rules. Both themes use meaningful text contrast and support `prefers-reduced-motion`. The 3D orbiter is optional and activated only by a deliberate desktop action. Sections remain usable without Three.js.

Design intentionally uses the original owner portrait, existing project media and CSS-built decorative artwork. No third-party video screenshots, copyrighted reference site components or unlicensed fonts were imported.
