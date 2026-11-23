import { test, expect } from '@playwright/test';

test('gallery filters, empty state, and case study navigation', async ({ page }) => {
  await page.goto('/projects/');
  await page.getByRole('button', { name: 'Mobile', exact: true }).click();
  const search = page.getByRole('searchbox', { name: 'Search projects' });
  await search.fill('no such application');
  await expect(page.locator('#project-empty')).toBeVisible();
  await search.fill('Food Fight');
  const technology = page.getByLabel('Technology', { exact: true });
  await technology.selectOption('Python');
  await expect(page.locator('#project-empty')).toBeVisible();
  await technology.selectOption('Flutter');
  await expect(page.locator('#project-count')).toHaveText('1 projects');
  await page.getByRole('heading', { name: 'Food Fight', exact: true }).getByRole('link').click();
  await expect(page).toHaveURL(/\/projects\/food-fight\/$/);
  await expect(page.getByRole('link', { name: 'View source on GitHub' })).toHaveAttribute('href', /github\.com\/Ir786106\/food-fight-app/);
});

test('contact reports success only after acceptance and retains input on error', async ({ page }) => {
  let responseStatus = 422;
  await page.route('https://formspree.io/**', route => route.fulfill({ status: responseStatus, json: {}, headers: { 'access-control-allow-origin': '*' } }));
  await page.goto('/contact/');
  await page.getByLabel('Your name').fill('Portfolio QA');
  await page.getByLabel('Email address').fill('qa@example.com');
  const message = page.getByLabel('Your message');
  await message.fill('This is a mocked browser check.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('status')).toContainText('could not be sent');
  await expect(message).toHaveValue('This is a mocked browser check.');
  responseStatus = 200;
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('status')).toContainText('was accepted');
  await expect(message).toHaveValue('');
});
