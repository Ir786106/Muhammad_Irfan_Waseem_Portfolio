import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('system explorer switches projects and returns to Origin without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await page.getByRole('region', { name: 'Interactive project systems' }).getByText('Food Fight', { exact: true }).click();
  await expect(page.getByRole('link', { name: 'Read case study' })).toHaveAttribute('href', '/projects/food-fight/');
  await page.getByText('Origin', { exact: true }).click();
  await expect(page.getByRole('link', { name: 'Read case study' })).toHaveCount(0);
  await context.close();
});
test('homepage, themes, keyboard and accessibility',async({page})=>{await page.goto('/');await expect(page.locator('main h1')).toContainText('Irfan Waseem');await page.keyboard.press('Tab');await expect(page.getByText('Skip to content')).toBeFocused();await page.locator('.theme-button').click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','light');const a=await new AxeBuilder({page}).setLegacyMode().analyze();expect(a.violations).toEqual([])});
test('responsive layout and media',async({page})=>{for(const width of [320,360,390,430,768,1024,1440,1920]){await page.setViewportSize({width,height:900});await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i instanceof HTMLImageElement ? (i.loading='eager',i.decode()).then(()=>i.naturalWidth>0).catch(()=>false) : false)).then(results=>results.every(Boolean)))).toBe(true)}await page.setViewportSize({width:1440,height:900});await page.screenshot({path:'test-results/regression-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/regression-mobile.png',fullPage:true})});
test('static content remains available without JavaScript',async({browser})=>{const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://127.0.0.1:4321/');await expect(page.locator('main h1')).toBeVisible();await expect(page.locator('.project-card').first()).toBeVisible();await context.close()});
test('reduced motion preserves fallback',async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('.sculpture-fallback')).toBeVisible();await expect(page.locator('main h1')).toBeVisible()});
