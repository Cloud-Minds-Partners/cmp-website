# Phase 1: Foundation — Context

**Gathered:** 2026-05-16
**Status:** Ready for planning
**Source:** Synthesized from PROJECT.md + REQUIREMENTS.md + codebase map + mock-26 design source

<domain>
## Phase Boundary

Phase 1 establishes the foundation substrate that every component (Phase 2) and page (Phase 3) will build on. It does NOT build components, pages, or content. It only stands up:

1. **Image pipeline** — 26 mock-26 photos downloaded locally, organized, and accessible via Astro `<Image>` with optimized output
2. **Design tokens** — palette, typography, spacing, radii from `mock-26/tokens.css` translated to Tailwind 4 config
3. **Fonts** — Space Grotesk + DM Sans loaded from local `@fontsource` packages (no Google Fonts CDN)
4. **Base styles** — global resets, body defaults migrated from `mock-26/site.css`
5. **i18n routing scaffold** — Astro native i18n configured with EN/PT/ES locales, translation file stubs in `src/i18n/`

When Phase 1 is done, an empty Astro page can pull tokens/fonts/i18n strings without further setup work.

</domain>

<decisions>
## Implementation Decisions (Locked)

### Image pipeline

- **Source:** `../cmp-design-system/mock-26/` is the canonical visual reference. The 26 photos are referenced via Unsplash CDN URLs in mock-26 (see `mock-26/IMAGES.md`).
- **Destination:** `src/assets/photos/` (Astro `<Image>` requires assets in `src/`, not `public/`, for build-time optimization).
- **Naming convention:** `<role>-<id>.<ext>` where role describes the photo's purpose (e.g., `hero-sp-marginal.jpg`, `card-grid-intel.jpg`). Decoupling filename from Unsplash hash makes future swaps easier.
- **Format:** Download original JPEGs from Unsplash at sufficient resolution (≥2400px wide for heroes, ≥1200px for cards). Let Astro `<Image>` emit WebP + AVIF + responsive srcset.
- **Image inventory file:** Create `src/assets/photos/INVENTORY.md` mapping each local filename to its mock-26 role, Unsplash source URL, photographer credit, and alt text. Single source of truth for image audits.
- **Credits:** Per Unsplash license, attribution is optional but encouraged. Store credits in INVENTORY.md; consider a `/credits` page (deferred to Phase 3 or v2).

### Design tokens

- **Palette tokens** (from `mock-26/tokens.css`):
  - `--color-cmp-navy: #0A2540` (or value in mock-26 — verify)
  - `--color-cmp-black: #0F1419`
  - `--color-cmp-cream: #FAF7F2`
  - `--color-cmp-blue: #2D6BE4` (CMP brand blue)
  - Plus any greys/borders/accents defined in mock-26
