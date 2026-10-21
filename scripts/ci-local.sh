#!/usr/bin/env bash
# Conferência local antes de liberar um PR (o mesmo build que o deploy faz no Actions).
# Uso: bash scripts/ci-local.sh
set -euo pipefail
cd "$(dirname "$0")/.."

[ -d node_modules ] || npm ci --no-audit --no-fund
npm run build

# páginas escondidas da apresentação institucional: saem no dist e ficam fora do sitemap
for p in pt/apresentacao es/presentacion presentation; do
  [ -f "dist/$p/index.html" ] || { echo "faltou dist/$p/index.html"; exit 1; }
  grep -q 'name="robots" content="noindex' "dist/$p/index.html" || { echo "dist/$p sem noindex"; exit 1; }
done
if grep -qE 'apresentacao|presentacion|/presentation' dist/sitemap-*.xml; then
  echo "apresentação apareceu no sitemap"; exit 1
fi
echo "ci-local ok"
