// Run with Playwright installed and CHROME_PATH pointing to a Chrome executable.
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
(async () => {
    const browser = await chromium.launch({executablePath:process.env.CHROME_PATH, headless:true});
    try {
        for (const width of [320, 768, 1440]) {
            for (const colorScheme of ['light','dark']) {
                const page = await browser.newPage({viewport:{width,height:900},colorScheme,reducedMotion:'reduce'});
                const errors = [];
                page.on('pageerror', error => errors.push(error.message));
                await page.route('https://**/*', route => route.abort());
                await page.goto('http://127.0.0.1:8080/');
                assert.equal(await page.locator('html').getAttribute('data-theme'),colorScheme);
                assert.equal(await page.locator('.proj-card').count(),(await import('../modules/projects.js')).projects.length);
                assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
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
                console.log(width, colorScheme, 'passed');
                await page.close();
            }
        }
    } finally { await browser.close(); }
})().catch(e => {console.error(e); process.exitCode=1;});
