---
phase: 3
slug: pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-17
---

# Phase 3 — Validation Strategy

> Per-phase validation contract. Derived from RESEARCH.md §Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.x (chromium, already installed Phase 2; webServer wired) |
| **Config file** | `playwright.config.ts` (exists) |
| **Quick run command** | `npx playwright test --grep @smoke` |
| **Full suite command** | `npx playwright test` |
| **Estimated runtime** | ~60s full suite (16+ tests) |

**NOTE:** RESEARCH.md incorrectly states Playwright is not installed. It WAS installed in Phase 2 (commit `c245ff4`). Phase 3 Wave 0 only needs to ADD new spec stubs, not bootstrap Playwright.

---

## Sampling Rate

- **Per task commit:** `npx playwright test --grep @smoke` for the touched page/route
- **Per wave merge:** Full `npx playwright test`
- **Before `/gsd:verify-work`:** Full suite green + `npx astro build` zero errors + visual eyeball on all 7 pages

---

## Per-Requirement Verification Map

| Req ID | Behavior | Test | Status |
|--------|----------|------|--------|
| PAGE-01 | `/` returns 200, hero has 3 slides | Playwright | ⬜ |
| PAGE-02 | `/advisory` returns 200, 6 capability cards | Playwright | ⬜ |
| PAGE-03 | `/development` returns 200, 3 role cards | Playwright | ⬜ |
| PAGE-04 | `/intelligence` returns 200, featured memo section | Playwright | ⬜ |
| PAGE-05 | `/platforms` returns 200, 4 product sections | Playwright | ⬜ |
| PAGE-06 | `/team` returns 200, partner names in DOM | Playwright | ⬜ |
| PAGE-07 | `/contact` returns 200, email link present | Playwright | ⬜ |
| CONT-02 | `/intelligence/memos/` returns 200, empty state when 0 entries | Playwright | ⬜ |
| CONT-03 | `/intelligence/memos/[slug]` returns 200 for valid slug | Playwright (skip if 0 published) | ⬜ |
| CONT-04 | `/intelligence/radar/` returns 200, ≥1 entry after publishing 2026-W20 | Playwright | ⬜ |
| CONT-05 | `/intelligence/radar/[week]` returns 200 for valid week | Playwright | ⬜ |
| CONT-06 | `/intelligence/regwatch/` returns 200, empty state | Playwright | ⬜ |
| CONT-07 | `/intelligence/regwatch/[month]` — manual only (no published entries v1) | manual | ⬜ |
| I18N-03 | LangSwitcher click PT on `/team` → `/pt/team` 200 | Playwright | ⬜ |
| I18N-04 | hreflang en/pt/es present on home + advisory + memos | Playwright | ⬜ |
| I18N-05 | `/pt/` renders PT headline (NOT EN), `/es/` renders ES headline | Playwright | ⬜ |

**Total:** 15 automated + 1 manual = 16 assertions covering all 16 Phase 3 reqs.

---

## Wave 0 Requirements

- [ ] `tests/phase3-pages.spec.ts` — PAGE-01..07 smoke tests
- [ ] `tests/phase3-collections.spec.ts` — CONT-02..06 routes + empty states
- [ ] `tests/phase3-i18n.spec.ts` — I18N-03..05 routing + translation checks
- [ ] Confirm `playwright.config.ts` `webServer` block targets `npm run dev` on :4321

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test |
|----------|-------------|------------|------|
| All 7 pages visually match mock-26 | All PAGE-* | Pixel/aesthetic | Eyeball each page vs mock-26 at :8096 |
| Hero rotation timing smooth | PAGE-01 | Animation perception | Watch home for 30s, confirm 3 slides cycle |
| Locale banner subtle but visible | I18N-05 | Visual judgement | Visit `/pt/team` — confirm "Translated version coming soon" banner is present but not intrusive |
| CONT-07 regwatch detail | CONT-07 | No published entries v1 | Deferred — when first regwatch published, test detail route |

---

## Phase Gate

Phase 3 complete when:
1. ✅ All 15 Playwright assertions pass
2. ✅ `npx astro build` exits 0
3. ✅ No `image-pipeline-test.astro` remaining in src/pages/ (Phase 1 scaffolding removed because real pages now import photos)
4. ✅ SiteHeader active nav state present on current-page link
5. ✅ Manual visual eyeball pass on 7 pages
6. ✅ Phase commits clean

---

*Validation strategy version: 1.0 · Phase 03-pages · 2026-05-17*
