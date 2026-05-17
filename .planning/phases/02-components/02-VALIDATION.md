---
phase: 2
slug: components
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-17
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from RESEARCH.md §Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.x (chromium, already configured Phase 1) |
| **Config file** | `playwright.config.ts` (project root) |
| **Quick run command** | `npx playwright test --project=chromium tests/comp-*.spec.ts` |
| **Full suite command** | `npx playwright test` |
| **Dev server** | `npx astro dev` (Playwright `webServer` config; Wave 0 must verify) |
| **Estimated runtime** | ~30s (9 specs × ~3s each) + Phase 1 specs |

---

## Sampling Rate

- **After every task commit:** Run targeted spec for the component just built (e.g., post-COMP-01 → `npx playwright test tests/comp-01-header.spec.ts`)
- **After every plan wave:** Full `npx playwright test` (~30s)
- **Before `/gsd:verify-work`:** Full Playwright suite + `npx astro build` zero errors + manual eyeball at `/dev/components`
- **Max feedback latency:** ~5s per targeted spec, ~30s full suite

---

## Per-Requirement Verification Map

| Req ID | Behavior | Test Type | Automated Command | File Exists | Status |
|--------|----------|-----------|-------------------|-------------|--------|
| COMP-01 | SiteHeader renders logo, nav, LangSwitcher, CTA pill | visual/smoke | `npx playwright test tests/comp-01-header.spec.ts` | ❌ W0 | ⬜ |
| COMP-01 | Mobile menu opens on hamburger click | interaction | `npx playwright test tests/comp-01-header.spec.ts` | ❌ W0 | ⬜ |
| COMP-01 | Mobile menu closes on Escape key | interaction | `npx playwright test tests/comp-01-header.spec.ts` | ❌ W0 | ⬜ |
| COMP-02 | SiteFooter renders 5 columns + correct links | smoke | `npx playwright test tests/comp-02-footer.spec.ts` | ❌ W0 | ⬜ |
| COMP-03 | Hero page-mode renders with bg image | visual | `npx playwright test tests/comp-03-hero.spec.ts` | ❌ W0 | ⬜ |
| COMP-03 | Hero home-variant has 3 slides in DOM | smoke | `npx playwright test tests/comp-03-hero.spec.ts` | ❌ W0 | ⬜ |
| COMP-04 | CapabilityCard renders photo + title + desc | smoke | `npx playwright test tests/comp-04-capcard.spec.ts` | ❌ W0 | ⬜ |
| COMP-05 | Newsletter form submits, shows success state | interaction | `npx playwright test tests/comp-05-newsletter.spec.ts` | ❌ W0 | ⬜ |
| COMP-05 | CF endpoint URL preserved from social.ts | unit/grep | `grep -q "us-central1-dcplatformcmp.cloudfunctions.net/subscribe" src/config/social.ts` | ❌ W0 | ⬜ |
| COMP-06 | WhatsAppFab renders when env var set | smoke | `npx playwright test tests/comp-06-wafab.spec.ts` | ❌ W0 | ⬜ |
| COMP-06 | WhatsAppFab absent/hidden when env var empty | smoke | `npx playwright test tests/comp-06-wafab.spec.ts` | ❌ W0 | ⬜ |
| COMP-07 | LangSwitcher PT link on `/team` → `/pt/team` | navigation | `npx playwright test tests/comp-07-langswitcher.spec.ts` | ❌ W0 | ⬜ |
| COMP-07 | LangSwitcher active locale has `aria-current="page"` | a11y | `npx playwright test tests/comp-07-langswitcher.spec.ts` | ❌ W0 | ⬜ |
| COMP-08 | SocialLinks renders LinkedIn + WhatsApp icons | smoke | `npx playwright test tests/comp-08-sociallinks.spec.ts` | ❌ W0 | ⬜ |
| COMP-09 | SEO emits `<title>`, `<meta description>`, OG tags | smoke | `npx playwright test tests/comp-09-seo.spec.ts` | ❌ W0 | ⬜ |
| COMP-09 | hreflang alternates present for en/pt/es | smoke | `npx playwright test tests/comp-09-seo.spec.ts` | ❌ W0 | ⬜ |
| CONT-01 | Build succeeds with language field added to schemas | build | `npx astro build` (exit 0) | ✓ (Phase 1) | ⬜ |
| CONT-01 | Invalid `language: fr` fixture causes build error | build | `npx astro build` (exit non-zero) when test fixture present | ❌ W0 | ⬜ |

**Total:** 16 Playwright + 1 grep + 1 build (live) + 1 build (fixture-toggled) = **19 automated assertions**

*Status legend: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/comp-01-header.spec.ts` — header render, mobile menu open/close, Escape key
- [ ] `tests/comp-02-footer.spec.ts` — 5-column grid, link presence
- [ ] `tests/comp-03-hero.spec.ts` — page hero + home hero 3-slide variant
- [ ] `tests/comp-04-capcard.spec.ts` — card photo, title, desc, cream variant
- [ ] `tests/comp-05-newsletter.spec.ts` — form render, JS submit hijack, mock fetch success/error
- [ ] `tests/comp-06-wafab.spec.ts` — env-var-driven render
- [ ] `tests/comp-07-langswitcher.spec.ts` — nav + aria-current
- [ ] `tests/comp-08-sociallinks.spec.ts` — icon render, href correctness
- [ ] `tests/comp-09-seo.spec.ts` — head tag emission, hreflang
- [ ] `tests/fixtures/bad-language.md` — synthetic memo with `language: fr` for CONT-01 Zod rejection check (deleted after test, OR kept in `tests/` and excluded from content collection glob)
- [ ] Verify `playwright.config.ts` `webServer` block configured to launch `npx astro dev` before specs
- [ ] `.env.example` documents `PUBLIC_WHATSAPP_NUMBER`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual fidelity vs mock-26 | COMP-01..08 | Pixel/aesthetic judgement | `npm run dev` → http://localhost:4321/dev/components → eyeball against http://localhost:8096 (mock-26 server) component by component |
| WhatsApp pulse animation | COMP-06 | Animation timing perception | Visit `/dev/components` with `PUBLIC_WHATSAPP_NUMBER` set; observe pulse ring 1.5-2s loop, no jank |
| Newsletter live CF POST | COMP-05 | Requires real network + real endpoint, not mocked | With dev server running + working internet, fill form with throwaway email, submit, verify dcinsights backend received it (check Firebase Functions logs or via the actual subscriber list) |

---

## Phase Gate

Phase 2 is complete when:
1. ✅ All 16 Playwright tests pass (`npx playwright test`)
2. ✅ `grep -q "us-central1-dcplatformcmp.cloudfunctions.net/subscribe" src/config/social.ts` (CF endpoint contract preserved)
3. ✅ `npx astro build` exits 0 (CONT-01 schema refactor doesn't break build)
4. ✅ CONT-01 negative test: introducing synthetic `language: fr` fixture causes build to fail; reverting the fixture restores green build
5. ✅ All 3 manual verifications pass eyeball/smoke
6. ✅ Phase commits clean

---

*Validation strategy version: 1.0 · Phase 02-components · 2026-05-17*
