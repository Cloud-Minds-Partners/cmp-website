import { test, expect } from '@playwright/test';

// Tests for COMP-07: LangSwitcher
// Verifies:
//   - PT link href on /dev/components routes to /pt/dev/components
//   - EN link has aria-current="page" (default locale)
//
// LangSwitcher is hidden below 880px (display:none via SiteHeader media query).
// Force desktop viewport so toHaveAttribute assertions target a visible element.
test.use({ viewport: { width: 1280, height: 720 } });

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/dev/components');
  if (!response || response.status() === 404) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
  if (!page.url().includes('dev/components')) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
});

test('LangSwitcher — PT link href produces /pt/dev/components', async ({ page }) => {
  // On /dev/components (EN locale), the PT link should point to /pt/dev/components
  const ptLink = page.locator('a[href="/pt/dev/components"], [class*="nav-lang"] a[hreflang="pt"], [class*="nav-lang"] a:has-text("PT")');
  await expect(ptLink.first()).toBeVisible();
  await expect(ptLink.first()).toHaveAttribute('href', '/pt/dev/components');
});

test('LangSwitcher — EN link has aria-current="page" on EN locale page', async ({ page }) => {
  // EN is the default locale (prefixDefaultLocale: false), so on /dev/components we are on EN
  const enLink = page.locator('[class*="nav-lang"] a[aria-current="page"], [class*="nav-lang"] a.active[aria-current="page"]');
  await expect(enLink.first()).toBeVisible();
  await expect(enLink.first()).toHaveAttribute('aria-current', 'page');
});
