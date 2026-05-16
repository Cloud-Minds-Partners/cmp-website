# cmp-website

## What This Is

Definitive marketing site for **Cloud Minds Partners** — B2B data center advisory, project development, and intelligence for Latin America. Premium static site built on Astro 6 + Tailwind 4, deployed to Firebase Hosting. Port of the canonical `mock-26` design (from `../cmp-design-system/`) into proper component architecture with i18n routing, native image optimization, SEO/AEO foundation, and content collections ready for memos/radar/regwatch.

## Core Value

Communicate Cloud Minds Partners' positioning as **the** LatAm DC intelligence firm to advisory/development prospects, with editorial-quality visual presence and zero-friction conversion paths (newsletter signup, WhatsApp, email contact).

## Requirements

### Validated

<!-- Exists in current code, will be preserved through the port -->

- ✓ Firebase Hosting deploy via GitHub Actions — existing
- ✓ Content collection scaffolding (Zod schemas for memos/radar/regwatch) — existing (needs `language` field added)
- ✓ Newsletter Cloud Function integration → dcinsights.web.app — existing
- ✓ WhatsApp FAB component — existing (hardcoded number, needs env)
- ✓ Social links component (LinkedIn) — existing
- ✓ Astro 6 + Tailwind 4 + React 19 scaffold — existing

### Active

<!-- v1 scope, mapped to roadmap phases -->

- [ ] Port mock-26 visual design across 6 canonical pages (home, advisory, development, intelligence, platforms, team)
- [ ] Native image optimization — download 26 mock-26 photos local, use Astro `<Image>` with WebP/AVIF + responsive srcset + lazy loading
- [ ] i18n functional routing EN/PT/ES (`/`, `/pt/`, `/es/`) — Astro native i18n, translation files per locale
- [ ] Content collection schemas refactored with `language` field, multi-locale entries supported
- [ ] SEO/AEO foundation — meta tags, OG images, Twitter Cards, JSON-LD structured data (Organization, Article), sitemap.xml, robots.txt
- [ ] Component library: `SiteHeader` (with EN/PT/ES switcher + "Talk to us" CTA), `SiteFooter` (5-col, brand cell + 4 link cols, LinkedIn + WhatsApp icons), `Hero` (with 3-city LatAm rotation), `CapabilityCard`, `NewsletterSubscribe` (inline embed, posts to existing CF), `WhatsAppFab` (env-driven number), `LangSwitcher`
- [ ] Design tokens — translate `mock-26/tokens.css` to Astro/Tailwind 4 config (palette navy/black/cream + brand blue `#2D6BE4`, Space Grotesk + DM Sans fonts)
- [ ] Index pages for `intelligence/memos`, `intelligence/radar`, `intelligence/regwatch` — render from content collections, gracefully empty when collection has no entries
- [ ] Preview channels per branch (Firebase Hosting channels) → manual promote to prod
- [ ] Production cutover from current v4 (Crusoe-inspired) → mock-26 design
- [ ] CMS-grade SEO baseline — Lighthouse SEO ≥95, accessible color contrast (WCAG AA), keyboard-navigable mobile menu

### Out of Scope

<!-- v2 / deferred / explicit exclusions -->

- Real memo/radar/regwatch content authoring — defer to CMP plan D5/D6 (memos reais, separate workstream)
- Custom domain cutover (`www.cloudmindspartners.com` vs current `dcplatformcmp.web.app`) — defer to CMP plan D13
- Analytics integration (GA4/Plausible) — v2, after baseline ships
- Blog / case studies / careers / press pages — v2, when content exists
- Search functionality — v2, low priority for ~20-page site
- Newsletter form revamp — out of scope, keep existing dcinsights CF integration as-is
- React interactivity beyond minimal — Astro SSG-first; React only where genuinely necessary (likely no use)
- CMS UI (Sanity/Decap/etc) — content collections via .md files are sufficient
- Search-engine paid optimization (SEM, Ads) — separate workstream

## Context

