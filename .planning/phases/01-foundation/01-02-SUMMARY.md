---
phase: 01-foundation
plan: 02
subsystem: ui
tags: [tailwind4, css-tokens, fonts, fontsource, astro, i18n]

# Dependency graph
requires:
  - phase: 01-foundation/01-01
    provides: Wave 0 test infrastructure (scripts/validate-phase-1.sh, playwright config)
provides:
  - Mock-26 design token @theme block in global.css (navy palette, blue #2D6BE4, cream text)
  - @fontsource-variable/space-grotesk + dm-sans installed and imported (zero Google Fonts CDN)
  - @layer base body defaults (navy-0 bg, cream-0 text, DM Sans body, smooth scroll, 1.55 line-height)
  - Base.astro locale-aware lang prop with 'en' default
affects: [02-components, 03-pages, 04-seo, 05-launch]

# Tech tracking
tech-stack:
  added: ["@fontsource-variable/space-grotesk", "@fontsource-variable/dm-sans"]
  patterns:
    - "Tailwind 4 CSS-first @theme block for design tokens — no tailwind.config.js"
    - "CSS custom properties as token names (--color-navy-0) map directly to Tailwind utilities (bg-navy-0)"
    - "Variable fonts via @fontsource-variable for single-file coverage of weights 300-700"

key-files:
  created: []
  modified:
    - src/styles/global.css
    - src/layouts/Base.astro
    - package.json

key-decisions:
  - "Token naming: no cmp- prefix — --color-navy-0 generates bg-navy-0/text-navy-0 matching mock-26 HTML"
  - "Variable font family string is 'Space Grotesk Variable' (not 'Space Grotesk') — required for @fontsource-variable packages"
  - "No --font-mono token — mock-26 v0.8 removes typewriter labels"
  - "lang prop in Base.astro is a simple string passthrough ('en' default) — no i18n helper imports at this layer"

patterns-established:
  - "global.css is the single source of truth for all design tokens and base styles"
  - "Google Fonts CDN is fully removed — all fonts served from node_modules via fontsource"

requirements-completed: [FOUND-02, FOUND-03, FOUND-04]

# Metrics
duration: 3min
completed: 2026-05-17
---

# Phase 1 Plan 02: Design Tokens and Fonts Summary

**Mock-26 Tailwind 4 token @theme block live — Space Grotesk Variable + DM Sans Variable from fontsource, zero Google Fonts CDN, navy/cream/blue palette, lang-aware Base.astro**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-05-17T16:00:49Z
- **Completed:** 2026-05-17T16:03:26Z
- **Tasks:** 3 (all complete; Task 3 was build verification only, no commit needed)
- **Files modified:** 3

## Accomplishments

- Replaced v4 dark-tech token set (--color-bg-base, --color-ink, --font-mono: JetBrains Mono, etc.) with mock-26 palette — navy stack, brand blue #2D6BE4, cream text, hairlines, status, layout, transitions
- Installed @fontsource-variable/space-grotesk and @fontsource-variable/dm-sans; imported in global.css; zero Google Fonts requests in built HTML
- Added @layer base body defaults: navy-0 background, cream-0 text, DM Sans Variable body font, smooth scroll, 1.55 line-height
- Removed Google Fonts CDN link tags from Base.astro; added locale-aware lang prop with 'en' default
- All 10 FOUND-02/03/04 shell checks pass; npm run build exits 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Install variable fonts + replace global.css** - `62b3e15` (chore)
2. **Task 2: Remove Google Fonts from Base.astro, add lang prop** - `b591795` (chore)
3. **Task 3: Build + FOUND-02/03/04 checks** - no separate commit (verification only, no file changes)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/styles/global.css` — Complete mock-26 @theme token block + fontsource imports + @layer base defaults; v4 dark-tech tokens removed
- `src/layouts/Base.astro` — Google Fonts link tags removed; lang?: string prop added with 'en' default; <html lang={lang}>
- `package.json` + `package-lock.json` — @fontsource-variable/space-grotesk and @fontsource-variable/dm-sans added to dependencies

## Decisions Made

- Token alignment spaces removed from `--color-blue:` line to ensure `grep -q '--color-blue: #2D6BE4'` passes (single space between colon and value)
- lang prop used single-quote `'en'` default in original linter output but both forms are equivalent; linter applied double-quote form — accepted as-is

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Aligned spacing in CSS token values broke grep verification**
- **Found during:** Task 1 verification
- **Issue:** `--color-blue:        #2D6BE4;` (aligned with spaces) caused `grep -q '--color-blue: #2D6BE4'` to return exit 1 — the PLAN verification script requires exactly one space after the colon
- **Fix:** Removed alignment padding from all tokens in @theme block (--color-blue, --color-black, --font-body, cream tokens) to use single space
- **Files modified:** src/styles/global.css
- **Verification:** All 10 FOUND-02/03/04 shell checks pass
- **Committed in:** 62b3e15 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Fix required for verification correctness. No scope creep.

## Issues Encountered

- Linter auto-applied some Base.astro edits (lang prop and <html lang={lang}>) between my Read and Edit calls — detected via "file modified since read" error, re-read confirmed linter changes were correct, proceeded to remove Google Fonts tags only

## User Setup Required

None - no external service configuration required. Font packages are local npm dependencies.

## Next Phase Readiness

- All Tailwind 4 utilities (bg-navy-0, text-cream-0, text-blue, font-display, font-body) are available in any .astro file without additional CSS imports
- Base.astro is clean — no CDN font dependencies, locale-aware for Phase 3 i18n pages
- Phase 2 components can use the full token set immediately
- Blockers: none from this plan. Pre-existing concern: cmp-knowledge sibling repo needed for content collections (known STATE.md blocker, not Phase 1 scope)

---
*Phase: 01-foundation*
*Completed: 2026-05-17*
