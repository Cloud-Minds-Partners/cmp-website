import { test, expect } from '@playwright/test';

// Tests for COMP-05: NewsletterSubscribe
// Verifies:
//   - Form renders with email input and submit button
//   - JS submit mock: intercept CF endpoint, return {status:"subscribed"}, expect success state
//   - CF endpoint URL contract preserved in social.ts

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/dev/components');
  if (!response || response.status() === 404) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
  if (!page.url().includes('dev/components')) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }
});

test('NewsletterSubscribe — form renders with email input and submit button', async ({ page }) => {
  const form = page.locator('form').filter({ has: page.locator('input[type="email"]') }).first();
  await expect(form).toBeVisible();
  await expect(form.locator('input[type="email"]')).toBeVisible();
  await expect(form.locator('button[type="submit"]')).toBeVisible();
});

test('NewsletterSubscribe — JS submit shows success state (mocked CF endpoint)', async ({ page }) => {
  // Intercept the Cloud Function subscribe endpoint
  await page.route('**/subscribe**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'subscribed' }),
    });
  });

  await page.goto('/dev/components');
  if (!page.url().includes('dev/components')) {
    test.skip(true, 'Dev preview page not yet built (Wave 2 pending)');
  }

  const form = page.locator('form').filter({ has: page.locator('input[type="email"]') }).first();
  await form.locator('input[type="email"]').fill('test@example.com');
  await form.locator('button[type="submit"]').click();

  // Success message should appear — check for success/confirmation text
  // The form should either hide or be replaced with a success message
  await expect(
    page.locator('[class*="success"], [data-state="success"], :text("You\'re in"), :text("Welcome"), :text("subscribed")')
  ).toBeVisible({ timeout: 5_000 });
});

test('NewsletterSubscribe — CF endpoint URL contract (grep check)', async () => {
  // This test verifies the CF endpoint is preserved in social.ts as the single source of truth.
  // It runs as a file-system assertion, not a browser test.
  const { execSync } = await import('child_process');
  const result = execSync(
    'grep -q "us-central1-dcplatformcmp.cloudfunctions.net/subscribe" /Users/edgardabreu/Projects/CODE/cmp-website/src/config/social.ts && echo "OK"',
    { encoding: 'utf8' }
  );
  expect(result.trim()).toBe('OK');
});
