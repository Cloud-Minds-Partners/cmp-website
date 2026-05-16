# Phase 1: Foundation — Research

**Researched:** 2026-05-16
**Domain:** Astro 6 i18n routing, Tailwind 4 @theme tokens, @fontsource variable fonts, Astro Image pipeline, Unsplash batch download
**Confidence:** HIGH (primary findings verified against official Astro docs + Tailwind v4 release notes + Fontsource docs)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Image pipeline**
- Source: `../cmp-design-system/mock-26/` is canonical. 26 photos referenced via Unsplash CDN URLs in `mock-26/IMAGES.md`.
- Destination: `src/assets/photos/` (Astro `<Image>` requires assets in `src/` for build-time optimization).
- Naming: `<role>-<id>.<ext>` — e.g., `hero-sp-marginal.jpg`, `card-grid-intel.jpg`.
- Format: Download original JPEGs from Unsplash (≥2400px wide for heroes, ≥1200px for cards). Let Astro `<Image>` emit WebP + AVIF + responsive srcset.
- Create `src/assets/photos/INVENTORY.md` mapping local filename → mock-26 role → Unsplash source URL → photographer credit → alt text.

**Design tokens**
- Palette tokens from `mock-26/tokens.css` (verified in research):
  - `--color-cmp-navy: #050E1D` (deepest navy, `--navy-0` in tokens.css)
  - `--color-cmp-navy-card: #0A1E38` (card surface, `--navy-1`)
  - `--color-cmp-black: #000000` (pure black, `--black`)
  - `--color-cmp-cream: #F5F1E8` (primary text on dark, `--cream-0`)
  - `--color-cmp-blue: #2D6BE4` (CMP brand blue, `--blue`)
  - `--color-cmp-blue-bright: #4A8FE7` (accent/glow, `--blue-bright`)
  - Plus cream-bg `#F5F1E8`, cream-bg-2 `#EDE6D5`, cream-bg-3 `#FAF6EC`
- Type scale: Use clamp-based fluid scale preserved verbatim from mock-26.
- Radii: 20–24px on cards, 19px on top corners of card photos, 999px on pill buttons.
- Spacing: `clamp(20px, 4vw, 56px)` gutter (from `--gutter` in tokens.css).
- **Tailwind 4 config approach**: `@theme` block in `src/styles/global.css` ONLY — NOT `tailwind.config.js`. This is how the project already uses Tailwind 4.

**Fonts**
- Packages: `@fontsource-variable/space-grotesk` + `@fontsource-variable/dm-sans` (variable font packages preferred — single file covers all weights).
- Loading: Import in `src/styles/global.css`.
- font-display: Fontsource packages use `swap` by default.
- Font CSS variables: `--font-display: "Space Grotesk Variable", ...fallbacks` + `--font-body: "DM Sans Variable", ...fallbacks`.
- No mono font in mock-26. Existing `--font-mono: "JetBrains Mono"` must be removed from @theme (mock-26 explicitly removes typewriter labels per CURRENT.md).
- Remove existing Google Fonts `<link>` tags from `src/layouts/Base.astro` (lines 39-44).

**Base styles**
- Migrate from `mock-26/site.css`: globals, body defaults, link styles, smooth scroll.
- Keep minimal: component-specific styles stay in Phase 2.
- Body defaults: `font-family: var(--font-body)`, color `var(--cream-0)` on dark `var(--navy-0)` background, `line-height: 1.55`.
- The existing `global.css` uses dark-first v4 theme with different variable names — must be replaced with mock-26 token names.

**i18n routing**
- Astro config `astro.config.mjs`:
  ```js
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'es'],
    routing: { prefixDefaultLocale: false },
    fallback: { pt: 'en', es: 'en' }
  }
  ```
- URLs: English `/`, `/about`, `/team` (no `/en/` prefix); Portuguese `/pt/`, `/pt/about`; Spanish `/es/`, `/es/about`.
- Translation files: `src/i18n/{en,pt,es}.json` — flat key-value, namespaced (e.g., `"nav.home": "Home"`).
- Helper: `src/i18n/utils.ts` exporting `getLangFromUrl(url)` + `useTranslations(lang)` → `t(key)`.
- Phase 1 deliverable: structure + EN values populated. PT/ES may be stubs.

### Claude's Discretion

- Internal file organization within `src/i18n/` (flat JSON vs nested vs YAML — JSON recommended for Astro tooling).
- Whether to write a `<Trans>` helper component now or defer to Phase 2 — likely defer.
- Migrating existing `src/components/*` and `src/pages/*` — out of scope for Phase 1.
- Whether to convert existing pages to i18n routing now or in Phase 3 — defer to Phase 3.

### Deferred Ideas (OUT OF SCOPE)

