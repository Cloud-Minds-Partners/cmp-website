---
phase: 03-pages
plan: "01"
subsystem: pages-foundation
tags: [i18n, layouts, seo, navigation, content-collections]
requirements_completed: [I18N-03, I18N-04, I18N-05, CONT-03, CONT-04, CONT-05]
dependency_graph:
  requires:
    - 02-03 (SEO.astro slot=json-ld pattern)
    - 02-02 (LangSwitcher barePath logic)
    - 01-04 (i18n utils + flat JSON keys)
    - 03-00 (Wave 0 spec stubs)
  provides:
    - Active nav state auto-detection (SiteHeader)
    - LocaleBanner component for EN-fallback PT/ES pages
    - SEO slot pattern on all 3 content layouts (MemoLayout/RadarLayout/RegwatchLayout)
    - Locale-aware back links via getRelativeLocaleUrl
    - Article JSON-LD on all 3 content detail pages
    - PT/ES first-pass translations for all home + common keys
    - 1 published radar entry (2026-W20) — unblocks CONT-04 rendering
  affects:
    - Every page that uses SiteHeader (active class now appears on current nav item)
    - All memo/radar/regwatch detail page renders (now hreflang-correct, Article schema)
tech-stack:
  added: []
  patterns:
    - "class:list directive for conditional active class on nav links"
    - "barePath regex /^\\/(pt|es)(\\/|$)/ strips locale prefix before comparison"
    - "SEO component with named slot=json-ld overriding default Organization schema"
    - "_meta.draft_keys CSV string flagging first-pass translations for review"
key-files:
  created:
    - src/components/LocaleBanner.astro
  modified:
    - src/components/SiteHeader.astro
    - src/layouts/MemoLayout.astro
    - src/layouts/RadarLayout.astro
    - src/layouts/RegwatchLayout.astro
    - src/i18n/en.json
    - src/i18n/pt.json
    - src/i18n/es.json
    - ../cmp-knowledge/knowledge/innovation-radar/2026-W20.md
decisions:
  - "SiteHeader auto-detects active link via Astro.url.pathname — no per-page prop needed; the unused active prop on SiteHeader was dropped from layout calls"
  - "Article JSON-LD passed through SEO's named slot (slot=json-ld) rather than adding a new prop to SEO.astro — keeps SEO interface stable"
  - "Stat numerics (76 / 251 / 508 / +18 GW) are identical across all 3 locales per CMP Rule #9 (ZERO dados inventados)"
  - "_meta.draft_keys lists 37 first-pass keys in pt.json and es.json; en.json key exists but empty string (consistent shape)"
  - "Radar gate flipped on 2026-W20.md only (most recent / most complete entry) — other 5 entries remain published: false pending Edgard review"
  - "Subnav labels in 3 layouts stay English — those are admin-facing section labels; full translation deferred to V2"
metrics:
  duration_min: 5
  tasks_total: 2
  tasks_completed: 2
  files_created: 1
  files_modified: 8
  completed_date: "2026-05-17"
---

# Phase 3 Plan 01: Foundation Fixes Summary

Plan 03-01 closes the foundation gaps RESEARCH.md identified before Wave 2 page composition: SiteHeader gains an auto-detected active nav state (and i18n labels), LocaleBanner.astro becomes the canonical EN-fallback banner, the three content layouts (MemoLayout/RadarLayout/RegwatchLayout) move to the `<SEO slot="head">` pattern with Article JSON-LD via the `slot="json-ld"` named override, pt.json and es.json receive a full first-pass home + common translation pass (37 home keys flagged in `_meta.draft_keys`), and the 2026-W20 innovation radar entry has its `published: true` gate flipped so CONT-04 renders 1 entry.

## Tasks Completed

### Task 1 — SiteHeader active nav state + LocaleBanner
- Added `isActive(href)` helper in SiteHeader.astro frontmatter that strips `/pt` or `/es` prefix via regex and matches `barePath.startsWith(href)`.
- Desktop and mobile nav links now render with `class:list={['nav-link', { active: isActive(...) }]}` and `aria-current="page"` when active.
- Added `.nav-link.active` and `.mobile-link.active` CSS so the underline shows permanently on the current page.
- Imported `useTranslations` and replaced hardcoded English nav labels and the "Talk to us" CTA pill with `t('nav.*')` / `t('cta.talk-to-us')`.
- Created `src/components/LocaleBanner.astro` — small client-side-free banner rendering `common.fallback-banner` for use on PT/ES URLs whose content falls back to EN (Wave 2 pages will mount this).

