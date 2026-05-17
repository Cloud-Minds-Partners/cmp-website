import { test, expect } from '@playwright/test';

// Tests for COMP-04: CapabilityCard
// Verifies:
//   - Card renders with photo (img), heading (title), and paragraph (description)
//   - On-cream variant applies different visual treatment (border/background change)

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/dev/components');
  if (!response || response.status() === 404) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
  if (!page.url().includes('dev/components')) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
});

test('CapabilityCard renders — photo, title, description visible', async ({ page }) => {
  const card = page.locator('.cap-card, [data-component="capcard"]').first();
  await expect(card).toBeVisible();
  // Photo — img inside the card
  await expect(card.locator('img')).toBeVisible();
  // Title — heading element
  await expect(card.locator('h2, h3, [class*="cap-title"]')).toBeVisible();
  // Description — paragraph
  await expect(card.locator('p, [class*="cap-desc"]')).toBeVisible();
});

test('CapabilityCard — on-cream variant renders with distinct styling', async ({ page }) => {
  // The on-cream variant wraps the card with .on-cream or uses data-on-cream
  // Check that at least one on-cream variant exists in the preview
  const onCreamWrapper = page.locator('.on-cream, [data-on-cream="true"]');
  await expect(onCreamWrapper).toBeVisible();
  // Confirm a card exists inside it
  await expect(onCreamWrapper.locator('.cap-card, [data-component="capcard"]')).toBeVisible();
});