- Translated copy in PT and ES — Phase 3 (I18N-05). Phase 1 leaves stubs.
- Component implementation — Phase 2. Phase 1 does not touch `src/components/`.
- Page content port — Phase 3.
- SEO meta tags / structured data / sitemap — Phase 4.
- Accessibility audits — Phase 4.
- Lighthouse CI / preview channels / cutover — Phase 5.
- Removing v4 Crusoe pages — Phase 3 replaces them.
- OG image generation — Phase 4.
- Translation tooling (i18next, etc.) — out of scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | 26 mock-26 photos downloaded to `src/assets/photos/` and referenced via Astro `<Image>` — WebP/AVIF output with responsive srcset and lazy loading | Astro `<Image>` + `<Picture>` components verified; Sharp image service default; batch download via curl loop with Unsplash CDN URLs |
| FOUND-02 | Design tokens from `mock-26/tokens.css` translated to Tailwind 4 config (palette navy/black/cream + brand blue `#2D6BE4`, spacing, radii, shadows) | Tailwind 4 @theme block verified; token values extracted from actual `mock-26/tokens.css`; CSS variable → utility class mapping confirmed |
| FOUND-03 | Space Grotesk + DM Sans fonts loaded via `@fontsource` packages (local, not Google Fonts CDN) with `font-display: swap` | `@fontsource-variable/space-grotesk` + `@fontsource-variable/dm-sans` confirmed; default font-display is swap; import syntax documented |
| FOUND-04 | Base styles + reset migrated from `mock-26/site.css` into Tailwind utilities + `global.css` | `mock-26/site.css` reviewed; body defaults, link styles, smooth scroll, `.wrap` layout container identified; Tailwind 4 `@layer base` pattern confirmed |
| I18N-01 | Astro native i18n routing configured in `astro.config.mjs` — default locale `en`, secondary `pt`, `es`, routes `/`, `/pt/`, `/es/` | Astro 6 `i18n` config verified via official docs; `prefixDefaultLocale: false` + fallback confirmed; file structure for `src/pages/pt/` + `src/pages/es/` documented |
| I18N-02 | Translation file structure created — `src/i18n/{en,pt,es}.json` with all UI strings (nav, CTAs, footer, common labels) | `getLangFromUrl` + `useTranslations` pattern extracted from official Astro recipes; flat JSON key-value structure confirmed; TypeScript typing approach documented |
</phase_requirements>

---

## Summary

Phase 1 establishes the substrate that every component (Phase 2) and page (Phase 3) will build upon. Research confirms all six requirements are achievable with the existing Astro 6 + Tailwind 4 scaffold — no new framework decisions needed.

The most critical implementation insight: the existing `src/styles/global.css` already uses Tailwind 4's `@theme` block pattern, but its token names (`--color-bg-base`, `--font-body: "Inter"`, `--font-mono`) are from the v4 dark tech theme, NOT from mock-26. The entire `@theme` block must be replaced with mock-26 token names and values. This is a full-replace, not a merge.

The second critical insight: the `@fontsource-variable/*` packages (variable fonts) are strongly preferred over individual weight imports (`@fontsource/space-grotesk/400.css`). Variable fonts cover weights 300–700 in a single file, which is both more performant and simpler to maintain. The Fontsource docs confirm default `font-display: swap` behavior.

**Primary recommendation:** Replace `@theme` block wholesale with mock-26 tokens → install `@fontsource-variable/space-grotesk` + `@fontsource-variable/dm-sans` → add `i18n` config block to `astro.config.mjs` → run curl download script for 26 Unsplash photos → wire `<Image>` + create `INVENTORY.md`.

---

## Standard Stack

### Core (all already installed except @fontsource packages)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 6.1.7 | SSG framework, i18n routing, Image component | Already in project; native i18n is Astro 5+ feature |
| tailwindcss | 4.2.2 | Utility CSS via @theme design tokens | Already installed, already wired via Vite plugin |
| @tailwindcss/vite | 4.2.2 | Tailwind 4 Vite integration | Already in astro.config.mjs |
| @fontsource-variable/space-grotesk | latest | Variable font for Space Grotesk (display) | Single file for all weights, font-display swap default |
| @fontsource-variable/dm-sans | latest | Variable font for DM Sans (body) | Single file for all weights, font-display swap default |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| sharp | bundled with Astro | Image processing at build time | Automatic — Astro's default image service |
| astro:assets | built-in | `<Image>` + `<Picture>` components | For every `<img>` tag in Phase 2/3 |
| astro:i18n | built-in | `getRelativeLocaleUrl()` helper | For locale-aware links in components |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@fontsource-variable/space-grotesk` | `@fontsource/space-grotesk/400.css` (static per-weight) | Variable font: 1 HTTP request vs 4; weight range vs fixed; slightly larger initial file. Variable preferred. |
| Astro native i18n | astro-i18next | astro-i18next adds React/i18next dependency overhead. Native i18n is zero-dep and sufficient for Phase 1 stubs. |
| Unsplash direct CDN (existing approach) | Local `src/assets/photos/` | CDN: zero build cost, fragile (network dep, 404 risk, CDN terms). Local: build-time optimization, zero runtime requests. Local wins for prod. |

**Installation:**
```bash
npm install @fontsource-variable/space-grotesk @fontsource-variable/dm-sans
```

---

## Architecture Patterns

### Recommended Project Structure (Phase 1 changes only)

```
src/
├── assets/
│   └── photos/               # NEW — 26 downloaded JPEG originals
│       ├── hero-sp-marginal.jpg
│       ├── hero-santiago.jpg
│       ├── hero-cdmx.jpg
│       └── ... (23 more)
│       └── INVENTORY.md      # NEW — mapping table
├── i18n/                     # NEW directory
│   ├── en.json               # Translation strings (fully populated)
│   ├── pt.json               # Stub — keys present, values = EN strings
│   ├── es.json               # Stub — keys present, values = EN strings
│   └── utils.ts              # getLangFromUrl + useTranslations helpers
├── styles/
│   └── global.css            # REPLACE @theme block; ADD fontsource imports
├── layouts/
│   └── Base.astro            # REMOVE Google Fonts <link> tags
astro.config.mjs              # ADD i18n block
```

### Pattern 1: Tailwind 4 @theme Token Replacement

**What:** The existing `@theme` block in `global.css` uses v4 dark-tech token names (`--color-bg-base`, `--color-ink`, `--font-body: "Inter"`). These must be replaced with mock-26 token names for consistency between design system and utility classes.

**When to use:** Always. The @theme block is the single source of truth for design tokens in Tailwind 4.

**Example — new @theme block based on mock-26/tokens.css:**
```css
/* Source: mock-26/tokens.css (verified 2026-05-16) */
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import "@fontsource-variable/space-grotesk/wght.css";
@import "@fontsource-variable/dm-sans/wght.css";

