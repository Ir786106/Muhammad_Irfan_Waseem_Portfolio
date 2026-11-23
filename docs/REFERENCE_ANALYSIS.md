# Reference analysis

Reviewed 22 November 2026. All eleven archives were located under the owner's Downloads directory. Their names match the requested names after removing the `(2)` suffix. This review inspected archive entry lists, manifests, READMEs, licenses and selected implementation files as text. No reference application's install scripts were run; no reference was imported as the starting application. Browser behavior of these reference applications was not tested. Source observations below are not runtime QA claims.

## Comparison and decisions

| Archive | Observed architecture and styling | Motion and interaction | License evidence | Original design takeaway |
| --- | --- | --- | --- | --- |
| `vincentdenil-site-main.zip` | Static HTML, inline/site CSS, project directories and separate Three.js experiments; root uses Figtree and a compact personal introduction | Root includes reduced-motion branches; individual 3D viewers use pointer/camera interaction and their own modules | Root LICENSE explicitly says All rights reserved | Treat typography, negative space and separate project destinations as general ideas only. Copy no code, logos, models or artwork. |
| `ChanMeng666-main.zip` | Node ES-module build tooling, YAML profile data, Handlebars and generated README/HTML/profile exports; CV, evidence, media and distribution directories | Primarily structured publishing and evidence organization, not a GSAP/WebGL portfolio template | GNU GPL v3 license text | Keep facts in one content source; separate evidence, CV and display content. No GPL code copied. |
| `lokendra.tech-main.zip` | Next.js App Router, React, TypeScript, Tailwind 4, MDX, next-themes; section and UI components | Motion library, Three.js/R3F/postprocessing, 2D ASCII dither; URL-backed Projects/Crafts tabs; CSS entrance stagger | No license file found in archive tree | Quiet texture outside the reading column, restrained editorial hierarchy and explicit project states. Reimplement independently. |
| `claude-app-portfolio-template-main.zip` | Astro static pages generated from `site.config.ts`; CSS and small browser script; optional Cloudflare contact/Ask worker | Sidebar conversations, question card, details viewer, diagrams and per-tab URLs | MIT LICENSE | Structured, grounded content and deep links; retain normal portfolio navigation. Do not imitate Claude visual identity. |
| `portfolio-website-template-main.zip` | Astro, TypeScript, component-scoped CSS, shared configuration and URL helpers; generated project routes | Sticky header, accessible theme/menu buttons, semantic section links and project navigation | MIT LICENSE | Static-first pages, reusable components, correct base paths and case studies. Build independently rather than copy template. |
| `folioweave-main.zip` | Next.js 16/React, content publishing core, selectable templates, CSS modules and template CSS; Markdown writing and résumé sources | Framer Motion and Three.js; Classic tactile project presentation, Refract globe narrative, Stack portrait interactions, Pond ASCII scene | MIT LICENSE | Choose one coherent language; keep content independent of presentation. Do not merge the seven distinct designs. |
| `Kukzze-main.zip` | GitHub profile README, generated SVG assets, light variants, workflows and structured data; not a standalone React site | Terminal/HUD-like graphics, collapsible architecture details, linked technical cards and external badges | MIT LICENSE | Small monospace metadata can convey engineering context. Do not reproduce another person's telemetry or ventures. |
| `personal-website-customize-your-own-master.zip` | Vite, React 19, TypeScript, React Router; data/config separation; custom CSS | GSAP hero/curtain sequences; pointer spotlight, cursor, tilt, magnetic controls; route-aware mobile navigation | MIT LICENSE | A consistent entrance rhythm, precise-pointer gating and reliable navigation cleanup. Keep native cursor and native scrolling. |
| `malikrajat.github.io-main.zip` | Static HTML, Bootstrap and custom CSS, dedicated article routes; vendored JS utilities | Typed.js, Swiper, GLightbox and Isotope are present; accessible menu attributes and résumé blocks | MIT LICENSE; vendor licenses remain independent | Clear professional chronology and explicit organization/role labels. Do not carry across analytics, ads, statistics or biography. |
| `Hemansh-X797-main.zip` | GitHub README plus generated SVGs and workflow/data files, rather than a standalone app | Theme-aware hero/radar/metrics graphics and contribution snake | MIT LICENSE | Compact technical identity and light/dark graphic variants; no self-rated radar, imported metrics or another author's achievements. |
| `husanbek-coder.uz-3d-web-app-main.zip` | Actual manifest is Next.js 14/React 18, Tailwind, Sass, next-intl and next-themes; README's client/server tree is labeled an example | GSAP, Framer Motion, Three.js, Spline and Lenis dependencies; nested navigation modules and hero section | README claims MIT, but no LICENSE file was found | One independently built 3D focal point, flexible navigation and separated content. Do not transplant Spline scenes or infer asset permission from README prose. |

## Implementation observations

### Vincent De Nil

Inspected root `index.html`, root `LICENSE`/`README.md`, archive hierarchy and several 3D viewer entry points. The supplied archive contains much more than a cinematic homepage: there are project indexes, documents and independent experiments. The root has a brand/emblem, biography and responsive CSS, including a breakpoint at 520px. Three.js import maps belong to specific viewers, not evidence that the entire portfolio requires a WebGL shell. The transferable idea is a clear introduction with deliberate project destinations. Full scenes, imagery, type treatments and personal branding are excluded from reuse.

