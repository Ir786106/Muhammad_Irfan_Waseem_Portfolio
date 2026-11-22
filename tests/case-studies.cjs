const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const generated = spawnSync(process.execPath,['tools/generate-case-studies.mjs'],{encoding:'utf8'});
assert.equal(generated.status,0,generated.stderr);
(async()=>{
  const {projects} = await import('../modules/projects.js');
  const sitemap = fs.readFileSync('sitemap.xml','utf8');
  const css = fs.readFileSync('case-studies.css','utf8');
  assert.match(css,/prefers-reduced-motion/);
  for(const project of projects){
    const pagePath = path.join('projects',project.id,'index.html');
    const html = fs.readFileSync(pagePath,'utf8');
    assert.ok(html.includes(`<title>${project.title.replaceAll('&','&amp;')} — Case Study`));
    assert.ok(html.includes('case-theme'));
    assert.ok(html.includes('Skip to project'));
    assert.ok(html.includes('Current outcome'));
    assert.ok(sitemap.includes(`projects/${project.id}/`));
    assert.ok(html.includes('href="../../case-studies.css"'));
    const srcs = [...html.matchAll(/(?:src|href)="(\.\.\/\.\.\/(?:Images|assets)\/[^\"]+)"/g)].map(x=>decodeURIComponent(x[1]));
    for(const asset of srcs) assert.ok(fs.existsSync(path.resolve(path.dirname(pagePath),asset)),`${pagePath}: ${asset}`);
    for(const link of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(link[0],/rel="noopener noreferrer"/);
    assert.ok(!/\bon(?:click|load|error)\s*=/.test(html));
  }
  const pkg=fs.readFileSync('tools/package-site.cjs','utf8');
  assert.ok(pkg.includes("'assets'"),'Packaging includes project media');
  assert.ok(pkg.includes("'projects'"),'Packaging includes project routes');
  assert.ok(pkg.includes("'case-studies.css'"),'Packaging includes case-study CSS');
  const ui=fs.readFileSync('modules/project-ui.js','utf8');
  assert.ok(ui.includes('project-study-link'),'Cards link to case studies');
  console.log(`Static route, asset, sitemap and package checks passed for ${projects.length} case studies.`);
})().catch(error=>{console.error(error);process.exitCode=1});