@theme {
  /* Fonts — Space Grotesk (display) + DM Sans (body) */
  --font-display: "Space Grotesk Variable", "Inter", system-ui, sans-serif;
  --font-body:    "DM Sans Variable", system-ui, -apple-system, sans-serif;
  /* NO --font-mono — mock-26 v0.8 removes typewriter labels */

  /* Navy stack (from mock-26/tokens.css) */
  --color-navy-0: #050E1D;    /* deepest — page bg */
  --color-navy-1: #0A1E38;    /* card surfaces */
  --color-navy-2: #122849;    /* surface raised */
  --color-navy-3: #1B3A5C;    /* heading navy */
  --color-navy-4: #234A75;    /* hover */
  --color-black:  #000000;    /* pure black break */

  /* Brand blue */
  --color-blue:        #2D6BE4;
  --color-blue-bright: #4A8FE7;
  --color-blue-deep:   #1D4289;

  /* Cream text + backgrounds */
  --color-cream-0:  #F5F1E8;   /* primary text on dark */
  --color-cream-1:  #C8D8F0;   /* secondary text */
  --color-cream-2:  #8A94A8;
  --color-cream-3:  #5A6478;
  --color-cream-bg:   #F5F1E8; /* warm cream section bg */
  --color-cream-bg-2: #EDE6D5; /* tonal card bg */
  --color-cream-bg-3: #FAF6EC; /* near-white warm */

  /* Hairlines */
  --color-line-0: #14213D;
  --color-line-1: #1F2E54;

  /* Status */
  --color-status-live: #4A8FE7;
  --color-status-prod: #22C55E;
  --color-status-warn: #F5A623;

  /* Max-width + gutter */
  --max-w: 1320px;
  --gutter: clamp(20px, 4vw, 56px);

  /* Transitions */
  --t-fast: .18s cubic-bezier(.4,0,.2,1);
  --t-base: .32s cubic-bezier(.4,0,.2,1);
  --t-slow: .6s cubic-bezier(.4,0,.2,1);
}
```

**Key difference from current global.css:** token names change (e.g., `--color-navy-0` not `--color-bg-base`). Tailwind utilities auto-generate from these: `bg-navy-0`, `text-cream-0`, `text-blue`, `border-line-0`, `font-display`, `font-body`.

### Pattern 2: Astro Native i18n Configuration

**What:** Astro 6 has built-in i18n routing. Adding the `i18n` key to `astro.config.mjs` enables locale-aware routing with no additional packages.

**When to use:** Once, during Phase 1. All subsequent pages automatically route correctly.

```js
// Source: https://docs.astro.build/en/guides/internationalization/
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'es'],
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'rewrite'   // show EN content at /pt/page without redirect
    },
    fallback: {
      pt: 'en',
      es: 'en'
    }
  }
});
```

**URL outcomes:**
- `src/pages/index.astro` → `/`
- `src/pages/about.astro` → `/about`
- `src/pages/pt/index.astro` → `/pt/`
- `src/pages/pt/about.astro` → `/pt/about`
- `src/pages/es/index.astro` → `/es/`

**IMPORTANT:** Phase 1 only creates `src/pages/pt/` and `src/pages/es/` as empty stub directories with placeholder index files. Real page content ports in Phase 3.

### Pattern 3: Translation Helper (src/i18n/utils.ts)

**What:** Official Astro recipe pattern — two functions that provide type-safe translation lookup.

```typescript
// Source: https://docs.astro.build/en/recipes/i18n/
// src/i18n/utils.ts
import en from './en.json';
import pt from './pt.json';
import es from './es.json';

export const ui = { en, pt, es } as const;
export const defaultLang = 'en' as const;
export type Lang = keyof typeof ui;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui['en']): string {
    return (ui[lang] as Record<string, string>)[key] ?? ui[defaultLang][key];
  };
}
```

**Usage in .astro page:**
```astro
---
import { getLangFromUrl, useTranslations } from '../i18n/utils';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<nav>{t('nav.home')}</nav>
```

**Translation JSON structure (flat, namespaced):**
```json
// src/i18n/en.json
{
  "nav.home": "Home",
  "nav.advisory": "Advisory",
  "nav.development": "Development",
  "nav.intelligence": "Intelligence",
  "nav.platforms": "Platforms",
  "nav.team": "Team",
  "nav.contact": "Contact",
  "cta.talk-to-us": "Talk to us",
  "cta.learn-more": "Learn more",
  "footer.tagline": "The LatAm DC intelligence firm.",
  "footer.copyright": "© 2025 Cloud Minds Partners. All rights reserved."
}
```

**PT/ES stubs (Phase 1 — same values as EN, to be translated in Phase 3):**
```json
// src/i18n/pt.json — Phase 1 stub
{
  "nav.home": "Home",
  "nav.advisory": "Advisory",
  ...
}
```

### Pattern 4: Local Image Import + Astro `<Image>`

**What:** Images in `src/assets/` are imported as ES modules. Astro's Sharp image service processes them at build time to WebP/AVIF with responsive srcset.

```astro
---
// Source: https://docs.astro.build/en/guides/images/
import { Image, Picture } from 'astro:assets';
import heroSp from '../assets/photos/hero-sp-marginal.jpg';
---

<!-- For single images needing WebP output -->
<Image
  src={heroSp}
  alt="São Paulo — Marginal Pinheiros e Ponte Octávio Frias"
  widths={[640, 1280, 2400]}
  sizes="100vw"
  format="webp"
  quality={80}
  loading="eager"
/>

