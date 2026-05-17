# Phase 2: Components — Research

**Researched:** 2026-05-17
**Domain:** Astro 6 component authoring, i18n helpers, Tailwind 4, content schema migration, env guards, dev-only routing
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Astro `.astro` components only — not React. Site is SSG. Mobile menu toggle uses minimal vanilla JS in `<script>` block.
- Replace 5 existing components (SiteHeader, SiteFooter, NewsletterSubscribe, WhatsAppFab, SocialLinks). Keep Logo.astro.
- Mock-26 is visual source of truth — read its HTML/CSS for structure.
- LangSwitcher: pure `<a href>` links computed via `getRelativeLocaleUrl(locale, currentPath)`, no JS.
- WhatsApp number from `PUBLIC_WHATSAPP_NUMBER` env var — fallback: empty string → component renders nothing.
- Newsletter: progressive enhancement (HTML form + JS fetch). States: idle / submitting / success / error.
- Tailwind 4 utilities inline + scoped `<style>` blocks for animations. No external per-component CSS files.
- Content schema CONT-01: add `language: z.enum(['en','pt','es']).default('en')` to memos, radar, regwatch schemas.
- Dev preview route: `src/pages/dev/components.astro` → `/dev/components`. Env-guarded in prod.

### Claude's Discretion
- Exact CSS class naming inside components (Tailwind utilities — match mock-26 visually but readable)
- Internal HTML structure within components (semantic HTML preferred — `<header>`, `<footer>`, `<nav>`, `<aside>`)
- Mobile breakpoint values for nav collapse (suggest 768px / Tailwind `md:` breakpoint)
- Animation timing for WhatsApp pulse (1.5-2s loop reasonable)
- Component file organization (`src/components/<Name>.astro` flat; no subdirectories needed for 9 components)

### Deferred Ideas (OUT OF SCOPE)
- Real OG image PNGs — Phase 4 (SEO-02). SEO component references `/og/default.png` placeholder.
- Page composition — Phase 3.
- Locale-prefixed memo slugs — Phase 3 (CONT-02..07).
- Newsletter form analytics/tracking — v2.
- Lighthouse a11y audit — Phase 4.
- WhatsApp business number cutover — operational, env var placeholder is enough.
- Component documentation — deferred indefinitely.
- Storybook / Histoire — out of scope.
- Removing v4 Crusoe pages — Phase 3.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| COMP-01 | SiteHeader — full-width, logo, primary nav, LangSwitcher, "Talk to us" CTA pill, mobile menu with keyboard Escape | Mock-26 `.nav` + `.nav-inner` + `.nav-lang` CSS extracted; existing SiteHeader pattern (click toggle, Escape key) documented below |
| COMP-02 | SiteFooter — 5-column grid (brand cell + 4 link cols), LinkedIn + WhatsApp icons in brand cell, copyright | Mock-26 `footer` + `.foot-links` grid CSS extracted; grid is `minmax(280px, 1.4fr) 1fr 1fr 1fr 1fr` |
| COMP-03 | Hero — flush-left content (max-width 820px, `clamp(32px,5vw,96px)` padding), static or rotating backgrounds | Mock-26 `.home-hero` (rotating, 3-slide 24s loop) + `.page-hero` (static, Ken Burns 18s) both documented |
| COMP-04 | CapabilityCard — rounded 20–24px, photo top with `border-radius: 19px 19px 0 0`, title + description + optional link | Mock-26 `.cap-card`, `.cap-card-photo`, `.cap-card-body` CSS extracted with exact values |
| COMP-05 | NewsletterSubscribe — inline embed, posts to existing dcinsights CF, in-place success/error, no redirect | CF endpoint confirmed: `https://us-central1-dcplatformcmp.cloudfunctions.net/subscribe`. Current script logic extracted. |
| COMP-06 | WhatsAppFab — bottom-right floating, number from env var, pulse animation | Current hardcoded number documented. Env var pattern `import.meta.env.PUBLIC_WHATSAPP_NUMBER` confirmed for Astro. |
| COMP-07 | LangSwitcher — EN · PT · ES, routes preserving current path | `getRelativeLocaleUrl(locale, path)` from `astro:i18n` — signature + example documented |
| COMP-08 | SocialLinks — LinkedIn + WhatsApp icons, header/footer variants | Mock-26 `.foot-social` CSS extracted; SVGs already in existing SocialLinks component |
| COMP-09 | SEO component — meta tags, OG, Twitter Card, canonical, JSON-LD slot, hreflang | `getAbsoluteLocaleUrl` from `astro:i18n` for canonical + alternates documented |
| CONT-01 | Zod schemas for memos/radar/regwatch gain `language` field | Default behavior with `.default('en')` means no migration needed for existing entries; existing radar entry works without frontmatter change |
</phase_requirements>

---

## Summary

Phase 2 builds 9 Astro components and refactors 3 content schemas. All components are `.astro` files with Tailwind 4 utilities + scoped `<style>` blocks. The visual source of truth is `../cmp-design-system/mock-26/` and all critical CSS values have been extracted from `site.css` and `index.html`.

