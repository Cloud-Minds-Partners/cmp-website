---
phase: 01-foundation
plan: "04"
subsystem: i18n
tags: [astro-i18n, i18n, routing, translations, json, typescript]

# Dependency graph
requires:
  - phase: 01-01
    provides: project scaffolding and Wave 0 validation infrastructure

provides:
  - Astro native i18n routing with EN/PT/ES locales (defaultLocale en, no /en/ prefix)
  - src/i18n/en.json with full English translation keys for nav, CTA, footer, common, home
  - src/i18n/pt.json and es.json as EN-value stubs (ready for Phase 3 translation)
  - src/i18n/utils.ts with getLangFromUrl + useTranslations helpers
  - src/pages/pt/index.astro and src/pages/es/index.astro stub pages returning 200
  - dist/pt/index.html + dist/es/index.html in build output

affects:
  - Phase 2 components (any component using t() for translation strings)
  - Phase 3 pages (all locale pages use this i18n scaffold)
  - Phase 4 SEO (hreflang generation uses site + i18n config)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Astro native i18n (no astro-i18next or i18next dependency)
    - Flat namespaced JSON keys ("nav.home", "cta.talk-to-us")
    - getLangFromUrl + useTranslations official Astro recipe pattern
    - prefixDefaultLocale: false (EN routes at /, PT at /pt/, ES at /es/)
    - fallbackType: rewrite (PT/ES fallback to EN content without redirect)

key-files:
  created:
    - astro.config.mjs (i18n block added + site property)
    - src/i18n/en.json
    - src/i18n/pt.json
    - src/i18n/es.json
    - src/i18n/utils.ts
    - src/pages/pt/index.astro
    - src/pages/es/index.astro
  modified:
    - src/layouts/Base.astro (added optional lang prop, html lang attribute now dynamic)

key-decisions:
  - "prefixDefaultLocale: false — EN at /, not /en/ (locked in CONTEXT.md)"
  - "fallbackType: rewrite — PT/ES serve EN content at their URL without redirecting"
  - "Flat JSON keys only — no YAML, no nested objects, no i18next library"
  - "PT/ES stubs with EN values in Phase 1 — real translations deferred to Phase 3"
  - "site: https://dcplatformcmp.web.app set now for Phase 4 hreflang generation"

patterns-established:
  - "i18n pattern: import { getLangFromUrl, useTranslations } from '../../i18n/utils'; const lang = getLangFromUrl(Astro.url); const t = useTranslations(lang);"
  - "Translation key format: namespace.subkey (nav.home, cta.talk-to-us, footer.tagline)"
  - "Locale stub pages: minimal Base.astro wrapper with lang prop, content replaced Phase 3"

requirements-completed: [I18N-01, I18N-02]

# Metrics
duration: 3min
completed: 2026-05-17
---

# Phase 01 Plan 04: i18n Routing Scaffold Summary

**Astro native i18n wired for EN/PT/ES with flat JSON translation files, getLangFromUrl/useTranslations helpers, and locale stub pages producing valid dist/pt/ + dist/es/ build output**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-05-17T16:01:20Z
- **Completed:** 2026-05-17T16:03:59Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- astro.config.mjs now has full i18n block (defaultLocale en, prefixDefaultLocale false, fallbackType rewrite, fallback pt/es to en, site staging URL)
- src/i18n/en.json populated with 48 real English keys spanning nav, CTA, footer, common labels, and home page strings
- src/i18n/utils.ts exports getLangFromUrl + useTranslations following official Astro recipe — any .astro file can call t('nav.home') in two lines
- src/pages/pt/index.astro and src/pages/es/index.astro stub pages make /pt/ and /es/ return 200; dist/pt/index.html and dist/es/index.html confirmed in build output
- dist/en/ does NOT exist — English routes have no prefix as required

## Task Commits

Each task was committed atomically:

1. **Task 1: Add i18n config to astro.config.mjs** - `309a3d8` (feat)
2. **Task 2: Create translation files and utils.ts** - `56847df` (feat)
3. **Task 3: Create PT/ES stub pages, build, and run I18N checks** - `a024804` (feat)

## Files Created/Modified

- `astro.config.mjs` - Added i18n block with all locked values + site property
- `src/i18n/en.json` - Full English translation file (48 keys: nav, CTA, footer, common, home)
- `src/i18n/pt.json` - EN-value stub (identical to en.json; real PT copy Phase 3)
- `src/i18n/es.json` - EN-value stub (identical to en.json; real ES copy Phase 3)
- `src/i18n/utils.ts` - getLangFromUrl + useTranslations + Lang type + ui object
- `src/pages/pt/index.astro` - Minimal stub making /pt/ route valid (200 not 404)
- `src/pages/es/index.astro` - Minimal stub making /es/ route valid (200 not 404)
- `src/layouts/Base.astro` - Added optional lang?: string prop; html[lang] now dynamic

## Decisions Made

- Used official Astro native i18n — no astro-i18next, no i18next library (locked in CONTEXT.md)
- Flat namespaced JSON keys ("nav.home": "Home") — not nested objects, not YAML
- PT/ES stubs use identical EN values so build doesn't fail; real translations are Phase 3
- Added `lang` prop to Base.astro as Rule 3 (blocking fix) — stub pages pass `lang="pt"` and `lang="es"` for correct html[lang] attribute
- site set to staging URL `https://dcplatformcmp.web.app` — Phase 5 swaps to cloudmindspartners.com

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added lang prop to Base.astro**
- **Found during:** Task 3 (Create PT/ES stub pages)
- **Issue:** Stub pages pass `lang="pt"` to Base.astro; Props interface only accepted title/description/canonical — TypeScript would error
- **Fix:** Added `lang?: string` to Base.astro Props interface, destructured with default `"en"`, changed `<html lang="en">` to `<html lang={lang}>`
- **Files modified:** src/layouts/Base.astro
- **Verification:** Build passes with zero TypeScript errors; html[lang] renders correctly
- **Committed in:** a024804 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (Rule 3 - blocking)
**Impact on plan:** Necessary for TypeScript correctness. Improves Base.astro for all locale pages in Phase 3 at zero extra cost.

## Issues Encountered

- Build showed WARNING: "Could not render /pt from route /pt/ as it conflicts with higher priority route /pt" — this is a cosmetic Astro warning when both a stub page and the i18n fallback system try to generate the same route. The stub page wins and the correct file is created. Not a bug.
- cmp-knowledge sibling directory not present: memos and regwatch collections log expected warnings during build (pre-existing, not caused by this plan).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Any .astro page can now call `const lang = getLangFromUrl(Astro.url); const t = useTranslations(lang);` and access all 48 EN translation strings
- Phase 2 components should import from `../../i18n/utils` (or adjust depth as needed)
- Phase 3 page creation: /pt/ and /es/ stub pages are in place; replace content with real pages
- Phase 3 translation work: pt.json and es.json contain EN values as placeholders, ready for real copy
- No blockers for Phase 2 (components wave)

---
*Phase: 01-foundation*
*Completed: 2026-05-17*
