---
phase: 02-components
plan: "03"
subsystem: components
tags: [hero, seo, newsletter, content-schema, i18n, tdd, astro]

# Dependency graph
requires:
  - phase: 02-components
    plan: "01"
    provides: Base.astro head slot, Playwright spec stubs for COMP-03/COMP-05/COMP-09/CONT-01
provides:
  - Hero.astro (home rotating + page Ken Burns variants)
  - SEO.astro (full head meta suite, hreflang, JSON-LD slot)
  - NewsletterSubscribe.astro (CF-backed, progressive enhancement, 4 states)
  - content.config.ts language field on memos/radar/regwatch
  - i18n newsletter keys on en/pt/es
affects:
  - 02-04 (dev preview page uses Hero.astro and SEO.astro)
  - Phase 3 pages (all use Hero.astro for page heroes, SEO.astro for head meta)
  - Phase 4 SEO audit (SEO.astro is the canonical head meta emitter)
  - All content collection queries that filter by language

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SEO component pattern: <SEO slot='head' .../> inside Base.astro named slot"
    - "hreflang computed via getAbsoluteLocaleUrl from astro:i18n (strips locale prefix first)"
    - "Hero two-variant pattern: single .astro file, conditional render on variant prop"
    - "Progressive enhancement newsletter: HTML form fallback + is:inline JS fetch hijack"
    - "CF endpoint single source of truth: social.subscribeEndpoint imported, never hardcoded"

key-files:
  created:
    - src/components/Hero.astro
    - src/components/SEO.astro
  modified:
    - src/components/NewsletterSubscribe.astro
    - src/content.config.ts
    - src/i18n/en.json
    - src/i18n/pt.json
    - src/i18n/es.json
    - src/layouts/Base.astro
    - src/pages/index.astro
    - src/pages/team.astro
    - src/pages/advisory.astro
    - src/pages/development.astro
    - src/pages/newsletter.astro
    - src/pages/platforms.astro
    - src/pages/contact.astro
    - src/pages/pt/index.astro
    - src/pages/es/index.astro
    - src/pages/intelligence/index.astro
    - src/pages/intelligence/memos/index.astro
    - src/pages/intelligence/radar/index.astro
    - src/pages/intelligence/regwatch/index.astro
    - src/pages/platforms/[slug].astro

key-decisions:
  - "Base.astro stripped of title prop and fullTitle logic — SEO.astro is the single owner of all head meta including title"
  - "Hero.astro uses single-file two-variant pattern (conditional JSX on variant prop) rather than two separate files"
  - "SEO.astro barePath computation strips /pt and /es prefix before passing to getAbsoluteLocaleUrl to avoid double-prefix on alternates"
  - "NewsletterSubscribe replaced entirely with mock-26 dark design; unique uid per instance prevents DOM conflicts on multi-embed pages"
  - "14 existing pages updated to <Base> + <SEO slot='head' .../> pattern as part of this plan (Rule 3 auto-fix — Base.astro prop removal would have broken all pages)"

# Metrics
duration: 14min
completed: 2026-05-17
---

# Phase 2 Plan 03: Hero, SEO, NewsletterSubscribe, CONT-01 Schema Summary

**Hero (home slideShow 24s + page heroKen 18s), SEO (OG/Twitter/hreflang/JSON-LD), NewsletterSubscribe (CF endpoint from social.ts, 4 states), content schema language field on memos/radar/regwatch**

## Performance

- **Duration:** ~14 min
- **Started:** 2026-05-17T18:02:36Z
- **Completed:** 2026-05-17T18:16:00Z
- **Tasks:** 2
- **Files modified:** 21

## Accomplishments

- Created Hero.astro with two variants:
  - Home: 3-slide rotating hero, 24s `slideShow` keyframes (opacity/scale), 820px content max-width, 3 progress track indicators (56px, scaleX fill over 8s), exact mock-26 overlay gradients (radial + 2 linear), grid texture with mask fade
  - Page: Ken Burns 18s `heroKen` animation, 620px content max-width, filter saturate/contrast/brightness, optional eyebrow with `.live` pulsing dot, action buttons (primary pill + outline)