### ChanMeng666

The manifest describes profile YAML as a single source of truth and scripts that generate multiple public outputs. `cv/`, `docs/answers/`, `docs/stories/` and export directories show an evidence-oriented publishing system. Its strongest relevance is content architecture, not a particular hover treatment. We use separate verified facts and project evidence so personal claims cannot accidentally migrate from inspiration material. Mobile layouts and runtime navigation are not established by the reviewed generator files.

### Lokendra

Inspected `app/globals.css`, `components/sections/header.tsx`, `projects.tsx`, `components/Dither/AsciiDither.tsx`, manifest and tree. Header content is compact; projects switch between Projects/Crafts using a URL query parameter and use one/two-column responsive grids. CSS separates display and body families, supports two themes and uses short staggered entries. The ASCII canvas caps updates at 15 FPS and device pixel ratio at 2, masks the central reading area, and cancels its loop on unmount. Reduced motion freezes wave time but the inspected loop still redraws, so copying it would not meet the new portfolio's goal of stopping unnecessary rendering. Prefer a CSS texture and a separately gated sculpture; no full-screen dither loop is needed.

### Conversational Astro template

The inspected README, manifest and source tree show a static-first architecture with distinct routes for each topic; a question UI enhances ordinary content. Its optional Ask service cites supplied answers and its contact service has real delivery providers. These are useful distinctions: a FAQ must not claim to be a live AI agent, and a form must not display success without an accepted submission. The original new portfolio remains a project-led website; a conversational app shell is not appropriate as its primary navigation.

### Astro portfolio template

Inspected `Header.astro`, `Hero.astro`, homepage and `[slug].astro`. The header only links to sections that have content, uses semantic navigation, named theme controls and `aria-expanded`/`aria-controls` for the menu. The project route uses static path generation, semantic metadata and previous/next destinations. Shared URL helpers make project links and images base-path-aware. These are architectural principles to implement independently. The supplied manifest's version strings are reference facts, not a recommendation to install those versions blindly.

### FolioWeave

Inspected manifest, README, content/resume guides, template tree and selected Classic/Stack/Pond source. Classic navigation includes active sections, a mobile toggle and inert hidden navigation. Its hero has CSS-first opening motion, reduced-motion handling and mobile reflow. Stack's avatar fans photographs on precise-pointer interaction and opens them into a row; Pond keeps project descriptions and links in a compact list. Refract's globe narrative is documented in its README, but was not visually tested. The new site adopts a single narrative and static content model, without the framework's template-selection/plugin machinery.

### Kukzze and Hemansh

These two archives are GitHub profile repositories. Their READMEs select light/dark SVGs with `<picture>` and combine linked project/status data with developer identity graphics. Kukzze has technical diagrams inside native disclosure elements; Hemansh explicitly marks one radar as self-rated and another as repository language data. These images are not transferable evidence of Irfan's skills or activity. SVG scaling alone also does not establish that dense labels are readable on small screens. Use short metadata, ordinary text and semantic lists instead of making essential information an image.

### React/GSAP personal website

Inspected `Navbar.tsx`, `GlobalEffects.tsx`, manifest and README. The effects module gates cursor, tilt and magnetic interactions on fine pointers and reduced-motion preference. Navigation clears an open drawer on route changes, Escape and crossing the mobile breakpoint, preventing stale scroll locks. This is a particularly useful interaction lesson. The new site uses normal document navigation, a simple responsive menu and short animation sequences; it avoids a full-screen curtain that delays route content, a replacement cursor and perpetual global pointer loops.

### Rajat Malik

Inspected static page markup, archive tree, license and README. The site has clear article destinations, biography/schema metadata, experience blocks and familiar Bootstrap layout. Its utilities include gallery, filter and typing libraries, but their presence does not establish that every feature is necessary. The source also includes advertising/analytics integrations that are unrelated to this task. Keep an understandable chronology and useful source links; implement with the new site's shared CSS and static pages.

### Husanbek

The actual source is a Next.js application with `src/app`, section components and nested header navigation modules. Manifest evidence is more reliable than the README's example folder tree. Spline, Three.js, GSAP, Framer Motion and Lenis coexist in its dependency list; this is not a reason to install all of them. The new portfolio needs only an original lightweight Three.js sculpture and selective GSAP orchestration. External scenes and screenshots have unresolved asset rights; none are reused. Mobile and camera behavior remain source-inferred until the reference app itself is run.

## Unified selection

Use Astro's static output and independently authored TypeScript/CSS. Lead with a large, readable name/role and an original orbital sculpture, then move quickly into evidenced projects. Use editorial project covers and case-study routes, a restrained chronology, grouped skills and a real contact path. Reserve cyan/violet for accents and the sculpture. Keep text available without JavaScript and provide a static equivalent to the 3D scene. Do not combine terminal dashboards, chat windows, character scenes and multiple template themes into the same presentation.

## Review limits and security

All archives were available and inspected as text; no claim is made that every file was read or that their builds passed. Selected source was read directly from archive streams, avoiding archive extraction/path traversal and avoiding execution of unknown scripts. Reference snapshots are local research material and excluded from Git/public output. Source licenses do not automatically license every photograph, font, logo or model. No reference assets or implementation code are required for the new site. Video observations belong in `VIDEO_DESIGN_ANALYSIS.md` and must come from the actual recordings rather than these repository descriptions.
