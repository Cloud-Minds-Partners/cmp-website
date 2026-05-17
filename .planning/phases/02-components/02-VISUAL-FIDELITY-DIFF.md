# Phase 2 — Structural Fidelity Diff

**Date:** 2026-05-17
**Method:** HTML/CSS structural comparison (not pixel diff)
**Source files inspected:** `src/components/*.astro`, `dist/index.html`, `dist/_astro/*.css`
**Mock-26 reference:** `../cmp-design-system/mock-26/site.css` + `tokens.css` + `index.html`
**Dev server:** http://localhost:4321 (Astro dev, confirmed live)
**Note:** `/dev/components` is prod-guarded (`isProd → redirect /404`); structural check performed via source inspection + `dist/index.html` (full rendered HTML confirmed).

---

## Component-by-component

### COMP-01: SiteHeader

- **HTML structure:** MATCH. Uses `<header class="site-header">` → `<div class="header-inner">` → `<a class="brand">` + `<nav class="desktop-nav" aria-label="Primary navigation">` + `<div class="header-right">` + `<button id="mobile-toggle" class="hamburger">`. Mobile `<nav id="mobile-nav" class="mobile-nav hidden">`. Optional `<nav class="subnav">`. Confirmed rendered in `dist/index.html`.
- **Class name fidelity:** Component uses own scoped class names (`site-header`, `header-inner`, `header-right`, `cta-pill`, `desktop-nav`, `nav-link`) that parallel mock-26's `.nav`, `.nav-inner`, `.nav-links`, `.nav-cta`. The semantics and visual intent are equivalent; the naming diverges intentionally (Astro scoped CSS isolates component classes).
- **Key mock-26 conventions preserved:**
  - `brand` class + `brand-tag` class: YES (mock-26 `.brand` + `.brand-tag`)
  - `nav-lang` class on LangSwitcher wrapper: YES (exact match — used as-is for mobile override `:global(.nav-lang)`)
  - Keyboard Escape to close mobile nav: YES (JS script block)
  - `aria-expanded` on hamburger: YES
- **Issues:** Minor — mock-26 uses `.nav-links a.active::after` for active link underline; Astro component does not implement the active state detection (no `aria-current="page"` on nav links, no `.active` class set). This is a deferred Phase 3 concern (page composition). No structural blocker.

---

### COMP-02: SiteFooter

- **HTML structure:** MATCH. `<footer class="site-footer">` → `<div class="foot-links">` (5-col grid) → `<div class="foot-brand">` + 4× `<div class="foot-col">` → `<div class="foot-bottom">`. Confirmed rendered in `dist/index.html`.
- **Class name fidelity:** MATCH. `foot-links`, `foot-brand`, `foot-col`, `foot-heading`, `foot-bottom` directly mirror mock-26 class names. `foot-tagline` is an Astro addition (no equivalent in mock-26, functionally correct).
- **5-column grid confirmed in rendered CSS:** `grid-template-columns:minmax(280px,1.4fr) 1fr 1fr 1fr 1fr` — exact match to mock-26.
- **SocialLinks embedded:** YES — `<div class="foot-social">` with LinkedIn + WhatsApp anchor elements rendered.
- **Issues:** None.

---

### COMP-03: Hero

- **HTML structure:** MATCH (both variants). Home variant: `<section class="home-hero">` → slides-layer + grid-texture + overlay + hero-content + progress-tracks. Page variant: `<section class="page-hero">` → page-bg + overlay + hero-content with optional eyebrow. Confirmed in source.
- **Class name fidelity:** PARTIAL MATCH. Hero uses component-internal names (`home-hero`, `page-hero`, `slides-layer`, `slide`, `page-bg`, `eyebrow`). Mock-26 uses `.home-hero`, `.home-hero-slides`, `.home-hero-slide`, `.page-hero`, `.page-hero-bg`, `.page-hero-content`, `.page-eyebrow`. Names differ slightly; structure is functionally equivalent.
- **Animation names:** `slideShow` keyframe (home, 24s) and `heroKen` keyframe (page, 18s) confirmed in source — exact match to mock-26 animation naming and durations.
- **Issues:** `page-hero-content` div is not present — Astro uses a unified `hero-content` class for both variants, with the max-width difference applied via `.page-hero .hero-content { max-width: 620px }`. Functionally equivalent, structural diff acceptable.

---

### COMP-04: CapabilityCard

- **HTML structure:** MATCH. Renders as `<article>` (no-link) or `<a>` (with link) with `class="cap-card"`. Inner: `<div class="cap-card-photo">` (contains `<Image>` + `.cap-photo-overlay`) + `<div class="cap-card-body">` with `.cap-num`, `.cap-title`, `.cap-desc`. Confirmed in source.
- **Class name fidelity:** MATCH. `cap-card`, `cap-card-photo`, `cap-card-body`, `cap-num`, `cap-title`, `cap-desc` — all exact matches to mock-26 class names.
- **Photo overlay:** Astro uses an explicit `<div class="cap-photo-overlay">` instead of mock-26's CSS `::after` pseudo-element. Functionally identical gradient overlay.
- **Issues:** None.

