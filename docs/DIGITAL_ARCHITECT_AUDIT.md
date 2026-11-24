# Digital Architect audit

The published baseline already has four Awakening states, verified résumé assets and a static Pages build. The first usability gaps identified in source are a missing direct contact action in the hero and category-only filtering on the work page. The first implementation pass adds those controls while preserving all ten projects and existing routes. Full route and content verification belongs to the remaining redesign passes.

GitHub API confirmed all ten source repositories are public and active. Food Fight v1.8.0 is a published stable release and preview-1.8.2+19 is a published prerelease. Both list uploaded APKs, Windows installers and APK checksums. The source architecture image exists and the EduQuest demo returned HTTP 200. Release assets were verified through metadata without installing the binaries. The case study now groups downloads by release channel and links both checksums. The prefixed 20-page build and local asset validator passed.

The Awakening hero now uses a drafting grid and cool scene lighting. A native bypass link moves keyboard focus to Featured Work. Chrome verified the bypass, static fallback and absence of horizontal overflow with JavaScript disabled at 320, 390, 768, 1024 and 1440 pixels. The 20-page build passed. Vite still reports the existing lazy Three.js chunk above 500 kB minified.

The personal portfolio brief makes the approved navy-suit portrait the homepage focal point. The new split hero reuses the existing 400w and 640w images and links directly to the supplied résumé PDF. Awakening sits immediately below as a separate project explorer. Chrome verified portrait decoding, viewport width and PDF availability at 320, 390, 768, 1024 and 1440 pixels on the prefixed production preview. The 20-page build and asset validator passed.

## Live mobile Lighthouse baseline

Lighthouse 13.6.0 measured the published homepage at revision 38ede19. Performance was 85, accessibility 100, best practices 100 and SEO 100. LCP was 2.2 seconds, CLS was 0 and total blocking time was 160 ms. The root document response took approximately 1.9 seconds in this lab run. This baseline precedes the deferred animation loading changes.
