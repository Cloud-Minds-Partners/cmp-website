# Roadmap: cmp-website

## Overview

Port the canonical mock-26 design into a production-grade Astro 6 site for Cloud Minds Partners. Five phases execute in strict dependency order: foundation tokens and i18n routing scaffolding first, then the shared component library and content schemas, then all six canonical pages and collection routes, then a quality gate that verifies SEO/A11Y/Performance against Lighthouse thresholds, and finally a coordinated cutover that replaces the live v4 Crusoe site with the mock-26 build on dcplatformcmp.web.app.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Design tokens, image pipeline, fonts, base styles, and i18n routing scaffolding
- [ ] **Phase 2: Components** - Full shared component library and content collection schemas
- [ ] **Phase 3: Pages** - All six canonical pages, content collection routes, and locale copy
- [ ] **Phase 4: Quality Gate** - SEO, accessibility, and performance baselines verified against Lighthouse thresholds
- [ ] **Phase 5: Deploy** - Hard-fail CI, preview channels, Lighthouse CI gate, and production cutover

## Phase Details

### Phase 1: Foundation
**Goal**: The project has correct design tokens, local image assets, local fonts, base styles, and i18n routing so that every subsequent component and page can be built on a stable, complete substrate.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, I18N-01, I18N-02
**Success Criteria** (what must be TRUE):
  1. `npm run dev` renders a page with Space Grotesk and DM Sans loaded from local @fontsource packages (no Google Fonts network requests visible in DevTools)
  2. All 26 mock-26 photos exist at `src/assets/` and `<Image>` outputs WebP with responsive srcset in the build
  3. Tailwind 4 config has `--color-blue: #2D6BE4`, navy, black, and cream tokens active — any `.astro` file can use them without a CSS import
  4. Navigating to `/pt/` and `/es/` returns 200 (or correct Astro i18n redirect) rather than 404
  5. `src/i18n/{en,pt,es}.json` exist with nav, CTA, footer, and common label keys — even if values are stub strings
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — Test infrastructure: validate-phase-1.sh, playwright.config.ts, network spec
- [x] 01-02-PLAN.md — Fonts + design tokens + base styles: @fontsource-variable, @theme replacement, Google Fonts removal
- [ ] 01-03-PLAN.md — Image pipeline: 26 photos downloaded to src/assets/photos/, INVENTORY.md, Astro Image WebP verification
- [ ] 01-04-PLAN.md — i18n scaffold: astro.config.mjs i18n block, src/i18n/ translation files, PT/ES stub pages

### Phase 2: Components
**Goal**: Every shared UI component from mock-26 is implemented, tested in isolation, and ready for page composition. Content collection schemas are refactored with the language field so pages can render locale-aware content.
**Depends on**: Phase 1
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, COMP-05, COMP-06, COMP-07, COMP-08, COMP-09, CONT-01
**Success Criteria** (what must be TRUE):
  1. A component test page at `/dev/components` (or equivalent) renders SiteHeader with EN/PT/ES switcher, SiteFooter with 5 columns, Hero with rotating background, CapabilityCard, NewsletterSubscribe, and WhatsAppFab — all visually matching mock-26
  2. Clicking "PT" on LangSwitcher on any path routes to the `/pt/` equivalent without a 404
  3. NewsletterSubscribe form submits to the dcinsights Cloud Function and shows the inline success state without redirecting
  4. WhatsAppFab renders with the number sourced from env var (not hardcoded), pulse animation visible
  5. Memos, radar, and regwatch Zod schemas each have a `language` field (`z.enum(["en","pt","es"])`) validated at build time
**Plans**: TBD

### Phase 3: Pages
**Goal**: All six canonical pages and the three intelligence collection routes are live and pixel-faithful to mock-26, with home page PT and ES locale copy complete and remaining pages falling back to EN with a visible banner.
**Depends on**: Phase 2
**Requirements**: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, PAGE-07, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, I18N-03, I18N-04, I18N-05
**Success Criteria** (what must be TRUE):
  1. Home page hero rotates across SP/Santiago/CDMX images on a timer; capabilities, stats, team teaser, and Newsletter sections are all present and match mock-26 layout
  2. Advisory, Development, Intelligence, Platforms, Team, and Contact pages each render at `/[slug]` with correct hero image and section content from mock-26
  3. `/intelligence/memos/` shows "Memo library expanding — first publication coming soon" when collection is empty; `/intelligence/radar/` renders the existing radar entry; `/intelligence/regwatch/` handles empty state gracefully
  4. Navigating to `/pt/` shows Spanish Português home page copy; navigating to `/es/` shows Spanish copy; `/pt/advisory` displays the EN advisory content with a visible "Translated version coming soon" fallback banner
  5. Every page emits correct `hreflang` alternates for `en`, `pt`, and `es` (visible in page source)
**Plans**: TBD

### Phase 4: Quality Gate
**Goal**: The built site passes Lighthouse SEO ≥95, Accessibility ≥95, and Performance ≥90 (mobile) on the home page and at least one sub-page, with all SEO metadata, structured data, image optimization, and accessibility requirements verified.
**Depends on**: Phase 3
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05, A11Y-06, PERF-01, PERF-02, PERF-03, PERF-04
**Success Criteria** (what must be TRUE):
  1. Lighthouse CLI run against the local build scores Performance ≥90 (mobile), SEO ≥95, and Accessibility ≥95 on the home page
  2. Viewing source on any page shows a per-page `<title>`, `<meta name="description">`, `og:image` pointing to `/og/<page>.png`, `twitter:card`, and `<link rel="canonical">`
  3. Page source includes a `<script type="application/ld+json">` Organization schema sitewide, and an Article schema on memo detail pages
  4. Mobile menu opens and closes with keyboard Escape; tab order is natural; every interactive element has a visible focus ring; a skip-to-content link appears on focus
  5. Hero images have `<link rel="preload" as="image">` in the document head; DevTools Network panel shows zero render-blocking third-party JS requests (no Google Fonts, no analytics)
**Plans**: TBD

### Phase 5: Deploy
**Goal**: GitHub Actions workflow hard-fails on missing secrets, preview channels deploy per branch for review before merge, Lighthouse CI gates enforce quality thresholds on every build, and the mock-26 design replaces v4 Crusoe on dcplatformcmp.web.app in a single coordinated deploy with a documented rollback path.
**Depends on**: Phase 4
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04
**Success Criteria** (what must be TRUE):
  1. Pushing a branch with `FIREBASE_TOKEN` unset causes the workflow to exit with a non-zero code and a clear error message — the deploy step does not silently skip
  2. A non-main branch push creates a Firebase Hosting preview channel URL (expires 7d) visible in the PR or Actions log
  3. The Lighthouse CI step in the workflow fails the build if Performance <90, SEO <95, or Accessibility <95 on the home page
  4. `dcplatformcmp.web.app` serves the mock-26 design with Space Grotesk typography, cream/navy palette, and the 3-city hero rotation — the v4 dark Crusoe layout is gone
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/4 | In Progress|  |
| 2. Components | 0/TBD | Not started | - |
| 3. Pages | 0/TBD | Not started | - |
| 4. Quality Gate | 0/TBD | Not started | - |
| 5. Deploy | 0/TBD | Not started | - |
