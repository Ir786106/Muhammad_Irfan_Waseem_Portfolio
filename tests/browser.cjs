// Run with Playwright installed and CHROME_PATH pointing to a Chrome executable.
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const BASE_URL = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:8080/';
(async () => {
    const browser = await chromium.launch({executablePath:process.env.CHROME_PATH, headless:true});
    try {
        for (const width of [320, 768, 1440]) {
            for (const colorScheme of ['light','dark']) {
                const page = await browser.newPage({viewport:{width,height:900},colorScheme,reducedMotion:'reduce'});
                const errors = [];
                page.on('pageerror', error => errors.push(error.message));
                await page.route('https://**/*', route => route.abort());
                await page.goto(BASE_URL);
                assert.equal(await page.locator('html').getAttribute('data-theme'),colorScheme);
                assert.equal(await page.locator('.proj-card').count(),(await import('../modules/projects.js')).projects.length);
                assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
                assert.equal(await page.locator('.proj-card h3').first().textContent(), 'Food Fight');
                assert.equal(await page.locator('#testimonials').isVisible(), false);
                assert.ok(await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].every(a => a.hash.length < 2 || document.getElementById(a.hash.slice(1)))));
                await page.locator('#theme-toggle').click();
                assert.equal(await page.locator('html').getAttribute('data-theme'),colorScheme === 'light' ? 'dark' : 'light');
                await page.locator('#theme-toggle').click();
                if (await page.locator('#hamburger').isVisible()) {
                    await page.locator('#hamburger').click();
                    assert.equal(await page.locator('#hamburger').getAttribute('aria-expanded'), 'true');
                    await page.keyboard.press('Escape');
                    assert.equal(await page.locator('#hamburger').getAttribute('aria-expanded'), 'false');
                }
                const trigger = page.locator('.proj-card button').first();
                await trigger.focus();
                await page.keyboard.press('Enter');
                assert.ok(await page.locator('#project-dialog').evaluate(d => d.open));
                await page.keyboard.press('Shift+Tab');
                assert.ok(await page.locator('dialog[open]').evaluate(d => d.contains(document.activeElement)));
                await page.keyboard.press('Escape');
                await page.locator('dialog[open]').waitFor({state:'detached'});
                assert.ok(await trigger.evaluate(b => b === document.activeElement));
                const image = page.locator('.gal-item').first();
                await image.focus();
                await page.keyboard.press('Enter');
                assert.ok(await page.locator('#lightbox').evaluate(d => d.open));
                await page.keyboard.press('Escape');
                await page.locator('dialog[open]').waitFor({state:'detached'});
                assert.ok(await image.evaluate(b => b === document.activeElement));
                assert.ok(!await page.locator('script[src*="three.min"]').count());
                await page.getByRole('button', {name:'View Developer Portfolio details',exact:true}).click();
                await page.getByRole('button', {name:'Next screenshot'}).click();
                assert.ok((await page.locator('.project-gallery img').getAttribute('src')).endsWith('portfolio-projects.webp'));
                await page.keyboard.press('Escape');
                await page.locator('dialog[open]').waitFor({state:'detached'});
                assert.deepEqual(errors, []);
                // Deep-linked case study must load correctly for Pages-style directory URLs.
                const caseURL = new URL('projects/foodfight/', BASE_URL).href;
                const caseResponse = await page.goto(caseURL);
                assert.equal(caseResponse.status(), 200);
                assert.ok(await page.getByRole('heading', {name:'Food Fight.'}).isVisible());
                assert.ok(await page.locator('.case-cover img').isVisible());
                assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
                await page.locator('#case-theme').click();
                assert.equal(await page.locator('html').getAttribute('data-theme'), colorScheme === 'light' ? 'dark' : 'light');
                const response = await page.goto(new URL('missing-test-page', BASE_URL).href);
                assert.equal(response.status(), 404);
                assert.equal(await page.locator('h1').textContent(), '404');
                assert.ok(await page.getByRole('link', {name:'Back to Home'}).isVisible());
                console.log(width, colorScheme, 'passed');
                await page.close();
            }
        }
    } finally { await browser.close(); }
})().catch(e => {console.error(e); process.exitCode=1;});
