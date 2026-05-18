---
phase: 03-pages
plan: "02"
subsystem: ui
tags: [astro, pages, i18n, mock-26, capabilitycard, hero, newslettersubscribe, seo]

requires:
  - phase: 01-foundation
    provides: Base layout, photo INVENTORY (27 photos), i18n routing config, tokens.css
  - phase: 02-components
    provides: Hero (variant home|page), CapabilityCard, NewsletterSubscribe, SEO, SiteHeader, SiteFooter
  - phase: 03-pages/03-00
    provides: spec stubs scaffolding cleanup, platforms/[slug] redirect
provides:
  - Home page (index.astro) — mock-26 6-section composition with 3-city hero rotation
  - Advisory page — hero + figures strip + 6-card capabilities + engagement timeline + CTA bar
  - Development page — hero + 3 role-cards + lifecycle 4-phase strip
  - Platforms page — hero + 4-product alternating split layout with anchor IDs
  - Home page i18n keys (en/pt/es) for hero, capabilities, cards, stats, principles, insight, newsletter sections
affects: [03-pages/03-03, 03-pages/03-04, 04-quality]

tech-stack:
  added: []
  patterns:
    - "Page scaffold: Base lang={locale} > SEO slot=head + SiteHeader + content + SiteFooter"
    - "Photo imports: import x from '../assets/photos/<file>.jpg' verified against INVENTORY.md"
    - "Inline custom card patterns (role-card, product) via scoped <style> when CapabilityCard doesn't fit"
    - "EN-hardcoded body copy on non-home pages per locked Phase 3 scope (I18N-05)"
    - "Insight section EN-only exemption per ROADMAP #4 (specific published memo reference)"

key-files:
  created:
    - .planning/phases/03-pages/03-02-SUMMARY.md
  modified:
    - src/pages/index.astro
    - src/pages/advisory.astro
    - src/pages/development.astro
    - src/pages/platforms.astro
    - src/i18n/en.json
    - src/i18n/pt.json
    - src/i18n/es.json

key-decisions:
  - "Newsletter section placed as last section before footer in home (locked CONTEXT.md decision, mock-26 has no newsletter on home but inline embed is canonical for CMP)"
  - "Insight section hardcoded EN per ROADMAP #4 exemption (references specific Memo 011 with Vespasiano/Uberlândia + 8 substations + +18 GW claims)"
  - "Home capabilities use onCream=true CapabilityCard variant on cream section bg"
  - "Advisory uses 3-col cap-grid (not 2-col) for 6 cards — denser composition matching mock-26 capabilities layout"
  - "Role cards on development.astro inline scoped CSS (not CapabilityCard) — distinct min-height 420px, centered text, photo-top pattern per RESEARCH.md implementation note"
  - "Platforms uses .product alternating CSS grid pattern (not CapabilityCard) — full-width split panels per mock-26"
  - "Anchor IDs on platforms.astro (platforms-site-selection / -grid-intelligence / -dc-financial / -test-fit-pro) match the redirect targets from platforms/[slug].astro 03-00"

patterns-established:
  - "Section rhythm: max-width 1280px, padding clamp(64px, 7vw, 112px) clamp(28px, 4vw, 64px), centered .section-head with eyebrow + h2"
  - "Cream-section vs navy-section color inheritance: .on-cream class on parent triggers cap-card on-cream variant"
  - "Animated stat values via stat-value class (matching mock-26 home reveal JS — JS not ported in Phase 3, deferred)"

requirements-completed:
  - PAGE-01
  - PAGE-02
  - PAGE-03
  - PAGE-05

duration: 22min
completed: 2026-05-17
---

# Phase 3 Plan 02: Home, Advisory, Development, Platforms Pages Summary

**Four marketing pages rebuilt as mock-26 verbatim Astro compositions — home with 3-city hero rotation + stats + 4-card capabilities + 3-principle grid + insight memo + newsletter; advisory with 5 sections including 6-lens capability grid and engagement timeline; development with 3 role cards and 4-phase lifecycle; platforms with 4 alternating split-panel products.**

## Performance

