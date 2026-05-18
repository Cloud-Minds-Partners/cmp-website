import { test, expect } from '@playwright/test';

test.describe('Phase 3 pages @smoke', () => {
  test('PAGE-01: home returns 200, hero has 3 slides', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    const slides = page.locator('[data-variant="home"] .slide');
    await expect(slides).toHaveCount(3);
  });

  test('PAGE-02: advisory returns 200, 6 cap-cards', async ({ page }) => {
    const res = await page.goto('/advisory');
    expect(res?.status()).toBe(200);
    const cards = page.locator('.cap-card');
    await expect(cards).toHaveCount(6);
  });

  test('PAGE-03: development returns 200, 3 role-cards', async ({ page }) => {
    const res = await page.goto('/development');
    expect(res?.status()).toBe(200);
    const roles = page.locator('.role-card');
    await expect(roles).toHaveCount(3);
  });

  test('PAGE-04: intelligence returns 200, featured memo section present', async ({ page }) => {
    const res = await page.goto('/intelligence');
    expect(res?.status()).toBe(200);
    await expect(page.locator('.featured')).toBeVisible();
  });

  test('PAGE-05: platforms returns 200, 4 product sections', async ({ page }) => {
    const res = await page.goto('/platforms');
    expect(res?.status()).toBe(200);
    const products = page.locator('.product');
    await expect(products).toHaveCount(4);
  });

  test('PAGE-06: team returns 200, partner names in DOM', async ({ page }) => {
    const res = await page.goto('/team');
    expect(res?.status()).toBe(200);
    const body = await page.textContent('body');
    expect(body).toContain('Edgard');
    expect(body).toContain('Gustavo');
  });

  test('PAGE-07: contact returns 200, email link present', async ({ page }) => {
    const res = await page.goto('/contact');
    expect(res?.status()).toBe(200);
    // Use first() to avoid strict mode violation — email appears in both contact section and footer
    const emailLink = page.locator('a[href*="info@cloudmindspartners.com"]').first();
    await expect(emailLink).toBeVisible();
  });
});
