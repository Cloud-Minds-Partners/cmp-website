# Phase 2: Components — Context

**Gathered:** 2026-05-17
**Status:** Ready for planning
**Source:** Synthesized from PROJECT.md + REQUIREMENTS.md + mock-26 design source + Phase 1 substrate

<domain>
## Phase Boundary

Phase 2 builds the shared component library that Phase 3 pages will compose. It does NOT build pages or render real content beyond a dev-only test page. Phase 2 delivers:

1. **9 shared Astro components** — SiteHeader, SiteFooter, Hero, CapabilityCard, NewsletterSubscribe, WhatsAppFab, LangSwitcher, SocialLinks, SEO
2. **Content schemas refactored** — memos, radar, regwatch Zod schemas gain a `language` field
3. **Dev component preview page** — `/dev/components` (or guarded equivalent) renders each component in isolation for visual review against mock-26

When Phase 2 is done, Phase 3 page work is pure composition: import components, pass props, no new shared UI.

</domain>

<decisions>
## Implementation Decisions (Locked)

### Existing components — replace, don't extend

The current `src/components/` directory has stale v4-era components (`SiteHeader.astro`, `SiteFooter.astro`, `NewsletterSubscribe.astro`, `WhatsAppFab.astro`, `SocialLinks.astro`, `Logo.astro`, `Section.astro`, `LatamPulseMap.astro`, `CarouselEmbed.astro`, `VideoEmbed.astro`, `NewsletterArchive.astro`, `WeeklyPulseSection.astro`).

**Approach:** REPLACE the 5 components that overlap with new Phase 2 components (SiteHeader, SiteFooter, NewsletterSubscribe, WhatsAppFab, SocialLinks). For Logo.astro: keep but verify it works with mock-26 logo SVGs. The rest (LatamPulseMap, CarouselEmbed, etc.) are orphaned by Phase 3 anyway — leave them for now (Phase 3 deletes unused).

### Component implementation language

- **Astro `.astro` components, not React** — site is SSG, no React-grade interactivity needed for any of these 9 components. Mobile menu toggle uses minimal vanilla JS in a `<script>` block at the bottom of SiteHeader.astro. LangSwitcher uses pure `<a href>` (no JS).
- React deps (`@types/react`, etc.) installed by Phase 1 stay in `package.json` but aren't imported anywhere in Phase 2.
- Astro's `client:*` directives NOT used in Phase 2 (no React/Vue/Svelte hydration).

### Component-level styling

- **Tailwind 4 utilities inline in `.astro` files** for layout, spacing, colors (uses tokens from Phase 1 `@theme` block).
- **Scoped `<style>` blocks** for complex selectors, pseudo-elements, animations (e.g., WhatsAppFab pulse keyframes, hover transitions).
- **No external `.css` files per component** — Astro's scoped styles + Tailwind suffice.

### LangSwitcher behavior

- Renders 3 `<a>` links: `EN · PT · ES`
- Each `<a href>` computed from current `Astro.url.pathname` via `getRelativeLocaleUrl(locale, currentPath)` from Astro i18n utils
- Active locale gets `aria-current="page"` and visual emphasis (underline or bold)
- Mobile: stays inline in nav (not collapsed into separate menu)
- **No JS** — pure server-rendered anchors

### Newsletter Cloud Function integration

- Existing CF endpoint: `https://us-central1-cmpnewsletter.cloudfunctions.net/subscribe` (or current dcinsights CF URL — researcher confirms exact endpoint)
- POST with `Content-Type: application/json`, body `{ email: "..." }`
- Form uses progressive enhancement:
  - Default: standard HTML `<form>` POST → redirects to thank-you page (fallback)
  - Enhanced: minimal vanilla JS hijacks submit, fetches CF endpoint, shows inline success/error message in same DOM node
- States:
  - idle (default form visible)
  - submitting (button disabled, spinner)
  - success (form replaced with "✓ You're in. Welcome to DC Insights." message)
  - error (inline red message above form, retry button)
- All states copy is localizable via i18n keys (`newsletter.submit`, `newsletter.success`, `newsletter.error`)

### WhatsAppFab env var

- Number sourced from `PUBLIC_WHATSAPP_NUMBER` env var (must be `PUBLIC_*` to be exposed at build time per Astro/Vite convention)
- Fallback: empty string → component renders nothing (graceful degradation)
- Local dev: set in `.env` (gitignored), e.g., `PUBLIC_WHATSAPP_NUMBER=5511999999999` (placeholder until CMP business number allocated)
- Production: set in Firebase Hosting env / GitHub Actions secret → injected at build time
- URL format: `https://wa.me/${PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}` where message defaults to "Hi, I'd like to talk to Cloud Minds Partners about..."

### Dev component preview page

- **Route:** `/dev/components` (real route, not `_dev-components` since Astro skips `_*`)
- **Env guard:** Inside page, check `if (import.meta.env.PROD) { return Astro.redirect('/404'); }` — page only renders in dev mode. Or wrap content in `{import.meta.env.DEV && (...)}` so prod build outputs an empty 404.
- **Layout:** Plain Base.astro inheritance. Renders each component with sample props. Labels each section with component name.
- **Not a "Storybook"** — minimal, just enough to eyeball Phase 2 deliverables visually against mock-26.

### Content schemas refactor (CONT-01)