---

### COMP-05: NewsletterSubscribe

- **HTML structure:** MATCH. `<div class="nl-wrap">` → `<form class="nl-form">` → `<input type="email" class="nl-input">` + `<button type="submit" class="nl-btn">` + `<p class="nl-msg" hidden>`. Progressive enhancement JS fetch confirmed. Confirmed rendered in `dist/index.html`.
- **Endpoint:** `https://us-central1-dcplatformcmp.cloudfunctions.net/subscribe` — hardcoded in the rendered JS, sourced from `social.ts`. Correct.
- **States:** idle / submitting (btn disabled + "...") / success (wrap.innerHTML replaced) / error (nl-msg unhidden with nl-error class). All 4 states implemented.
- **Issues:** None.

---

### COMP-06: WhatsAppFab

- **HTML structure:** MATCH when `PUBLIC_WHATSAPP_NUMBER` env var is set (length ≥ 10). Renders `<a class="wa-fab">` with WhatsApp SVG, pulse animation, fixed bottom-right. When env var absent/empty → renders nothing (no DOM node). Graceful absence confirmed.
- **Pulse animation:** `wa-pulse` keyframe 2s ease-out infinite — matches mock-26 pattern.
- **Issues:** `WhatsAppFab` reads `import.meta.env.PUBLIC_WHATSAPP_NUMBER` — env var not set in local dev. Component renders nothing in the preview (graceful). This is correct behavior per RESEARCH.md scope.

---

### COMP-07: LangSwitcher

- **HTML structure:** MATCH. `<div class="nav-lang" role="navigation" aria-label="Language selector">` → 3× `<a class="lang-link [active]" [aria-current="page"]>` + 2× `<span class="sep">`. Exactly 3 language anchors (EN, PT, ES). Confirmed rendered in `dist/index.html`.
- **Class name fidelity:** MATCH. `nav-lang`, `lang-link`, `lang-link.active`, `sep` — all exact matches to mock-26 `.nav-lang`, `.nav-lang a`, `.nav-lang a.active`, `.nav-lang span.sep`.
- **i18n routing:** Uses `getRelativeLocaleUrl(locale, barePath)` from `astro:i18n`. Active locale correctly set from `Astro.currentLocale`. Path stripping for locale prefix confirmed (`/pt/team → /team`).
- **Issues:** None.

---

### COMP-08: SocialLinks

- **HTML structure:** MATCH (footer variant). `<div class="foot-social">` → 2× `<a class="social-icon-link">` (LinkedIn + WhatsApp, each with 16×16 SVG). Header variant: `<div class="header-social">` → `<a class="header-icon-link">`. Confirmed in `dist/index.html`.
- **Class name fidelity:** MATCH for footer variant — `foot-social`, `social-icon-link` exactly mirror mock-26 `.foot-social` and `.foot-social a`.
- **SVG icons:** LinkedIn (path confirmed) + WhatsApp (path confirmed) both present in both variants.
- **Issues:** None.

---

### COMP-09: SEO

- **Head elements confirmed in `dist/index.html`:**
  - `<title>`: YES (`Cloud Minds Partners — Data Center Intelligence for Latin America`)
  - `<meta name="description">`: YES
  - `<meta name="robots">`: YES
  - `<link rel="canonical">`: YES
  - OG tags (title, description, image, url, type, locale, site_name): YES — all 7 present
  - Twitter Card tags (card, title, description, image): YES — all 4 present
  - hreflang alternates: YES — en, pt-BR, es, x-default (4 links confirmed)
  - JSON-LD `Organization` schema: YES (script type="application/ld+json")
- **i18n locale map:** `en → en_US`, `pt → pt_BR`, `es → es_LA` — correct OG locale values.
- **Canonical URL computation:** Strips locale prefix; uses `Astro.url.pathname` fallback.
- **Issues:** None.

---

## Mock-26 CSS values present in Astro build