- **Design source of truth:** `../cmp-design-system/mock-26/` (sole canonical mock, all others deleted 2026-05-16, backups in `~/cmp-design-system-archive/`). 6 standalone HTML pages, 26 curated LatAm photos, design system documented in `CURRENT.md`.
- **Current production state:** `dcplatformcmp.web.app` (Firebase Hosting site `cmp-website` inside the shared `dcplatformcmp` project) deploys v4 Crusoe-inspired dark layout from commit `8e4b045` (2026-04-25). To be replaced.
- **Branch state at project init:** Local repo had `main` (v4 deployed) + `design/v2-tech-dark` (3 unpushed commits, v2/v3 dark-first iterations). Codebase map and PROJECT.md will guide the port; v2-tech-dark branch is reference, not target.
- **Newsletter backend:** `dcinsights.web.app` (separate Firebase project `cmp-newsletter` or similar). Existing Cloud Function for subscribe — keep as-is.
- **Brand assets:** Logo SVGs at `public/brand/cmp-logo-{white,navy}.svg`. Wordmark + mark at `mock-26/logo/`. People photos at `mock-26/photos/`.
- **WhatsApp FAB:** Today points to Edgard's personal number — must move to env var pending CMP business number allocation.
- **Image library performance:** Mock-26 currently pulls 26 photos from Unsplash CDN. For prod, must download locally and let Astro optimize (WebP/AVIF + responsive srcset).
- **GitHub Actions Firebase deploy:** Currently degrades gracefully when `FIREBASE_TOKEN` unset (commits `dae2d8f`, `ba8f68a`). Per global rule #8b ("Silent skip is failure"), must change to hard fail with explicit health check.
- **Content collections:** Schemas exist for memos/radar/regwatch in `src/content.config.ts`. Only radar has 1 real entry; memos/regwatch are empty scaffolds. Plan accommodates empty state.

## Constraints

- **Tech stack:** Astro 6 + Tailwind 4 + React 19 — already scaffolded, do NOT change foundation. React kept available but used sparingly (SSG-first).
- **Deploy:** Firebase Hosting via GitHub Actions to `dcplatformcmp` project, hosting site `cmp-website`. Preview channels per branch.
- **Design fidelity:** 100% to `mock-26` — no design iteration during port. Anything ambiguous in mock-26, follow `CURRENT.md` design system rules.
- **Performance:** Lighthouse Performance ≥90 (mobile), SEO ≥95, Accessibility ≥95.
- **Image hosting:** Local + Astro-optimized. Unsplash CDN OK as temporary placeholder during port, must be replaced before prod cutover.
- **i18n routing:** Functional from v1 (per Key Decision below). Defer translated copy is OK; routing structure must be present.
- **Languages:** EN (primary), PT-BR, ES (LatAm). Brand language for marketing pages per CMP global rule #27 (default English; localized copy when authored).
- **CMP global rules apply:** #1 (no invented data), #20 (Chain of Truth for client-facing), #28 (CMP Refundação plan adherence), #29 (post length not relevant here — this is the site itself), #38 (no fabricated specifics in marketing mocks — site copy must come from `mock-26` or be flagged as placeholder).
- **No newsletter form rewrite:** Existing dcinsights CF integration is fixed contract.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro framework (not raw HTML deploy) | Premium long-lived site needs proper foundation: image optimization, i18n routing, SEO baked-in, type-safe content schemas, component reuse. Mock-26 HTML direct is workaround, not definitive. | — Pending |
| Port mock-26 (not iterate further) | Mock-26 is canonical post 2026-05-16 cleanup. Design phase closed. Implementation phase opens. | — Pending |
| i18n functional in v1 | EN/PT/ES is in design. Visual-only switcher = tech debt. Astro i18n is cheap when set up at start, expensive to retrofit. | — Pending |
| Content schemas ready, real content later | Don't block port on missing memos. Schemas + index pages handle empty collections gracefully. Drop a .md in `src/content/memos/` → memo appears in nav. | — Pending |
| Newsletter inline embed (not external link) | Friction-zero conversion is core value. Keep existing dcinsights CF, just embed form section. | — Pending |
| Preview channels → manual promote | Edgard reviews each PR in preview URL before merging to prod. Eliminates "live broken site" risk. | — Pending |
| Image library local + Astro `<Image>` | Unsplash CDN dependency = performance + reliability + branding risk. Local + optimized = 2-3x faster, no third-party fragility. | — Pending |
| Hard-fail Firebase deploy (no silent skip) | Per global rule #8b, silent-skip CI is recurring CMP bug pattern. Deploy step must health-check tokens explicitly. | — Pending |

---
*Last updated: 2026-05-16 after initialization*
