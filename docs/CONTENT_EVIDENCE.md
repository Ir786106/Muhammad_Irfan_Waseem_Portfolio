# Content and evidence ledger

Reviewed 2026-11-22. This ledger distinguishes local source claims from independently checked public metadata. No owner identity, work history, adoption metric, testimonial, or product deployment has been invented.

| Published item | Evidence source | Status / guardrail |
|---|---|---|
| Owner name, role, email, LinkedIn, biography | `index.html`, `modules/profile.js`, `README.md` | Retained from the existing public site; owner should reconfirm personal details and résumé before production. |
| Project titles, roles, summaries, statuses, stack and links | `modules/projects.js` | Existing published source records; not independently verified against every project repository. Keep prototype/source-repository labels distinct from shipped products. |
| Food Fight stable release | [GitHub release v1.8.0](https://github.com/Ir786106/food-fight-app/releases/tag/v1.8.0) and GitHub Releases API | Verified 2026-11-22: non-prerelease `v1.8.0`, APK and Windows installer assets exist. APK checksum sidecar reports `f7de876cd96c5ae59263b7e711da375d62186cb5fc438425d39f0ef522d6d06c`. |
| Food Fight preview release | [GitHub release preview-1.8.2+19](https://github.com/Ir786106/food-fight-app/releases/tag/preview-1.8.2%2B19) and GitHub Releases API | Verified 2026-11-22: prerelease `preview-1.8.2+19` (Build 19), APK and Windows installer assets exist. APK checksum sidecar reports `0340ea4d9432f236bfa3747bb77342904a1c4f38f7e6d7e07d7289c8f9e94260`. |
| Food Fight download targets | `modules/projects.js` and release asset metadata | Stable APK: `FoodFight_v1.8.0_release.apk`; Windows: `FoodFight-1.8.0-Windows-x64-Setup.exe`. Preview APK: `FoodFight_v1.8.2_release.apk`; Windows: `FoodFight-1.8.2-Windows-x64-Setup.exe`. Exact URLs are stored in the project's `links` object. GET checks returned HTTP 200; binary download, checksum verification against downloaded binaries, and installation were not performed. |
| Ittehad Food Industries | `modules/projects.js` and linked public repository | Presented as a working public source repository, not a verified shipped ERP. Do not conflate it with academic MillX ERP. |
| Project covers and galleries | `modules/projects.js`, `assets/projects/`, `Images/` | Genuine source artwork is labeled as repository art/product artwork where it is not an application screenshot. No missing UI screenshots were fabricated. |
| Résumé | PDF/DOCX under `Images/` | Existing files retained; contents and public-data approval need owner review. |
| Testimonials | `modules/firebase.js`, `modules/reviews.js`, `firestore.rules` | Display requires both owner approval and publication permission. No live review data was read. |
| Blog and social destinations | `index.html`, `modules/profile.js`, project records | Existing public links only. The link-check script returned HTTP 999 for LinkedIn; this anti-bot response does not establish whether the profile is available. |

### GitHub release evidence

The public API endpoints checked were `https://api.github.com/repos/Ir786106/food-fight-app/releases/tags/v1.8.0` and `https://api.github.com/repos/Ir786106/food-fight-app/releases/tags/preview-1.8.2%2B19`. The stable release is marked `prerelease: false`; the 1.8.2 Build 19 release is marked `prerelease: true`. Both releases expose Android APK, Windows installer, and APK `.sha256` sidecar assets. The sidecar contents were fetched as text; the APK binaries themselves were not downloaded for local hash recomputation.

No usage metrics, client quotes, awards, user counts, testimonials, or production-readiness claims were added.
