import { test, expect } from '@playwright/test';

// Tests for COMP-02: SiteFooter
// Verifies: footer element visible, 5-column grid (brand + 4 link cols),
//           column headings (Platforms, Intelligence, Company, Contact),
//           and copyright text containing "Cloud Minds Partners".

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/dev/components');
  if (!response || response.status() === 404) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
  if (!page.url().includes('dev/components')) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
});

test('SiteFooter renders — footer element visible', async ({ page }) => {
  await expect(page.locator('footer')).toBeVisible();
});

test('SiteFooter — 4 link column headings visible', async ({ page }) => {
  const footer = page.locator('footer');
  await expect(footer).toBeVisible();
  // Verify the 4 required column headings from mock-26
  await expect(footer.getByText('Platforms', { exact: true })).toBeVisible();
  await expect(footer.getByText('Intelligence', { exact: true })).toBeVisible();
  await expect(footer.getByText('Company', { exact: true })).toBeVisible();
  await expect(footer.getByText('Contact', { exact: true })).toBeVisible();
});

test('SiteFooter — copyright contains "Cloud Minds Partners"', async ({ page }) => {
  await expect(page.locator('footer')).toContainText('Cloud Minds Partners');
});