### Task 2 — Layouts upgrade + i18n PT/ES + radar gate flip
- **MemoLayout.astro / RadarLayout.astro / RegwatchLayout.astro:** moved from `<Base title=... description=...>` to `<Base lang={locale}>` + `<SEO slot="head" type="article" ...>` with Article JSON-LD passed through `<script slot="json-ld" ... />`. Back-links use `getRelativeLocaleUrl(locale, 'intelligence/<type>')`. Subnav links also locale-aware. Removed the now-unused `active="intelligence"` prop from SiteHeader calls (active state auto-detected from URL).
- **pt.json:** Full first-pass Portuguese translation for nav, CTA, footer, common, newsletter, and all 47 home.* keys. `_meta.draft_keys` lists 37 home keys awaiting Edgard review.
- **es.json:** Full first-pass Spanish translation for the same key surface. `_meta.draft_keys` mirrors pt.json.
- **en.json:** Added `_meta.draft_keys: ""` to keep JSON shape consistent across locales (TypeScript `keyof ui['en']` stays clean).
- **../cmp-knowledge/knowledge/innovation-radar/2026-W20.md:** Added YAML frontmatter at the top with `week`, `period_start`, `period_end`, `author`, `published: true`, `language: en`. This flips the gate per the radar Zod schema so `getCollection('radar', r => r.data.published)` returns 1 entry. Committed in cmp-knowledge repo as `c9d5455`.

## Verification Run

| # | Check | Result |
|---|-------|--------|
| 1 | `grep isActive src/components/SiteHeader.astro` | 5 matches |
| 2 | `grep aria-current src/components/SiteHeader.astro` | 3 matches |
| 3 | `test -f src/components/LocaleBanner.astro` | OK |
| 4 | `grep SEO src/layouts/MemoLayout.astro` | 3 matches |
| 5 | `grep getRelativeLocaleUrl src/layouts/RadarLayout.astro` | 6 matches |
| 6 | `grep "published: true" 2026-W20.md` | 1 match |
| 7 | `grep _meta.draft_keys src/i18n/pt.json` | 1 match |
| 8 | `npx astro build` | 18 pages built · `dist/intelligence/radar/2026-W20/index.html` present · only warnings are pre-existing empty memos/regwatch collections |

## Deviations from Plan

**None — plan executed exactly as written.**

The plan's action block also said to remove `active="intelligence"` from the SiteHeader call in each layout; this was done in the rewrite of the three layout files. No other deviations.

## Open Items for Wave 2 (Plans 03-02 and onward)

- Pages composing the home/team/intelligence/etc routes will need to mount `<LocaleBanner />` conditionally at top of `<main>` when `currentLocale !== 'en'` AND no locale-specific page exists (per RESEARCH.md fallback pattern).
- The 37 `_meta.draft_keys` listed in pt.json and es.json should be reviewed by Edgard before any client-facing PT/ES launch.
- 5 other radar entries (2026-W14 … 2026-W19) remain `published: false` — defer to Edgard before flipping more gates.

## Commits

- `2452722` — feat(03-pages-01): SiteHeader active nav state + LocaleBanner
- `a235fc9` — feat(03-pages-01): SEO slot layouts + i18n PT/ES + radar gate
- `c9d5455` (cmp-knowledge repo) — feat(radar): publish 2026-W20 frontmatter

## Self-Check: PASSED
- src/components/LocaleBanner.astro: FOUND
- src/components/SiteHeader.astro: FOUND with isActive
- src/layouts/MemoLayout.astro: FOUND with SEO + getRelativeLocaleUrl
- src/layouts/RadarLayout.astro: FOUND with SEO + getRelativeLocaleUrl
- src/layouts/RegwatchLayout.astro: FOUND with SEO + getRelativeLocaleUrl
- src/i18n/pt.json: FOUND with _meta.draft_keys + "Inteligência"
- src/i18n/es.json: FOUND with _meta.draft_keys + "Inteligencia"
- ../cmp-knowledge/knowledge/innovation-radar/2026-W20.md: FOUND with published: true
- Commit 2452722: FOUND in cmp-website
- Commit a235fc9: FOUND in cmp-website
- Commit c9d5455: FOUND in cmp-knowledge
- `npx astro build` exits 0; 18 pages built; radar 2026-W20 detail page generated