The Cloud Function endpoint for the newsletter (`https://us-central1-dcplatformcmp.cloudfunctions.net/subscribe`) is confirmed from the existing `src/config/social.ts` and `NewsletterSubscribe.astro`. The existing WhatsApp number (`5511915788796` — Edgard's personal number) must be replaced with `import.meta.env.PUBLIC_WHATSAPP_NUMBER` (the CONCERNS.md explicitly flags this as a required migration). The i18n API `getRelativeLocaleUrl(locale, path)` from `astro:i18n` is the correct mechanism for LangSwitcher. The Astro config (`astro.config.mjs`) already has i18n routing in place with `prefixDefaultLocale: false`.

Content schema migration is non-breaking: adding `.default('en')` to a Zod field means existing markdown entries without the field parse fine — Astro applies the default on read. The one real radar entry in `cmp-knowledge` does not need frontmatter surgery.

**Primary recommendation:** Extract mock-26 component HTML/CSS values verbatim into Astro components; use Tailwind 4 utilities for layout and scoped `<style>` for animations (pulse, Ken Burns, slideshow); wire `astro:i18n` helpers at every URL construction point; keep the CF endpoint URL from `social.ts` as the single source of truth.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 6.1.7 | SSG framework, component system, i18n routing | Already scaffolded; Phase 1 complete |
| Tailwind CSS | 4.2.2 | Utility-first styling with `@theme` tokens | Phase 1 tokens (`--color-navy-0`, `--color-blue`, etc.) already live in `global.css` |
| `astro:i18n` | built-in | `getRelativeLocaleUrl`, `getAbsoluteLocaleUrl`, `Astro.currentLocale` | Native Astro 6 API; no extra package |
| Zod | bundled via `astro:content` | Content schema validation | Already used in `src/content.config.ts` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@astrojs/react` | 5.0.4 | React integration (installed, unused in Phase 2) | NOT used in Phase 2; no `client:*` directives |
| `astro:content` `defineCollection` | built-in | Content collection schema definitions | CONT-01 schema refactor |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `astro:i18n` `getRelativeLocaleUrl` | Custom path manipulation in `i18n/utils.ts` | Custom approach is what Phase 1 scaffolded (`getLangFromUrl`); the native `astro:i18n` module is cleaner and type-safe; both can coexist (utils.ts provides `t()` translation helper, `astro:i18n` provides URL helpers) |
| Scoped `<style>` for animations | Tailwind plugin or external CSS | `@tailwindcss/vite` doesn't support arbitrary keyframe animations inline; scoped `<style>` is the correct Astro pattern for custom keyframes |

**Installation:** No new packages required. All dependencies are Phase 1 artifacts.

---

## Architecture Patterns

### Recommended Component File Organization
```
src/
├── components/
│   ├── SiteHeader.astro    # REPLACE existing
│   ├── SiteFooter.astro    # REPLACE existing
│   ├── Hero.astro          # NEW
│   ├── CapabilityCard.astro # NEW
│   ├── NewsletterSubscribe.astro # REPLACE existing
│   ├── WhatsAppFab.astro   # REPLACE existing
│   ├── LangSwitcher.astro  # NEW
│   ├── SocialLinks.astro   # REPLACE existing
│   ├── SEO.astro           # NEW
│   └── Logo.astro          # KEEP (verify SVG path only)
├── pages/
│   └── dev/
│       └── components.astro  # NEW (env-guarded)
└── content.config.ts         # MODIFY (add language field)
```

### Pattern 1: SiteHeader Structure (from mock-26)

**What:** Sticky nav with `backdrop-filter: blur(20px)`, logo+tagline brand cell, nav links with underline-slide hover, LangSwitcher + "Talk to us" CTA pill, mobile hamburger.

**HTML structure extracted from mock-26 `site.css` + `index.html`:**
```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';
import LangSwitcher from './LangSwitcher.astro';
import Logo from './Logo.astro';
const currentLocale = Astro.currentLocale ?? 'en';
const currentPath = /* strip locale prefix from Astro.url.pathname */
---
<header class="sticky top-0 z-50 border-b border-[var(--line-0)] bg-[rgba(5,14,29,0.78)] backdrop-blur-[20px] saturate-[1.6]">
  <div class="flex items-center justify-between h-[72px] w-full px-[clamp(28px,4vw,64px)]">
    <!-- Brand: logo + tagline separated by hairline -->
    <!-- Nav links: Space Grotesk 15px, gap-9, underline-slide ::after -->
    <!-- Right: LangSwitcher + CTA pill -->
    <!-- Mobile: hamburger (hidden md:hidden) -->
  </div>
  <!-- Mobile nav: hidden md:hidden, full-width dropdown -->
</header>
<script>
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('mobile-nav');
  toggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('hidden') === false;
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      nav?.classList.add('hidden');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
</script>
```

**Key mock-26 CSS values for SiteHeader:**
- Nav height: `72px`
- Horizontal padding: `clamp(28px, 4vw, 64px)`
- Background: `rgba(5, 14, 29, 0.78)` + `backdrop-filter: blur(20px) saturate(160%)`
- Border: `1px solid var(--line-0)` = `#14213D`
- Nav links: font-family `Space Grotesk`, `15px`, `color: var(--cream-1)`, `gap: 36px`
- Active link underline: `::after` pseudo, `height: 1px`, `background: var(--blue-bright)`, `transition: right`
- CTA pill (`.nav-cta`): `border-radius: 999px`, `background: var(--blue)`, `padding: 11px 20px`, `font-size: 14px font-weight: 600`
- Brand tag: `font-size: 13px`, `border-left: 1px solid var(--line-1)`, `padding-left: 14px`
- Mobile hide nav links at `max-width: 880px`

### Pattern 2: SiteFooter Structure (from mock-26)

**What:** Single unified layer with 5-column CSS grid, brand cell (logo + tagline + social icons), 4 link columns (Platforms, Intelligence, Company, Contact).

**Key mock-26 CSS values:**
```css
/* .foot-links */
display: grid;
grid-template-columns: minmax(280px, 1.4fr) 1fr 1fr 1fr 1fr;
gap: clamp(40px, 4vw, 80px);
padding: 0 clamp(32px, 5vw, 96px) 64px;
```
- Column headings: Space Grotesk, `14px`, `font-weight: 600`, `letter-spacing: -0.005em`, `color: var(--cream-0)`
- Column links: DM Sans, `14px`, `color: var(--cream-1)`, hover → `var(--blue-bright)`
- Footer top padding: `80px`, bottom: `32px`
- Copyright row (`.foot-bottom`): `font-size: 13px`, `color: var(--cream-2)`, `justify-content: space-between`, padded top `24px`, `border-top: 1px solid var(--line-0)`
- Social icons (`.foot-social a`): `width: 36px height: 36px`, `border: 1px solid var(--line-1)`, `border-radius: 999px`, hover → `border-color: var(--blue-bright)`, `background: rgba(45,107,228,0.10)`, `transform: translateY(-2px)`
- Social SVGs: `width: 16px height: 16px`, `fill: currentColor`

**The 4 link column content (from mock-26 `index.html`):**
- Platforms: Site Selection, Grid Intelligence, Financial Model, Test Fit Pro
- Intelligence: Technical Memos, Innovation Radar, Regulatory Watch, Weekly Pulse
- Company: Advisory, Development, Team
- Contact: info@cloudmindspartners.com, São Paulo · BR, Santiago · CL, Mexico City · MX

### Pattern 3: Hero Component — Two Modes

**Mode A: Home rotating hero (3-city LatAm slideshow)**
```css
/* Structural values from mock-26 index.html */
min-height: calc(100vh - 72px);
padding: 80px 0;
/* Content: max-width: 820px, margin-left: 0 */
/* Padding: clamp(32px, 5vw, 96px) both sides */
/* h1: clamp(36px, 4.6vw, 60px), line-height: 1.08, font-weight: 600 */
/* p: 17px, line-height: 1.6, max-width: 540px, color: var(--cream-1) */

/* Slideshow animation */
@keyframes slideShow {
  0%   { opacity: 0; transform: scale(1.0); }
  4%   { opacity: 1; }
  29%  { opacity: 1; }
  34%  { opacity: 0; transform: scale(1.08); }
  100% { opacity: 0; transform: scale(1.08); }
}
/* 3 slides, 24s total, delays: 0s, 8s, 16s */

/* Overlay (2 gradients + radial glow) */
background:
  radial-gradient(ellipse 50% 40% at 0% 70%, rgba(74, 143, 231, 0.32), transparent 60%),
  linear-gradient(180deg, rgba(5,14,29,0.05) 0%, rgba(5,14,29,0.22) 50%, rgba(5,14,29,0.78) 100%),
  linear-gradient(90deg, rgba(5,14,29,0.52) 0%, rgba(5,14,29,0.10) 55%, rgba(5,14,29,0.0) 100%);

/* Grid texture (z-index -2) */
background-image:
  linear-gradient(rgba(74,143,231,0.04) 1px, transparent 1px),
  linear-gradient(90deg, rgba(74,143,231,0.04) 1px, transparent 1px);
background-size: 88px 88px;
mask-image: linear-gradient(180deg, transparent, black 25%, black 70%, transparent);

/* Progress indicators: 3 tracks, width: 56px, height: 1px */
/* Fill animation: scaleX 0→1 over 8s linear, delays: -16s, 0s, -8s */
```

**Mode B: Page hero (static bg, Ken Burns)**
```css
/* .page-hero */
min-height: 66vh;
padding: 96px 0 80px;
/* Content: max-width: 620px (smaller than home!) */
/* h1: clamp(34px, 4.2vw, 56px) */

/* Ken Burns animation */
@keyframes heroKen {
  0%   { transform: scale(1.0) translate(0,0); }
  100% { transform: scale(1.09) translate(-1.4%,-1.2%); }
}
/* animation: heroKen 18s ease-in-out infinite alternate */
/* filter: saturate(1.22) contrast(1.06) brightness(1.04) */

/* Overlay slightly different from home */
background:
  radial-gradient(ellipse 55% 45% at 0% 70%, rgba(74, 143, 231, 0.24), transparent 60%),
  linear-gradient(180deg, rgba(5,14,29,0.10) 0%, rgba(5,14,29,0.25) 55%, rgba(5,14,29,0.82) 100%),
  linear-gradient(90deg, rgba(5,14,29,0.55) 0%, rgba(5,14,29,0.12) 55%, rgba(5,14,29,0.02) 100%);

/* Page eyebrow (.page-eyebrow) */
/* Optional `.live` modifier adds pulsing blue dot ::before */
@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(74, 143, 231, 0.65); }
  70%  { box-shadow: 0 0 0 12px rgba(74, 143, 231, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 143, 231, 0); }
}
```

**Hero Astro props interface:**
```typescript
interface Props {
  variant: 'home' | 'page';
  // home variant
  slides?: Array<{ src: ImageMetadata; alt: string }>;
  // page variant
  image?: ImageMetadata | string;  // static bg
  eyebrow?: string;
  live?: boolean;           // shows pulsing dot on eyebrow
  heading: string;
  subheading?: string;
  actions?: Array<{ label: string; href: string; variant: 'primary' | 'outline' }>;
}
```

### Pattern 4: CapabilityCard (from mock-26 `site.css`)

**Exact CSS values:**
```css
.cap-card {
  background: var(--navy-1);       /* #0A1E38 */
  border: 1px solid var(--line-1); /* #1F2E54 */
  border-radius: 20px;
  min-height: 380px;
  overflow: hidden;
}
.cap-card-photo {
  width: 100%; height: 180px;
  border-radius: 19px 19px 0 0;    /* CRITICAL: top corners only */
  filter: saturate(1.18) contrast(1.05);
  /* ::after overlay: linear-gradient(180deg, rgba(5,14,29,0.05) 0%, rgba(10,30,56,0.45) 100%) */
}
.cap-card-body {
  padding: 28px 28px 32px;
  align-items: center; justify-content: center; /* centered text layout */
}
.cap-title { font-size: 26px; letter-spacing: -0.018em; font-weight: 600; }
.cap-desc  { font-size: 16px; line-height: 1.55; max-width: 36ch; }
.cap-num   { font-size: 13px; font-weight: 600; letter-spacing: 0.04em; color: var(--blue-bright); }
/* On-cream variant: transparent bg, navy text */
.on-cream .cap-card { background: transparent; border: 1px solid rgba(5,14,29,0.12); }
.on-cream .cap-title { color: var(--navy-0); }
.on-cream .cap-desc  { color: #4D5F7A; }
```

**CapabilityCard Astro props interface:**
```typescript
interface Props {
  num: string;            // e.g. "01 — Site"
  title: string;
  description: string;
  photo: ImageMetadata;   // from src/assets/photos/
  href?: string;          // optional link (whole card becomes <a>)
  onCream?: boolean;      // switches to light-bg variant
}
```

### Pattern 5: LangSwitcher (astro:i18n)

**Confirmed API (Astro 6, HIGH confidence — official docs):**
```typescript
// src: https://docs.astro.build/en/reference/modules/astro-i18n/
import { getRelativeLocaleUrl } from 'astro:i18n';

// getRelativeLocaleUrl(locale, path?, options?) => string
// With prefixDefaultLocale: false (already configured in astro.config.mjs):
getRelativeLocaleUrl('en', 'team')  // => /team
getRelativeLocaleUrl('pt', 'team')  // => /pt/team
getRelativeLocaleUrl('es', 'team')  // => /es/team
```

**LangSwitcher implementation pattern:**
```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';
const currentLocale = Astro.currentLocale ?? 'en';
// Strip locale prefix to get bare path
const rawPath = Astro.url.pathname
  .replace(/^\/(pt|es)\//, '/')   // strip /pt/ or /es/ prefix
  .replace(/^\/(pt|es)$/, '/');   // handle /pt or /es exactly
const locales = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
  { code: 'es', label: 'ES' },
];
---
<div class="nav-lang">
  {locales.map((loc, i) => (
    <>
      <a
        href={getRelativeLocaleUrl(loc.code, rawPath.replace(/^\//, ''))}
        class={currentLocale === loc.code ? 'active' : ''}
        aria-current={currentLocale === loc.code ? 'page' : undefined}
      >{loc.label}</a>
      {i < locales.length - 1 && <span class="sep" aria-hidden="true">·</span>}
    </>
  ))}
</div>
```

**Mock-26 CSS values for LangSwitcher:**
```css
.nav-lang {
  display: inline-flex; align-items: center;
  margin-right: 24px;
  font-family: var(--font-display);
  font-size: 13px; font-weight: 500;
  color: var(--cream-2);
}
.nav-lang a { padding: 6px 10px; border-radius: 6px; }
.nav-lang a:hover { color: var(--cream-0); }
.nav-lang a.active { color: var(--cream-0); font-weight: 600; }
.nav-lang a.active::after {
  /* underline bar: left: 10px; right: 10px; bottom: 1px; height: 1px; background: var(--blue-bright) */
}
.nav-lang span.sep { color: var(--line-1); font-size: 11px; }
/* Hidden below 880px (mobile — stays inline in desktop nav, hidden on mobile per mock-26) */
@media (max-width: 880px) { .nav-lang { display: none; } }
```

### Pattern 6: Newsletter CF Integration (confirmed)

**Confirmed endpoint from `src/config/social.ts`:**
```
https://us-central1-dcplatformcmp.cloudfunctions.net/subscribe
```

**Current script behavior (extracted from existing `NewsletterSubscribe.astro`):**
- POST `{ email }` JSON to endpoint
- Success: `r.ok && (data.status === 'subscribed' || data.status === 'already_subscribed')`
- Error: `data.error || "Something went wrong. Try again in a minute."`
- The new component MUST preserve this exact endpoint URL and response parsing logic

**Progressive enhancement pattern for Phase 2:**
```astro
<!-- HTML fallback: standard form POST to a thank-you page -->
<form
  id={uid}
  method="post"
  action="/newsletter?thanks=1"
  novalidate
>
  <input type="email" name="email" required />
  <button type="submit">{t('newsletter.submit')}</button>
</form>
<p id={uid+'-msg'} hidden></p>

<script is:inline define:vars={{ uid, endpoint }}>
  // JS enhancement hijacks submit, fetches CF endpoint
  // On success: replaces form HTML with success message
  // On error: shows inline error, re-enables button
</script>
```

**i18n keys needed (add to `src/i18n/{en,pt,es}.json`):**
- `newsletter.submit` → "Subscribe"
- `newsletter.success` → "You're in. Welcome to DC Insights."
- `newsletter.already` → "You're already on the list."
- `newsletter.error` → "Something went wrong. Try again in a minute."
- `newsletter.network` → "Couldn't reach the server. Try again shortly."
- `newsletter.placeholder` → "you@company.com"

### Pattern 7: WhatsAppFab Env Var Pattern

**Confirmed Astro env var access (HIGH confidence — Vite/Astro docs):**
```astro
---
// PUBLIC_* vars are exposed at build time in Astro (Vite convention)
const waNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '';
const enabled = waNumber.length >= 10;
const message = encodeURIComponent("Hi, I'd like to talk to Cloud Minds Partners about...");
const href = `https://wa.me/${waNumber}?text=${message}`;
---
{enabled && (
  <a href={href} class="fixed bottom-6 right-6 z-50 ..." aria-label="Chat on WhatsApp">
    <!-- existing WhatsApp SVG icon (24×24) -->
  </a>
)}
```

**Existing hardcoded number** (from `src/config/social.ts` line 9): `5511915788796` — Edgard's personal number. The Phase 2 task is to remove this hardcoded value and source it from the env var.

**Pulse animation (WhatsApp ring effect) — scoped `<style>` block:**
```css
@keyframes wa-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.55); }
  70%  { box-shadow: 0 0 0 14px rgba(37, 211, 102, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
}
.wa-fab { animation: wa-pulse 2s ease-out infinite; }
```

**The current component does NOT have a pulse** — it only has hover scale + shadow transitions. The new component should add the ring pulse per COMP-06 requirement.

### Pattern 8: SEO Component

**Props interface for `SEO.astro`:**
```typescript
interface Props {
  title: string;
  description: string;
  image?: string;         // defaults to '/og/default.png' (Phase 4 placeholder)
  canonical?: string;     // auto-computed from Astro.url if absent
  lang?: string;          // defaults to Astro.currentLocale
  type?: 'website' | 'article';
  noindex?: boolean;
}
```

**hreflang alternates using `getAbsoluteLocaleUrl`:**
```astro
---
import { getAbsoluteLocaleUrl } from 'astro:i18n';
const rawPath = /* strip locale prefix */ '';
const hreflangs = [
  { locale: 'en',    hreflang: 'en',    href: getAbsoluteLocaleUrl('en', rawPath) },
  { locale: 'pt',    hreflang: 'pt-BR', href: getAbsoluteLocaleUrl('pt', rawPath) },
  { locale: 'es',    hreflang: 'es',    href: getAbsoluteLocaleUrl('es', rawPath) },
  { locale: 'x-default', hreflang: 'x-default', href: getAbsoluteLocaleUrl('en', rawPath) },
];
---
{hreflangs.map(h => (
  <link rel="alternate" hreflang={h.hreflang} href={h.href} />
))}
```

**Note:** `site: 'https://dcplatformcmp.web.app'` is already set in `astro.config.mjs`, so `getAbsoluteLocaleUrl` works correctly. The JSON-LD slot pattern:
```astro
<slot name="json-ld">
  <!-- Default: Organization schema -->
  <script type="application/ld+json" set:html={JSON.stringify(orgSchema)} />
</slot>
```

### Pattern 9: Dev Preview Page Guard

**Env guard — correct Astro 6 pattern:**
```astro
---
// src/pages/dev/components.astro
if (import.meta.env.PROD) {
  return Astro.redirect('/404', 404);
}
---
<!-- component previews below -->
```

**What the static build produces:** In `astro build` (PROD mode), the redirect fires server-side during the static rendering pass. Astro will emit the page but returning `Astro.redirect` causes the prerender to produce a 404-redirect response. The file IS generated in `dist/dev/components/index.html` but navigating to it in production returns 404 from the redirect — behavior depends on Firebase Hosting 404 config. The cleanest approach is: `if (import.meta.env.PROD) return Astro.redirect('/404', 404)` at the top of the frontmatter.

**Alternative (renders nothing in prod):** Wrap all JSX in `{import.meta.env.DEV && (...)}` — this produces an empty page in prod build, which Firebase serves as 200 OK with empty body. Not ideal.

**Recommended:** Use `return Astro.redirect('/404', 404)` — more semantically correct and the page simply doesn't work in prod.

### Anti-Patterns to Avoid
- **Using `Astro.url.pathname` directly for LangSwitcher links** — must strip locale prefix first before passing to `getRelativeLocaleUrl`
- **Hardcoding the CF endpoint URL in the component** — keep it in `src/config/social.ts` and import; components never hardcode external URLs
- **Putting WhatsApp number in `social.ts`** — Phase 2 moves it to `import.meta.env.PUBLIC_WHATSAPP_NUMBER`; the `social.ts` `whatsappNumber` field becomes the env-var fallback source or is deprecated
- **Using `<Image>` inside CapabilityCard with `background-image` CSS** — mock-26 uses CSS `background-image` for card photos (not `<img>`). For Astro Image optimization, the photo must be rendered as `<img>` with `object-fit: cover` inside a positioned container. Use `<Image>` component, not CSS background.
- **Calling `client:*` directives on any Phase 2 component** — zero hydration; all JS via `<script is:inline>` or `<script>` blocks

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale URL computation | Custom string manipulation | `getRelativeLocaleUrl(locale, path)` from `astro:i18n` | Handles `prefixDefaultLocale: false`, normalization, trailing slash, all edge cases |
| Absolute URL for hreflang | String concat with `site` base | `getAbsoluteLocaleUrl(locale, path)` from `astro:i18n` | Uses the `site` config value correctly across locales |
| Image optimization for card photos | `<img src="...">` with raw file paths | `<Image>` from `astro:assets` | Produces WebP/AVIF srcset, lazy loading — FOUND-01 already depends on this |
| WhatsApp URL construction | Inline string template | `whatsappLink()` from `src/config/social.ts` | Centralized, reusable, already exists |
| Newsletter endpoint URL | Inline string in component | `social.subscribeEndpoint` from `src/config/social.ts` | Single source of truth — prevent drift between components |

---

## Common Pitfalls

### Pitfall 1: LangSwitcher produces double locale prefix
**What goes wrong:** `getRelativeLocaleUrl('pt', Astro.url.pathname)` when pathname is already `/pt/team` → produces `/pt/pt/team`.
**Why it happens:** `Astro.url.pathname` contains the locale prefix for PT/ES pages. You must strip it before passing to `getRelativeLocaleUrl`.
**How to avoid:** Use `rawPath = Astro.url.pathname.replace(/^\/(pt|es)(\/|$)/, '/')` before calling the function.
**Warning signs:** LangSwitcher links produce 404s in PT/ES locales.

### Pitfall 2: CapabilityCard `<Image>` inside CSS background pattern
**What goes wrong:** Trying to use Astro `<Image>` with `background-image` CSS doesn't work — the Image component renders an `<img>` tag, not a CSS value.
**Why it happens:** Mock-26 used `background-image: url(...)` on `.cap-card-photo` div, but Astro's optimization pipeline requires `<img>` elements.
**How to avoid:** Render `<Image>` inside `.cap-card-photo` container with `class="absolute inset-0 w-full h-full object-cover"` and set `overflow: hidden` on the container.
**Warning signs:** Card photos appear broken or unoptimized.

### Pitfall 3: `import.meta.env.PUBLIC_WHATSAPP_NUMBER` is empty string, not undefined
**What goes wrong:** `if (!import.meta.env.PUBLIC_WHATSAPP_NUMBER)` catches empty string, but if `.env` file has `PUBLIC_WHATSAPP_NUMBER=` (key present, value empty), this evaluates correctly. If key is absent entirely from `.env`, the value is `undefined`. Check `waNumber.length >= 10`, not just truthiness.
**How to avoid:** Always use `(import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '').length >= 10` for the guard.

### Pitfall 4: Scoped `<style>` animation keyframes not applying to children
**What goes wrong:** In Astro's scoped CSS, `@keyframes` in a `<style>` block ARE scoped by default but keyframe names don't get the scoped hash. However, if the element the animation applies to is in a slot or child component, the style won't reach it.
**How to avoid:** Keep animation keyframes and the elements they animate in the same component file. The WhatsApp pulse, Ken Burns, and slideShow animations are all self-contained in their respective components.

### Pitfall 5: SEO component `<head>` injection requires slot in Base.astro
**What goes wrong:** If `SEO.astro` emits `<title>` and `<meta>` tags but Base.astro doesn't have a slot in `<head>`, the SEO output goes to `<body>`.
**Why it happens:** Astro layout `<slot />` placement determines where child content renders.
**How to avoid:** Base.astro needs `<slot name="head" />` inside `<head>`, and pages call `<SEO slot="head" ... />`. Verify existing `src/layouts/Base.astro` — it likely has a head slot already (standard Astro pattern).

### Pitfall 6: Content schema `.default()` doesn't backfill frontmatter
**What goes wrong:** Adding `.default('en')` to the Zod schema does NOT write `language: en` to existing `.md` files. It only applies at parse time.
**Why it matters:** If Phase 3 code does `entry.data.language === 'en'` to filter, it will correctly match entries that have no `language` key (Zod applies default). No migration needed. But if code checks `'language' in entry.data`, that check would be false for entries without the frontmatter key.
**How to avoid:** Always access `entry.data.language` (Zod guaranteed value), never check for key presence.

### Pitfall 7: SiteHeader `subnav` prop removal
**What goes wrong:** The existing `SiteHeader.astro` has a `subnav` prop for secondary nav bars (used on intelligence/* pages). The new header must either preserve this prop or Phase 3 will break when those pages try to use it.
**How to avoid:** Include `subnav?: Array<{ href: string; label: string; active?: boolean }>` prop in the replacement SiteHeader. The mock-26 doesn't show a subnav explicitly, but the existing implementation has it — preserve the prop and the secondary nav bar pattern.

---

## Code Examples

### Content Schema Language Field Addition (CONT-01)
```typescript
// src/content.config.ts — add to memos, radar, regwatch schemas
// Source: Astro content collections Zod schema docs

// Memos schema addition:
const memos = defineCollection({
  schema: z.object({
    // ... existing fields ...
    language: z.enum(['en', 'pt', 'es']).default('en'),  // ADD THIS
  }),
});

// Radar schema addition:
const radar = defineCollection({
  schema: z.object({
    // ... existing fields ...
    language: z.enum(['en', 'pt', 'es']).default('en'),  // ADD THIS
  }),
});

// Regwatch schema addition:
const regwatch = defineCollection({
  schema: z.object({
    // ... existing fields ...
    language: z.enum(['en', 'pt', 'es']).default('en'),  // ADD THIS
  }),
});
```

Existing entries without `language:` in frontmatter will parse as `language: 'en'`. No file migration required. Build continues to pass.

### Scroll Reveal (from mock-26 — replicate in dev preview page)
```javascript
// Source: mock-26/index.html inline script
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```
The `.reveal` + `.visible` pattern uses `opacity: 0 → 1` + `translateY(20px → 0)` with `transition: 0.6s`. This is a page-level concern (Phase 3), but CapabilityCards accept `class="reveal"` from parent pages.

---

## State of the Art

| Old Approach (Current Codebase) | Phase 2 Approach | Impact |
|---------------------------------|------------------|--------|
| `src/config/social.ts` `whatsappNumber` hardcoded | `import.meta.env.PUBLIC_WHATSAPP_NUMBER` with fallback | Number no longer in version control; can differ per env |
| `getLangFromUrl()` custom util for locale detection | `Astro.currentLocale` (built-in) | Simpler; no custom parsing needed in components |
| Custom `getLocalizedUrl()` (to be added to utils.ts per CONTEXT.md) | `getRelativeLocaleUrl()` from `astro:i18n` | Both can coexist; prefer `astro:i18n` for URL construction in components |
| No `<SEO>` component — meta tags inline in Base.astro | Dedicated `SEO.astro` component | Enables per-page overrides without touching layouts |
| Mobile menu: click-only, no keyboard support | Click + Escape key handler + `aria-expanded` | WCAG-compliant (COMP-01 requires keyboard Escape support) |

**Confirmed as still current:**
- `astro:i18n` `getRelativeLocaleUrl` / `getAbsoluteLocaleUrl` — confirmed in official docs, valid for Astro 6.x

---

## Open Questions

1. **`getRelativeLocaleUrl` path normalization with trailing slashes**
   - What we know: Function accepts `path` without leading slash (e.g., `'team'`, not `'/team'`)
   - What's unclear: If `rawPath` after stripping locale prefix starts with `/`, does passing `rawPath.replace(/^\//, '')` always work, including for `rawPath = '/'` (home page)?
   - Recommendation: For home page (`rawPath === '/'`), pass empty string to `getRelativeLocaleUrl` to get the locale root. Use `rawPath.replace(/^\//, '') || ''`.

2. **Base.astro head slot naming**
   - What we know: Standard Astro pattern uses `<slot name="head" />` in `<head>`
   - What's unclear: The current `src/layouts/Base.astro` may or may not have this named slot (file not fully read)
   - Recommendation: Wave 0 task should read Base.astro and add `<slot name="head" />` if absent, before SEO component can work.

3. **WhatsApp env var in GitHub Actions CI**
   - What we know: `PUBLIC_WHATSAPP_NUMBER` must be set in GH Actions secrets for prod build
   - What's unclear: If empty, the component renders nothing — acceptable per CONTEXT.md. But CI build will output a site with no WhatsApp FAB; confirm this is expected behavior.
   - Recommendation: Flag in PLAN.md task notes; add `PUBLIC_WHATSAPP_NUMBER` to GH Actions secrets documentation.

---

## Validation Architecture

> `nyquist_validation: true` in `.planning/config.json` — section required.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (already configured from Phase 1, chromium only) |
| Config file | `playwright.config.ts` (project root) |
| Quick run command | `npx playwright test --project=chromium` |
| Full suite command | `npx playwright test` |
| Dev server command | `npx astro dev` (needed before Playwright tests) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| COMP-01 | SiteHeader renders with logo, nav, LangSwitcher, CTA pill | visual/smoke | `npx playwright test tests/comp-01-header.spec.ts -x` | ❌ Wave 0 |
| COMP-01 | Mobile menu opens on hamburger click | interaction | `npx playwright test tests/comp-01-header.spec.ts -x` | ❌ Wave 0 |
| COMP-01 | Mobile menu closes on Escape key | interaction | `npx playwright test tests/comp-01-header.spec.ts -x` | ❌ Wave 0 |
| COMP-02 | SiteFooter renders 5 columns with correct links | smoke | `npx playwright test tests/comp-02-footer.spec.ts -x` | ❌ Wave 0 |
| COMP-03 | Hero renders in page mode with Ken Burns bg | visual | `npx playwright test tests/comp-03-hero.spec.ts -x` | ❌ Wave 0 |
| COMP-03 | Hero home variant: 3 slides present in DOM | smoke | `npx playwright test tests/comp-03-hero.spec.ts -x` | ❌ Wave 0 |
| COMP-04 | CapabilityCard renders photo + title + desc | smoke | `npx playwright test tests/comp-04-capcard.spec.ts -x` | ❌ Wave 0 |
| COMP-05 | Newsletter form submits, shows success state | interaction | `npx playwright test tests/comp-05-newsletter.spec.ts -x` | ❌ Wave 0 |
| COMP-05 | Newsletter CF endpoint URL matches locked contract | unit/grep | `grep -r "us-central1-dcplatformcmp" src/config/social.ts` | ❌ Wave 0 |
| COMP-06 | WhatsApp FAB renders when env var set | smoke | `npx playwright test tests/comp-06-wafab.spec.ts -x` | ❌ Wave 0 |
| COMP-06 | WhatsApp FAB absent when env var empty | smoke | `npx playwright test tests/comp-06-wafab.spec.ts -x` | ❌ Wave 0 |
| COMP-07 | LangSwitcher PT link on `/team` routes to `/pt/team` | navigation | `npx playwright test tests/comp-07-langswitcher.spec.ts -x` | ❌ Wave 0 |
| COMP-07 | LangSwitcher active locale has `aria-current="page"` | a11y | `npx playwright test tests/comp-07-langswitcher.spec.ts -x` | ❌ Wave 0 |
| COMP-08 | SocialLinks renders LinkedIn + WhatsApp icons | smoke | `npx playwright test tests/comp-08-sociallinks.spec.ts -x` | ❌ Wave 0 |
| COMP-09 | SEO component emits `<title>`, `<meta description>`, OG tags | smoke | `npx playwright test tests/comp-09-seo.spec.ts -x` | ❌ Wave 0 |
| COMP-09 | hreflang alternates present for en/pt/es | smoke | `npx playwright test tests/comp-09-seo.spec.ts -x` | ❌ Wave 0 |
| CONT-01 | Build succeeds with schema language field added | build | `npx astro build 2>&1 | grep -v error` (zero errors) | ❌ Wave 0 |
| CONT-01 | Invalid `language: fr` in fixture causes build error | build | Synthetic bad fixture test (manual or grep Zod output) | manual-only |

**Manual-only validations:**
- Visual fidelity of components vs mock-26 screenshots — eyeball at `/dev/components` in dev mode
- WhatsApp pulse animation timing — visual review
- Newsletter CF live POST (requires real network + real endpoint) — manual smoke test

### Sampling Rate
- **Per task commit:** `npx astro build` (zero build errors = gate 1); run 1 targeted spec file for the component just built
- **Per wave merge:** `npx playwright test` full suite
- **Phase gate:** Full suite green + `npx astro build` zero errors before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/comp-01-header.spec.ts` — covers COMP-01 (header render, mobile menu, Escape key)
- [ ] `tests/comp-02-footer.spec.ts` — covers COMP-02 (footer grid, 4 link columns)
- [ ] `tests/comp-03-hero.spec.ts` — covers COMP-03 (page hero static + home hero slides)
- [ ] `tests/comp-04-capcard.spec.ts` — covers COMP-04 (card photo, title, desc, on-cream variant)
- [ ] `tests/comp-05-newsletter.spec.ts` — covers COMP-05 (form render, JS submit hijack, mock fetch)
- [ ] `tests/comp-06-wafab.spec.ts` — covers COMP-06 (FAB present/absent based on env var)
- [ ] `tests/comp-07-langswitcher.spec.ts` — covers COMP-07 (PT/ES navigation, aria-current)
- [ ] `tests/comp-08-sociallinks.spec.ts` — covers COMP-08 (icon render, href validity)
- [ ] `tests/comp-09-seo.spec.ts` — covers COMP-09 (meta tags, hreflang, canonical)
- [ ] `tests/fixtures/bad-language.md` — synthetic fixture with `language: fr` to verify CONT-01 Zod rejection
- [ ] All tests require Playwright dev server fixture (`webServer` in `playwright.config.ts`) — verify Phase 1 config has this

---

## Sources

### Primary (HIGH confidence)
- Astro docs `astro:i18n` module — `getRelativeLocaleUrl(locale, path)` signature, `getAbsoluteLocaleUrl`, confirmed for Astro 5/6 — https://docs.astro.build/en/reference/modules/astro-i18n/
- `../cmp-design-system/mock-26/site.css` — all component CSS values extracted directly (nav, footer, cards, hero, lang switcher, social icons, buttons)
- `../cmp-design-system/mock-26/index.html` — SiteHeader HTML structure, Hero home variant (slideshow, overlay, grid, progress indicators), CapabilityCard grid, Footer HTML
- `../cmp-design-system/mock-26/advisory.html` — Page hero structure (static bg, Ken Burns, eyebrow)
- `src/config/social.ts` — CF endpoint URL confirmed: `https://us-central1-dcplatformcmp.cloudfunctions.net/subscribe`
- `src/components/NewsletterSubscribe.astro` — existing script logic, `is:inline define:vars` pattern
- `src/components/WhatsAppFab.astro` — existing icon SVG, hardcoded number confirmed as `5511915788796`
- `src/components/SiteHeader.astro` — existing mobile menu pattern (click toggle, `subnav` prop to preserve)
- `src/i18n/utils.ts` — existing `getLangFromUrl`, `useTranslations`, `defaultLang` — Phase 1 substrate
- `astro.config.mjs` — i18n config confirmed: `prefixDefaultLocale: false`, fallback `pt/es → en`

### Secondary (MEDIUM confidence)
- WebSearch + official docs cross-verification: `Astro.currentLocale` in Astro 6 components confirmed as built-in (no extra package)
- Vite `import.meta.env.PUBLIC_*` pattern — standard Vite convention, confirmed in Astro docs

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all Phase 1 artifacts verified in-repo
- Architecture: HIGH — mock-26 CSS values extracted directly from source files
- Pitfalls: HIGH — derived from reading actual source code + Astro i18n docs
- CF endpoint: HIGH — confirmed from `src/config/social.ts` line 15
- i18n API: HIGH — confirmed from official Astro docs

**Research date:** 2026-05-17
**Valid until:** 2026-06-17 (Astro APIs stable; 30-day window reasonable)
