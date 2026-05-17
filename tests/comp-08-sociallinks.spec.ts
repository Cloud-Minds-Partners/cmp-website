import { test, expect } from '@playwright/test';

// Tests for COMP-08: SocialLinks
// Verifies:
//   - LinkedIn anchor with SVG icon renders
//   - WhatsApp anchor with SVG icon renders (footer variant always shown)
//
// SocialLinks renders in two variants: header (inline) and footer (brand cell).
// The footer variant always shows WhatsApp regardless of env var.

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/dev/components');
  if (!response || response.status() === 404) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
  if (!page.url().includes('dev/components')) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
});

test('SocialLinks — LinkedIn icon renders with href', async ({ page }) => {
  const linkedInLink = page.locator('a[href*="linkedin.com"]').first();
  await expect(linkedInLink).toBeVisible();
  // Should contain an SVG icon
  await expect(linkedInLink.locator('svg')).toBeVisible();
});

test('SocialLinks — WhatsApp icon renders with href (footer variant)', async ({ page }) => {
  // Footer variant always renders WhatsApp icon in brand cell (not dependent on env var)
  const whatsappLink = page.locator('footer a[href*="wa.me"], [data-variant="footer"] a[href*="wa.me"]').first();
  await expect(whatsappLink).toBeVisible();
  // Should contain an SVG icon
  await expect(whatsappLink.locator('svg')).toBeVisible();
});
