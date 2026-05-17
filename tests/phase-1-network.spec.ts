import { test, expect } from '@playwright/test';

test('home page makes no Google Fonts network requests @smoke', async ({ page }) => {
  const googleFontsRequests: string[] = [];

  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
      googleFontsRequests.push(url);
    }
  });

  await page.goto('/');
  // Wait for fonts to potentially load
  await page.waitForLoadState('networkidle');

  expect(googleFontsRequests, `Google Fonts requests found: ${googleFontsRequests.join(', ')}`).toHaveLength(0);
});
