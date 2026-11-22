/**
 * Generate static, no-framework case-study routes from the existing project ledger.
 * Only verified public records in modules/projects.js may be presented as facts.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { projects } from '../modules/projects.js';

const baseUrl = 'https://ir786106.github.io/Muhammad_Irfan_Waseem_Portfolio/';
const escape = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const safeExternal = url => /^https:\/\/[a-z\d.-]+(?:[:/]|$)/i.test(url);
const slug = id => {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error('Invalid project ID: ' + id);
  return id;
};
const linkLabels = {
  repo: 'Source repository', demo: 'Live demo', stable: 'Stable release', preview: 'Preview release',
  apk: 'Android APK', windows: 'Windows installer', previewApk: 'Preview Android APK',
  previewWindows: 'Preview Windows installer', checksum: 'Release checksum',
  releaseHistory: 'All releases', architecture: 'Architecture diagram', implementation: 'Implementation', store: 'App store'
};
function asset(path) {
  if (!/^(?:Images|assets)\/[a-zA-Z\d._/ -]+$/.test(path) || path.includes('..')) throw new Error('Unsafe local asset path: ' + path);
  return `../../${path.split('/').map(encodeURIComponent).join('/')}`;
}
function tagList(values) {
  return (values ?? []).map(value => `<li>${escape(value)}</li>`).join('\n');
}
function projectPage(project, index) {
  const title = escape(project.title);
  const canonical = `${baseUrl}projects/${slug(project.id)}/`;
  const cover = project.images?.[0];
  const visual = cover ? `<figure class="case-cover"><img src="${asset(cover.src)}" alt="${escape(cover.alt)}" width="${Number(cover.width)}" height="${Number(cover.height)}" fetchpriority="high"><figcaption>${escape(cover.label || 'Project media')} · ${escape(cover.alt)}</figcaption></figure>` : '<div class="case-placeholder" aria-hidden="true"></div>';
  const gallery = (project.images ?? []).slice(1).map((image, i) => `<figure class="case-shot"><img src="${asset(image.src)}" alt="${escape(image.alt)}" loading="lazy" width="${Number(image.width)}" height="${Number(image.height)}"><figcaption>${escape(image.label || 'Project media')} ${i + 2} · ${escape(image.alt)}</figcaption></figure>`).join('\n');
  const links = Object.entries(project.links ?? {}).filter(([key,url]) => linkLabels[key] && safeExternal(url)).map(([key,url]) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(linkLabels[key])} <span aria-hidden="true">↗</span></a>`).join('\n');
  const previous = projects[(index + projects.length - 1) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<title>${title} — Case Study | Muhammad Irfan Waseem</title>
<meta name="description" content="${escape(project.description)}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="article"><meta property="og:title" content="${title} — Project Case Study"><meta property="og:description" content="${escape(project.description)}"><meta property="og:url" content="${canonical}">
<link rel="canonical" href="${canonical}"><link rel="icon" href="../../Images/logo.svg" type="image/svg+xml">
<link rel="stylesheet" href="../../case-studies.css">
<script type="module" src="../../case-studies.js"></script>
</head>
<body>
<a class="case-skip" href="#main">Skip to project</a>
<header class="case-header"><div class="case-shell case-nav"><a class="case-brand" href="../../index.html" aria-label="Return to portfolio home">IRFAN<span>.</span></a><nav aria-label="Project navigation"><a href="../../index.html#projects">All projects</a><a href="../../index.html#about">About</a><a href="../../index.html#contact">Contact</a></nav><button class="case-theme" type="button" id="case-theme" aria-label="Switch color theme">◐ <span class="theme-label">Theme</span></button></div></header>
<main id="main">
<section class="case-hero"><div class="case-shell">
<div class="case-breadcrumb"><a href="../../index.html">Portfolio</a><span aria-hidden="true">/</span><a href="../../index.html#projects">Projects</a><span aria-hidden="true">/</span><span aria-current="page">${title}</span></div>
<div class="case-hero-grid"><div class="case-hero-copy"><div class="case-kicker"><span class="case-signal" aria-hidden="true"></span>PROJECT CASE STUDY <span class="case-index">${String(index + 1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}</span></div><h1>${title}<span class="case-period">.</span></h1><p class="case-lede">${escape(project.description)}</p><div class="case-status"><span>Project status</span><strong>${escape(project.status)}</strong></div><ul class="case-tags" aria-label="Technologies">${tagList(project.tags)}</ul><a class="case-scroll" href="#overview">Explore project <span aria-hidden="true">↓</span></a></div>${visual}</div>
</div></section>
<section class="case-content case-shell" id="overview"><div class="case-section-heading"><span class="case-number">01 / THE STORY</span><h2>Building for a <em>real problem.</em></h2></div><div class="case-story-grid"><article class="case-panel"><h3>The challenge</h3><p>${escape(project.problem)}</p></article><article class="case-panel"><h3>My contribution</h3><p>${escape(project.role)}</p></article><article class="case-panel case-result"><h3>Current outcome</h3><p>${escape(project.result)}</p><p class="case-caveat">Status reflects the project's published description; it is not a claim of independent production verification.</p></article></div></section>
${(project.features?.length ?? 0) ? `<section class="case-content case-shell"><div class="case-section-heading"><span class="case-number">02 / IMPLEMENTATION</span><h2>What the project <em>includes.</em></h2></div><ul class="case-feature-grid">${tagList(project.features)}</ul></section>` : ''}
${gallery ? `<section class="case-content case-shell"><div class="case-section-heading"><span class="case-number">03 / PROJECT MEDIA</span><h2>A closer <em>look.</em></h2></div><p class="case-media-note">Repository images, interface screenshots, and conceptual artwork are labeled separately; illustrations are not presented as app screenshots.</p><div class="case-media-grid">${gallery}</div></section>` : ''}
<section class="case-content case-shell"><div class="case-section-heading"><span class="case-number">${gallery ? '04' : '03'} / EVIDENCE & LINKS</span><h2>Go beyond <em>the visuals.</em></h2></div><div class="case-links">${links || '<p>No publicly verified links have been provided for this project.</p>'}</div></section>
<section class="case-next case-shell" aria-label="More projects"><div><span class="case-number">NEXT PROJECT</span><a href="../${slug(next.id)}/">${escape(next.title)} <span aria-hidden="true">↗</span></a></div><div><span class="case-number">PREVIOUS</span><a href="../${slug(previous.id)}/">${escape(previous.title)} <span aria-hidden="true">↗</span></a></div></section>
</main><footer class="case-footer"><div class="case-shell"><span>© ${new Date().getUTCFullYear()} Muhammad Irfan Waseem</span><a href="../../index.html#contact">Have a project? Let's talk ↗</a><a href="../../privacy.html">Privacy &amp; data use</a></div></footer>
</body></html>\n`;
}
const ids = new Set();
for (const [index, project] of projects.entries()) {
  if (ids.has(project.id)) throw new Error('Duplicate project ID');
  ids.add(project.id);
  const target = new URL(`../projects/${slug(project.id)}/`, import.meta.url);
  await mkdir(target, {recursive:true});
  await writeFile(new URL('index.html',target), projectPage(project, index), 'utf8');
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[baseUrl, `${baseUrl}privacy.html`, ...projects.map(p => `${baseUrl}projects/${slug(p.id)}/`)].map(loc=>`  <url><loc>${escape(loc)}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(new URL('../sitemap.xml', import.meta.url), sitemap, 'utf8');
console.log(`Generated ${projects.length} case-study pages and sitemap.xml`);