- File: `src/content.config.ts`
- Add `language: z.enum(['en', 'pt', 'es']).default('en')` field to each of memos, radar, regwatch collection schemas
- Existing radar entry needs frontmatter migration: add `language: en` if missing
- Slug strategy: locale prefix in slug (e.g., `memos/pt/grid-headroom-2026` vs `memos/grid-headroom-2026`) — defer slug strategy details to Phase 3 (CONT-02..07), Phase 2 only adds the schema field
- Validation: build must fail if any entry has invalid language value

### SEO component (COMP-09)

- File: `src/components/SEO.astro`
- Props: `title`, `description`, `image` (optional, falls back to default OG), `canonical` (optional, computed from URL if absent), `lang` (current locale), `type` (default 'website', 'article' for memos), `noindex` (default false)
- Emits in `<head>`:
  - `<title>`, `<meta name="description">`, `<meta name="robots">`
  - OG: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, `og:site_name`
  - Twitter: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
  - `<link rel="canonical">`
  - `hreflang` `<link>` alternates for en/pt/es (computed via i18n helper)
  - JSON-LD slot (Organization sitewide via Base.astro; Article in MemoLayout)
- **Note:** OG image generation/files come in Phase 4 (SEO-02). Phase 2 ships the SEO component with a placeholder OG `/og/default.png` reference that resolves to a Phase 4 deliverable.

### Claude's Discretion

- Exact CSS class naming inside components (Tailwind utilities — match mock-26 visually but readable)
- Internal HTML structure within components (semantic HTML preferred — `<header>`, `<footer>`, `<nav>`, `<aside>`)
- Mobile breakpoint values for nav collapse (suggest 768px / Tailwind `md:` breakpoint)
- Animation timing for WhatsApp pulse (1.5-2s loop reasonable)
- Component file organization (`src/components/<Name>.astro` flat; no subdirectories needed for 9 components)
</decisions>

<specifics>
## Specific References

- **Design source:** `../cmp-design-system/mock-26/` — read `index.html`, `advisory.html`, etc. for component structure; `site.css` for component CSS rules to replicate
- **CURRENT.md design system:** palette, type scale, radii, layout primitives (already in `@theme` block from Phase 1)
- **Existing components** (replace 5 of these, keep Logo):
  - `src/components/SiteHeader.astro` → REPLACE
  - `src/components/SiteFooter.astro` → REPLACE
  - `src/components/NewsletterSubscribe.astro` → REPLACE (preserve existing CF endpoint URL if accessible)
  - `src/components/WhatsAppFab.astro` → REPLACE (env-driven number)
  - `src/components/SocialLinks.astro` → REPLACE
  - `src/components/Logo.astro` → KEEP, verify SVG path
- **New components:**
  - `src/components/Hero.astro` (NEW)
  - `src/components/CapabilityCard.astro` (NEW)
  - `src/components/LangSwitcher.astro` (NEW)
  - `src/components/SEO.astro` (NEW)
- **i18n utils:** `src/i18n/utils.ts` (from Phase 1) — `getLangFromUrl`, `useTranslations`, plus add `getLocalizedUrl(targetLocale, currentPath)` helper for LangSwitcher
- **Existing CF endpoint URL:** Likely in current `NewsletterSubscribe.astro` — read it first to preserve. Researcher should confirm exact URL.

## Test Page

`src/pages/dev/components.astro` (creates `/dev/components` route in dev only; redirected in prod). Renders:

```
<section>SiteHeader (default + open mobile menu state)</section>
<section>SiteFooter</section>
<section>Hero (static bg)</section>
<section>Hero (3-city rotating bg)</section>
<section>CapabilityCard × 3 (varying props)</section>
<section>NewsletterSubscribe (idle + success + error states)</section>
<section>WhatsAppFab (rendered in fixed position)</section>
<section>LangSwitcher (current locale highlighted)</section>
<section>SocialLinks (header variant + footer variant)</section>
```

## Phase 1 substrate already in place

- `@theme` tokens: `--color-navy-0`, `--color-blue`, `--color-cream-0`, etc.
- Fonts loaded: Space Grotesk Variable + DM Sans Variable
- Photos available: 27 JPEGs in `src/assets/photos/`
- i18n config: en/pt/es locales, rewrite fallback, helper utils

Phase 2 consumes all of these. Do not duplicate token definitions or font imports.
</specifics>

<deferred>
## Deferred Ideas (out of Phase 2)

- **Real OG image PNGs** — Phase 4 (SEO-02). Phase 2 ships SEO component referencing `/og/default.png` placeholder.
- **Page composition** — Phase 3. Phase 2 only delivers the dev preview page.
- **Locale-prefixed memo slugs** — Phase 3 (CONT-02..07 detail).
- **Newsletter form analytics/tracking** — v2.
- **Lighthouse a11y audit** — Phase 4.
- **WhatsApp business number cutover** — operational task, not Phase 2 scope (env var placeholder is enough).
- **Component documentation** — defer indefinitely. Tests + dev preview page are documentation.
- **Storybook / Histoire** — out of scope. Dev preview page suffices.
- **Removing v4 Crusoe pages** — Phase 3 replaces them.
</deferred>

---

*Phase: 02-components*
*Context gathered: 2026-05-17 via synthesis from PROJECT.md / REQUIREMENTS.md / mock-26 / Phase 1 substrate*