- **Type scale**: Read mock-26 `tokens.css` for clamp values; preserve fluid scale.
- **Radii**: 20–24px on cards, 19px on top corners of card photos, 999px on pills (CTA button) — per mock-26 CURRENT.md
- **Spacing**: clamp-based fluid scale (e.g., `clamp(32px, 5vw, 96px)` for section padding) — preserve mock-26 values verbatim
- **Tailwind 4 config approach**: Use `@theme` block in `src/styles/global.css` (Tailwind 4's CSS-first config) rather than `tailwind.config.js`. This matches Astro 6 + Tailwind 4 conventions.

### Fonts

- **Packages**: `@fontsource-variable/space-grotesk` + `@fontsource-variable/dm-sans` (variable fonts — single file covers all weights 300-700, smaller payload than per-weight static fonts)
- **Loading**: Import in `src/styles/global.css` with `@import "@fontsource-variable/space-grotesk";` etc.
- **Font family naming**: Variable fonts register as `"Space Grotesk Variable"` and `"DM Sans Variable"` — this exact string must be used in `@theme` font-family tokens, not `"Space Grotesk"`
- **font-display**: Force `swap` to prevent FOIT (Flash of Invisible Text)
- **Font CSS variables**: `--font-display: "Space Grotesk", ...fallbacks` + `--font-body: "DM Sans", ...fallbacks` — referenced from Tailwind via `font-display` / `font-body` utilities
- **No mono font**: Mock-26 explicitly removes typewriter labels (per CURRENT.md). Do NOT add JetBrains Mono or similar.
- **Verify**: Check current `src/layouts/Base.astro` for Google Fonts `<link>` tags and remove them.

### Base styles

- **Migrate from `mock-26/site.css`**: extract globals, body defaults, link styles, smooth scroll
- **Keep minimal**: anything component-specific (buttons, cards) goes in Phase 2 component files
- **CSS reset**: Tailwind 4's `@layer base` covers most resets; add only what mock-26 needs beyond
- **Body defaults**: font-family: var(--font-body), color, background, line-height

### i18n routing

- **Astro config** (`astro.config.mjs`):
  ```js
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'es'],
    routing: { prefixDefaultLocale: false },
    fallback: { pt: 'en', es: 'en' }
  }
  ```
- **URLs**:
  - English: `/`, `/about`, `/team` (no `/en/` prefix)
  - Portuguese: `/pt/`, `/pt/about`, `/pt/team`
  - Spanish: `/es/`, `/es/about`, `/es/team`
- **Fallback strategy**: When PT/ES page doesn't exist, fall back to EN content (per I18N-05). Visible "translated soon" banner is a Phase 3 concern.
- **Translation files**: `src/i18n/{en,pt,es}.json` — flat key-value, namespaced (e.g., `"nav.home": "Home"`).
- **Helper**: `src/i18n/utils.ts` exporting `t(locale, key)` function that loads the right JSON and returns the string (with EN fallback if key missing).
- **Stubs OK**: Phase 1 deliverable is structure + EN values populated; PT/ES can be stubs or empty in Phase 1. Translation copy is Phase 3.

### Claude's Discretion

- Internal file organization within `src/i18n/` (flat JSON vs nested vs YAML — but pick one and stick to it; JSON is recommended for Astro tooling).
- Whether to write a `<Trans>` helper component now or defer to Phase 2 — likely defer, raw `t(locale, key)` in Astro frontmatter is fine for Phase 1.
- Migrating existing `src/components/*` and `src/pages/*` content — out of scope for Phase 1; those get replaced in Phase 2/3. Phase 1 may leave them broken/orphaned as long as Phase 1 success criteria pass.
- Whether to convert existing pages to i18n routing now or in Phase 3 — defer to Phase 3 (the new pages will be i18n-aware from the start).
</decisions>

<specifics>
## Specific References

- **Design tokens raw source**: `../cmp-design-system/mock-26/tokens.css` (and `site.css`)
- **Image inventory**: `../cmp-design-system/mock-26/IMAGES.md` + `IMAGE-SOURCES.md`
- **Mock-26 CURRENT.md**: documents the canonical design system (palette, type, radii, layout primitives)
- **Existing layout**: `src/layouts/Base.astro` — currently loads Google Fonts; must be modified to use local fonts
- **Existing Tailwind setup**: `src/styles/global.css` — Tailwind 4 already wired
- **Astro config**: `astro.config.mjs` — needs i18n block added
- **Local server port**: mock-26 dev runs on `:8096` (Python http.server). Astro dev runs on `:4321`.
- **26 photo IDs**: see `mock-26/IMAGES.md` for full list including Unsplash hashes, role assignments, and alt-text candidates

## Photo Inventory (from mock-26 CURRENT.md)

**Home hero rotation (3):** SP Marginal, Santiago Costanera, CDMX Reforma
**Page heros (5):** Advisory (A01), Development (modern aerial), Intelligence (AI06 circuit), Platforms (D09 abstract), Team (T02 SP traffic)
**Home capabilities (4 cards):** Site Selection, Grid Intelligence, DC Financial, Test Fit Pro (R02 wireframe)
**Home insight memo (1):** green sunset silhouette
**Advisory 6 capability cards:** farms / power tower / coast water / blueprints / stock chart / SP skyline
**Development 3 roles:** modern office / blueprint / trading screens
**Platforms 4 products:** Site Selection / Grid Intelligence / DC Financial / Test Fit Pro (R02 reused)
**Intelligence featured memo (1):** B&W transmission
**Total:** 26 unique photos (R02 reused 2x intentionally)
</specifics>

<deferred>
## Deferred Ideas (out of Phase 1)

- **Translated copy in PT and ES** — Phase 3 (I18N-05). Phase 1 leaves stubs.
- **Component implementation** — Phase 2. Phase 1 does not touch `src/components/`.
- **Page content port** — Phase 3.
- **SEO meta tags / structured data / sitemap** — Phase 4.
- **Accessibility audits** — Phase 4.
- **Lighthouse CI / preview channels / cutover** — Phase 5.
- **Removing v4 Crusoe pages** — Phase 3 will replace them; Phase 1 leaves them be.
- **OG image generation** — Phase 4.
- **Translation tooling (i18next, etc.)** — out of scope. Native Astro i18n + flat JSON is sufficient.
</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-05-16 via synthesis from PROJECT.md / REQUIREMENTS.md / codebase map*
