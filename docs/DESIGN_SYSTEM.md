# Design system

## Direction

A dark editorial portfolio with one original linked orbital sculpture. The visual metaphor is connected software systems: small parts forming one clear, reliable whole. Typography and real project evidence carry the story; 3D supplies atmosphere. This is the design specification, not a claim that every behavior has passed QA.

## Color

| Role | Dark | Light |
| --- | --- | --- |
| Canvas | `#080B12` | `#F6F7FB` |
| Surface | `#121824` | `#FFFFFF` |
| Text | `#F4F7FB` | `#121826` |
| Secondary text | `#A4AFBF` | `#526071` |
| Cyan emphasis | `#65DBFF` | Darken sufficiently for text on white |
| Violet accent | `#8A7DFF` | Use primarily as a decorative accent |

CSS custom properties own theme values. Buttons use dark text on a bright fill in dark mode. Thin neutral borders separate content without surrounding every paragraph with a box. Do not use accent color alone to indicate state; active controls also change shape, border or semantic pressed/current state. Test actual computed combinations, including hover/focus and subdued labels.

## Type and spacing

Use locally served Space Grotesk for display type and Inter for body text, retaining their font licenses. A system monospace stack is sufficient for compact engineering labels. Body copy starts at 16px; ordinary labels at 14px; small metadata is exceptional. Hero type uses `clamp()` and wraps within the viewport rather than clipping. Use a consistent 4/8px spacing rhythm, generous section gaps and a bounded reading width. Intro and featured work receive the most space; timelines and skills do not need full-screen sections.

## Composition

- Desktop hero: editorial text balanced with an original orbital sculpture; clear work, résumé and contact actions.
- Mobile hero: text first, compact static sculpture/fallback beneath or behind it, with no decorative element overlapping the heading.
- Work: generous media proportions, readable status labels, short problem statements, verified technology tags and ordinary case-study links.
- Case studies: introduction, source/status summary, project-specific evidence, appropriately labeled media and clear return navigation.
- About: authorized portrait and concrete verified introduction; no generated face.
- Experience: dates, role, organization and type of work visibly separated. Education is not presented as employment.
- Contact: direct verified email and social destinations remain usable alongside the form.

## Motion

GSAP is reserved for a short hero entrance timeline where coordinated timing adds value. Simple hover/focus feedback uses CSS. Section reveals are optional progressive enhancements; HTML is visible before scripts run. Use approximately 150–250ms for control feedback and 400–700ms for an entrance, with short staggers. Never block content behind a loader or hijack native scroll.

The Three.js module loads after meaningful content and only on capable, sufficiently wide fine-pointer devices without reduced-motion preference. Cap pixel ratio and geometry complexity; pause offscreen and while the document is hidden. Dispose geometry, materials, renderer resources and listeners when torn down. WebGL failure retains the static visual. Pointer parallax is subtle and affects decoration only. Mobile, reduced-motion and unavailable-WebGL paths remain intentionally designed experiences.

## Components and accessibility

Astro renders semantic navigation, main content, sections, articles and footer. Shared components handle project cards, buttons and metadata without adding a client framework. Use real anchors for navigation and buttons for state changes. Theme choice persists when storage is available; storage failure must not break the page. Menus expose expanded state, close with Escape and restore useful focus. Search/filter changes announce result counts and retain a readable empty state. Visible focus rings and adequate touch targets are required in both themes.

## Media rules

Only authorized owner photographs, verified project assets and original artwork are eligible. Original cover diagrams are explicitly labeled illustrations, never screenshots. Decorative sculpture and background textures are hidden from assistive technology; meaningful images receive descriptive alt text and stable dimensions. No reference template branding, portraits, characters, GitHub metrics or third-party scenes are included.

## Verification

Review screenshots at the requested phone, tablet and desktop widths. Check heading wrapping, grid rhythm, contrast, touch targets and content density in both themes. Run keyboard, reduced-motion, no-JavaScript and failed-WebGL scenarios. The production QA report records actual results and exceptions; it must not turn design intentions into unmeasured performance or accessibility claims.