<!-- For above-the-fold heroes: use Picture for AVIF + WebP + JPEG fallback -->
<Picture
  src={heroSp}
  formats={['avif', 'webp']}
  widths={[640, 1280, 2400]}
  sizes="100vw"
  alt="São Paulo — Marginal Pinheiros e Ponte Octávio Frias"
  loading="eager"
/>

<!-- For card images (below fold): lazy load -->
<Image
  src={cardGridIntel}
  alt="High-voltage transmission towers"
  widths={[400, 800]}
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
/>
```

**Build note:** Astro caches processed images in `node_modules/.astro/`. First build with 26 images will take longer (~30-60s extra). Subsequent builds use cache.

### Pattern 5: Unsplash Batch Download Script

**What:** Curl loop downloading 26 Unsplash photos by ID at maximum resolution.

```bash
#!/usr/bin/env bash
# Source: Unsplash CDN URL pattern from mock-26/IMAGE-SOURCES.md
# Usage: bash download-photos.sh
# Run from cmp-website/ — outputs to src/assets/photos/

set -euo pipefail
OUT="src/assets/photos"
mkdir -p "$OUT"

download() {
  local id="$1" filename="$2" width="${3:-3000}"
  local url="https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=90"
  if [ ! -f "$OUT/$filename" ]; then
    echo "Downloading: $filename"
    curl -fsSL "$url" -o "$OUT/$filename"
  else
    echo "Skip (exists): $filename"
  fi
}

# Home hero (heroes: 2400px min)
download "1645918899630-85e2f3132a84" "hero-sp-marginal.jpg"       2400
download "1689850543263-01a52ccc6943" "hero-santiago.jpg"           2400
download "1674681512510-e06db64f53fb" "hero-cdmx.jpg"              2400

# Page heroes
download "1473341304170-971dccb5ac1e" "hero-advisory.jpg"          2400
download "1496564203457-11bb12075d90" "hero-development.jpg"       2400
download "1605379399843-5870eea9b74e" "hero-intelligence.jpg"      2400
download "1573164713988-8665fc963095" "hero-platforms.jpg"         2400
download "1620996148584-c3c8cf5a0788" "hero-team.jpg"              2400

# Home capability cards (1200px sufficient)
download "1669003153363-6d7ba8e20c7e" "card-home-site-selection.jpg" 1200
download "1554735231-2250c114a31d"    "card-home-grid-intel.jpg"     1200
download "1691643158804-d3f02eb456a3" "card-home-dc-financial.jpg"   1200
download "1683322499436-f4383dd59f5a" "card-home-testfit-pro.jpg"    1200

# Home insight memo
download "1413882353314-73389f63b6fd" "memo-home-grid-headroom.jpg"  1200

# Advisory capability cards
download "1500382017468-9049fed747ef" "card-adv-site-selection.jpg"  1200
download "1690780473941-f6a55a5fc420" "card-adv-power-grid.jpg"      1200
download "1497436072909-60f360e1d4b1" "card-adv-water-climate.jpg"   1200
download "1497435334941-8c899ee9e8e9" "card-adv-regulatory.jpg"      1200
download "1745270917331-787c80129680" "card-adv-financial.jpg"        1200
download "1554168848-228452c09d60"    "card-adv-market-intel.jpg"    1200

# Development roles
download "1448630360428-65456885c650" "card-dev-codeveloper.jpg"     1200
download "1721244654392-9c912a6eb236" "card-dev-tech-advisor.jpg"    1200
download "1621264448270-9ef00e88a935" "card-dev-financial-partner.jpg" 1200

# Platforms product visuals
download "1715026323215-a2dbb71272f6" "card-platform-site-selection.jpg" 1200
download "1596072215997-cac821d05b9c" "card-platform-grid-intel.jpg"     1200
download "1591696205602-2f950c417cb9" "card-platform-dc-financial.jpg"   1200
download "1639066648921-82d4500abf1a" "card-platform-testfit-pro.jpg"    1200

# Intelligence featured memo
download "1591075246923-76a081d21e25" "memo-intelligence-grid.jpg"   1200

