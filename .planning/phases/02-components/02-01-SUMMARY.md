---
phase: 02-components
plan: "01"
subsystem: testing
tags: [playwright, astro, tdd, i18n, seo, base-layout]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Base.astro layout, playwright.config.ts, i18n utils, social.ts CF endpoint
provides:
  - 9 Playwright spec stubs (RED TDD posture) covering all COMP-01..09 and CONT-01 requirements
  - tests/fixtures/bad-language.md with language:fr for CONT-01 Zod rejection negative test
  - playwright.config.ts webServer block auto-launching astro dev before test suite
  - .env.example documenting PUBLIC_WHATSAPP_NUMBER
  - Base.astro <slot name="head" /> for SEO component injection into document head
affects:
  - 02-02 through 02-10 (all component plans depend on spec stubs for TDD GREEN phase)
  - Phase 3 pages (head slot required for per-page SEO via SEO component)
  - Phase 4 SEO audit (COMP-09 spec validates hreflang alternates)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "TDD stub pattern: test.beforeEach skips if /dev/components returns 404 (graceful RED)"
    - "test.use({viewport}) at file level for viewport-sensitive specs (comp-07)"
    - "File-system assertions via execSync in Playwright test for source-level contracts (comp-05, comp-06)"
    - "Base.astro named slot: <slot name='head' /> for layout-level SEO injection"

key-files:
  created:
    - tests/comp-01-header.spec.ts
    - tests/comp-02-footer.spec.ts
    - tests/comp-03-hero.spec.ts
    - tests/comp-04-capcard.spec.ts
    - tests/comp-05-newsletter.spec.ts
    - tests/comp-06-wafab.spec.ts
    - tests/comp-07-langswitcher.spec.ts
    - tests/comp-08-sociallinks.spec.ts
    - tests/comp-09-seo.spec.ts
    - tests/fixtures/bad-language.md
    - .env.example
  modified:
    - src/layouts/Base.astro
    - playwright.config.ts

key-decisions:
  - "Removed SEO-managed meta tags from Base.astro (og:*, description, robots, canonical) — delegated to SEO.astro via head slot"
  - "Spec stubs use test.skip() graceful exit when /dev/components returns 404 (Wave 2 not yet built)"
  - "comp-07-langswitcher uses test.use({viewport:1280x720}) — LangSwitcher hidden below 880px per mock-26"
  - "CF endpoint and WhatsApp guard verified via execSync file-system grep in specs — not runtime browser tests"
  - "bad-language.md lives in tests/fixtures/ outside cmp-knowledge glob — zero build impact"

patterns-established:
  - "Pattern: TDD RED stubs skip gracefully when target page not yet built"
  - "Pattern: Viewport-sensitive tests declare test.use at file level before beforeEach"
  - "Pattern: Source contracts (CF endpoint, guard condition) verified via grep in Playwright test"

requirements-completed:
  - COMP-01
  - COMP-02
  - COMP-03
  - COMP-04
  - COMP-05
  - COMP-06
  - COMP-07
  - COMP-08
  - COMP-09
  - CONT-01

# Metrics
duration: 3min
completed: 2026-05-17
---

# Phase 2 Plan 01: Wave 0 Test Infrastructure Summary

**9 Playwright spec stubs (TDD RED), bad-language fixture, webServer wiring, and Base.astro head slot for SEO injection**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-05-17T17:56:34Z
- **Completed:** 2026-05-17T17:59:52Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- Patched Base.astro to add `<slot name="head" />` and removed SEO-managed meta tags (og:*, description, robots) — head now clean for SEO.astro injection
- Created 9 Playwright spec stubs covering all COMP-01..09 requirements with meaningful selector-based assertions, graceful skip when Wave 2 page not yet built
- Wired Playwright webServer block to auto-launch `npx astro dev` (port 4321, reuseExistingServer for local dev)
- Created .env.example documenting PUBLIC_WHATSAPP_NUMBER
- Created tests/fixtures/bad-language.md with `language: fr` for CONT-01 negative Zod validation test

## Task Commits

1. **Task 1: Patch Base.astro and create .env.example** - `aba7cb4` (feat)
2. **Task 2: Wire Playwright webServer + 9 spec stubs + bad-language fixture** - `c245ff4` (feat)

## Files Created/Modified
- `src/layouts/Base.astro` - Added `<slot name="head" />`, removed SEO-delegated meta tags
- `playwright.config.ts` - Added webServer block (npx astro dev, port 4321, reuseExistingServer)
- `.env.example` - Documents PUBLIC_WHATSAPP_NUMBER with usage comment
- `tests/comp-01-header.spec.ts` - COMP-01: header render, mobile menu open/close, Escape key
- `tests/comp-02-footer.spec.ts` - COMP-02: footer element, 4 column headings, copyright
- `tests/comp-03-hero.spec.ts` - COMP-03: page hero variant, home hero 3-slide DOM check
- `tests/comp-04-capcard.spec.ts` - COMP-04: card photo+title+desc, on-cream variant
- `tests/comp-05-newsletter.spec.ts` - COMP-05: form render, mocked CF submit, endpoint grep
- `tests/comp-06-wafab.spec.ts` - COMP-06: wa.me render, source guard length>=10 grep
- `tests/comp-07-langswitcher.spec.ts` - COMP-07: PT href /pt/dev/components, aria-current (1280px viewport)
- `tests/comp-08-sociallinks.spec.ts` - COMP-08: LinkedIn+WhatsApp SVG icon render
- `tests/comp-09-seo.spec.ts` - COMP-09: title, meta description, OG tags, hreflang en/pt-BR/es
- `tests/fixtures/bad-language.md` - CONT-01 negative test fixture (language: fr, outside glob path)

## Decisions Made
- Removed og:*, meta description, robots, canonical meta tags from Base.astro — these are per-page concerns owned by SEO.astro; keeping structural boilerplate only (charset, viewport, color-scheme, theme-color, favicon)
- comp-07-langswitcher.spec.ts uses `test.use({ viewport: { width: 1280, height: 720 } })` at file level because LangSwitcher has `display:none` at max-width 880px (mock-26 `.nav-lang` media query)
- CF endpoint URL contract and WhatsApp guard condition verified via `execSync` grep in test body — these are build-time source contracts, not runtime behaviors

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. `npx astro build` exits cleanly after both tasks. The "collection does not exist" messages for `memos` and `regwatch` are pre-existing warnings from empty collections (Phase 1 substrate), not errors introduced by this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All 9 spec stubs are in place. Wave 1 (COMP-09 SEO.astro) can run `npx playwright test tests/comp-09-seo.spec.ts` immediately after building SEO.astro to confirm GREEN.
- Base.astro head slot is live — SEO.astro can use `<SEO slot="head" />` pattern.
- Wave 2 dev preview page build will automatically unlock all 9 specs from skip state.
- .env.example ready for developer onboarding docs.

---
*Phase: 02-components*
*Completed: 2026-05-17*
