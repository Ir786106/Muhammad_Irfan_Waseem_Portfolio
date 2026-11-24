import { expect, test } from '@playwright/test';

test('internal navigation and fragment links resolve', async ({ page }) => {
  await page.goto('/');
  const origin = new URL(page.url()).origin;
  const pending = new Set([page.url()]);
  const visited = new Map<string, Set<string>>();
  const fragments: { source: string; target: URL }[] = [];

  for (const address of pending) {
    const response = await page.goto(address);
    expect(response?.ok(), address).toBe(true);
    const targets = await page.locator('[id]').evaluateAll(elements => elements.map(element => element.id));
    visited.set(address, new Set(targets));

    const links = await page.locator('a[href]').evaluateAll(elements => elements.map(element => (element as HTMLAnchorElement).href));
    for (const href of links) {
      const target = new URL(href);
      if (target.origin !== origin || !target.pathname.endsWith('/')) continue;
      if (target.hash) fragments.push({ source: address, target: new URL(target) });
      target.hash = '';
      pending.add(target.href);
    }
  }

  expect(visited.size).toBeGreaterThanOrEqual(18);
  for (const { source, target } of fragments) {
    const id = decodeURIComponent(target.hash.slice(1));
    target.hash = '';
    expect(visited.get(target.href)?.has(id), `${source} links to ${target.href}#${id}`).toBe(true);
  }
});

test('résumé page offers one PDF download', async ({ page }) => {
  await page.goto('/resume/');
  for (const [label, suffix, signature] of [
    ['Download PDF', '.pdf', '%PDF-'],
  ]) {
    const link = page.getByRole('link', { name: label, exact: true });
    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();
    const response = await page.request.get(new URL(href!, page.url()).href);
    expect(response.ok()).toBe(true);
    expect((await response.body()).subarray(0, signature.length).toString()).toBe(signature);

    const [download] = await Promise.all([page.waitForEvent('download'), link.click()]);
    expect(download.suggestedFilename()).toMatch(new RegExp(`\\${suffix}$`));
    expect(await download.failure()).toBeNull();
  }
});

test('design gallery serves four distinct images on desktop and mobile', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/design/');
    const images = page.locator('.design-gallery img');
    await expect(images).toHaveCount(4);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(node =>
        node instanceof HTMLImageElement && node.complete && node.naturalWidth > 0,
      )).toBe(true);
    }
    const urls = await images.evaluateAll(nodes => nodes.map(node => (node as HTMLImageElement).currentSrc));
    expect(new Set(urls).size).toBe(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('screenshots open in a keyboard-dismissible lightbox', async ({ page }) => {
  await page.goto('/projects/eduquest/');
  const screenshot = page.locator('.case-screenshots figure a').first();
  await screenshot.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Project screenshot' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(screenshot).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
