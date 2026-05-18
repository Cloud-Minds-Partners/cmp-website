---
phase: "03-pages"
plan: "04"
subsystem: "intelligence"
tags: ["intelligence", "memos", "radar", "regwatch", "collection-routes", "locale", "mock-26"]
dependency_graph:
  requires: ["03-01"]
  provides: ["PAGE-04", "CONT-02", "CONT-03", "CONT-04", "CONT-05", "CONT-06", "CONT-07"]
  affects:
    - src/pages/intelligence/index.astro
    - src/pages/intelligence/memos/index.astro
    - src/pages/intelligence/memos/[slug].astro
    - src/pages/intelligence/radar/index.astro
    - src/pages/intelligence/radar/[week].astro
    - src/pages/intelligence/regwatch/index.astro
    - src/pages/intelligence/regwatch/[month].astro
tech_stack:
  added: []
  patterns:
    - "getCollection locale filter with EN fallback"
    - "LocaleBanner showFallbackBanner pattern"
    - "collection-main CSS grid rows (num/id/detail/meta)"
    - "i18n empty-state keys (common.empty-memos, common.empty-regwatch)"
key_files:
  created: []
  modified:
    - src/pages/intelligence/memos/index.astro
    - src/pages/intelligence/radar/index.astro
    - src/pages/intelligence/regwatch/index.astro
decisions:
  - "intelligence/index.astro and all [slug]/[week]/[month].astro detail pages were already rebuilt in prior execution (commit 4cedd62) — only index pages for memos/radar/regwatch were stale"
  - "regwatch/[month].astro getStaticPaths returns empty array (0 published entries) — correct SSG behavior for CONT-07"
  - "Collection warning 'does not exist or is empty' is expected — memos/regwatch source from ../cmp-knowledge which is absent in local dev; build still exits 0"
metrics:
  duration: "~10 min"
  completed: "2026-05-18"
  tasks_completed: 3
  files_changed: 3
---

# Phase 03 Plan 04: Intelligence Collection Routes Summary

**One-liner:** memos/radar/regwatch index pages rebuilt with locale-filter + EN fallback + LocaleBanner + i18n empty-states, removing all v4 Section component usage.

## What Was Built

Three index pages rebuilt from v4 Crusoe pattern to mock-26 pattern:

### memos/index.astro (CONT-02)
- `getCollection('memos', m => m.data.publish)` — publish-gated
- Locale filter: `m.data.language === locale` with EN fallback if 0 locale matches
- `LocaleBanner` when `showFallbackBanner` (PT/ES URL + 0 locale content)
- Empty state: `t('common.empty-memos')` — "Memo library expanding — first publication coming soon."
- Grid rows: num / date / title+meta / topic tag

### radar/index.astro (CONT-04)
- `getCollection('radar', r => r.data.published)` — published-gated
- Locale filter + EN fallback + LocaleBanner
- Empty state: hardcoded "Innovation radar — first entry coming soon." (no i18n key for radar)
- Grid rows: num / week / period range / author
- 2026-W20 entry appears after 03-01 gate flip (published: true)

### regwatch/index.astro (CONT-06)
- `getCollection('regwatch', r => r.data.published)` — published-gated
- Locale filter + EN fallback + LocaleBanner
- Empty state: `t('common.empty-regwatch')` — "Regulatory watch — first digest coming soon."
- Grid rows: num / formatted month / raw id / author

## Already Done in Prior Execution (not re-done)

- `intelligence/index.astro` — rebuilt in commit `4cedd62`
- `memos/[slug].astro` — already uses render + MemoLayout correctly
- `radar/[week].astro` — already uses render + RadarLayout correctly
- `regwatch/[month].astro` — already uses render + RegwatchLayout correctly (0 entries = 0 static pages)

## Build Verification

`npx astro build` → 18 pages built, exit 0.
"collection does not exist or is empty" warnings for memos/regwatch are expected — those collections source from `../cmp-knowledge` which requires CI checkout. Build completes cleanly regardless.

## Deviations from Plan

None — plan executed exactly as written for the 3 files that were stale. 4 files (intelligence/index + 3 detail pages) were already rebuilt; no re-work needed.

## Self-Check

- `src/pages/intelligence/memos/index.astro` exists — getCollection + LocaleBanner + empty-memos ✓
- `src/pages/intelligence/radar/index.astro` exists — published filter + LocaleBanner ✓
- `src/pages/intelligence/regwatch/index.astro` exists — published filter + LocaleBanner + empty-regwatch ✓
- Commit `b16097f` present ✓
- `npx astro build` exits 0, 18 pages ✓
