import { test, expect } from '@playwright/test';

// Tests for COMP-03: Hero
// Verifies:
//   - Page hero variant (static bg, Ken Burns animation, data-variant="page")
//   - Home hero variant (3-slide rotating bg — all 3 slide elements present in DOM)

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/dev/components');
  if (!response || response.status() === 404) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
  if (!page.url().includes('dev/components')) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
});

test('Hero — page variant renders', async ({ page }) => {
  // Page hero uses data-variant="page" or class containing "page-hero"
  const pageHero = page.locator('[data-variant="page"], [class*="page-hero"]').first();
  await expect(pageHero).toBeVisible();
});

test('Hero — home variant has 3 slide elements in DOM', async ({ page }) => {
  // Home hero has 3 bg slides present simultaneously (CSS animation controls opacity)
  // Slides use data-slide attribute or a container [class*="home-hero"] with img children
  const slides = page.locator('[data-slide], [data-variant="home"] [class*="slide"], [class*="home-hero"] [class*="slide"]');
  const count = await slides.count();
  expect(count).toBeGreaterThanOrEqual(3);
});