echo "Done. $(ls $OUT/*.jpg | wc -l) photos in $OUT/"
```

**Note on Unsplash licensing:** Per Unsplash License (2018+), commercial use requires no attribution. Attribution stored in INVENTORY.md is best practice but not legally required.

**Git storage consideration:** 26 photos × ~500KB avg ≈ 13MB. This is acceptable for a production site repo (under 50MB threshold). Do NOT gitignore `src/assets/photos/` — committing ensures reproducible builds without re-downloading.

### Anti-Patterns to Avoid

- **Using `@fontsource/space-grotesk/400.css` (static weight files) instead of `@fontsource-variable/space-grotesk/wght.css`:** Static imports require 4 separate CSS files for 4 weights. Variable font covers 300-700 in one file at comparable size.
- **Keeping Google Fonts `<link>` tags in Base.astro:** Even if `@fontsource` is imported in CSS, leftover `<link rel="preconnect" href="https://fonts.googleapis.com">` tags will still fire DNS requests and show in DevTools. Remove ALL three lines (lines 39-44 in current Base.astro).
- **Putting Unsplash photos in `public/photos/` instead of `src/assets/photos/`:** Files in `public/` bypass Astro's image optimization pipeline. Astro `<Image>` ONLY optimizes assets imported from `src/`.
- **Using `<img>` tags instead of `<Image>` from `astro:assets`:** Raw `<img>` skips WebP/AVIF conversion, responsive srcset, and lazy loading.
- **Using `i18n.routing.fallbackType: 'redirect'` (the default) for Phase 1:** Redirect behavior causes browser URL bar to change to EN URL when visiting `/pt/page` that doesn't exist, which creates a confusing UX. Use `'rewrite'` instead — content appears at the PT URL without redirect.
- **Merging new tokens into existing @theme block instead of replacing it:** The existing token names (`--color-bg-base`, `--color-ink`, etc.) will create conflicts and dual naming conventions. Clean replace is required.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image WebP/AVIF conversion | Custom Sharp pipeline, CI imagemagick step | `astro:assets` `<Image>` / `<Picture>` | Astro handles format conversion, srcset, lazy loading; cache built-in |
| Font subsetting / preloading | Custom font-face declarations | `@fontsource-variable/*` | NPM packages handle @font-face, font-display, variable font ranges correctly |
| Locale detection from URL | Custom regex on `Astro.url.pathname` | `getLangFromUrl()` helper in `src/i18n/utils.ts` (Astro recipe pattern) | Handles edge cases: no locale prefix, default locale, nested paths |
| Locale-aware link generation | String concatenation `/${lang}/${path}` | `getRelativeLocaleUrl(lang, path)` from `astro:i18n` | Handles `prefixDefaultLocale: false` edge case (EN has no prefix) |
| CSS reset / base styles | Full custom reset | Tailwind 4's `@layer base` + mock-26/site.css globals | Tailwind already provides box-sizing, margins; only need mock-26 body/link overrides |

**Key insight:** Astro's image pipeline is production-grade Sharp under the hood. Any custom image processing workflow will produce worse output (no automatic srcset, no build cache, no AVIF/WebP negotiation).

---

## Common Pitfalls

### Pitfall 1: Tailwind 4 Token Naming — Utility Class Mismatch

**What goes wrong:** Defining `--color-cmp-navy: #050E1D` in @theme generates `bg-cmp-navy`, `text-cmp-navy` utilities. But if mock-26 HTML uses `bg-navy-0`, the utility doesn't exist unless the token is named `--color-navy-0`. The token name structure determines the utility class name.

**Why it happens:** Tailwind 4 strips the `--color-` prefix and uses the rest as the class name suffix. `--color-navy-0` → `bg-navy-0`. `--color-cmp-navy-0` → `bg-cmp-navy-0`.

**How to avoid:** Name tokens to match expected utility usage. Research verified mock-26 HTML uses class names like `bg-navy-0`, `text-cream-0`, `bg-blue`. Set tokens as `--color-navy-0`, `--color-cream-0`, `--color-blue` accordingly (not prefixed with `cmp-`).

**Warning signs:** Tailwind utilities not applying, CSS variables present in DevTools but no utility class exists.

### Pitfall 2: Google Fonts DNS Prefetch Surviving Fontsource Migration

**What goes wrong:** Developer adds `@fontsource-variable/space-grotesk` to global.css but forgets to remove the three Google Fonts `<link>` tags in `Base.astro`. The fonts load locally but Google Fonts DNS requests still fire in the browser.

**Why it happens:** `<link rel="preconnect">` tags are independent of CSS imports — removing CSS `@import` does not remove HTML `<link>` tags.

**How to avoid:** After adding @fontsource imports, grep `Base.astro` for `googleapis` and `gstatic` — remove ALL matching lines. Verify in DevTools Network tab (filter by "fonts") that zero requests go to `fonts.googleapis.com` or `fonts.gstatic.com`.

**Warning signs:** DevTools Network tab shows `fonts.googleapis.com` requests; Lighthouse flags "Eliminate render-blocking resources."

### Pitfall 3: Astro i18n Routing — `getRelativeLocaleUrl` for Default Locale

**What goes wrong:** `getRelativeLocaleUrl('en', '/about')` returns `/about` when `prefixDefaultLocale: false`, but `getRelativeLocaleUrl('pt', '/about')` returns `/pt/about`. Writing manual `/${lang}/about` breaks English links (would generate `/en/about` which doesn't exist).

**Why it happens:** `prefixDefaultLocale: false` means EN routes have no prefix. Manual string concat doesn't account for this.

**How to avoid:** Always use `getRelativeLocaleUrl(lang, path)` from `astro:i18n` for internal links. Never build locale URLs by string concatenation.

**Warning signs:** EN language switcher links generate 404 (`/en/page` doesn't exist); only apparent when testing locale switcher in browser.

### Pitfall 4: Images in `public/` vs `src/assets/`

**What goes wrong:** Photos downloaded to `public/photos/` display correctly (`<img src="/photos/hero.jpg">`) but Astro `<Image>` cannot optimize them. Build produces unoptimized full-size JPEGs in production.

**Why it happens:** Astro's image pipeline only processes ESM-imported assets from `src/`. Files in `public/` are served as-is.

**How to avoid:** All 26 photos go into `src/assets/photos/`. Import them in `.astro` files: `import heroSp from '../assets/photos/hero-sp-marginal.jpg'`. Astro types these correctly.

**Warning signs:** `<Image src="/photos/hero.jpg">` — string src (not imported) skips optimization. TypeScript will not error; need visual inspection of build output.

### Pitfall 5: cmp-knowledge Sibling Repo Required at Build Time

**What goes wrong:** `src/content.config.ts` uses glob loader paths like `../cmp-knowledge/knowledge/memos/published/**/*.md`. If `cmp-knowledge` is not cloned as a sibling during local dev or CI, the build warns but does NOT fail — it produces empty content collections silently.

**Why it happens:** The CONCERNS.md notes this as a known issue: FIREBASE_TOKEN and CMP_KNOWLEDGE_READ_TOKEN absent → silent skips per existing deploy.yml.

**How to avoid (Phase 1 scope):** Phase 1 does not touch content.config.ts — this is noted as a blocker for Phase 2. Verify `../cmp-knowledge` exists before running `npm run build` locally. Document in INVENTORY.md.

**Warning signs:** Build succeeds with "0 memos loaded" in output. No error thrown.

### Pitfall 6: @fontsource-variable Font Family Name

**What goes wrong:** Installing `@fontsource-variable/space-grotesk` and setting `font-family: "Space Grotesk"` — this does NOT work. The variable font package registers the family as `"Space Grotesk Variable"`.

**Why it happens:** Fontsource variable packages use a distinct font family name to avoid conflict with static weight packages.

**How to avoid:** Set `--font-display: "Space Grotesk Variable", "Inter", system-ui, sans-serif` in @theme. If static and variable packages are both installed (they shouldn't be), the names still differ.

**Warning signs:** Font renders as system font fallback despite package being installed. Check @font-face rules in DevTools.

---

## Code Examples

Verified patterns from official sources and mock-26 design system:

### Complete global.css Structure (Phase 1 target)

```css
/* Source: Tailwind 4 docs + mock-26/tokens.css + fontsource.org */
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import "@fontsource-variable/space-grotesk/wght.css";
@import "@fontsource-variable/dm-sans/wght.css";