- **Duration:** ~22 min
- **Started:** 2026-05-18T00:21:23Z
- **Completed:** 2026-05-18T00:43:16Z
- **Tasks:** 2 (atomic per-task commits)
- **Files modified:** 7 (4 pages + 3 i18n JSON)

## Accomplishments

- Home (`index.astro`): 6-section mock-26 composition — Hero (3-rotation SP/Santiago/CDMX), Stats (76/251/508/+18 GW near-black bar), Platforms grid (4 CapabilityCards on cream), Principles (3-col cream), Insight (Memo 011 near-black highlight with stat overlay), Newsletter (NewsletterSubscribe inline)
- Advisory: 5 sections — Hero + Figures strip + 6 CapabilityCards (Site/Power/Water/Regulatory/Capital/Intelligence) + Engagement timeline (Phase 01-04) + cream CTA bar
- Development: 3 sections — Hero + 3 role-cards (Co-developer/Tech advisor/Financial partner) + Lifecycle 4-phase track (Pre-site/Engineering/Construction/Operate)
- Platforms: Hero + 4 alternating split products with mock-26-matching anchor IDs hookup to `platforms/[slug].astro` 301 redirects (Wave 0 from 03-00)
- All 4 pages: SEO slot present, locale-aware via `Astro.currentLocale`, photo imports validated against INVENTORY.md
- `npx astro build` exits 0 — 18 pages built, only pre-existing warnings (empty content collections, pt/es route conflicts — 03-03/04 scope)

## Task Commits

1. **Pre-task deviation: i18n keys** — `2ea023c` (chore)
2. **Task 1: Home page (index.astro) mock-26 composition** — `c686861` (feat)
3. **Task 2: Advisory + Development + Platforms pages** — `307b3b2` (feat)

_Note: i18n key addition committed separately as a Rule 3 blocking fix (en.json needed new keys to satisfy `useTranslations` keyof typing before pages would build). 03-01 plan running in parallel filled PT/ES translations and `_meta.draft_keys` audit list shortly after._

## Files Created/Modified

- `src/pages/index.astro` (566 lines) — Home: Hero 3-rotation + Stats + Capabilities + Principles + Insight + Newsletter
- `src/pages/advisory.astro` (333 lines) — Hero + Figures strip + 6-card Capabilities + Engagement timeline + CTA bar
- `src/pages/development.astro` (278 lines) — Hero + 3 role-cards + Lifecycle 4-phase track
- `src/pages/platforms.astro` (227 lines) — Hero + 4-product alternating split panels with anchor IDs
- `src/i18n/en.json` — added 39 new home page keys (hero CTAs, capabilities subhead, 4 card sets, 4 stat sets, principles eyebrow/heading, 3 principle sets, insight eyebrow/cta)
- `src/i18n/pt.json` — mirrored new keys (translated by parallel 03-01 plan with proper PT-BR copy)
- `src/i18n/es.json` — mirrored new keys (translated by parallel 03-01 plan with proper ES copy)

## Decisions Made

- **Newsletter section in home as last section before footer** — locked CONTEXT.md decision; mock-26/index.html has no newsletter, but CMP marketing canon requires inline embed on home (NewsletterSubscribe component from Phase 2)
- **Insight section EN-hardcoded** — per ROADMAP #4 exemption, the Memo 011 references specific verifiable claims (Vespasiano N-1, PARPEL 2027-2031, 8 substations, +18 GW). Translating these EN claims into PT/ES without source review would violate global rules #9 (zero invented data) and #19 (marketing audit protocol). Eyebrow + CTA label remain translated via `t()`.
- **Advisory cap-grid 3-col instead of 2x3** — denser composition matches mock-26 visual rhythm where 6 cards form 2 rows of 3 (cleaner than 3 rows of 2 on wide screens)
- **Role cards inline, not CapabilityCard** — RESEARCH.md flagged the role-card pattern as distinct (centered text, photo-top, min-height 420px, hover lift with blue glow box-shadow). Scoped `<style>` in development.astro replicates mock-26 CSS verbatim.
- **Platforms .product CSS grid pattern, not CapabilityCard** — full-width 50/50 alternating split panels are structurally different from a card grid. Implemented with `nth-child(even) .product-visual { order: 1 }` for photo-left flip.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added home page i18n keys to en.json (and mirrored to pt/es)**

