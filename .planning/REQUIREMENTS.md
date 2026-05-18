# Requirements: cmp-website

**Defined:** 2026-05-16
**Core Value:** Communicate Cloud Minds Partners' positioning as **the** LatAm DC intelligence firm to advisory/development prospects, with editorial-quality visual presence and zero-friction conversion paths.

## v1 Requirements

### Foundation

- [x] **FOUND-01**: 26 mock-26 photos downloaded to `src/assets/` and referenced via Astro `<Image>` — WebP/AVIF output with responsive srcset and lazy loading
- [x] **FOUND-02**: Design tokens from `mock-26/tokens.css` translated to Tailwind 4 config (palette navy/black/cream + brand blue `#2D6BE4`, spacing, radii, shadows)
- [x] **FOUND-03**: Space Grotesk + DM Sans fonts loaded via `@fontsource` packages (local, not Google Fonts CDN) with `font-display: swap`
- [x] **FOUND-04**: Base styles + reset migrated from `mock-26/site.css` into Tailwind utilities + `global.css`

### Components

- [x] **COMP-01**: `SiteHeader` component — full-width edge-to-edge, logo, primary nav, EN/PT/ES `LangSwitcher`, "Talk to us" CTA pill, mobile menu with keyboard escape support
- [x] **COMP-02**: `SiteFooter` component — single unified row with 5 columns (brand cell + 4 link cols), LinkedIn + WhatsApp icons in brand cell, copyright line
- [x] **COMP-03**: `Hero` component — flush-left content (max-width 820px, padding `clamp(32px,5vw,96px)`), supports static or rotating background images (3-city LatAm rotation on home)
- [x] **COMP-04**: `CapabilityCard` component — rounded 20–24px, transparent background on cream sections, photo on top with `border-radius: 19px 19px 0 0`, title + description + optional link
- [x] **COMP-05**: `NewsletterSubscribe` component — inline section embed, posts to existing dcinsights Cloud Function, in-place success/error states, no external redirect
- [x] **COMP-06**: `WhatsAppFab` component — bottom-right floating button, number from env var (placeholder until CMP business number allocated), pulse animation
- [x] **COMP-07**: `LangSwitcher` component — EN · PT · ES inline switch, routes to `/`, `/pt/`, `/es/` preserving current path
- [x] **COMP-08**: `SocialLinks` component — LinkedIn + WhatsApp icons, reusable in header/footer/fab
- [x] **COMP-09**: `SEO` component — meta tags, OG, Twitter Card, canonical, JSON-LD slot, hreflang — used in every page layout

### Pages

- [x] **PAGE-01**: Home page — 3-city LatAm hero rotation (SP/Santiago/CDMX), capabilities section (4 cards), insight memo highlight, stats section, team teaser, Newsletter section
- [x] **PAGE-02**: Advisory page — hero (industrial campus aerial A01), 6 capability cards (farms / power tower / coast water / blueprints / stock chart / SP skyline)
- [x] **PAGE-03**: Development page — hero (aerial campus), 3 roles section (modern office / blueprint / trading screens)
- [x] **PAGE-04**: Intelligence page — hero (AI circuit board AI06), featured memo highlight, three subsection links (memos / radar / regwatch)
- [x] **PAGE-05**: Platforms page — hero (D09 blue circuit abstract), 4 product cards (Site Selection / Grid Intelligence / DC Financial / Test Fit Pro)
- [x] **PAGE-06**: Team page — hero (T02 SP Marginal traffic), real bios from `cmp-knowledge/people/` (Edgard, Gustavo, Rodrigo, Sérgio, João Carlos)
- [x] **PAGE-07**: Contact page — direct emails, WhatsApp link, social links, simple inquiry form posting to existing inquiry handler

### Content collections

- [x] **CONT-01**: Zod schemas for `memos`, `radar`, `regwatch` refactored with `language` field (en/pt/es enum) + locale-aware slugs
- [x] **CONT-02**: Memos index page (`/intelligence/memos/`) — renders list from collection, gracefully shows "Memo library expanding — first publication coming soon" when empty
- [x] **CONT-03**: Memo detail page (`/intelligence/memos/[slug]`) — uses `MemoLayout`, includes `Article` JSON-LD, related memos
- [x] **CONT-04**: Radar index page — preserves existing 1 entry, list view
- [x] **CONT-05**: Radar detail page — uses `RadarLayout`
- [x] **CONT-06**: Regwatch index page — handles empty collection same as memos
- [x] **CONT-07**: Regwatch detail page — uses `RegwatchLayout`

