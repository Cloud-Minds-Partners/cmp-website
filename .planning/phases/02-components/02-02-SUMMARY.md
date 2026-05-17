---
phase: 02-components
plan: "02"
subsystem: ui
tags: [astro, tailwind, i18n, whatsapp, sociallinks, capabilitycard, langswitcher]

# Dependency graph
requires:
  - phase: 02-01
    provides: Playwright spec stubs for comp-04/06/07/08, head slot in Base.astro, webServer config
  - phase: 01-foundation
    provides: Tailwind 4 tokens (--color-navy-0, --color-blue, etc.), i18n routing, astro:i18n, src/assets/photos/

provides:
  - SocialLinks.astro with header/footer variants (LinkedIn + WhatsApp, circular bordered footer buttons)
  - WhatsAppFab.astro driven by PUBLIC_WHATSAPP_NUMBER env var with wa-pulse keyframe animation
  - LangSwitcher.astro using getRelativeLocaleUrl with locale prefix stripping, no JS
  - CapabilityCard.astro using Astro Image, 19px 19px 0 0 top radius, on-cream variant, optional link wrapper

affects:
  - 02-03 (SiteHeader imports LangSwitcher + SocialLinks; SiteFooter imports SocialLinks)
  - 02-04 (dev preview page imports all 4 components)
  - 03-pages (CapabilityCard composed in home/advisory/development pages)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "astro:i18n getRelativeLocaleUrl with locale prefix stripping for LangSwitcher (no double-prefix /pt/pt/)"
    - "Astro <Image> inside absolutely-positioned container for CapabilityCard photo (not CSS background-image)"
    - "import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '' with .length >= 10 guard for env-driven component rendering"
    - "Scoped <style> blocks for keyframe animations (wa-pulse, hover transitions) alongside Tailwind utilities"

key-files:
  created:
    - src/components/LangSwitcher.astro
    - src/components/CapabilityCard.astro
  modified:
    - src/components/SocialLinks.astro
    - src/components/WhatsAppFab.astro

key-decisions:
  - "SocialLinks uses 'header' | 'footer' variant prop — replaces old 'light' | 'dark' variants from v4 era"
  - "WhatsAppFab: personal number removed entirely from component; only env var path, no social.ts fallback"
  - "CapabilityCard: photo rendered as Astro <Image> inside overflow:hidden container (not CSS background-image) per pitfall doc"
  - "LangSwitcher: barePath = rawPath.replace(/^\\//, '') || '' handles home page edge case (empty string = locale root)"

patterns-established:
  - "Pattern: getRelativeLocaleUrl always receives bare path (no leading slash). Home page passes empty string ''"
  - "Pattern: env-var component guard = (import.meta.env.VAR ?? '').trim().length >= 10 — handles undefined + empty string"
  - "Pattern: CapabilityCard uses data-component='capcard' + data-on-cream='true' for Playwright targeting"

requirements-completed:
  - COMP-04
  - COMP-06
  - COMP-07
  - COMP-08

# Metrics
duration: 8min
completed: 2026-05-17
---

# Phase 02 Plan 02: Wave 1a Leaf Components Summary

**Four standalone Astro leaf components: SocialLinks (header/footer variants), WhatsAppFab (env-driven, wa-pulse animation), LangSwitcher (astro:i18n, no JS), CapabilityCard (Astro Image, on-cream variant)**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-05-17T15:02:28Z
- **Completed:** 2026-05-17T15:10:44Z
- **Tasks:** 2
- **Files modified:** 4 (2 replaced, 2 new)

## Accomplishments

- SocialLinks fully replaced: footer variant = 36px circular bordered anchors with hover blue glow matching mock-26 `.foot-social`; header variant = plain inline icons; both have aria-labels and LinkedIn + WhatsApp SVGs
- WhatsAppFab fully replaced: personal number removed from component, env var guard `(PUBLIC_WHATSAPP_NUMBER ?? '').trim().length >= 10`, wa-pulse keyframe animation, renders nothing when env var absent
- LangSwitcher new: `getRelativeLocaleUrl` from `astro:i18n` with locale prefix stripping to prevent double-prefix `/pt/pt/team` bug; `aria-current="page"` on active locale; active underline bar; hidden below 880px per mock-26
- CapabilityCard new: Astro `<Image>` inside absolutely-positioned container, `19px 19px 0 0` top radius, photo gradient overlay div, on-cream variant switches to transparent bg + navy-0 title + #4D5F7A desc; optional href wrapper with hover lift

## Task Commits

1. **Task 1: SocialLinks + WhatsAppFab (REPLACE)** - `5969777` (feat)
2. **Task 2: LangSwitcher + CapabilityCard (NEW)** - `8bc7c7a` (feat)

## Files Created/Modified

- `src/components/SocialLinks.astro` - Replaced: header/footer variants, LinkedIn + WhatsApp SVGs, mock-26 .foot-social CSS, scoped hover transitions
- `src/components/WhatsAppFab.astro` - Replaced: env var guard, wa-pulse animation, 56px fixed FAB, no hardcoded number
- `src/components/LangSwitcher.astro` - New: astro:i18n getRelativeLocaleUrl, 3 locale anchors, aria-current, active underline, 880px media hide
- `src/components/CapabilityCard.astro` - New: Astro Image, photo container overflow:hidden, gradient overlay, num/title/desc body, on-cream variant, optional link wrapper

## Decisions Made

- SocialLinks variant prop changed from old `'light' | 'dark'` to `'header' | 'footer'` — matches Phase 2 context spec; old variant names belonged to v4 era
- WhatsAppFab: personal number `5511915788796` removed entirely from component; only `import.meta.env.PUBLIC_WHATSAPP_NUMBER` path, with `social.whatsappDefaultMessage` for the message text (acceptable per CONTEXT.md)
- CapabilityCard uses `<Image>` component (not CSS `background-image`) — Astro Image optimization requires `<img>` elements; photo container is `position:relative; overflow:hidden; height:180px` with absolute inset img
- LangSwitcher `barePath` edge case: home page rawPath is `'/'` after stripping, `.replace(/^\//, '') || ''` produces empty string which `getRelativeLocaleUrl` interprets as locale root

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. Build green on first attempt both tasks.

## User Setup Required

None — no external service configuration required. `PUBLIC_WHATSAPP_NUMBER` env var documented in `.env.example` (Phase 01-04 artifact).

## Next Phase Readiness

- SocialLinks and LangSwitcher are ready for import by SiteHeader (02-03) and SiteFooter (02-03)
- WhatsAppFab is ready for import in SiteFooter or Base layout (02-03)
- CapabilityCard is ready for use in home/advisory/development pages (Phase 3)
- All 4 components: `npx astro build` green, Playwright spec stubs skip gracefully until dev preview page built (02-04)

---
*Phase: 02-components*
*Completed: 2026-05-17*
