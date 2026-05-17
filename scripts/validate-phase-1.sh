#!/usr/bin/env bash
# Phase 1 — Foundation validation script
# 21 shell checks across FOUND-01 / FOUND-02 / FOUND-03 / FOUND-04 / I18N-01 / I18N-02
# Usage: bash scripts/validate-phase-1.sh
# Hard-exits on first failure (Rule #8b: no silent skip).

set -euo pipefail

pass() { echo "  PASS: $*"; }
fail() { echo "  FAIL: $*"; exit 1; }

check() {
  if "$@" 2>/dev/null; then
    pass "$*"
  else
    fail "$*"
  fi
}

echo ""
echo "Phase 1 — Foundation validation"
echo "================================"

# ---------------------------------------------------------------------------
# FOUND-01 (4 checks): Local photos — 27 JPGs, WebP output, srcset, no Unsplash CDN
# ---------------------------------------------------------------------------
echo ""
echo "FOUND-01: Image pipeline"
check test "$(ls src/assets/photos/*.jpg 2>/dev/null | wc -l | tr -d ' ')" -eq 27
check bash -c 'grep -qr "\.webp" dist/ --include="*.html"'
check bash -c 'grep -qr "srcset=" dist/ --include="*.html"'
check bash -c '! grep -qr "images.unsplash.com" dist/ --include="*.html"'

# ---------------------------------------------------------------------------
# FOUND-02 (4 checks): Design tokens in global.css and built CSS
# ---------------------------------------------------------------------------
echo ""
echo "FOUND-02: Design tokens"
check grep -q -- '--color-navy-0: #050E1D' src/styles/global.css
check grep -q -- '--color-blue: #2D6BE4' src/styles/global.css
check bash -c '! grep -q -- "--color-bg-base" src/styles/global.css'
check bash -c 'grep -qr -- "--color-navy-0" dist/ --include="*.css"'

# ---------------------------------------------------------------------------
# FOUND-03 (4 checks): Local fontsource packages, CSS import, no googleapis in build
# ---------------------------------------------------------------------------
echo ""
echo "FOUND-03: Fonts (local, no Google CDN)"
check test -d node_modules/@fontsource-variable/space-grotesk
check test -d node_modules/@fontsource-variable/dm-sans
check grep -q '@fontsource-variable/space-grotesk' src/styles/global.css
check bash -c '! grep -qr "fonts.googleapis.com" dist/ --include="*.html"'

# ---------------------------------------------------------------------------
# FOUND-04 (2 checks): Base styles — smooth scroll, body background token
# ---------------------------------------------------------------------------
echo ""
echo "FOUND-04: Base styles"
check grep -q 'scroll-behavior: smooth' src/styles/global.css
check grep -q 'background: var(--color-navy-0)' src/styles/global.css

# ---------------------------------------------------------------------------
# I18N-01 (4 checks): Astro i18n config, dist output for pt/es, no /en/ prefix
# ---------------------------------------------------------------------------
echo ""
echo "I18N-01: Astro i18n routing"
check grep -q "defaultLocale: 'en'" astro.config.mjs
check test -f dist/pt/index.html
check test -f dist/es/index.html
check bash -c 'test -f dist/index.html && ! test -d dist/en'

# ---------------------------------------------------------------------------
# I18N-02 (3 checks): Translation files, utils exports, required nav keys
# ---------------------------------------------------------------------------
echo ""
echo "I18N-02: Translation files and utilities"
check bash -c 'test -f src/i18n/en.json && test -f src/i18n/pt.json && test -f src/i18n/es.json'
check bash -c 'grep -q "getLangFromUrl" src/i18n/utils.ts && grep -q "useTranslations" src/i18n/utils.ts'
check node -e "const t=require('./src/i18n/en.json'); ['nav.home','nav.advisory','cta.talk-to-us'].forEach(k=>{if(!t[k])throw new Error('Missing: '+k)})"

echo ""
echo "All Phase 1 shell checks passed."