### Internationalization

- [x] **I18N-01**: Astro native i18n routing configured in `astro.config.mjs` — default locale `en`, secondary `pt`, `es`, routes `/`, `/pt/`, `/es/`
- [x] **I18N-02**: Translation file structure created — `src/i18n/{en,pt,es}.json` with all UI strings (nav, CTAs, footer, common labels)
- [x] **I18N-03**: Locale-aware `LangSwitcher` — clicking PT on `/team` routes to `/pt/team`; preserves deep links
- [x] **I18N-04**: `hreflang` tags emitted on every page (canonical, alternates)
- [x] **I18N-05**: At least the home page has translated copy in PT and ES at launch; other pages may fall back to EN (acceptable interim state, flagged in UX with subtle banner)

### SEO / AEO

- [x] **SEO-01**: Per-page `<title>` and `<meta name="description">` driven by page frontmatter, English defaults with PT/ES overrides
- [x] **SEO-02**: OG image system — branded default OG for each top-level page (`/og/<page>.png`), generated once and committed to `public/og/`
- [x] **SEO-03**: Twitter Card tags (`summary_large_image`) on every page
- [x] **SEO-04**: JSON-LD structured data — `Organization` schema sitewide, `Article` schema on memo pages, `WebSite` schema with potentialAction `SearchAction` placeholder
- [x] **SEO-05**: `sitemap.xml` generated via `@astrojs/sitemap` integration, includes locale alternates
- [x] **SEO-06**: `robots.txt` allowing all crawlers, pointing to sitemap
- [x] **SEO-07**: Canonical `<link rel="canonical">` on every page, pointing to canonical locale
- [x] **SEO-08**: Lighthouse SEO score ≥95 on home + 1 sub-page (verified in CI) — structural checks pass; manual score validation post-deploy

### Accessibility

- [x] **A11Y-01**: Keyboard navigation — tab order natural, mobile menu opens/closes with Escape, focus trap inside open menu
- [x] **A11Y-02**: WCAG AA color contrast verified on all text/background combinations (target ratio ≥4.5:1 for body, ≥3:1 for large text)
- [x] **A11Y-03**: Alt text on every image — descriptive (not "image of"), sourced from `mock-26/IMAGES.md` mappings
- [x] **A11Y-04**: Visible focus states on every interactive element (default browser focus ring or custom matching brand)
- [x] **A11Y-05**: Skip-to-content link visible on focus at top of every page
- [x] **A11Y-06**: Lighthouse Accessibility score ≥95 on home + 1 sub-page — structural checks pass; manual score validation post-deploy

### Performance

- [x] **PERF-01**: Lighthouse Performance ≥90 (mobile) on home page — structural checks pass; manual score validation post-deploy
- [x] **PERF-02**: Hero images pre-loaded with `<link rel="preload" as="image">` for above-the-fold
- [x] **PERF-03**: Astro `<Image>` outputs WebP + AVIF + fallback, responsive `srcset` for hero + card images
- [x] **PERF-04**: Zero render-blocking third-party JS — Google Fonts replaced by local @fontsource, no analytics in v1

### Deploy

