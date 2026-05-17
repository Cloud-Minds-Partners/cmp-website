---
phase: 01-foundation
plan: "03"
subsystem: ui
tags: [astro, sharp, images, webp, srcset, unsplash]

# Dependency graph
requires:
  - phase: 01-01
    provides: Playwright test infrastructure and validate-phase-1.sh shell gate

provides:
  - 27 JPEG originals at src/assets/photos/ with role-based filenames
  - scripts/download-photos.sh idempotent download script (reruns safely)
  - src/assets/photos/INVENTORY.md — 27-row single source of truth mapping filenames to mock-26 roles, Unsplash IDs, alt text
  - src/pages/_image-pipeline-test.astro — Phase 1 scaffolding keeping FOUND-01 WebP/srcset gates green

affects:
  - Phase 2 components (import photos via ES module from src/assets/photos/)
  - Phase 3 pages (hero images, card images)
  - validate-phase-1.sh FOUND-01 checks (4 shell gates)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Astro <Image> with src/assets/ import for WebP output + responsive srcset"
    - "Role-based filename convention: hero-{location}, card-{page}-{role}, memo-{page}-{topic}"
    - "Idempotent bash download pattern: if [ ! -f ] skip with set -euo pipefail hard-fail"

key-files:
  created:
    - scripts/download-photos.sh
    - src/assets/photos/INVENTORY.md
    - src/pages/_image-pipeline-test.astro
  modified:
    - scripts/validate-phase-1.sh (photo count corrected 26→27)

key-decisions:
  - "Photo count is 27 not 26: plan must_haves.truths had a typo; files_modified list and IMAGES.md both enumerate 27 distinct filenames — corrected validate-phase-1.sh accordingly"
  - "_image-pipeline-test.astro is intentional Phase 1 scaffolding (NOT temporary) — keeps FOUND-01 WebP+srcset gates green until Phase 3 pages import photos"
  - "Heroes downloaded at 2400px, cards/memos at 1200px — matches Astro <Image> source resolution requirements"

patterns-established:
  - "Photo import: import heroSp from '../assets/photos/hero-sp-marginal.jpg' + <Image> component — NOT public/ static serving"

requirements-completed:
  - FOUND-01

# Metrics
duration: 5min
completed: 2026-05-17
---

# Phase 1 Plan 03: Photo Pipeline Summary

**27 Unsplash JPEGs downloaded to src/assets/photos/ with role-based names, INVENTORY.md audit trail, and Astro Image pipeline producing WebP+srcset confirmed via build**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-17T16:01:14Z
- **Completed:** 2026-05-17T16:06:09Z
- **Tasks:** 3
- **Files created/modified:** 30 (27 JPEGs + INVENTORY.md + _image-pipeline-test.astro + download script + validate-phase-1.sh fix)

## Accomplishments

- 27 JPEGs at src/assets/photos/ covering all mock-26 photo slots (8 heroes at 2400px, 19 cards/memos at 1200px)
- scripts/download-photos.sh: idempotent, set -euo pipefail, 0.5s polite sleep between downloads
- INVENTORY.md: 27 rows mapping filename → mock-26 role → Unsplash ID → alt text → dimensions
- _image-pipeline-test.astro: Phase 1 scaffolding page that keeps FOUND-01 gates green via Astro `<Image>` import
- All 4 FOUND-01 shell checks pass: 27 photos present, .webp in built HTML, srcset= in built HTML, zero images.unsplash.com in built HTML

## Task Commits

1. **Task 1: Download script + 27 photos** — committed in `a024804` (concurrent with 01-04 agent — photos/script landed in that commit due to parallel staging)
2. **Task 2: INVENTORY.md + _image-pipeline-test.astro** — `59bec50` (feat)
3. **Task 3: FOUND-01 gate verification** — no new files; build confirmed passing

**Plan metadata:** (this commit)

## Files Created/Modified

- `scripts/download-photos.sh` — idempotent Unsplash CDN download script, set -euo pipefail, 27 entries
- `scripts/validate-phase-1.sh` — FOUND-01 count corrected from 26 to 27 (plan typo fix)
- `src/assets/photos/*.jpg` — 27 JPEG originals (heroes 2400px, cards/memos 1200px)
- `src/assets/photos/INVENTORY.md` — 27-row audit table with role, Unsplash ID, alt text, dimensions
- `src/pages/_image-pipeline-test.astro` — Phase 1 scaffolding; imports hero-sp-marginal.jpg via `<Image>` with widths=[640,1280]

## Decisions Made

- **Photo count 27 not 26:** The plan's `must_haves.truths` said "26 JPEG files" but the plan's own `files_modified` list had 27 `.jpg` entries, and the authoritative `IMAGES.md` header says "27 unique slots." The count "26" was a documentation typo. Corrected `validate-phase-1.sh` to check `-eq 27`.
- **_image-pipeline-test.astro is NOT temporary:** The plan explicitly marks this as "Phase 1 scaffolding — do NOT delete." It keeps FOUND-01 WebP/srcset gates passing until Phase 3 pages consume the photos directly. Left in place.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Photo count assertion corrected from 26 to 27**
- **Found during:** Task 1 (download + count verification)
- **Issue:** `validate-phase-1.sh` line 29 had `-eq 26` but the plan's `files_modified` enumerated 27 `.jpg` files and `IMAGES.md` documents "27 unique slots"
- **Fix:** Updated validate-phase-1.sh FOUND-01 count check from `-eq 26` to `-eq 27`
- **Files modified:** scripts/validate-phase-1.sh
- **Verification:** `ls src/assets/photos/*.jpg | wc -l` returns 27; check passes
- **Committed in:** `a024804` (alongside the photos, concurrent agent commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - documentation/assertion bug)
**Impact on plan:** Necessary correctness fix. All 27 required photos are present. No scope creep.

## Issues Encountered

- Parallel execution with plans 01-02 and 01-04 caused photos and download script to be staged and committed by the 01-04 agent (commit `a024804`) before Task 1's explicit commit. The work is in git history correctly; the commit message attribution is under 01-04 but all 27 files are present and verified.

## User Setup Required

None — no external service configuration required. Unsplash CDN downloads are public, no API key needed.

## Next Phase Readiness

- All 27 photos are in src/assets/photos/ and ready for Phase 2 component imports
- INVENTORY.md provides alt text for every photo — Phase 2 components can copy directly
- Astro `<Image>` pipeline confirmed working (WebP output, responsive srcset)
- Phase 2 import pattern: `import heroSp from '../assets/photos/hero-sp-marginal.jpg'` + `<Image src={heroSp} ...>`

---
*Phase: 01-foundation*
*Completed: 2026-05-17*
