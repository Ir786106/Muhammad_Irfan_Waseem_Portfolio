import { test, expect } from '@playwright/test';

test('avatar tracks the cursor and resets for reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const avatar = page.locator('[data-avatar]');
  await expect(avatar).toHaveAttribute('data-avatar-active', '');
  const intro = page.locator('.personal-hero');
  const bounds = (await intro.boundingBox())!;
  const gaze = (property: string) => avatar.evaluate((element, name) =>
    parseFloat((element as HTMLElement).style.getPropertyValue(name)), property);
  for (const [x, y] of [[.25, .35], [.75, .65]]) {
    await page.mouse.move(bounds.x + bounds.width * x, bounds.y + bounds.height * y);
    await expect.poll(async () => (await gaze('--eye-x')) * Math.sign(x - .5)).toBeGreaterThan(0);
    await expect.poll(async () => (await gaze('--head-y')) * Math.sign(y - .5)).toBeGreaterThan(0);
  }
  await page.mouse.move(1, 1);
  await expect.poll(() => gaze('--eye-x')).toBe(0);
  await expect(avatar.locator('.avatar-eyes')).toHaveCSS('animation-name', /blink/);
  await expect(avatar.locator('.avatar-body')).toHaveCSS('animation-name', /breathe/);
  await page.screenshot({ path: 'test-results/avatar-desktop.png' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(avatar).not.toHaveAttribute('data-avatar-active', '');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await expect(page.getByRole('link', { name: 'View original photograph' })).toHaveAttribute('href', /Irfan.webp/);
  await page.screenshot({ path: 'test-results/avatar-mobile.png' });
});

test('context cursor and coding panel keep real links accessible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const projects = page.getByRole('link', { name: 'View projects' });
  await projects.hover({ position: { x: 12, y: 12 } });
  const cursor = page.locator('.context-cursor');
  await expect(cursor).toBeVisible();
  await expect(cursor).toHaveText('EXPLORE');
  const summary = page.locator('.avatar-code summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.avatar-code')).toHaveJSProperty('open', true);
  await expect(page.locator('[data-avatar]')).toHaveAttribute('data-presenting', '');
  await expect(page.locator('.avatar-code').getByRole('link', { name: 'Food Fight' })).toHaveAttribute('href', /projects\/food-fight\//);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(cursor).toBeHidden();
  await page.getByRole('button', { name: 'Explore Food Fight system' }).click();
  const explorer = page.getByRole('region', { name: 'Interactive project systems' });
  const selected = explorer.getByRole('radio', { name: 'Food Fight' });
  await expect(selected).toBeChecked();
  await expect(selected).toBeFocused();
  await expect(explorer.getByRole('link', { name: 'Read case study' })).toHaveAttribute('href', /projects\/food-fight\//);
  await expect(page.locator('[data-avatar]')).not.toHaveAttribute('data-presenting', '');
});
