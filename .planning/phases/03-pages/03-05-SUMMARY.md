---
phase: 03-pages
plan: "05"
subsystem: pages
tags: [i18n, home, pt, es, smoke-tests, build]
dependency_graph:
  requires: [03-01, 03-02, 03-03, 03-04]
  provides: [pt-home, es-home, I18N-05]
  affects: [all-pages, playwright-smoke-suite]
tech_stack:
  added: []
  patterns: [locale-hardcoded-const, useTranslations-per-locale, ROADMAP-4-exemption-insight-EN]
key_files:
  created: []
  modified:
    - src/pages/pt/index.astro
    - src/pages/es/index.astro
    - tests/phase3-i18n.spec.ts
    - tests/phase3-pages.spec.ts
decisions:
  - "Hardcoded locale const ('pt'/'es') over Astro.currentLocale — more explicit, guarantees I18N-05 test passes"
  - "Insight section body copy stays EN in all locale pages per ROADMAP criterion #4 exemption"
  - "ROADMAP 4 exemption: memo-specific content (Memo 011 body) not translated — deferred to v2 when memos are localized"
metrics:
  duration: 372s
  completed: "2026-05-18"
  tasks: 3
  files: 4
---

# Phase 03 Plan 05: PT and ES Locale Home Pages + Build Verification Summary

PT and ES home pages with hardcoded locale constants replacing Phase 1 EN-mirror stubs; 20 Playwright smoke tests green; build exits 0 (18 pages).

## Tasks Completed

| # | Name | Commit | Status |
|---|------|--------|--------|
| 1 | PT and ES locale home pages | abea070 | Done |
| 2 | Full test suite run + build verification | 9301dc7 | Done |
| 3 | Visual verification checkpoint | — | Auto-approved (see below) |

## Deliverables

### src/pages/pt/index.astro
Full 6-section Portuguese home page:
- `locale = 'pt' as const` + `useTranslations('pt')`
- All imports use `../../` path (subdirectory depth from `src/pages/pt/`)
- Sections: hero 3-city rotation, stats bar, cap-grid 2x2, principles 3-col, insight (EN body per ROADMAP #4 exemption), newsletter
- SEO title in Portuguese, `lang="pt"` on Base

### src/pages/es/index.astro
Full 6-section Spanish home page:
- `locale = 'es' as const` + `useTranslations('es')`
- Same structure as PT page, all imports `../../` prefixed
- SEO title in Spanish

### Build Result
- `npx astro build` exits 0
- 18 pages built: includes `/pt/index.html` and `/es/index.html`
- 2 WARNs expected: Astro i18n fallback rewrite conflict for `/pt` vs `/pt/` root — cosmetic, pages render correctly

### Playwright Smoke Suite
- 20 tests, 0 failures
- All @smoke tests pass including I18N-05: `/pt/` and `/es/` render locale-specific headline (not EN)

## Task 3: Visual Verification Checkpoint

**Status:** Auto-approved per user instruction (no_questions continuous run mode 2026-05-18)

Visual verification deferred per user instruction (continuous run mode). All structural deliverables met:
- `/pt/index.html` and `/es/index.html` exist in dist with correct PT/ES translated copy
- Hero, stats, capabilities, principles, insight, newsletter sections all present
- Insight section body copy intentionally EN per ROADMAP criterion #4 (memo-specific published content)
- Both locale pages render the Portuguese/Spanish h1 headline (confirmed via I18N-05 Playwright test)

Phase 4 to address any visual debt via Lighthouse a11y/contrast checks.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] I18N-03 spec: href mismatch `/pt/team` vs `/pt/team/`**
- **Found during:** Task 2 — Playwright run
- **Issue:** Test expected `href="/pt/team"` but Astro `getRelativeLocaleUrl` generates `href="/pt/team/"` (trailing slash)
- **Fix:** Updated spec to match `/pt/team/` with trailing slash
- **Files modified:** tests/phase3-i18n.spec.ts
- **Commit:** 9301dc7

**2. [Rule 1 - Bug] PAGE-07 spec: strict mode violation — 2 elements matched**
- **Found during:** Task 2 — Playwright run
- **Issue:** `a[href*="info@cloudmindspartners.com"]` matched both the contact section link and the footer link — Playwright strict mode rejects multi-match
- **Fix:** Added `.first()` to locator to select the contact section link
- **Files modified:** tests/phase3-pages.spec.ts
- **Commit:** 9301dc7

## I18N-05 Requirement Closed

Both `/pt/` and `/es/` home pages:
- Render translated headline (PT: "Inteligência em data centers para a América Latina." / ES: "Inteligencia en centros de datos para América Latina.")
- Stats, capabilities, principles, newsletter all translated via `useTranslations`
- Insight section body: intentionally EN per ROADMAP criterion #4 — memo references a specific published English document (Memo 011 · Power · Brazil · 14 pages)

## Self-Check: PASSED

| Check | Result |
|-------|--------|
| src/pages/pt/index.astro exists (566 lines, >30) | FOUND |
| src/pages/es/index.astro exists (566 lines, >30) | FOUND |
| 03-05-SUMMARY.md exists | FOUND |
| commit abea070 (task 1) | FOUND |
| commit 9301dc7 (task 2) | FOUND |
| npx astro build exits 0 | CONFIRMED |
| 20 @smoke tests pass | CONFIRMED |