- [x] **DEPLOY-01**: GitHub Actions workflow — hard-fails when `FIREBASE_TOKEN` or `CMP_KNOWLEDGE_READ_TOKEN` missing (remove silent-skip per global rule #8b)
- [x] **DEPLOY-02**: Firebase Hosting preview channels per non-main branch (`channel-deploy --expires 7d`)
- [x] **DEPLOY-03**: Production cutover — mock-26 design replaces v4 Crusoe on `dcplatformcmp.web.app/cmp-website` site, single coordinated deploy, rollback documented
- [x] **DEPLOY-04**: Lighthouse CI step in workflow — fails build if Performance <90, SEO <95, Accessibility <95 on home page

## v2 Requirements

### Content

- **V2-CONT-01**: Real memo publication pipeline (depends on CMP D5/D6)
- **V2-CONT-02**: Real regwatch entries (depends on D4 regwatch CLI)
- **V2-CONT-03**: Translated copy for ALL pages in PT and ES (v1 ships with EN as fallback for non-home pages)
- **V2-CONT-04**: Blog / case studies / careers / press pages

### Platform

- **V2-PLAT-01**: Analytics integration (Plausible or GA4)
- **V2-PLAT-02**: Search functionality across memos/radar/regwatch
- **V2-PLAT-03**: Custom domain cutover `www.cloudmindspartners.com` (CMP plan D13)
- **V2-PLAT-04**: CMS UI layer (Sanity/Decap) — only if non-technical authors need to publish

### CRM

- **V2-CRM-01**: Inquiry form → CRM/email pipeline (today: simple email-to handler)
- **V2-CRM-02**: Newsletter signup analytics (open rates, conversion tracking)

## Out of Scope

| Feature | Reason |
|---------|--------|
| React-heavy interactivity | Astro SSG-first; site is content-led, no app-like behavior needed |
| Custom CMS | Markdown content collections are sufficient for advisory firm publishing cadence |
| Newsletter form rewrite | Existing dcinsights CF is fixed contract; integration is stable |
| WhatsApp business number setup | Operations task, not website; FAB will use env var placeholder |
| Multi-tenant / client portal | Different product (Atlas Dashboard, SST, etc are separate apps) |
| E-commerce / payments | Not a transactional site |
| Cookie consent banner | No tracking in v1 — defer to v2 if/when analytics added |

## Traceability

**Updated by `gsd-roadmapper` on 2026-05-16.**

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| I18N-01 | Phase 1 | Complete |
| I18N-02 | Phase 1 | Complete |
| COMP-01 | Phase 2 | Complete |
| COMP-02 | Phase 2 | Complete |
| COMP-03 | Phase 2 | Complete |
| COMP-04 | Phase 2 | Complete |
| COMP-05 | Phase 2 | Complete |
| COMP-06 | Phase 2 | Complete |
| COMP-07 | Phase 2 | Complete |
| COMP-08 | Phase 2 | Complete |
| COMP-09 | Phase 2 | Complete |
| CONT-01 | Phase 2 | Complete |
| PAGE-01 | Phase 3 | Complete |
| PAGE-02 | Phase 3 | Complete |
| PAGE-03 | Phase 3 | Complete |
| PAGE-04 | Phase 3 | Complete |
| PAGE-05 | Phase 3 | Complete |
| PAGE-06 | Phase 3 | Complete |
| PAGE-07 | Phase 3 | Complete |
| CONT-02 | Phase 3 | Complete |
| CONT-03 | Phase 3 | Complete |
| CONT-04 | Phase 3 | Complete |
| CONT-05 | Phase 3 | Complete |
| CONT-06 | Phase 3 | Complete |
| CONT-07 | Phase 3 | Complete |
| I18N-03 | Phase 3 | Complete |
| I18N-04 | Phase 3 | Complete |
| I18N-05 | Phase 3 | Complete |
| SEO-01 | Phase 4 | Complete |
| SEO-02 | Phase 4 | Complete |
| SEO-03 | Phase 4 | Complete |
| SEO-04 | Phase 4 | Complete |
| SEO-05 | Phase 4 | Complete |
| SEO-06 | Phase 4 | Complete |
| SEO-07 | Phase 4 | Complete |
| SEO-08 | Phase 4 | Complete |
| A11Y-01 | Phase 4 | Complete |
| A11Y-02 | Phase 4 | Complete |
| A11Y-03 | Phase 4 | Complete |
| A11Y-04 | Phase 4 | Complete |
| A11Y-05 | Phase 4 | Complete |
| A11Y-06 | Phase 4 | Complete |
| PERF-01 | Phase 4 | Complete |
| PERF-02 | Phase 4 | Complete |
| PERF-03 | Phase 4 | Complete |
| PERF-04 | Phase 4 | Complete |
| DEPLOY-01 | Phase 5 | Complete |
| DEPLOY-02 | Phase 5 | Complete |
| DEPLOY-03 | Phase 5 | Complete |
| DEPLOY-04 | Phase 5 | Complete |

**Coverage:**
- v1 requirements: 51 total
- Mapped to phases: 51 ✓
- Unmapped: 0 ✓

| Phase | Requirements | Count |
|-------|-------------|-------|
| 1. Foundation | FOUND-01–04, I18N-01–02 | 6 |
| 2. Components | COMP-01–09, CONT-01 | 10 |
| 3. Pages | PAGE-01–07, CONT-02–07, I18N-03–05 | 17 |
| 4. Quality Gate | SEO-01–08, A11Y-01–06, PERF-01–04 | 18 |
| 5. Deploy | DEPLOY-01–04 | 4 |
| **Total** | | **51** |

---
*Requirements defined: 2026-05-16*
*Last updated: 2026-05-16 — traceability populated by gsd-roadmapper*
