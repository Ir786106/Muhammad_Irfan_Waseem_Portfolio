# Image asset audit

`Images.7z` contained 37 files. The 34 images comprised 31 rasters and three SVG files. The three résumé files were outside the image audit. Extraction took place under ignored local research. The scan also covered 15 existing public image assets, including the favicon.

Every image was SHA-256 hashed. FFmpeg decoded raster images to 24 × 24 grayscale samples for normalized-size pixel comparison. Matches were checked against the contact sheet to reject lookalikes such as distinct certificates with the same layout. SVGs were checked as vector source and by exact hash. The archive and original files were preserved.

| Archive entries | Decision and placement |
| --- | --- |
| `1.jpg`, `1.webp` | Same coffee artwork. Keep the existing exact WebP at `images/design/coffee-poster.webp`. |
| `4.jpg`, `4.webp` | Same wordmark artwork. Keep the existing exact WebP at `images/design/monsterxd-wordmark.webp`. |
| `7.png`, `7.webp` | Same smoothie artwork. Keep the existing exact WebP at `images/design/smoothie-poster.webp`. |
| `6.png`, `6.webp` | Same first aid artwork. Added the existing 960 × 960 optimized WebP, 47,022 bytes, as `images/design/first-aid-poster.webp` on the graphic design gallery. |
| `Irfan.jpg`, `Irfan.webp`, `portrait-small.webp` | Same portrait. Preserve the existing two exact WebPs as responsive renditions. The homepage now selects between them. |
| `share-card.jpg` | Exact existing social preview image. Keep the current path. |
| `2.jpg/webp`, `3.jpg/webp`, `5.jpg/webp` | Three distinct poster designs, each with two encodings. Menu, travel and study advertisements remain in the archive. |
| Four `cert-*.jpg/webp` pairs and `LinkedIn/2.jpg` through `5.jpg` | Four distinct certificates. Each has two encodings and an exact LinkedIn copy of the JPEG. None added to the visual gallery. |
| `2Irfan.jpg` | Distinct portrait. The portfolio already has an established profile image. |
| `2favicon.svg`, `icons.svg`, `logo.svg` | Distinct legacy vector files by byte hash. Existing branding and artwork remain in place. |

No archive image was identified as a new software screenshot. Existing EduQuest and previous portfolio screenshots remain in their case studies. Concept artwork remains labeled as such.

Chromium loaded all four unique gallery images at 1440px and 390px without horizontal overflow. The production artifact check verified 20 pages and their local image and link paths.
