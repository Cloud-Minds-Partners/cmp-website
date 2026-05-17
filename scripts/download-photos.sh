#!/usr/bin/env bash
# scripts/download-photos.sh
# Downloads all 26 mock-26 photos from Unsplash CDN to src/assets/photos/
# Run from cmp-website/ project root.
# Idempotent: skips files that already exist.

set -euo pipefail
OUT="src/assets/photos"
mkdir -p "$OUT"

download() {
  local id="$1" filename="$2" width="${3:-1200}"
  local url="https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=90"
  if [ ! -f "$OUT/$filename" ]; then
    echo "Downloading: $filename"
    curl -fsSL "$url" -o "$OUT/$filename"
    sleep 0.5
  else
    echo "Skip (exists): $filename"
  fi
}

# Home hero rotation (2400px)
download "1645918899630-85e2f3132a84" "hero-sp-marginal.jpg"       2400
download "1689850543263-01a52ccc6943" "hero-santiago.jpg"           2400
download "1674681512510-e06db64f53fb" "hero-cdmx.jpg"              2400

# Page heroes (2400px)
download "1473341304170-971dccb5ac1e" "hero-advisory.jpg"          2400
download "1496564203457-11bb12075d90" "hero-development.jpg"       2400
download "1605379399843-5870eea9b74e" "hero-intelligence.jpg"      2400
download "1573164713988-8665fc963095" "hero-platforms.jpg"         2400
download "1620996148584-c3c8cf5a0788" "hero-team.jpg"              2400

# Home capability cards (1200px)
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
download "1745270917331-787c80129680" "card-adv-financial.jpg"       1200
download "1554168848-228452c09d60"    "card-adv-market-intel.jpg"    1200

# Development roles
download "1448630360428-65456885c650" "card-dev-codeveloper.jpg"        1200
download "1721244654392-9c912a6eb236" "card-dev-tech-advisor.jpg"       1200
download "1621264448270-9ef00e88a935" "card-dev-financial-partner.jpg"  1200

# Platforms product cards
download "1715026323215-a2dbb71272f6" "card-platform-site-selection.jpg" 1200
download "1596072215997-cac821d05b9c" "card-platform-grid-intel.jpg"     1200
download "1591696205602-2f950c417cb9" "card-platform-dc-financial.jpg"   1200
download "1639066648921-82d4500abf1a" "card-platform-testfit-pro.jpg"    1200

# Intelligence featured memo
download "1591075246923-76a081d21e25" "memo-intelligence-grid.jpg"   1200

echo ""
echo "Done. $(ls "$OUT"/*.jpg | wc -l | tr -d ' ') photos in $OUT/"
