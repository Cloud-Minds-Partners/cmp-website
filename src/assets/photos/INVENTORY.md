# Photo Inventory — src/assets/photos/

Single source of truth for all 27 mock-26 photos used in the CMP website.
Unsplash License: commercial use permitted, attribution optional.
Attribution stored here; credits page deferred to Phase 3 / v2.

| Filename | Mock-26 Role | Unsplash ID | Alt Text | Dimensions |
|----------|-------------|-------------|----------|------------|
| hero-sp-marginal.jpg | Home hero 1 — São Paulo | 1645918899630-85e2f3132a84 | São Paulo skyline — Marginal Pinheiros e Ponte Octávio Frias | 2400px |
| hero-santiago.jpg | Home hero 2 — Santiago | 1689850543263-01a52ccc6943 | Santiago skyline with Cordillera de los Andes | 2400px |
| hero-cdmx.jpg | Home hero 3 — CDMX | 1674681512510-e06db64f53fb | Mexico City — Paseo de la Reforma aerial view | 2400px |
| hero-advisory.jpg | Advisory page hero | 1473341304170-971dccb5ac1e | Transmission tower at sunset — orange sky | 2400px |
| hero-development.jpg | Development page hero | 1496564203457-11bb12075d90 | Aerial view of modern corporate campus | 2400px |
| hero-intelligence.jpg | Intelligence page hero | 1605379399843-5870eea9b74e | Warm-lit data center corridor | 2400px |
| hero-platforms.jpg | Platforms page hero | 1573164713988-8665fc963095 | Data center corridor with engineers | 2400px |
| hero-team.jpg | Team page hero | 1620996148584-c3c8cf5a0788 | São Paulo at night — aerial view | 2400px |
| card-home-site-selection.jpg | Home capabilities — Site Selection | 1669003153363-6d7ba8e20c7e | Industrial campus aerial — site and land selection | 1200px |
| card-home-grid-intel.jpg | Home capabilities — Grid Intelligence | 1554735231-2250c114a31d | Wide multi-tower power transmission spread | 1200px |
| card-home-dc-financial.jpg | Home capabilities — DC Financial | 1691643158804-d3f02eb456a3 | Growth chart on tablet — financial modeling | 1200px |
| card-home-testfit-pro.jpg | Home capabilities — Test Fit Pro | 1683322499436-f4383dd59f5a | Server rack with blue fiber cabling | 1200px |
| memo-home-grid-headroom.jpg | Home insight memo — Brazil 2028 grid headroom | 1413882353314-73389f63b6fd | Transmission tower silhouette against green sunset | 1200px |
| card-adv-site-selection.jpg | Advisory card — Site Selection | 1500382017468-9049fed747ef | Aerial farmland — site evaluation landscape | 1200px |
| card-adv-power-grid.jpg | Advisory card — Power & Grid | 1690780473941-f6a55a5fc420 | Single iconic high-voltage transmission tower | 1200px |
| card-adv-water-climate.jpg | Advisory card — Water & Climate | 1497436072909-60f360e1d4b1 | Aerial coastal and water infrastructure | 1200px |
| card-adv-regulatory.jpg | Advisory card — Regulatory & Tax | 1497435334941-8c899ee9e8e9 | Architectural blueprints — regulatory planning | 1200px |
| card-adv-financial.jpg | Advisory card — Financial Structuring | 1745270917331-787c80129680 | Stock chart on tablet — financial structuring | 1200px |
| card-adv-market-intel.jpg | Advisory card — Market Intelligence | 1554168848-228452c09d60 | São Paulo skyline — market intelligence | 1200px |
| card-dev-codeveloper.jpg | Development role — Co-developer | 1448630360428-65456885c650 | Modern office façade — collaborative development | 1200px |
| card-dev-tech-advisor.jpg | Development role — Technical Advisor | 1721244654392-9c912a6eb236 | Blueprint sheet — technical advisory | 1200px |
| card-dev-financial-partner.jpg | Development role — Financial Partner | 1621264448270-9ef00e88a935 | Trading multi-screen station — financial partnership | 1200px |
| card-platform-site-selection.jpg | Platforms — Site Selection product | 1715026323215-a2dbb71272f6 | Hyperscale data center exterior aerial | 1200px |
| card-platform-grid-intel.jpg | Platforms — Grid Intelligence product | 1596072215997-cac821d05b9c | Transmission tower in daylight | 1200px |
| card-platform-dc-financial.jpg | Platforms — DC Financial product | 1591696205602-2f950c417cb9 | Stocks chart on screen | 1200px |
| card-platform-testfit-pro.jpg | Platforms — Test Fit Pro product | 1639066648921-82d4500abf1a | Green LED server stacks | 1200px |
| memo-intelligence-grid.jpg | Intelligence featured memo — Brazil 2028 grid | 1591075246923-76a081d21e25 | Transmission tower black and white | 1200px |

## Notes

- Total: 27 unique files. The plan's must_haves.truths referenced "26" in error — the files_modified list and IMAGES.md both enumerate 27 distinct filenames.
- `card-home-testfit-pro.jpg` and `card-platform-testfit-pro.jpg` are intentionally different photos (both R02 role in mock-26, used in different contexts).
- Heroes downloaded at 2400px wide; all cards/memos at 1200px wide.
- Astro `<Image>` converts to WebP + emits responsive srcset at build time — originals are not served directly.

## cmp-knowledge availability note

`src/content.config.ts` loads content from `../cmp-knowledge/`. If that repo is not cloned as a sibling, the build will succeed but content collections will be empty (no error thrown). This is a known Phase 1 constraint documented in CONCERNS.md §Pitfall 5.
