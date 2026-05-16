---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-16
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from RESEARCH.md Validation Architecture section.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework (primary)** | Shell assertions against `dist/` build output |
| **Framework (secondary)** | Playwright 1.x — for runtime network assertion only |
| **Config file** | `scripts/validate-phase-1.sh` (Wave 0 gap) + `playwright.config.ts` (Wave 0 gap) |
| **Quick run command** | `bash scripts/validate-phase-1.sh` |
| **Full suite command** | `bash scripts/validate-phase-1.sh && npx playwright test tests/phase-1-network.spec.ts` |
| **Estimated runtime** | ~5s shell + ~10s Playwright |

**Note:** No test infrastructure exists in the project today. All infrastructure is Wave 0.

---

## Sampling Rate

- **After every task commit:** Run relevant subset of shell checks for the task's requirement (e.g., post-FOUND-03 commit → run font checks only)
- **After every plan wave:** Run full `bash scripts/validate-phase-1.sh` (~5s)
- **Before `/gsd:verify-work`:** Full suite green (shell + Playwright) + `npm run build` succeeds with zero TypeScript errors
- **Max feedback latency:** 5 seconds (shell), 15 seconds (full)

---

## Per-Requirement Verification Map

| Req ID | Behavior | Test Type | Automated Command | File Exists | Status |
|--------|----------|-----------|-------------------|-------------|--------|
| FOUND-01 | `src/assets/photos/` contains 26 `.jpg` files | shell | `test "$(ls src/assets/photos/*.jpg 2>/dev/null \| wc -l)" -eq 26` | ❌ W0 | ⬜ |
| FOUND-01 | Built HTML contains `.webp` URLs (Astro Image optimized) | shell | `grep -qr "\.webp" dist/ --include="*.html"` | ❌ W0 | ⬜ |
| FOUND-01 | Built HTML contains `srcset=` attributes (responsive sizes) | shell | `grep -qr 'srcset=' dist/ --include="*.html"` | ❌ W0 | ⬜ |
| FOUND-01 | No Unsplash CDN URLs in built HTML | shell | `! grep -qr "images.unsplash.com" dist/ --include="*.html"` | ❌ W0 | ⬜ |
| FOUND-02 | `global.css` contains `--color-navy-0: #050E1D` (mock-26 token) | shell | `grep -q "\-\-color-navy-0: #050E1D" src/styles/global.css` | ❌ W0 | ⬜ |
| FOUND-02 | `global.css` contains `--color-blue: #2D6BE4` (brand blue token) | shell | `grep -q "\-\-color-blue: #2D6BE4" src/styles/global.css` | ❌ W0 | ⬜ |
| FOUND-02 | `global.css` does NOT contain v4 dark token `--color-bg-base` | shell | `! grep -q "\-\-color-bg-base" src/styles/global.css` | ❌ W0 | ⬜ |
| FOUND-02 | Built CSS contains `--color-navy-0` | shell | `grep -qr "\-\-color-navy-0" dist/ --include="*.css"` | ❌ W0 | ⬜ |
| FOUND-03 | `@fontsource-variable/space-grotesk` installed | shell | `test -d node_modules/@fontsource-variable/space-grotesk` | ❌ W0 | ⬜ |
| FOUND-03 | `@fontsource-variable/dm-sans` installed | shell | `test -d node_modules/@fontsource-variable/dm-sans` | ❌ W0 | ⬜ |
| FOUND-03 | `global.css` imports fontsource-variable packages | shell | `grep -q "@fontsource-variable/space-grotesk" src/styles/global.css` | ❌ W0 | ⬜ |
| FOUND-03 | NO `fonts.googleapis.com` in built HTML | shell | `! grep -qr "fonts.googleapis.com" dist/ --include="*.html"` | ❌ W0 | ⬜ |
| FOUND-03 | NO network requests to googleapis at runtime | Playwright | `expect(requests.filter(u => u.includes('googleapis'))).toHaveLength(0)` | ❌ W0 | ⬜ |
| FOUND-04 | `global.css` `@layer base` contains `scroll-behavior: smooth` | shell | `grep -q "scroll-behavior: smooth" src/styles/global.css` | ❌ W0 | ⬜ |
| FOUND-04 | `global.css` body background uses `var(--color-navy-0)` | shell | `grep -q "background: var(--color-navy-0)" src/styles/global.css` | ❌ W0 | ⬜ |
| I18N-01 | `astro.config.mjs` contains i18n block with `defaultLocale: 'en'` | shell | `grep -q "defaultLocale: 'en'" astro.config.mjs` | ❌ W0 | ⬜ |
| I18N-01 | Build output contains `dist/pt/index.html` | shell | `test -f dist/pt/index.html` | ❌ W0 | ⬜ |
| I18N-01 | Build output contains `dist/es/index.html` | shell | `test -f dist/es/index.html` | ❌ W0 | ⬜ |
| I18N-01 | EN index at `dist/index.html` (no `/en/` prefix) | shell | `test -f dist/index.html && ! test -d dist/en/` | ❌ W0 | ⬜ |
| I18N-02 | `src/i18n/en.json`, `pt.json`, `es.json` all exist | shell | `test -f src/i18n/en.json && test -f src/i18n/pt.json && test -f src/i18n/es.json` | ❌ W0 | ⬜ |
| I18N-02 | `src/i18n/utils.ts` exports `getLangFromUrl` + `useTranslations` | shell | `grep -q "getLangFromUrl" src/i18n/utils.ts && grep -q "useTranslations" src/i18n/utils.ts` | ❌ W0 | ⬜ |
| I18N-02 | `en.json` contains required nav keys | shell | `node -e "const t=require('./src/i18n/en.json'); ['nav.home','nav.advisory','cta.talk-to-us'].forEach(k=>{if(!t[k])throw new Error('Missing: '+k)})"` | ❌ W0 | ⬜ |

**Shell check count:** 21 rows above marked `shell` (FOUND-01=4, FOUND-02=4, FOUND-03=4, FOUND-04=2, I18N-01=4, I18N-02=3). The Playwright row (FOUND-03 runtime) is separate and does NOT count toward the 21.

*Status legend: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/validate-phase-1.sh` — phase-1 shell validation script (template in RESEARCH.md §Validation Architecture)
- [ ] `playwright.config.ts` — minimal config targeting `http://localhost:4321`
- [ ] `@playwright/test` installed: `npm install -D @playwright/test && npx playwright install chromium`
- [ ] `tests/phase-1-network.spec.ts` — single test asserting no requests to `fonts.googleapis.com` on home page load

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Site visually looks like mock-26 | All | Pixel/aesthetic judgement | `npm run dev` → open http://localhost:4321 → eyeball against http://localhost:8096 (mock-26 server) — fonts, palette, base layout primitives match |
| Fonts render with `swap` not `block` | FOUND-03 | Visual perception of FOIT | Network throttle to "Slow 3G" → reload → text should appear in fallback then swap to Space Grotesk/DM Sans (not blink to blank) |

---

## Phase Gate

Phase 1 is complete when:
1. ✅ All 21 automated shell checks in the table above pass (`bash scripts/validate-phase-1.sh` exits 0)
2. ✅ Playwright network test passes (zero googleapis requests on home load)
3. ✅ `npm run build` succeeds with zero TypeScript errors
4. ✅ Both manual verifications pass eyeball check
5. ✅ Phase commits clean (no WIP staged files)

---

*Validation strategy version: 1.1 · Phase 01-foundation · 2026-05-16 · Updated: srcset check added (FOUND-01), --color-blue check added (FOUND-02), I18N-02 checks compounded*
