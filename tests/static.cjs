const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const html = fs.readFileSync('index.html', 'utf8');
assert.ok(!/\s(?:on\w+|style)=/i.test(html), 'No inline handlers or styles');
for (const tag of html.matchAll(/<a\b[^>]*>/g)) {
  if (/target="_blank"/.test(tag[0])) {
    assert.match(tag[0], /rel="[^"]*noopener[^"]*"/);
    assert.match(tag[0], /rel="[^"]*noreferrer[^"]*"/);
  }
}
for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
  assert.match(tag[0], /\bwidth="\d+"/);
  assert.match(tag[0], /\bheight="\d+"/);
  assert.match(tag[0], /\balt="[^"]*"/);
}
for (const file of fs.readdirSync('modules')) {
  const source = fs.readFileSync('modules/' + file, 'utf8');
  assert.ok(!/innerHTML|insertAdjacentHTML|document\.write\(/.test(source), file + ' uses safe DOM construction');
}
const data = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
const hash = crypto.createHash('sha256').update(data).digest('base64');
const config = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
const csp = config.hosting.headers.flatMap(rule => rule.headers).find(header => header.key === 'Content-Security-Policy').value;
assert.ok(csp.includes("'sha256-" + hash + "'"), 'CSP permits the actual structured data');
assert.ok(!csp.includes("'unsafe-inline'"));
assert.equal(config.hosting.public, 'release/site');
assert.match(html, /download="Muhammad_Irfan_Waseem_CV\.pdf"/);
console.log('Static security, image dimensions, download filename and CSP checks passed.');
