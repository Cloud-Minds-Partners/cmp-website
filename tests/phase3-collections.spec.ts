import { test, expect } from '@playwright/test';

test.describe('Phase 3 collection routes @smoke', () => {
  test('CONT-02: memos index returns 200', async ({ page }) => {
    const res = await page.goto('/intelligence/memos/');
    expect(res?.status()).toBe(200);
    // Either memo list OR empty state — both are valid
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('CONT-02: memos empty state text present when no memos', async ({ page }) => {
    await page.goto('/intelligence/memos/');
    const body = await page.textContent('body');
    // If no memos published, empty state must show
    const hasMemoList = await page.locator('.memo-list').count() > 0;
    if (!hasMemoList) {
      expect(body).toContain('Memo library expanding');
    }
  });

  test('CONT-04: radar index returns 200, shows 1+ entries after gate flip', async ({ page }) => {
    const res = await page.goto('/intelligence/radar/');
    expect(res?.status()).toBe(200);
    const body = await page.textContent('body');
    expect(body).toContain('2026-W20');
  });

  test('CONT-05: radar detail /intelligence/radar/2026-W20 returns 200', async ({ page }) => {
    const res = await page.goto('/intelligence/radar/2026-W20');
    expect(res?.status()).toBe(200);
    const body = await page.textContent('body');
    expect(body).toContain('2026-W20');
  });

  test('CONT-06: regwatch index returns 200', async ({ page }) => {
    const res = await page.goto('/intelligence/regwatch/');
    expect(res?.status()).toBe(200);
    const body = await page.textContent('body');
    // Empty state
    expect(body).toContain('Regulatory watch');
  });
});
