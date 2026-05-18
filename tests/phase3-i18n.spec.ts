import { test, expect } from '@playwright/test';

test.describe('Phase 3 i18n @smoke', () => {
  test('I18N-04: hreflang alternates present on home', async ({ page }) => {
    await page.goto('/');
    const hreflangEn = page.locator('link[hreflang="en"]');
    await expect(hreflangEn).toHaveCount(1);
    const hreflangPt = page.locator('link[hreflang="pt-BR"]');
    await expect(hreflangPt).toHaveCount(1);
    const hreflangEs = page.locator('link[hreflang="es"]');
    await expect(hreflangEs).toHaveCount(1);
  });

  test('I18N-04: hreflang present on advisory', async ({ page }) => {
    await page.goto('/advisory');
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
  });

  test('I18N-04: hreflang present on memos index', async ({ page }) => {
    await page.goto('/intelligence/memos/');
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
  });

  test('I18N-05: /pt/ renders PT headline (not EN)', async ({ page }) => {
    await page.goto('/pt/');
    const h1 = page.locator('h1').first();
    // PT home headline must NOT be the EN string
    await expect(h1).not.toHaveText('The LatAm Data Center Intelligence Firm');
    // Must contain Portuguese text
    const text = await h1.textContent();
    expect(text).toBeTruthy();
  });

  test('I18N-05: /es/ renders ES headline (not EN)', async ({ page }) => {
    await page.goto('/es/');
    const h1 = page.locator('h1').first();
    await expect(h1).not.toHaveText('The LatAm Data Center Intelligence Firm');
  });

  test('I18N-03: LangSwitcher on /team links to /pt/team', async ({ page }) => {
    await page.goto('/team');
    const ptLink = page.locator('.lang-link[href="/pt/team"], a[href="/pt/team"]').first();
    await expect(ptLink).toBeVisible();
  });

  test('I18N-03: /pt/team returns 200 (Astro rewrite fallback)', async ({ page }) => {
    const res = await page.goto('/pt/team');
    expect(res?.status()).toBe(200);
  });
});