- **Found during:** Task 1 (home page wiring — `useTranslations` types use `keyof typeof ui['en']`)
- **Issue:** The plan's `t('home.hero.cta-primary')`, `t('home.card.site-selection.num')`, `t('home.stat.cities.value')`, `t('home.principle.sources.title')`, `t('home.insight.eyebrow')` etc. (39 keys total) did not exist in `src/i18n/en.json`. Without them, TypeScript would error on the keyof constraint and at runtime `useTranslations` would return undefined, rendering blank text. The 03-01 plan running in parallel listed PT/ES translation work but its file scope didn't include en.json (the 03-01 plan even noted on its line 126: "New keys added to all 3 JSON files must exist in en.json first").
- **Fix:** Added 39 new keys to en.json with values pulled verbatim from mock-26/index.html (headline, subhead, CTAs, capability subhead-detail, 4 card num/title/desc triples, 4 stat value/label/unit triples, 3 principle num/title/desc triples, insight eyebrow/cta). Mirrored the same keys to pt.json and es.json with EN values as placeholders — the parallel 03-01 plan overwrote pt/es shortly after with proper translations (and added a `_meta.draft_keys` audit string).
- **Files modified:** src/i18n/en.json, src/i18n/pt.json, src/i18n/es.json
- **Verification:** `npx astro build` exits 0, all 4 pages render correctly, no `undefined` strings in HTML output.
- **Committed in:** `2ea023c` (chore commit, separate from task feat commits)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The 03-01 plan acknowledged this gap (line 126) but its `files_modified` list excluded en.json. Since 03-02 cannot compile without those keys, fixing en.json was on-path for 03-02 completion. No scope creep — values come from mock-26 HTML verbatim.

## Issues Encountered

- **i18n file race condition with 03-01 plan running in parallel** — my Write to pt.json/es.json was reverted mid-flight when 03-01's translation work landed. Resolved by leaving 03-01's translated files in place (they include `_meta.draft_keys` audit string). My en.json contribution survived since 03-01 didn't touch en.json. No conflict; final state has all 39 new keys translated properly in PT and ES.
- **Build warnings (pre-existing, not 03-02 scope):**
  - Empty memos/regwatch collections (no `.md` files in cmp-knowledge/knowledge/{memos/published,regwatch}) — 03-03/03-04 plans will populate
  - `/pt` and `/es` route conflicts (existing pt/index.astro and es/index.astro vs locale rewrite) — 03-04 plan will resolve

## User Setup Required

None — pages use existing photo assets, existing components, existing i18n config.

## Next Phase Readiness

- **Ready for 03-03 (intelligence + collection routes):** home page Insight section CTA links to `/intelligence`; intelligence index page is next plan
- **Ready for 03-04 (team + contact + PT/ES home translations):** SiteHeader nav already exposes /team and /contact links; locale-aware via auto-detect from 03-01
- **Phase 2 components consumed successfully** — Hero (both variants), CapabilityCard (with onCream), NewsletterSubscribe, SEO, SiteHeader, SiteFooter all working in production page composition
- **No blockers for downstream work**

## Self-Check: PASSED

- src/pages/index.astro — FOUND (566 lines, has Hero with 3 slide objects, NewsletterSubscribe import, cap-grid class, SEO slot)
- src/pages/advisory.astro — FOUND (333 lines, 6 CapabilityCard instances, SEO slot)
- src/pages/development.astro — FOUND (278 lines, 3 role-card articles, SEO slot)
- src/pages/platforms.astro — FOUND (227 lines, 4 product--N articles with anchor IDs, SEO slot)
- Commit `2ea023c` — FOUND (i18n deviation fix)
- Commit `c686861` — FOUND (Task 1 home page)
- Commit `307b3b2` — FOUND (Task 2 three pages)
- `npx astro build` exits 0 — VERIFIED (18 pages built, no errors)

---
*Phase: 03-pages*
*Completed: 2026-05-17*
