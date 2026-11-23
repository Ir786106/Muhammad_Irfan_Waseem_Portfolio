import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const output = process.argv[2] || 'dist';
const base = `/${(process.env.BASE_PATH || '/').split('/').filter(Boolean).join('/')}`.replace(/\/$/, '');
const origin = process.env.SITE_URL || 'https://portfolio.invalid';
const pages = readdirSync(output, { recursive: true }).filter(file => file.endsWith('.html'));
const failures = [];
const fragments = new Map();

if (pages.length < 19) failures.push(`Expected at least 19 HTML pages, found ${pages.length}`);
for (const file of pages) {
  const route = file.replaceAll('\\', '/').replace(/(^|\/)index\.html$/, '$1');
  const address = new URL(`${base}/${route}`, origin);
  const html = readFileSync(join(output, file), 'utf8');

  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    // Canonical and social URLs may use the configured production origin.
    const target = new URL(value, address);
    if (target.origin !== address.origin) continue;
    if (!target.pathname.startsWith(`${base}/`)) {
      // Another public project can live on the same GitHub Pages account.
      if (/^https?:\/\//i.test(value)) continue;
      failures.push(`${file}: URL escapes base path: ${value}`);
      continue;
    }
    const relative = decodeURIComponent(target.pathname.slice(base.length + 1));
    const local = join(output, relative);
    const destination = existsSync(local) && statSync(local).isDirectory() ? join(local, 'index.html') : local;
    if (!existsSync(destination)) {
      failures.push(`${file}: missing destination: ${value}`);
    } else if (target.hash && destination.endsWith('.html')) {
      if (!fragments.has(destination)) {
        const destinationHtml = readFileSync(destination, 'utf8');
        fragments.set(destination, new Set([...destinationHtml.matchAll(/\sid="([^"]+)"/g)].map(item => item[1])));
      }
      if (!fragments.get(destination).has(decodeURIComponent(target.hash.slice(1)))) {
        failures.push(`${file}: missing fragment: ${value}`);
      }
    }
  }
}
if (process.env.SITE_URL && !existsSync(join(output, 'sitemap-index.xml'))) {
  failures.push('Expected sitemap-index.xml for the configured site origin');
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${pages.length} HTML pages and their local href/src targets at ${base || '/'}`);
}