| Value | Source (mock-26) | Location in Astro | Found? |
|-------|-----------------|-------------------|--------|
| nav height `72px` | `site.css .nav-inner { height: 72px }` | `SiteHeader.astro` `.header-inner { height: 72px }` | YES |
| nav padding `clamp(28px, 4vw, 64px)` | `site.css .nav-inner` | `SiteHeader.astro` `.header-inner` | YES |
| footer grid `minmax(280px, 1.4fr) 1fr 1fr 1fr 1fr` | `site.css .foot-links` | `SiteFooter.astro` `.foot-links` — confirmed in dist CSS | YES |
| footer padding `clamp(32px, 5vw, 96px)` | `site.css .foot-links` | `SiteFooter.astro` `.foot-links` | YES |
| card photo radius `19px 19px 0 0` | `site.css .cap-card-photo` | `CapabilityCard.astro` `.cap-card-photo` | YES |
| hero content max-width `820px` (home) | mock-26 index.html `.home-hero` content | `Hero.astro` `.hero-content { max-width: 820px }` | YES |
| page-hero content max-width `620px` | `site.css .page-hero-content { max-width: 620px }` | `Hero.astro` `.page-hero .hero-content { max-width: 620px }` | YES |
| hero padding `clamp(32px, 5vw, 96px)` | `site.css .page-hero .wrap` | `Hero.astro` `.hero-content { padding: 0 clamp(32px, 5vw, 96px) }` | YES |
| brand blue `#2D6BE4` | `tokens.css --blue: #2D6BE4` | `global.css --color-blue: #2D6BE4` | YES |
| navy-0 `#050E1D` | `tokens.css --navy-0: #050E1D` | `global.css --color-navy-0: #050E1D` | YES |
| Ken Burns animation `heroKen` 18s | `site.css @keyframes heroKen` | `Hero.astro` `@keyframes heroKen { 0% scale(1.0); 100% scale(1.09) translate(-1.4%,-1.2%) }` | YES |
| Slideshow `slideShow` 24s | mock-26 index.html JS | `Hero.astro` `@keyframes slideShow` 24s | YES |
| foot-social icon size `36×36px` | `site.css .foot-social a` | `SocialLinks.astro` `.foot-social .social-icon-link { width: 36px; height: 36px }` | YES |
| LangSwitcher separator font-size `11px` | `site.css .nav-lang span.sep { font-size: 11px }` | `LangSwitcher.astro` `.sep { font-size: 11px }` | YES |

---

## Hardcoded smell scan

- **`5511915788796` in `src/`:** FOUND — in `src/config/social.ts` (`whatsappNumber: "5511915788796"`). This is the canonical social config file, not a component. The number was intentionally migrated from hardcoded component HTML to the config file (per RESEARCH.md: "must be replaced with `import.meta.env.PUBLIC_WHATSAPP_NUMBER`"). The WhatsAppFab reads `import.meta.env.PUBLIC_WHATSAPP_NUMBER` directly. SocialLinks reads `social.whatsappNumber` (fallback for footer icons — a known open item). The number is NOT hardcoded in any component template; it lives in one config file. Status: **CONFIG FILE ONLY — not a component smell, but pending env-var migration for SocialLinks footer icons**.
- **`images.unsplash.com` in `src/components/`:** NOT FOUND — clean.
- **`fonts.googleapis.com` in `dist/`:** NOT FOUND — clean. Fonts loaded via `@fontsource-variable` packages (self-hosted), not Google CDN.

---

## i18n routing smoke

- `/pt/` HTTP status: **200** — `<html lang="pt">` confirmed, PT meta description present ("inteligência, assessoria e plataformas para data centers na América Latina"), hreflang links correct (en/pt-BR/es/x-default).
- `/es/` HTTP status: **200** — `<html lang="es">` confirmed, ES meta description present ("inteligencia, asesoría y plataformas para data centers en América Latina"), hreflang links correct.
- Both locales return locale-specific content (not EN fallback); canonical URLs include locale prefix.

---

## Notable Observations

1. **Home page (`dist/index.html`) does not use the Phase 2 Hero or CapabilityCard components** — the home page uses a different design (Tailwind utility classes, SVG LatAm map, bento grid for platforms). The Phase 2 components are used in the `/dev/components` preview page (prod-guarded) and are structurally verified via source inspection.

2. **SiteHeader active nav link detection is absent** — no `aria-current="page"` on `<nav class="desktop-nav">` links, no `.active` class logic. This is a Phase 3 concern (page composition), not a Phase 2 component structural issue. The mobile hamburger `aria-expanded` IS implemented correctly.

3. **SocialLinks footer variant reads from `social.whatsappNumber`** (still `5511915788796`) rather than `import.meta.env.PUBLIC_WHATSAPP_NUMBER`. The WhatsAppFab correctly reads from env var. This creates an inconsistency: footer social icons will show the personal number even when env var is unset or set to a different number. **This is a blocker for production WhatsApp number cutover.**

4. **CapabilityCard renders as semantic `<article>` when no `href` is provided**, and as `<a>` when `href` is provided. This is a correct accessibility pattern not present in mock-26 (which uses `<div class="cap-card">`). Astro implementation is strictly better.

---

## Verdict

**PASS with notes.**

Structural fidelity is confirmed for all 9 components. All mock-26 CSS values sampled are present in the Astro implementation. HTML semantic structure is correct or improved (article/a pattern in CapabilityCard, aria attributes throughout). i18n routing works for all 3 locales.

**Two notes for pre-production follow-up (not Phase 3 blockers):**

1. **SocialLinks footer `whatsappNumber`** — reads from `social.ts` config constant instead of `PUBLIC_WHATSAPP_NUMBER` env var. Must be unified before production WhatsApp number cutover.
2. **SiteHeader active link state** — `.active` class not applied to current-page nav links. Phase 3 page composition should add `aria-current="page"` detection (compare `Astro.url.pathname` to link href).

Visual fidelity debt is cleared for structural concerns. User pixel diff still recommended but not blocking Phase 3.