- Created SEO.astro with complete head meta suite:
  - `<title>` with Cloud Minds suffix auto-append
  - `<meta name="description">` and `<meta name="robots">`
  - 7 OG tags (title, description, image, url, type, locale, site_name)
  - 4 Twitter Card tags
  - `<link rel="canonical">` (auto-computed from Astro.url)
  - 4 hreflang alternates (en, pt-BR, es, x-default) via `getAbsoluteLocaleUrl`
  - JSON-LD `<slot name="json-ld">` with default Organization schema
- Replaced NewsletterSubscribe.astro with mock-26 dark design:
  - CF endpoint imported from `social.subscribeEndpoint` (never hardcoded)
  - Unique `uid` per instance prevents DOM ID conflicts on multi-embed pages
  - Progressive enhancement: HTML form fallback + `is:inline` JS fetch hijack
  - 4 states: idle, submitting (btn disabled, `...`), success (wrap innerHTML replaced), error (inline red message)
  - Success check: `res.ok && (data.status === 'subscribed' || data.status === 'already_subscribed')`
- Updated `src/content.config.ts`: `language: z.enum(['en','pt','es']).default('en')` added to memos, radar, and regwatch schemas (CONT-01)
- Updated i18n JSON (en/pt/es): 6 newsletter keys added (submit, success, already, error, network, placeholder)

## Task Commits

1. **Task 1: Hero component** - `e5380f8` (feat)
   - src/components/Hero.astro
2. **Task 2: SEO + NewsletterSubscribe + CONT-01 + Base cleanup** - `6cee1d1` (feat)
   - src/components/SEO.astro (new)
   - src/components/NewsletterSubscribe.astro (replaced)
   - src/content.config.ts
   - src/i18n/en.json, pt.json, es.json
   - src/layouts/Base.astro
   - 14 pages

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Base.astro title prop removal required all pages to be updated**

- **Found during:** Task 2 — when Base.astro's `title` prop was removed to give SEO.astro full ownership of `<title>`, all 14 existing pages that passed `title=` to Base would produce TypeScript errors at build time
- **Fix:** Updated all 14 pages to `import SEO from ...` and use `<SEO slot="head" title="..." description="..." />` inside `<Base>`. Each page preserved its original title and description strings.
- **Files modified:** src/pages/index.astro, team.astro, advisory.astro, development.astro, newsletter.astro, platforms.astro, contact.astro, pt/index.astro, es/index.astro, intelligence/index.astro, intelligence/memos/index.astro, intelligence/radar/index.astro, intelligence/regwatch/index.astro, platforms/[slug].astro
- **Commit:** `6cee1d1`

**2. [Rule 1 - Bug] Base.astro had duplicate `<title>` that would conflict with SEO.astro**

- **Found during:** Task 2 — Base.astro still had `<title>{fullTitle}</title>` even though plan 02-01 removed OG/meta tags. SEO.astro also emits `<title>`, causing duplicate title elements in the document head.
- **Fix:** Removed `<title>` tag, `fullTitle` computation, `title`/`description`/`canonical` props from Base.astro. Updated `color-scheme` to `dark` and `theme-color` to `#05111D` to match mock-26 dark palette.
- **Files modified:** src/layouts/Base.astro
- **Commit:** `6cee1d1`

## Verification Results

All 7 plan verification checks passed:
1. `slideShow` in Hero.astro: PASS
2. `820px` and `620px` in Hero.astro: PASS
3. `hreflang` in SEO.astro: PASS
4. `social.subscribeEndpoint` in NewsletterSubscribe.astro: PASS
5. `language.*z.enum` in content.config.ts: PASS
6. `npx astro build` exits 0: PASS (20 pages, zero errors)
7. CF endpoint contract preserved in social.ts: PASS

## Self-Check: PASSED

- src/components/Hero.astro: FOUND
- src/components/SEO.astro: FOUND
- src/components/NewsletterSubscribe.astro: FOUND (replaced)
- src/content.config.ts: language field present 3x (memos, radar, regwatch)
- Commits e5380f8 and 6cee1d1: both present in git log

---
*Phase: 02-components*
*Completed: 2026-05-17*
