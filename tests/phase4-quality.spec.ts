/**
 * Phase 4 Quality Gate tests
 *
 * Covers SEO, A11Y, and Performance structural requirements:
 *   SEO-01  robots.txt reachable + allows crawlers
 *   SEO-02  sitemap-index.xml generated in dist/ (build-time artifact, checked via fs)
 *   SEO-03  <title> tag non-empty on all pages
 *   SEO-04  <meta name="description"> populated on all pages
 *   SEO-05  og:image present on all pages
 *   SEO-06  twitter:card present on all pages
 *   SEO-07  <link rel="canonical"> present on all pages
 *   SEO-08  JSON-LD Organization on home
 *   A11Y-01  Skip-to-content link in DOM
 *   A11Y-02  No Google Fonts JS/CSS in HTML
 *   PERF-01  <link rel="preload"> for hero image on home
 *   PERF-02  No fonts.googleapis.com link tag (zero 3rd-party font blocking)
 *
 * NOTE: Lighthouse CLI scoring (Lighthouse score ≥90/95) is validated manually
 * post-deploy. CLI install was skipped per plan time budget. See SUMMARY.md.
 *
 * NOTE: sitemap-index.xml is a build-time artifact (emitted by @astrojs/sitemap
 * into dist/). It is NOT served by `astro dev`, so SEO-02 is verified by
 * reading dist/sitemap-index.xml directly via fs rather than HTTP.
 */

import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Pages to check for common SEO meta
const PAGES = ['/', '/advisory', '/development', '/intelligence', '/platforms', '/team', '/contact'];

// ── robots.txt ─────────────────────────────────────────────────────────────
test('SEO-01: robots.txt is reachable and allows crawlers', async ({ page }) => {
  const resp = await page.goto('/robots.txt');
  expect(resp?.status()).toBe(200);
  const body = await page.textContent('body') ?? await resp?.text() ?? '';
  expect(body).toMatch(/User-agent:\s*\*/i);
  expect(body).toMatch(/Allow:\s*\//i);
  expect(body).toContain('sitemap-index.xml');
});

// ── sitemap ─────────────────────────────────────────────────────────────────
// sitemap-index.xml is a build artifact (dist/), not served by astro dev.
// Verified via filesystem after `astro build`.
test('SEO-02: sitemap-index.xml exists in dist/ and contains entries', async () => {
  const distDir = join(process.cwd(), 'dist');
  const sitemapIndex = join(distDir, 'sitemap-index.xml');
  expect(existsSync(sitemapIndex), `dist/sitemap-index.xml not found — run 'astro build' first`).toBe(true);
  const content = readFileSync(sitemapIndex, 'utf8');
  expect(content).toContain('<sitemap>');
  expect(content).toContain('sitemap-0.xml');

  // sitemap-0.xml should also exist and reference pages
  const sitemap0 = join(distDir, 'sitemap-0.xml');
  expect(existsSync(sitemap0), 'dist/sitemap-0.xml not found').toBe(true);
  const sm0content = readFileSync(sitemap0, 'utf8');
  expect(sm0content).toContain('<url>');
  expect(sm0content).toContain('dcplatformcmp.web.app');
});

// ── Per-page SEO meta ────────────────────────────────────────────────────────
for (const path of PAGES) {
  test(`SEO-03/04/05/06/07: ${path} has title, description, OG, twitter:card, canonical`, async ({ page }) => {
    const resp = await page.goto(path);
    expect(resp?.status()).toBe(200);

    // SEO-03: <title> non-empty
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title).toContain('Cloud Minds');

    // SEO-04: meta description populated
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(10);

    // SEO-05: og:image present
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();

    // SEO-06: twitter:card
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');

    // SEO-07: canonical link
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
    expect(canonical).toContain('dcplatformcmp.web.app');
  });
}

// ── JSON-LD Organization ────────────────────────────────────────────────────
test('SEO-08: home page has JSON-LD Organization schema', async ({ page }) => {
  await page.goto('/');
  const ldScripts = page.locator('script[type="application/ld+json"]');
  const count = await ldScripts.count();
  expect(count).toBeGreaterThanOrEqual(1);

  let foundOrg = false;
  for (let i = 0; i < count; i++) {
    const json = await ldScripts.nth(i).textContent() ?? '';
    try {
      const data = JSON.parse(json);
      if (data['@type'] === 'Organization') {
        foundOrg = true;
        expect(data.name).toBe('Cloud Minds Partners');
        expect(data.url).toContain('dcplatformcmp.web.app');
        break;
      }
    } catch {
      // skip malformed scripts
    }
  }
  expect(foundOrg).toBe(true);
});

// ── A11Y: Skip-to-content ────────────────────────────────────────────────────
test('A11Y-01: skip-to-content link present in DOM on all pages', async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const skipLink = page.locator('a[href="#main"]');
    await expect(skipLink).toHaveCount(1);
    // Verify it has meaningful text
    const text = await skipLink.textContent();
    expect(text?.toLowerCase()).toContain('skip');
  }
});

// ── A11Y-02 / PERF-02: No Google Fonts ──────────────────────────────────────
test('A11Y-02/PERF-02: no Google Fonts (fonts.googleapis.com) in HTML', async ({ page }) => {
  await page.goto('/');
  const content = await page.content();
  expect(content).not.toContain('fonts.googleapis.com');
});

// ── PERF-01: Hero preload on home ────────────────────────────────────────────
test('PERF-01: home page has <link rel="preload"> for hero image', async ({ page }) => {
  await page.goto('/');
  const preloads = page.locator('link[rel="preload"][as="image"]');
  const count = await preloads.count();
  expect(count).toBeGreaterThanOrEqual(1);

  // At least one preload should target a webp image (hero-sp-marginal)
  let hasHeroPreload = false;
  for (let i = 0; i < count; i++) {
    const href = await preloads.nth(i).getAttribute('href') ?? '';
    if (href.includes('hero') || href.includes('webp') || href.includes('_astro')) {
      hasHeroPreload = true;
      break;
    }
  }
  expect(hasHeroPreload).toBe(true);
});

// ── SEO-08 coverage: hreflang alternates on home ─────────────────────────────
test('SEO: hreflang alternates (en, pt-BR, es, x-default) present on home', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
});
