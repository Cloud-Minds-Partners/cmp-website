/**
 * Phase 5 — Deploy smoke tests
 * Validates that dist/ contains critical build artifacts before CI deploys.
 * Run: npx playwright test tests/phase5-deploy.spec.ts
 * Requires: npm run build (dist/ must exist)
 */

import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST = path.resolve(__dirname, "../dist");

function distExists(relPath: string): boolean {
  return fs.existsSync(path.join(DIST, relPath));
}

test.describe("Phase 5 — Build artifact smoke", () => {
  test("dist/ directory exists (build ran)", () => {
    expect(fs.existsSync(DIST)).toBe(true);
  });

  test("index.html present", () => {
    expect(distExists("index.html")).toBe(true);
  });

  test("sitemap-index.xml present", () => {
    expect(distExists("sitemap-index.xml")).toBe(true);
  });

  test("robots.txt present", () => {
    expect(distExists("robots.txt")).toBe(true);
  });

  test("404.html present", () => {
    expect(distExists("404.html")).toBe(true);
  });

  test("OG images directory present", () => {
    // Phase 4 generated og/*.png — verify at least one exists
    const ogDir = path.join(DIST, "og");
    const hasOg =
      fs.existsSync(ogDir) && fs.readdirSync(ogDir).some((f) => f.endsWith(".png"));
    expect(hasOg).toBe(true);
  });

  test("no continue-on-error on deploy steps in workflow", () => {
    const workflowPath = path.resolve(
      __dirname,
      "../.github/workflows/deploy.yml"
    );
    const content = fs.readFileSync(workflowPath, "utf-8");
    // Fail if any step has continue-on-error: true (silent skip pattern)
    expect(content).not.toContain("continue-on-error: true");
  });

  test("workflow references FIREBASE_SERVICE_ACCOUNT_DCPLATFORMCMP (service account, not legacy CI token)", () => {
    const workflowPath = path.resolve(
      __dirname,
      "../.github/workflows/deploy.yml"
    );
    const content = fs.readFileSync(workflowPath, "utf-8");
    expect(content).toContain("FIREBASE_SERVICE_ACCOUNT_DCPLATFORMCMP");
  });

  test("workflow has pre-flight exit 1 on missing secret", () => {
    const workflowPath = path.resolve(
      __dirname,
      "../.github/workflows/deploy.yml"
    );
    const content = fs.readFileSync(workflowPath, "utf-8");
    expect(content).toContain("exit 1");
    expect(content).toContain("Pre-flight");
  });

  test("workflow configures preview channel for non-main branches", () => {
    const workflowPath = path.resolve(
      __dirname,
      "../.github/workflows/deploy.yml"
    );
    const content = fs.readFileSync(workflowPath, "utf-8");
    expect(content).toContain("preview-");
    expect(content).toContain("channelId: live");
  });

  test("lighthouserc.json present with correct thresholds", () => {
    const lhPath = path.resolve(__dirname, "../.lighthouserc.json");
    expect(fs.existsSync(lhPath)).toBe(true);
    const config = JSON.parse(fs.readFileSync(lhPath, "utf-8"));
    const assertions = config.ci.assert.assertions;
    // Performance must be ≥ 0.9
    expect(assertions["categories:performance"][1].minScore).toBeGreaterThanOrEqual(0.9);
    // Accessibility must be ≥ 0.95
    expect(assertions["categories:accessibility"][1].minScore).toBeGreaterThanOrEqual(0.95);
    // SEO must be ≥ 0.95
    expect(assertions["categories:seo"][1].minScore).toBeGreaterThanOrEqual(0.95);
  });
});