@theme {
  --font-display: "Space Grotesk Variable", "Inter", system-ui, sans-serif;
  --font-body:    "DM Sans Variable", system-ui, -apple-system, sans-serif;

  --color-black:  #000000;
  --color-navy-0: #050E1D;
  --color-navy-1: #0A1E38;
  --color-navy-2: #122849;
  --color-navy-3: #1B3A5C;
  --color-navy-4: #234A75;
  --color-blue:        #2D6BE4;
  --color-blue-bright: #4A8FE7;
  --color-blue-deep:   #1D4289;
  --color-cream-0:  #F5F1E8;
  --color-cream-1:  #C8D8F0;
  --color-cream-2:  #8A94A8;
  --color-cream-3:  #5A6478;
  --color-cream-bg:   #F5F1E8;
  --color-cream-bg-2: #EDE6D5;
  --color-cream-bg-3: #FAF6EC;
  --color-line-0: #14213D;
  --color-line-1: #1F2E54;
  --color-status-live: #4A8FE7;
  --color-status-prod: #22C55E;
  --color-status-warn: #F5A623;
  --max-w: 1320px;
  --gutter: clamp(20px, 4vw, 56px);
  --t-fast: .18s cubic-bezier(.4,0,.2,1);
  --t-base: .32s cubic-bezier(.4,0,.2,1);
  --t-slow: .6s cubic-bezier(.4,0,.2,1);
}

@layer base {
  /* Source: mock-26/site.css */
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  body {
    background: var(--color-navy-0);
    color: var(--color-cream-0);
    font-family: var(--font-body);
    font-feature-settings: "ss01";
    line-height: 1.55;
    overflow-x: hidden;
  }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }
  button { font: inherit; cursor: pointer; border: 0; background: transparent; color: inherit; }
  ::selection { background: var(--color-blue); color: var(--color-cream-0); }
}

