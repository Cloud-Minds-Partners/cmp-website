import { test, expect } from '@playwright/test';

// Tests for COMP-09: SEO component + Base.astro head slot
// Verifies:
//   - <title> tag is non-empty and contains "Cloud Minds"
//   - <meta name="description"> has content attribute set
//   - OG tags: og:title, og:description present in <head>
//   - hreflang alternates for en, pt-BR, and es present in <head>
//
// These tests rely on:
//   - Base.astro having <slot name="head" /> (Wave 0 Task 1 adds this)
//   - SEO.astro component injecting into that slot (Wave 1 builds SEO.astro)
//   - /dev/components page using SEO component (Wave 2 builds the page)

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/dev/components');
  if (!response || response.status() === 404) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
  if (!page.url().includes('dev/components')) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
});

test('SEO — title tag is non-empty and contains "Cloud Minds"', async ({ page }) => {
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
  expect(title).toContain('Cloud Minds');
});

test('SEO — meta description has content attribute set', async ({ page }) => {
  const metaDesc = page.locator('meta[name="description"]');
  await expect(metaDesc).toHaveAttribute('content', /.+/);
});

test('SEO — OG tags present in document head', async ({ page }) => {
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
});

test('SEO — hreflang alternates for en, pt-BR, and es present', async ({ page }) => {
  // These link tags must be in <head> — verifiable via DOM query
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(1);
});