/* Layout wrapper (from mock-26/site.css .wrap) */
.wrap {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Base.astro — Google Fonts Removal

Current lines to DELETE (39-44 in current file):
```astro
<!-- DELETE THESE THREE LINES from Base.astro -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

Also update `<html lang="en">` to be locale-aware (Phase 1 scope for the base layout):
```astro
---
// Base.astro — add locale-aware lang attribute
const { lang = 'en' } = Astro.props;
---
<html lang={lang}>
```

### INVENTORY.md Template

```markdown
# Photo Inventory — src/assets/photos/

| Filename | Mock-26 Role | Unsplash ID | Source URL | Alt Text | Dimensions |
|----------|-------------|-------------|------------|----------|------------|
| hero-sp-marginal.jpg | Home hero 1 (SP) | 1645918899630-85e2f3132a84 | https://unsplash.com/photos/1645918899630-85e2f3132a84 | São Paulo — Marginal Pinheiros e Ponte Octávio Frias | 2400×1600 |
| hero-santiago.jpg | Home hero 2 (Santiago) | 1689850543263-01a52ccc6943 | https://unsplash.com/photos/1689850543263-01a52ccc6943 | Santiago skyline com Cordillera de los Andes | 2400×1600 |
...
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` `theme.extend` | `@theme` block in CSS | Tailwind v4 (2025) | No JS config file needed; CSS is the config |
| `@astrojs/tailwind` integration | `@tailwindcss/vite` Vite plugin | Tailwind v4 + Astro 5+ | Faster HMR; already implemented in this project |
| Google Fonts CDN `<link>` | `@fontsource-variable/*` npm packages | Fontsource ecosystem (2022+) | Zero network requests; GDPR compliant; offline builds |
| `import '@fontsource/space-grotesk/400.css'` per weight | `import '@fontsource-variable/space-grotesk/wght.css'` | @fontsource-variable packages (2023+) | Single file for all weights; variable font axis |
| `getStaticPaths()` locale routing (manual) | Astro native `i18n` config | Astro 3.5+ (stable in 5+) | Built-in routing, no middleware required for static sites |
| `astro:assets` disabled by default | Enabled by default in Astro 3+ | Astro 3.0 (2023) | `<Image>` component available without integration flag |

**Deprecated/outdated:**
- `@astrojs/tailwind`: v3 pattern. This project correctly uses `@tailwindcss/vite` (v4 pattern).
- Per-weight static @fontsource imports: still functional but variable font is cleaner.
- `astro-i18next`: third-party package. Astro native i18n is now sufficient for this use case.

---

## Open Questions

1. **Exact mock-26 spacing/radii values for Tailwind tokens**
   - What we know: `mock-26/tokens.css` defines `--gutter: clamp(20px, 4vw, 56px)` and `--max-w: 1320px`. Card radii are 20-24px, photo top corners 19px (from CONTEXT.md).
   - What's unclear: Whether radii and shadow values should go into @theme (they could as `--radius-card: 22px`, `--shadow-card: ...`) or just be used as inline values. Tailwind 4 supports `--radius-*` in @theme to generate `rounded-card` etc.
   - Recommendation: Read `mock-26/site.css` (full file) before writing @theme to capture any remaining tokens. The planner should include a task to review the full file — research only read first 80 lines.

2. **`astro.config.mjs` — site URL for i18n**
   - What we know: Some Astro i18n features (hreflang generation, canonical URLs) require `site: "https://..."` in astro.config. The project's eventual domain is `cloudmindspartners.com` (deferred to D13).
   - What's unclear: Whether to set `site` now to the staging URL (`https://dcplatformcmp.web.app`) or leave unset for Phase 1.
   - Recommendation: Set `site: 'https://dcplatformcmp.web.app'` as placeholder for Phase 1. Phase 5 cutover task can swap to final domain.

3. **`src/pages/pt/` and `src/pages/es/` stub structure**
   - What we know: Phase 1 needs PT/ES directories for Astro i18n routing to recognize those locales. But real page content is Phase 3.
   - What's unclear: Whether Phase 1 should create minimal `index.astro` stubs (renders "Coming soon") or completely empty dirs.
   - Recommendation: Create `src/pages/pt/index.astro` and `src/pages/es/index.astro` with bare HTML that inherits Base.astro. Routing validates correctly; Phase 3 replaces them.

---

## Validation Architecture

> `workflow.nyquist_validation` is `true` in `.planning/config.json` — this section is required.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.x (not yet installed — Wave 0 gap) |
| Config file | `playwright.config.ts` — Wave 0 gap |
| Quick run command | `npx playwright test --grep "@smoke"` |
| Full suite command | `npx playwright test` |
| Alt (no Playwright) | Shell assertions on `dist/` build output (grep-based) |

**Note:** No test infrastructure exists in the project today (confirmed: no `playwright.config.ts`, no `*.spec.ts` files, no `@playwright/test` in package.json). All test infrastructure is a Wave 0 gap.

For Phase 1 specifically, **shell-based assertions on the Astro build output** (`dist/`) are the fastest path to validation and do not require Playwright browser launch. These are appropriate for validating CSS/font/token presence. Playwright is needed for network-level assertions (no googleapis requests).

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | `src/assets/photos/` contains 26 `.jpg` files | shell | `ls src/assets/photos/*.jpg \| wc -l \| grep -q "^26$"` | ❌ Wave 0 |
| FOUND-01 | Build output HTML contains `<source>` or `<img>` with `.webp` src (Astro Image processed) | shell | `grep -r "\.webp" dist/ --include="*.html" -l \| grep -q .` | ❌ Wave 0 |
| FOUND-01 | No Unsplash CDN URLs in built HTML | shell | `! grep -r "images.unsplash.com" dist/ --include="*.html" -q` | ❌ Wave 0 |
| FOUND-02 | `src/styles/global.css` contains `--color-navy-0: #050E1D` (mock-26 token) | shell | `grep -q "\-\-color-navy-0: #050E1D" src/styles/global.css` | ❌ Wave 0 |
| FOUND-02 | `src/styles/global.css` does NOT contain `--color-bg-base` (v4 dark theme token) | shell | `! grep -q "\-\-color-bg-base" src/styles/global.css` | ❌ Wave 0 |
| FOUND-02 | Build output CSS contains `--color-navy-0` | shell | `grep -r "\-\-color-navy-0" dist/ --include="*.css" -q` | ❌ Wave 0 |
| FOUND-03 | `@fontsource-variable/space-grotesk` installed | shell | `test -d node_modules/@fontsource-variable/space-grotesk` | ❌ Wave 0 |
| FOUND-03 | `@fontsource-variable/dm-sans` installed | shell | `test -d node_modules/@fontsource-variable/dm-sans` | ❌ Wave 0 |
| FOUND-03 | `global.css` imports fontsource-variable packages | shell | `grep -q "@fontsource-variable/space-grotesk" src/styles/global.css` | ❌ Wave 0 |
| FOUND-03 | NO `fonts.googleapis.com` in built HTML (Google Fonts removed) | shell + Playwright | `! grep -r "fonts.googleapis.com" dist/ --include="*.html" -q` | ❌ Wave 0 |
| FOUND-03 | NO network requests to googleapis at runtime | Playwright | `page.on('request', req => { requests.push(req.url()) }); expect(requests.filter(u => u.includes('googleapis'))).toHaveLength(0)` | ❌ Wave 0 |
| FOUND-04 | `global.css` `@layer base` contains `scroll-behavior: smooth` | shell | `grep -q "scroll-behavior: smooth" src/styles/global.css` | ❌ Wave 0 |
| FOUND-04 | `global.css` body background is `var(--color-navy-0)` | shell | `grep -q "background: var(--color-navy-0)" src/styles/global.css` | ❌ Wave 0 |
| I18N-01 | `astro.config.mjs` contains `i18n` block with `defaultLocale: 'en'` | shell | `grep -q "defaultLocale: 'en'" astro.config.mjs` | ❌ Wave 0 |
| I18N-01 | Build output contains `dist/pt/index.html` | shell | `test -f dist/pt/index.html` | ❌ Wave 0 |
| I18N-01 | Build output contains `dist/es/index.html` | shell | `test -f dist/es/index.html` | ❌ Wave 0 |
| I18N-01 | EN index at `dist/index.html` (no `/en/` prefix) | shell | `test -f dist/index.html && ! test -d dist/en/` | ❌ Wave 0 |
| I18N-02 | `src/i18n/en.json`, `pt.json`, `es.json` exist | shell | `test -f src/i18n/en.json && test -f src/i18n/pt.json && test -f src/i18n/es.json` | ❌ Wave 0 |
| I18N-02 | `src/i18n/utils.ts` exports `getLangFromUrl` and `useTranslations` | shell | `grep -q "getLangFromUrl" src/i18n/utils.ts && grep -q "useTranslations" src/i18n/utils.ts` | ❌ Wave 0 |
| I18N-02 | `en.json` contains required nav keys | shell | `node -e "const t=require('./src/i18n/en.json'); ['nav.home','nav.advisory','cta.talk-to-us'].forEach(k => { if(!t[k]) throw new Error('Missing: '+k) })"` | ❌ Wave 0 |

### Recommended Validation Runner Script

Create `scripts/validate-phase-1.sh` — runs all shell assertions, reports pass/fail per check, exits non-zero on first failure:

```bash
#!/usr/bin/env bash
# Phase 1 validation — run after `npm run build`
set -euo pipefail

pass() { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; exit 1; }
check() { "$@" && pass "$*" || fail "$*"; }

# FOUND-01
check test "$(ls src/assets/photos/*.jpg 2>/dev/null | wc -l)" -eq 26
check grep -qr "\.webp" dist/ --include="*.html"
check bash -c '! grep -qr "images.unsplash.com" dist/ --include="*.html"'

# FOUND-02
check grep -q "\-\-color-navy-0: #050E1D" src/styles/global.css
check bash -c '! grep -q "\-\-color-bg-base" src/styles/global.css'

# FOUND-03
check test -d node_modules/@fontsource-variable/space-grotesk
check test -d node_modules/@fontsource-variable/dm-sans
check grep -q "@fontsource-variable/space-grotesk" src/styles/global.css
check bash -c '! grep -qr "fonts.googleapis.com" dist/ --include="*.html"'

# FOUND-04
check grep -q "scroll-behavior: smooth" src/styles/global.css
check grep -q "background: var(--color-navy-0)" src/styles/global.css

# I18N-01
check grep -q "defaultLocale: 'en'" astro.config.mjs
check test -f dist/pt/index.html
check test -f dist/es/index.html
check test -f dist/index.html
check bash -c '! test -d dist/en'

# I18N-02
check test -f src/i18n/en.json
check test -f src/i18n/pt.json
check test -f src/i18n/es.json
check grep -q "getLangFromUrl" src/i18n/utils.ts
check grep -q "useTranslations" src/i18n/utils.ts

echo ""
echo "All Phase 1 checks passed."
```

### Sampling Rate

- **Per task commit:** Run relevant subset of `validate-phase-1.sh` checks for the task's requirement (e.g., after FOUND-03 task, run only the font checks).
- **Per wave merge:** `bash scripts/validate-phase-1.sh` (full shell suite, ~5 seconds).
- **Phase gate:** Full shell suite green + `npm run build` succeeds (zero TypeScript errors) before `/gsd:verify-work`.

### Wave 0 Gaps

- [ ] `scripts/validate-phase-1.sh` — Phase 1 shell validation script (created above; needs to be written to file)
- [ ] `playwright.config.ts` — For the one Playwright test (no googleapis network check). Minimal config targeting `http://localhost:4321`.
- [ ] `@playwright/test` install: `npm install -D @playwright/test && npx playwright install chromium` — only needed for the googleapis network test; all other checks are shell-based.
- [ ] `tests/phase-1-network.spec.ts` — Single test: load home page, assert no requests to `fonts.googleapis.com`.

*(All other validation is shell-based against `dist/` build output — no additional framework install required.)*

---

## Sources

### Primary (HIGH confidence)

- Astro Docs — Internationalization Routing Guide — verified config syntax, `prefixDefaultLocale`, `fallbackType: 'rewrite'`, file structure
- Astro Docs — Add i18n features (Recipes) — verified `getLangFromUrl` + `useTranslations` exact code
- Astro Docs — Images guide — verified `<Image>`, `<Picture>`, `getImage()`, Sharp default, build cache behavior
- Tailwind CSS v4.0 release blog — verified `@theme` block syntax, CSS variable → utility class mapping, Vite plugin usage
- `mock-26/tokens.css` — direct file read — verified ALL color token names and values
- `mock-26/IMAGES.md` — direct file read — verified all 26 Unsplash photo IDs and role assignments
- `mock-26/site.css` — direct file read (first 80 lines) — verified body defaults, nav styles, `.wrap` pattern
- `src/styles/global.css` — direct file read — verified current @theme token names (v4 dark theme) that need replacement
- `src/layouts/Base.astro` — direct file read — verified Google Fonts link tags at lines 39-44 that need removal
- Fontsource docs — verified `@fontsource-variable/space-grotesk/wght.css` import syntax; confirmed `font-display: swap` is default

### Secondary (MEDIUM confidence)

- Fontsource variable font naming: "Space Grotesk Variable" vs "Space Grotesk" — confirmed via npm package README pattern; not directly tested in this project
- `fallbackType: 'rewrite'` behavior in Astro 6 — confirmed in official docs; not verified via local build test

### Tertiary (LOW confidence)

- Git repository size impact of 26 × ~500KB photos (~13MB): estimated from typical Unsplash JPEG size at 2400px; actual sizes depend on download. Verify post-download.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified via official docs; package versions from actual package.json
- Architecture: HIGH — token values extracted from actual mock-26/tokens.css source file
- Pitfalls: HIGH — Tailwind 4 naming convention, Google Fonts removal, public/ vs src/ image path are well-documented patterns
- i18n configuration: HIGH — exact config syntax verified against Astro 6 official docs
- Validation architecture: HIGH — shell assertions on deterministic build output are reliable and fast

**Research date:** 2026-05-16
**Valid until:** 2026-08-16 (Astro 6 stable; Tailwind 4 stable; @fontsource-variable stable — all mature APIs)
