# Phase 3: Pages — Research

**Researched:** 2026-05-17
**Domain:** Astro 6 page composition, i18n routing, content collection index/detail patterns, LangSwitcher active state, locale-aware filtering
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Page composition strategy:**
- Each page = Astro `.astro` file in `src/pages/`, imports Phase 2 components, passes props
- Every page renders `<SEO slot="head" ... />` with page-specific title/description/og/canonical
- Hero variant per page: home uses `variant="home"` (3-slide rotation, 24s), all others use `variant="page"` with single bg + Ken Burns 18s
- CapabilityCard grids composed inline per page; props from i18n string keys
- Content lives in `src/i18n/{en,pt,es}.json` — page copy keys per page
- Photo imports are explicit `import` statements from `src/assets/photos/`, filenames validated against INVENTORY.md

**Content collection routes (CONT-02..07):**
- Index pages render from collection content with language filter + EN fallback
- Empty state renders i18n key (e.g. `common.empty-memos`) inside styled card — no hardcoded strings
- Detail pages at `[slug].astro` use respective layout (MemoLayout, RadarLayout, RegwatchLayout)
- Detail pages emit Article JSON-LD via SEO component
- Locale-prefixed routes auto-handled by Astro i18n fallbackType: 'rewrite'

**i18n routing depth:**
- I18N-03: LangSwitcher correctness verified via Playwright on multiple paths
- I18N-04: hreflang already emitted by SEO component (Phase 2); extend verification to all 7 pages
- I18N-05: home page (`/`, `/pt/`, `/es/`) renders fully localized copy from i18n JSON keys; other pages fall back to EN with a `<LocaleBanner />` (new small component for this phase)

**Replace v4 Crusoe pages:**
- REPLACE content of existing pages, not delete-and-recreate
- `newsletter.astro` — delete (newsletter is inline section within home)
- `platforms/[slug].astro` — redirect to `/#platforms-<slug>` anchor
- `image-pipeline-test.astro` — DELETE (real pages now import photos)
- `dev/components.astro` — KEEP (env-guarded)

**Image pipeline scaffolding removal:**
- `src/pages/image-pipeline-test.astro` deleted in Phase 3

**Translated copy scope:**
- EN: all 7 pages + 3 collection indexes fully populated
- PT: home page only (I18N-05 minimum bar); others get EN with fallback banner
- ES: home page only; same pattern
- First-pass PT/ES home copy written in this phase, flagged for Edgard review

**Page-level photos (from INVENTORY.md):**
- Home heros (3-rotation): `hero-sp-marginal.jpg` · `hero-santiago.jpg` · `hero-cdmx.jpg`
- Advisory hero: `hero-advisory.jpg`
- Development hero: `hero-development.jpg`
- Intelligence hero: `hero-intelligence.jpg`
- Platforms hero: `hero-platforms.jpg`
- Team hero: `hero-team.jpg`
- Card photos: per INVENTORY.md role mapping

### Claude's Discretion

- Internal section composition order on each page (follow mock-26 HTML structure verbatim)
- Exact i18n key naming (convention: `<page>.<section>.<element>`)
- Component prop signatures finalized in Phase 2 — Phase 3 only consumes
- Mobile breakpoints inherit from Phase 2 components
- Whether `newsletter.astro` redirects or is deleted — delete (cleanest)
- Wave structure: Wave 0 spec stubs → Wave 1 EN pages parallel → Wave 2 collection routes + LocaleBanner → Wave 3 PT+ES home + cleanup

### Deferred Ideas (OUT OF SCOPE)

- PT/ES translated copy beyond home — V2-CONT-03
- Real memo/radar/regwatch publishing — V2-CONT-01 / V2-CONT-02
- OG image PNGs generated per page — Phase 4 (SEO-02)
- Lighthouse audits — Phase 4
- Sitemap generation — Phase 4 (SEO-05)
- Accessibility audit — Phase 4 (A11Y-*)
- Contact form backend — out of scope (mailto: fallback acceptable)
- Translations for non-home pages — V2
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAGE-01 | Home page — 3-city hero rotation, capabilities (4 cards), insight memo highlight, stats, team teaser, newsletter | Mock-26 index.html section map extracted; Hero `variant="home"` props confirmed; CapabilityCard prop interface confirmed |
| PAGE-02 | Advisory page — hero, 6 capability cards | Mock-26 advisory.html section map + 4-section extension (figures, capabilities, engagement model, CTA) extracted |
| PAGE-03 | Development page — hero, 3 roles section | Mock-26 development.html: roles grid + lifecycle track patterns extracted |
| PAGE-04 | Intelligence page — hero, featured memo, 3 subsection links | Mock-26 intelligence.html: streams tabs + featured memo + memos archive patterns extracted |
| PAGE-05 | Platforms page — hero, 4 product cards | Mock-26 platforms.html: alternating split layout pattern extracted |
| PAGE-06 | Team page — hero, real bios from cmp-knowledge people collection | Mock-26 team.html: partner-grid (cream) + bench-grid (navy) patterns; people content via `getCollection('people')` |
| PAGE-07 | Contact page — email, WhatsApp, LinkedIn, simple form | No mock-26 source; minimal design defined in CONTEXT.md |
| CONT-02 | Memos index page — collection list + graceful empty state | Existing page analyzed; language-filter pattern documented; empty state key `common.empty-memos` confirmed |
| CONT-03 | Memo detail page — MemoLayout + Article JSON-LD | MemoLayout current state analyzed; 3 changes needed (SEO slot, Article JSON-LD, locale-aware back link) |
| CONT-04 | Radar index page — preserves existing 1 entry, list view | Radar collection: 6 entries in cmp-knowledge, `published: false` is the gate; need to flip gate to render |
| CONT-05 | Radar detail page — RadarLayout | RadarLayout analyzed; same 3 changes as MemoLayout |
| CONT-06 | Regwatch index page — handles empty collection | Same pattern as memos; `common.empty-regwatch` key exists |
| CONT-07 | Regwatch detail page — RegwatchLayout | RegwatchLayout analyzed; same changes needed |
| I18N-03 | LangSwitcher correctness — clicking PT on /team routes to /pt/team | LangSwitcher uses `getRelativeLocaleUrl` with barePath stripping; already correct; active state missing from nav links |
| I18N-04 | hreflang on every page | SEO component already emits hreflang via `getAbsoluteLocaleUrl`; need to verify on collection routes |
| I18N-05 | Home page translated copy in PT and ES | i18n JSONs currently identical across EN/PT/ES for home keys; Phase 3 populates PT+ES translations |
</phase_requirements>

---

## Summary

Phase 3 is a composition phase: the component library from Phase 2 is wired into 7 canonical pages and 6 collection routes. The substrate is solid — Astro 6 i18n routing is configured (`fallbackType: 'rewrite'`, `prefixDefaultLocale: false`), the SEO component already emits hreflang, and the LangSwitcher correctly computes locale-prefixed URLs via `getRelativeLocaleUrl`. The Hero and CapabilityCard components are fully implemented with correct prop interfaces.

Three significant issues to resolve during implementation: (1) SiteHeader has no active nav state — `nav-link` links get no `.active` class for the current page; (2) the three content layouts (MemoLayout, RadarLayout, RegwatchLayout) still use `<Base>` directly rather than going through `<SEO slot="head">`, and their "back to index" hrefs are locale-unaware; (3) the radar collection has 6 real entries but none are rendered because `published: false` is the schema default and none have been flipped.

The PT and ES i18n JSON files are currently carbon copies of the EN file — every home key is in English. Phase 3 must populate the translated values for PT and ES home keys, and build the `<LocaleBanner>` component to appear on non-home pages served under `/pt/` and `/es/` via EN fallback rewrite.

**Primary recommendation:** Follow the 4-wave structure. Wave 0 plants Playwright spec stubs and deletes scaffolding files. Wave 1 builds all 7 EN pages in parallel (pages are independent). Wave 2 wires collection routes and builds LocaleBanner. Wave 3 writes PT+ES home translations and implements SiteHeader active state.

---

## Standard Stack

### Core (already installed — no new installs needed for Phase 3)

| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| Astro | 6.1.7 | SSG framework, i18n routing, content collections | Configured in astro.config.mjs |
| `astro:content` | built-in | `getCollection()`, collection filtering | Schema has `language` field already |
| `astro:i18n` | built-in | `getRelativeLocaleUrl`, `getAbsoluteLocaleUrl`, `Astro.currentLocale` | Used by LangSwitcher + SEO |
| Tailwind CSS | 4.2.2 | Utilities | Via @tailwindcss/vite |
| Playwright | (GH Actions / dev) | E2E validation | See Validation Architecture |

### Phase 2 Components Phase 3 Consumes

| Component | Import Path | Used By |
|-----------|------------|---------|
| `Base` | `../layouts/Base.astro` | Every page (via layout chain) |
| `SEO` | `../components/SEO.astro` | Every page — `slot="head"` |
| `SiteHeader` | `../components/SiteHeader.astro` | Every page |
| `SiteFooter` | `../components/SiteFooter.astro` | Every page |
| `Hero` | `../components/Hero.astro` | All 7 pages |
| `CapabilityCard` | `../components/CapabilityCard.astro` | Home (4), Advisory (6), Platforms (4) |
| `NewsletterSubscribe` | `../components/NewsletterSubscribe.astro` | Home |
| `LangSwitcher` | `../components/LangSwitcher.astro` | Already in SiteHeader |
| `WhatsAppFab` | `../components/WhatsAppFab.astro` | Already in Base layout |

### New Component (Phase 3)

| Component | Purpose | Size |
|-----------|---------|------|
| `LocaleBanner` | Subtle top-of-page banner when EN content served under PT/ES URL | Small — ~30 lines |

---

## Mock-26 Page Section Maps (canonical)

### Home (index.html) — Section Order

1. **`<header class="home-hero">`** — 3-slide rotation (SP/Santiago/CDMX) with progress tracks, blue dot grid texture, overlay gradients. Content: h1 + subhead + 2 action buttons
2. **`<section class="stats">`** — near-black background, 4-column grid: `76 cities / 251 sites / 508 studies / +18 GW`
3. **`<section class="capabilities on-cream" id="platforms">`** — cream bg, section-eyebrow "Platforms", h2, 2x2 cap-grid with 4 CapabilityCards (Site Selection / Grid Intelligence / DC Financial Model / Test Fit Pro), each links to platforms.html
4. **`<section class="principles on-cream">`** — cream bg, section-eyebrow "How we work", h2, 3-col principles grid (Primary sources only / Partners on every call / Audited before delivery)
5. **`<section class="insight" id="intelligence">`** — pure black bg, insight-inner grid (image left, text right), featured memo with stat overlay, insight-cta
6. **`<footer>`** — standard 5-col footer

**CONTEXT.md discrepancy note:** CONTEXT.md lists "Team teaser" and "Newsletter section" in the home section map but mock-26/index.html does NOT contain them — the mock has Principles and Insight sections instead. The newsletter is not present in mock-26/index.html. Phase 3 should follow mock-26 verbatim; newsletter should be included as a section below insights (it is part of the locked decision as an inline embed). The team teaser is also absent from mock-26 — omit until confirmed by Edgard or keep as an optional extension after mock-26 content. **Recommendation:** Build mock-26 verbatim (hero → stats → capabilities/platforms → principles → insight/featured-memo → newsletter → footer). The newsletter section adds below insight since that is the locked decision.

### Advisory (advisory.html) — Section Order

1. **`<header class="page-hero">`** — hero-advisory.jpg bg, eyebrow "Advisory", h1, subhead
2. **`<section class="sec-near">`** — near-black bg, 4-col figures strip: `76 Cities / 30+ Engagements / 1B+ USD informed / 3 Markets`
3. **`<section class="sec-cream sec-pad on-cream">`** — cream bg, eyebrow "Capabilities", h2 "Six lenses. One picture.", 2x3 cap-grid with 6 CapabilityCards (Site selection / Power & grid / Water & climate / Regulatory & tax / Financial structuring / Market intelligence)
4. **`<section class="sec-navy sec-pad">`** — navy bg, eyebrow "Engagement", h2 "Four phases. One owner.", 4-step model timeline (Thesis 3-4wk / Shortlist 6-10wk / Diligence 4-8wk / Close Variable)
5. **`<section class="sec-cream sec-pad-sm on-cream">`** — cream CTA bar: h2 "Bring a thesis. We'll pressure-test it.", 2 buttons (Engage advisory / Read a memo)
6. **`<footer>`** — standard

**Photos used:** card-adv-site-selection.jpg / card-adv-power-grid.jpg / card-adv-water-climate.jpg / card-adv-regulatory.jpg / card-adv-financial.jpg / card-adv-market-intel.jpg

### Development (development.html) — Section Order

1. **`<header class="page-hero">`** — hero-development.jpg bg, eyebrow "Development", h1, subhead
2. **`<section class="roles on-cream">`** — cream bg, eyebrow "Roles", h2 "Three ways we sit on the cap table.", 3-col roles-grid (Co-developer 01-Equity / Technical advisor 02-Fee-based / Financial partner 03-Capital)
3. **`<section class="lifecycle">`** — navy bg, eyebrow "Lifecycle", h2 "Kickoff to commissioning.", 4-phase lifecycle-track strip (Pre-site / Engineering & permits / Construction / Operate & iterate)
4. **`<footer>`** — standard

**Photos used:** card-dev-codeveloper.jpg / card-dev-tech-advisor.jpg / card-dev-financial-partner.jpg

**Implementation note:** The `.roles-grid` and `.role-card` are custom patterns not directly mapping to CapabilityCard. Phase 3 should render these inline in development.astro using the same CSS class names from site.css, or create a `RoleCard` inline variant. Given no new components in Phase 3, use a scoped `<style>` block in development.astro mirroring the mock-26 CSS.

### Intelligence (intelligence.html) — Section Order

1. **`<header class="page-hero">`** — hero-intelligence.jpg bg, eyebrow "Intelligence", h1, subhead
2. **`<div class="streams">`** — sticky sub-tab bar (Technical Memos / Innovation Radar / Regulatory Watch / Weekly Pulse) with count badges — these link to `#memos / #radar / #regwatch / #pulse` anchors OR to collection index pages
3. **`<section class="featured" id="memos">`** — cream bg, 2-col grid: featured memo image (memo-intelligence-grid.jpg) + text (eyebrow, h3, meta, CTA "Read memo")
4. **`<section class="memos">`** — navy bg, memo archive list (6 entries in mock with num/date/title/tag/meta columns), links to detail pages

**Implementation note:** The intelligence index page replaces the current v4 version which has no mock-26 resemblance. The "memos" list section renders from `getCollection('memos')` filtered by language. The "streams" tabs should link to the collection index pages (`/intelligence/memos/`, `/intelligence/radar/`, `/intelligence/regwatch/`) not anchors, since they are separate routes.

### Platforms (platforms.html) — Section Order

1. **`<header class="page-hero">`** — hero-platforms.jpg bg, eyebrow "Platforms", h1, subhead
2. **`<section class="products">`** — 4 products in alternating split layout (info panel + visual panel), alternating dark/cream backgrounds. Each product: full-width 50/50 grid, info centered, visual has Ken Burns photo
   - Product 1 (navy-left): 01 Site Selection — card-platform-site-selection.jpg
   - Product 2 (cream-left, photo-left): 02 Grid Intelligence — card-platform-grid-intel.jpg
   - Product 3 (navy-left): 03 DC Financial Model — card-platform-dc-financial.jpg
   - Product 4 (cream-left, photo-left): 04 Test Fit Pro — card-platform-testfit-pro.jpg
3. **`<footer>`** — standard

**Implementation note:** Platforms page uses a unique alternating layout not covered by CapabilityCard. Implement with scoped CSS in platforms.astro matching mock-26's `.product` / `.product-info` / `.product-visual` pattern. Even-numbered products swap order (photo left, info right) via CSS `order` property.

### Team (team.html) — Section Order

1. **`<header class="page-hero">`** — hero-team.jpg bg, eyebrow "Team", h1, subhead
2. **`<section class="leadership on-cream">`** — cream bg, eyebrow "Partners", h2 "Forty years of LatAm infrastructure.", 2-col partner-grid with circular avatars + name + role + bio + meta
3. **`<section class="bench">`** — navy bg, eyebrow "Bench", h2 "Senior advisors. One call away.", 3-col bench-grid with small circular photos + domain + name + credit + city tag
4. **`<footer>`** — standard

**Data source:** People from `getCollection('people')` — split by role: partners (Edgard, Gustavo) and advisors (João Carlos, Rodrigo, Sérgio). Filter `partners/` vs `advisors/` by path in the id field.

**Photos:** People photos are in `public/people/photos/` (copied from cmp-knowledge at build time), referenced as regular `<img>` tags (NOT `<Image>`) since they live in `public/` not `src/assets/`.

### Contact (no mock-26 source) — Design Recommendation

```
1. page-hero (hero-intelligence.jpg reused or hero-team.jpg) — eyebrow "Contact", h1 "Let's talk.", subhead
2. 3-col contact options (cream section):
   - Email: info@cloudmindspartners.com (primary)
   - WhatsApp: wa.me link with number from env
   - LinkedIn: company page
3. Inquiry form (navy section): name + company + email + message textarea + submit
   - Posts to existing inquiry handler OR mailto: fallback
   - No backend required in Phase 3
4. footer
```

---

## Architecture Patterns

### Locale-Aware Collection Filtering

**Pattern for collection index pages:**

```typescript
// Source: Astro docs — getCollection with filter function
import { getCollection } from 'astro:content';

const currentLocale = Astro.currentLocale ?? 'en';

// Filter by language field, fall back to EN entries if no locale-specific content
const allMemos = await getCollection('memos', (m) => m.data.publish);
const localeMemos = allMemos.filter((m) => m.data.language === currentLocale);
const memos = localeMemos.length > 0
  ? localeMemos.sort((a, b) => b.data.created.valueOf() - a.data.created.valueOf())
  : allMemos.sort((a, b) => b.data.created.valueOf() - a.data.created.valueOf());

// When falling back to EN under a PT/ES URL, show the LocaleBanner
const showFallbackBanner = localeMemos.length === 0 && currentLocale !== 'en';
```

**Edge cases:**
- 0 PT entries + PT URL → render EN list + `<LocaleBanner />` (controlled via `showFallbackBanner` flag)
- 0 entries in any language → render styled empty card with i18n key text
- `language` field defaults to `'en'` in schema, so existing entries without explicit language will correctly appear in EN locale

### Radar Collection Gate

The 6 radar entries in cmp-knowledge all have `published: false` (schema default). Phase 3 must flip at least 1 to `published: true` to populate CONT-04. The simplest approach: during Wave 2 implementation, patch `2026-W20.md` to add `published: true` in frontmatter. Do NOT bulk-flip all 6 without Edgard approval.

**Radar slug structure:** The `[week].astro` route uses `entry.data.week ?? entry.id`. The entry id from the glob loader is the filename without extension (e.g. `2026-W20`). The week field value (e.g. `"2026-W20"`) matches the filename. URLs resolve to `/intelligence/radar/2026-W20`.

### SiteHeader Active Nav State

**Current state:** SiteHeader has no active class on nav-link elements. Comment in code says "i18n Phase 3 adds t() calls". The `active` prop in the existing layouts (e.g. `SiteHeader active="intelligence"`) is accepted in the Props interface but not used.

**Best pattern — auto-detect inside SiteHeader using `Astro.url.pathname`:**

```typescript
// In SiteHeader.astro frontmatter
const currentPath = Astro.url.pathname;

// Strip locale prefix for matching
const barePath = currentPath.replace(/^\/(pt|es)(\/|$)/, '/');

// Determine active link — match if barePath starts with link href
const isActive = (href: string) => {
  if (href === '/') return barePath === '/';
  return barePath.startsWith(href);
};
```

Then in the template:
```astro
<a
  href={link.href}
  class={`nav-link${isActive(link.href) ? ' active' : ''}`}
  aria-current={isActive(link.href) ? 'page' : undefined}
>{link.label}</a>
```

Add `.nav-link.active` CSS:
```css
.nav-link.active {
  color: var(--color-cream-0);
}
.nav-link.active::after {
  right: 0; /* show underline permanently when active */
}
```

**Recommendation:** Auto-detect (no prop needed). Remove the now-unused `active?: string` prop from Props to avoid confusion.

### LocaleBanner Component

New small component for Phase 3:

```astro
---
// src/components/LocaleBanner.astro
import { useTranslations } from '../i18n/utils';
const t = useTranslations(Astro.currentLocale ?? 'en');
---
<div class="locale-banner" role="status">
  {t('common.fallback-banner')}
</div>
<style>
  .locale-banner {
    background: rgba(45, 107, 228, 0.08);
    border-bottom: 1px solid rgba(45, 107, 228, 0.18);
    padding: 10px clamp(28px, 4vw, 64px);
    font-size: 13px;
    color: var(--color-cream-2);
    text-align: center;
  }
</style>
```

The `common.fallback-banner` key already exists in all 3 JSON files: `"Translated version coming soon. Showing English content."` — needs PT/ES translation in Phase 3.

### Layout Updates Required (MemoLayout / RadarLayout / RegwatchLayout)

All three layouts have the same issue: they use `<Base title=... description=...>` pattern rather than routing SEO through the `<SEO slot="head">` pattern established in Phase 2. They also have locale-unaware back-links.

**Changes needed per layout:**

| Layout | Change 1 | Change 2 | Change 3 |
|--------|---------|---------|---------|
| MemoLayout | Replace `<Base title=...>` with `<Base>` + `<SEO slot="head" type="article" ... />` | Change `href="/intelligence/memos"` to `href={getRelativeLocaleUrl(locale, 'intelligence/memos')}` | Add Article JSON-LD via SEO `slot="json-ld"` |
| RadarLayout | Same SEO slot pattern | Change `href="/intelligence/radar"` to locale-aware | Add Article JSON-LD |
| RegwatchLayout | Same SEO slot pattern | Change `href="/intelligence/regwatch"` to locale-aware | Add Article JSON-LD |

**Article JSON-LD pattern:**
```astro
---
// In detail page [slug].astro, pass to layout via slot
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  author: { '@type': 'Person', name: author },
  datePublished: created.toISOString(),
  dateModified: updated.toISOString(),
  publisher: { '@type': 'Organization', name: 'Cloud Minds Partners' },
};
---
<SEO slot="head" type="article" title={...} description={...}>
  <script slot="json-ld" type="application/ld+json" set:html={JSON.stringify(articleSchema)} />
</SEO>
```

Wait — SEO component does not forward inner slots. Simpler: pass `articleSchema` as a prop or use a named slot override. Looking at SEO.astro: it has `<slot name="json-ld">` with the Organization schema as the default. Detail pages can override this by passing their Article schema as `slot="json-ld"`:

```astro
<SEO slot="head" type="article" title={...} description={...} />
<script slot="json-ld" type="application/ld+json" set:html={JSON.stringify(articleSchema)} />
```

This does not work because `slot="json-ld"` would need to be inside the SEO component call. The cleanest solution: add an `articleSchema?` prop to SEO component that overrides the default JSON-LD when present. This is a minor SEO component extension (single optional prop).

### i18n Routing Edge Case: fallbackType: 'rewrite'

**Configuration confirmed in astro.config.mjs:**
```js
routing: { prefixDefaultLocale: false, fallbackType: 'rewrite' },
fallback: { pt: 'en', es: 'en' },
```

**Behavior with `fallbackType: 'rewrite'`:** When `/pt/team` is requested and no PT-specific `pt/team.astro` page exists, Astro serves the EN content AT the URL `/pt/team` (the URL is preserved as `/pt/team`, not rewritten to `/team`). This means:
- `Astro.url.pathname` will be `/pt/team`
- `Astro.currentLocale` will be `'pt'`
- The SEO component's canonical will point to `/pt/team`
- hreflang will correctly list `/pt/team` as the PT alternate

This is correct for SEO. The LangSwitcher will already correctly generate `/pt/team` from EN `/team` via `getRelativeLocaleUrl('pt', 'team')`.

**Implication for LocaleBanner:** Since `Astro.currentLocale === 'pt'` even on a rewritten page, the banner trigger condition is simply `currentLocale !== 'en'` — no need to detect rewrite vs native PT page.

**Critical: PT/ES locale pages that DO exist:** `src/pages/pt/index.astro` and `src/pages/es/index.astro` exist as stub files from Phase 1. Phase 3 replaces these with real home translations.

### Empty Collection Graceful Handling

```astro
---
const memos = await getCollection('memos', (m) => m.data.publish);
const t = useTranslations(currentLocale);
---
{memos.length === 0 ? (
  <div class="empty-card">
    <p>{t('common.empty-memos')}</p>
  </div>
) : (
  <div class="memo-list">
    {memos.map(memo => ...)}
  </div>
)}
```

The `common.empty-memos` key exists in all three JSON files. For regwatch: `common.empty-regwatch`. These keys need PT/ES translations in Phase 3.

### newsletter.astro Handling

Decision: delete the file (per CONTEXT.md — cleanest approach). The newsletter form is inline in the home page. If Firebase Hosting has a redirect from `/newsletter` cached, that is irrelevant since this is a static site rebuild.

### platforms/[slug].astro Redirect

```astro
---
// src/pages/platforms/[slug].astro
export function getStaticPaths() {
  return [
    { params: { slug: 'site-selection' } },
    { params: { slug: 'grid-intelligence' } },
    { params: { slug: 'dc-financial' } },
    { params: { slug: 'test-fit-pro' } },
  ];
}
const { slug } = Astro.params;
return Astro.redirect(`/platforms#platforms-${slug}`, 301);
---
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale URL generation | Custom string concat | `getRelativeLocaleUrl(locale, path)` from `astro:i18n` | Handles all edge cases (trailing slash, default locale prefix) |
| Locale detection | Parse URL manually | `Astro.currentLocale` | Set by Astro i18n middleware, always correct |
| hreflang generation | Build `<link>` tags manually | Already in SEO.astro via `getAbsoluteLocaleUrl` | Already done in Phase 2 |
| Image optimization | Manual `<picture>` with WebP | `<Image>` from `astro:assets` | Auto-generates WebP + srcset + lazy loading |
| Content filtering | Custom file system reads | `getCollection()` with filter fn | Type-safe, build-time |
| Static path generation | Manual route listing | `getStaticPaths()` returning collection entries | Astro pattern for dynamic routes |

---

## Common Pitfalls

### Pitfall 1: Importing People Photos as ImageMetadata

**What goes wrong:** People photos live in `public/people/photos/*.jpg` (copied from cmp-knowledge at build time). Attempting to `import` them via `import photo from '../assets/...'` will fail because they are in `public/`, not `src/assets/`.

**How to avoid:** Reference people photos as plain URL strings: `<img src="/people/photos/edgard-abreu.jpg" />`. Do NOT use Astro `<Image>` for these — Astro `<Image>` only works with local imports from `src/` or remote URLs.

**Warning signs:** TypeScript error "Cannot find module '../../public/people/photos/...' or its corresponding type declarations"

### Pitfall 2: Radar published Gate

**What goes wrong:** `getCollection('radar', (r) => r.data.published)` returns 0 entries even though 6 entries exist in cmp-knowledge, because all have `published: false` (schema default).

**How to avoid:** Flip `published: true` on `2026-W20.md` (the most recent, most complete entry) in cmp-knowledge before implementing CONT-04. This is a one-line frontmatter change.

**Warning signs:** Radar index page shows empty state despite files existing in cmp-knowledge.

### Pitfall 3: Locale Prefix in Active Nav Detection

**What goes wrong:** `Astro.url.pathname` on `/pt/advisory` will be `/pt/advisory`. If you match `href="/advisory"` against it with `startsWith`, it fails because of the `/pt/` prefix.

**How to avoid:** Strip the locale prefix before matching:
```typescript
const barePath = Astro.url.pathname.replace(/^\/(pt|es)(\/|$)/, '/');
const isActive = (href: string) => href === '/' ? barePath === '/' : barePath.startsWith(href);
```

### Pitfall 4: Collection Detail Page Slug vs ID

**What goes wrong:** Radar entries use `entry.id` (filename without extension, e.g. `2026-W20`) as the identifier. The Zod schema has `week` field (e.g. `"2026-W20"`) which matches the id but is optional. Linking to `entry.data.week ?? entry.id` is correct, but the static path must use the same value.

**How to avoid:** In `getStaticPaths()`:
```typescript
return entries.map(e => ({ params: { week: e.data.week ?? e.id }, props: { entry: e } }));
```

### Pitfall 5: i18n JSON Not Updated for New Keys

**What goes wrong:** Adding a new key to `en.json` but forgetting to add the same key to `pt.json` and `es.json` causes `useTranslations` to return `undefined`, which renders as blank in the UI.

**How to avoid:** All three JSON files must be updated simultaneously when adding new keys. For Phase 3, all new page-level keys get EN values and PT/ES DRAFT values.

### Pitfall 6: SEO Component slot="head" in Base Layout

**What goes wrong:** `<SEO slot="head" ... />` must be inside a page that uses `<Base>` as its root, because Base defines `<slot name="head" />`. If a layout (e.g. MemoLayout) wraps Base, it must pass the SEO through or handle it directly.

**How to avoid:** Detail pages (`[slug].astro`) should use the layout but pass SEO props: each layout gets an updated interface accepting title/description/type and renders `<SEO slot="head" ... />` inside `<Base>`. The Base layout's `<slot name="head" />` picks it up.

### Pitfall 7: Hero component `image` prop type

**What goes wrong:** The Hero `variant="page"` accepts `image?: ImageMetadata | string`. When passing a local import (`import heroImg from '../assets/photos/hero-advisory.jpg'`), the type is `ImageMetadata`. When passing a string URL, the `<Image>` rendering `src={image as ImageMetadata}` would fail type-check.

**How to avoid:** Always use `import heroImg from '../../assets/photos/hero-advisory.jpg'` (relative path) and pass the imported variable. Never pass a string URL for page heroes.

---

## Code Examples

### Page Scaffold Pattern (every page)

```astro
---
// src/pages/advisory.astro
import Base from '../layouts/Base.astro';
import SEO from '../components/SEO.astro';
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';
import Hero from '../components/Hero.astro';
import CapabilityCard from '../components/CapabilityCard.astro';

import heroAdvisory from '../assets/photos/hero-advisory.jpg';
import cardSiteSelection from '../assets/photos/card-adv-site-selection.jpg';
// ... more card imports

const { currentLocale } = Astro; // from Astro.currentLocale
import { useTranslations } from '../i18n/utils';
const t = useTranslations(currentLocale ?? 'en');
---
<Base lang={currentLocale ?? 'en'}>
  <SEO slot="head"
    title={t('advisory.meta.title')}
    description={t('advisory.meta.description')}
    lang={currentLocale}
  />
  <SiteHeader />

  <Hero
    variant="page"
    image={heroAdvisory}
    eyebrow={t('nav.advisory')}
    live
    heading={t('advisory.hero.heading')}
    subheading={t('advisory.hero.subhead')}
  />

  <!-- ... sections -->

  <SiteFooter />
</Base>
```

### Home Hero with 3-Slide Rotation

```astro
---
import heroSp from '../assets/photos/hero-sp-marginal.jpg';
import heroSantiago from '../assets/photos/hero-santiago.jpg';
import heroCdmx from '../assets/photos/hero-cdmx.jpg';
---
<Hero
  variant="home"
  slides={[
    { src: heroSp, alt: 'São Paulo skyline — Marginal Pinheiros' },
    { src: heroSantiago, alt: 'Santiago skyline with Cordillera' },
    { src: heroCdmx, alt: 'Mexico City — Paseo de la Reforma' },
  ]}
  heading={t('home.hero.headline')}
  subheading={t('home.hero.subhead')}
  actions={[
    { label: t('home.hero.cta-primary'), href: 'mailto:info@cloudmindspartners.com', variant: 'primary' },
    { label: t('home.hero.cta-secondary'), href: '/platforms', variant: 'outline' },
  ]}
/>
```

### Collection Index with Language Filter and Empty State

```astro
---
import { getCollection } from 'astro:content';
import { useTranslations } from '../../i18n/utils';
import LocaleBanner from '../../components/LocaleBanner.astro';

const locale = Astro.currentLocale ?? 'en';
const t = useTranslations(locale);

const allMemos = await getCollection('memos', (m) => m.data.publish);
const localeMemos = allMemos.filter((m) => m.data.language === locale);
const memos = (localeMemos.length > 0 ? localeMemos : allMemos)
  .sort((a, b) => b.data.created.valueOf() - a.data.created.valueOf());

const showFallbackBanner = localeMemos.length === 0 && locale !== 'en';
---
{showFallbackBanner && <LocaleBanner />}
{memos.length === 0 ? (
  <div class="empty-state">
    <p>{t('common.empty-memos')}</p>
  </div>
) : (
  <div class="memo-list">
    {memos.map(memo => (
      <a href={`/intelligence/memos/${memo.data.slug}`}>{memo.data.title}</a>
    ))}
  </div>
)}
```

### SiteHeader Active Nav State (auto-detect)

```astro
---
// Addition to SiteHeader.astro frontmatter
const currentPath = Astro.url.pathname;
const barePath = currentPath.replace(/^\/(pt|es)(\/|$)/, '/');
const isActive = (href: string): boolean => {
  if (href === '/') return barePath === '/';
  return barePath.startsWith(href);
};
---
<!-- In nav links map -->
<a
  href={link.href}
  class:list={['nav-link', { active: isActive(link.href) }]}
  aria-current={isActive(link.href) ? 'page' : undefined}
>{link.label}</a>
```

### Radar getStaticPaths (handles both id and week field)

```astro
---
// src/pages/intelligence/radar/[week].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const entries = await getCollection('radar', (r) => r.data.published);
  return entries.map(entry => ({
    params: { week: entry.data.week ?? entry.id },
    props: { entry },
  }));
}
---
```

---

## PT/ES First-Pass Translations

All values below are DRAFT — Edgard must review and approve before deploying. Keys to be added to `src/i18n/pt.json` and `src/i18n/es.json`.

### Home Page Copy

| Key | EN | PT (DRAFT) | ES (DRAFT) |
|-----|----|-----------|-----------|
| `home.hero.headline` | The LatAm Data Center Intelligence Firm | Inteligência em Data Centers para a América Latina | La firma de inteligencia en centros de datos de América Latina |
| `home.hero.subhead` | We help investors and developers navigate Latin America's data center market with proprietary intelligence, advisory services, and purpose-built platforms. | Ajudamos investidores e desenvolvedores a navegar no mercado de data centers da América Latina com inteligência proprietária, serviços de consultoria e plataformas especializadas. | Ayudamos a inversores y desarrolladores a navegar el mercado de centros de datos de América Latina con inteligencia propia, servicios de asesoría y plataformas especializadas. |
| `home.hero.cta-primary` | Engage advisory | Falar com a equipe | Contactar equipo |
| `home.hero.cta-secondary` | Open the platforms | Ver plataformas | Ver plataformas |
| `home.capabilities.heading` | Our Capabilities | Nossas Capacidades | Nuestras Capacidades |
| `home.capabilities.eyebrow` | Platforms | Plataformas | Plataformas |
| `home.capabilities.subhead` | Four tools. In production. | Quatro ferramentas. Em produção. | Cuatro herramientas. En producción. |
| `home.capabilities.subhead-detail` | Built for our advisory. Available to clients. Live data — not a slide deck. | Construídas para nossa consultoria. Disponíveis aos clientes. Dados ao vivo — não uma apresentação. | Construidas para nuestra asesoría. Disponibles a clientes. Datos en tiempo real — no una presentación. |
| `home.card.site-selection.num` | 01 — Site | 01 — Site | 01 — Sitio |
| `home.card.site-selection.title` | Site Selection | Seleção de Sites | Selección de Sitios |
| `home.card.site-selection.desc` | Score LatAm cities by land, grid, water and fiscal. | Avalie cidades da América Latina por terreno, rede elétrica, água e incentivos fiscais. | Evalúe ciudades de América Latina por terreno, red eléctrica, agua e incentivos fiscales. |
| `home.card.grid-intel.num` | 02 — Grid | 02 — Grid | 02 — Red |
| `home.card.grid-intel.title` | Grid Intelligence | Inteligência de Rede Elétrica | Inteligencia de Red Eléctrica |
| `home.card.grid-intel.desc` | 508 ONS studies. PARPEL 2027–2031. Reports in 24h. | 508 estudos ONS. PARPEL 2027–2031. Relatórios em 24h. | 508 estudios ONS. PARPEL 2027–2031. Informes en 24h. |
| `home.card.dc-financial.num` | 03 — Capital | 03 — Capital | 03 — Capital |
| `home.card.dc-financial.title` | DC Financial Model | Modelo Financeiro DC | Modelo Financiero DC |
| `home.card.dc-financial.desc` | TCO + IRR with country tariffs and FX stress. | TCO + TIR com tarifas por país e estresse cambial. | TCO + TIR con tarifas por país y estrés cambiario. |
| `home.card.testfit-pro.num` | 04 — Fit-out | 04 — Projeto | 04 — Diseño |
| `home.card.testfit-pro.title` | Test Fit Pro | Test Fit Pro | Test Fit Pro |
| `home.card.testfit-pro.desc` | Hyperscale and edge fit-out. 30 presets. Under an hour. | Projetos hyperscale e edge. 30 presets. Em menos de uma hora. | Proyectos hyperscale y edge. 30 presets. En menos de una hora. |
| `home.stats.heading` | Intelligence-Led | Orientado por Inteligência | Basado en Inteligencia |
| `home.stat.cities.value` | 76 | 76 | 76 |
| `home.stat.cities.label` | Working portfolio | Portfólio de trabalho | Portafolio de trabajo |
| `home.stat.sites.value` | 251 | 251 | 251 |
| `home.stat.sites.label` | Greenfield pipeline | Pipeline greenfield | Pipeline greenfield |
| `home.stat.studies.value` | 508 | 508 | 508 |
| `home.stat.studies.label` | Grid intelligence | Inteligência de rede | Inteligencia de red |
| `home.stat.headroom.value` | +18 GW | +18 GW | +18 GW |
| `home.stat.headroom.label` | Headroom 2028 | Capacidade disponível 2028 | Capacidad disponible 2028 |
| `home.principles.eyebrow` | How we work | Como trabalhamos | Cómo trabajamos |
| `home.principles.heading` | Three principles. Non-negotiable. | Três princípios. Inegociáveis. | Tres principios. No negociables. |
| `home.principle.sources.num` | 01 | 01 | 01 |
| `home.principle.sources.title` | Primary sources only | Somente fontes primárias | Solo fuentes primarias |
| `home.principle.sources.desc` | Every claim links to a document we can hand a regulator. | Cada afirmação remete a um documento que podemos apresentar a um regulador. | Cada afirmación remite a un documento que podemos presentar a un regulador. |
| `home.principle.partners.num` | 02 | 02 | 02 |
| `home.principle.partners.title` | Partners on every call | Sócios em cada reunião | Socios en cada llamada |
| `home.principle.partners.desc` | The person who builds the memo presents it. No pyramid. | Quem elabora o memorando o apresenta. Sem intermediários. | Quien elabora el memo lo presenta. Sin pirámide. |
| `home.principle.audited.num` | 03 | 03 | 03 |
| `home.principle.audited.title` | Audited before delivery | Auditado antes da entrega | Auditado antes de la entrega |
| `home.principle.audited.desc` | Chain of Truth review. If we can't verify, we drop it. | Revisão Chain of Truth. Se não pudermos verificar, descartamos. | Revisión Chain of Truth. Si no podemos verificar, lo descartamos. |
| `home.insight.eyebrow` | Latest research | Última pesquisa | Última investigación |
| `home.insight.cta` | Read memo | Ler memorando | Leer memo |
| `home.newsletter.heading` | Stay ahead of the LatAm DC market | Fique à frente do mercado DC da América Latina | Adelántese al mercado DC de América Latina |
| `home.newsletter.subhead` | Daily intelligence from Cloud Minds Partners. | Inteligência diária da Cloud Minds Partners. | Inteligencia diaria de Cloud Minds Partners. |

### Common / UI Keys (needed for all pages)

| Key | EN | PT (DRAFT) | ES (DRAFT) |
|-----|----|-----------|-----------|
| `common.fallback-banner` | Translated version coming soon. Showing English content. | Versão traduzida em breve. Exibindo conteúdo em inglês. | Versión traducida próximamente. Mostrando contenido en inglés. |
| `common.empty-memos` | Memo library expanding — first publication coming soon. | Biblioteca de memorandos em expansão — primeira publicação em breve. | Biblioteca de memos en expansión — primera publicación próximamente. |
| `common.empty-regwatch` | Regulatory watch — first digest coming soon. | Monitoramento regulatório — primeiro digest em breve. | Monitoreo regulatorio — primer digest próximamente. |
| `nav.home` | Home | Início | Inicio |
| `nav.advisory` | Advisory | Consultoria | Asesoría |
| `nav.development` | Development | Desenvolvimento | Desarrollo |
| `nav.intelligence` | Intelligence | Inteligência | Inteligencia |
| `nav.platforms` | Platforms | Plataformas | Plataformas |
| `nav.team` | Team | Equipe | Equipo |
| `nav.contact` | Contact | Contato | Contacto |
| `nav.close` | Close menu | Fechar menu | Cerrar menú |
| `cta.talk-to-us` | Talk to us | Fale conosco | Hablemos |
| `cta.learn-more` | Learn more | Saiba mais | Saber más |
| `cta.get-in-touch` | Get in touch | Entre em contato | Contáctenos |
| `cta.view-all` | View all | Ver todos | Ver todos |
| `footer.tagline` | The LatAm DC intelligence firm. | A firma de inteligência DC da América Latina. | La firma de inteligencia DC de América Latina. |
| `footer.copyright` | © 2025 Cloud Minds Partners. All rights reserved. | © 2025 Cloud Minds Partners. Todos os direitos reservados. | © 2025 Cloud Minds Partners. Todos los derechos reservados. |
| `newsletter.submit` | Subscribe | Assinar | Suscribirse |
| `newsletter.placeholder` | you@company.com | voce@empresa.com | tu@empresa.com |
| `newsletter.success` | You're in. Welcome to DC Insights. | Você está dentro. Bem-vindo ao DC Insights. | Ya estás dentro. Bienvenido a DC Insights. |
| `newsletter.already` | You're already on the list. | Você já está na lista. | Ya estás en la lista. |
| `newsletter.error` | Something went wrong. Try again in a minute. | Algo deu errado. Tente novamente em um minuto. | Algo salió mal. Inténtalo de nuevo en un minuto. |

**Note on stats values (76, 251, 508, +18 GW):** These are numeric data, not translated copy. They come from CMP's proprietary intelligence. Per global rule #9 (ZERO dados inventados) and rule #20 (Chain of Truth), these values must NOT be changed in any locale. The stat values are hardcoded identically across all locales.

---

## Validation Architecture

`nyquist_validation: true` in config.json — this section is required.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright (E2E) — no unit test framework detected in project |
| Config file | `playwright.config.ts` — Wave 0 creates this if absent |
| Quick run command | `npx playwright test --grep @smoke` |
| Full suite command | `npx playwright test` |
| Dev server command | `npm run dev` (Astro dev server on port 4321) |

**Note:** No existing Playwright or Vitest setup detected in the project. Wave 0 must scaffold `playwright.config.ts` and install `@playwright/test` as a dev dependency.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGE-01 | Home page returns 200, hero has 3 `.slide` elements | smoke | `npx playwright test --grep "home"` | ❌ Wave 0 |
| PAGE-02 | Advisory returns 200, contains 6 capability card elements | smoke | `npx playwright test --grep "advisory"` | ❌ Wave 0 |
| PAGE-03 | Development returns 200, contains 3 role-card elements | smoke | `npx playwright test --grep "development"` | ❌ Wave 0 |
| PAGE-04 | Intelligence returns 200, featured memo section present | smoke | `npx playwright test --grep "intelligence"` | ❌ Wave 0 |
| PAGE-05 | Platforms returns 200, 4 product sections present | smoke | `npx playwright test --grep "platforms"` | ❌ Wave 0 |
| PAGE-06 | Team returns 200, partner names in DOM | smoke | `npx playwright test --grep "team"` | ❌ Wave 0 |
| PAGE-07 | Contact returns 200, email link present | smoke | `npx playwright test --grep "contact"` | ❌ Wave 0 |
| CONT-02 | /intelligence/memos/ returns 200; empty state present when 0 entries | smoke | `npx playwright test --grep "memos-index"` | ❌ Wave 0 |
| CONT-03 | /intelligence/memos/[slug] returns 200 for valid slug | smoke | `npx playwright test --grep "memo-detail"` | ❌ Wave 0 |
| CONT-04 | /intelligence/radar/ returns 200, shows 1+ entries after gate flip | smoke | `npx playwright test --grep "radar-index"` | ❌ Wave 0 |
| CONT-05 | /intelligence/radar/[week] returns 200 for valid week | smoke | `npx playwright test --grep "radar-detail"` | ❌ Wave 0 |
| CONT-06 | /intelligence/regwatch/ returns 200, empty state present | smoke | `npx playwright test --grep "regwatch-index"` | ❌ Wave 0 |
| CONT-07 | /intelligence/regwatch/[month] — manual only (no published entries in Phase 3) | manual | n/a | N/A |
| I18N-03 | LangSwitcher click PT on /team → navigates to /pt/team and returns 200 | e2e | `npx playwright test --grep "lang-switcher"` | ❌ Wave 0 |
| I18N-04 | hreflang links present on home + /advisory + /intelligence/memos/ | smoke | `npx playwright test --grep "hreflang"` | ❌ Wave 0 |
| I18N-05 | /pt/ renders Portuguese headline; /es/ renders Spanish headline | smoke | `npx playwright test --grep "home-i18n"` | ❌ Wave 0 |

**CONT-07 manual-only justification:** No regwatch entries will be published in Phase 3. The detail page route exists but cannot be exercised via automated test without a published entry. Test is deferred to when regwatch publishing begins (V2-CONT-02).

### Key Playwright Spec Patterns

```typescript
// tests/phase3-smoke.spec.ts

test.describe('PAGE smoke @smoke', () => {
  test('home 200 + 3 slides', async ({ page }) => {
    await page.goto('/');
    expect(page.url()).not.toContain('404');
    const slides = page.locator('[data-variant="home"] .slide');
    await expect(slides).toHaveCount(3);
  });

  test('advisory 200 + 6 cap-cards', async ({ page }) => {
    await page.goto('/advisory');
    const cards = page.locator('.cap-card');
    await expect(cards).toHaveCount(6);
  });

  test('memos index shows empty state when empty', async ({ page }) => {
    await page.goto('/intelligence/memos/');
    // If no memos published, check empty state text
    const content = await page.textContent('body');
    expect(content).toContain('Memo library expanding');
  });

  test('hreflang present on home', async ({ page }) => {
    await page.goto('/');
    const hreflangEN = page.locator('link[hreflang="en"]');
    await expect(hreflangEN).toHaveCount(1);
    const hreflangPT = page.locator('link[hreflang="pt-BR"]');
    await expect(hreflangPT).toHaveCount(1);
  });
});

test.describe('I18N @smoke', () => {
  test('home PT renders Portuguese headline', async ({ page }) => {
    await page.goto('/pt/');
    const h1 = page.locator('h1').first();
    // Check that h1 does NOT contain English headline
    await expect(h1).not.toHaveText('The LatAm Data Center Intelligence Firm');
  });

  test('lang switcher PT on team', async ({ page }) => {
    await page.goto('/team');
    await page.click('.lang-link[href="/pt/team"]');
    await expect(page).toHaveURL('/pt/team');
    expect(page.url()).not.toContain('404');
  });
});
```

### Sampling Rate

- **Per task commit:** `npx playwright test --grep @smoke` (< 30 seconds against local dev server)
- **Per wave merge:** `npx playwright test` (full suite)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/phase3-smoke.spec.ts` — covers PAGE-01..07, CONT-02..06, I18N-03..05
- [ ] `playwright.config.ts` — dev server baseURL `http://localhost:4321`, workers 1, reporter list
- [ ] Install: `npm install --save-dev @playwright/test && npx playwright install chromium` — if not already present
- [ ] `image-pipeline-test.astro` — delete file
- [ ] `newsletter.astro` — delete file

---

## State of the Art

| Old Pattern (v4 Crusoe) | Phase 3 Pattern | Why Changed |
|------------------------|-----------------|-------------|
| Pages have inline HTML content | Pages compose Phase 2 components | Reuse, consistency |
| `<Base title=...>` prop for SEO | `<SEO slot="head" ... />` inside `<Base>` | Standard Phase 2 pattern |
| No locale in layouts | `Astro.currentLocale` + locale-aware links | i18n requirement |
| `active="intelligence"` prop on SiteHeader (unused) | Auto-detect via `Astro.url.pathname` | Cleaner, no per-page prop |
| Layouts render their own Header/Footer | Layouts render via slot, pages control header | Consistent page structure |
| PT/ES JSON = EN copy | PT/ES JSON = translated values for home keys | I18N-05 requirement |

---

## Open Questions

1. **Home newsletter section — exact mock-26 position**
   - What we know: mock-26/index.html has no newsletter section. CONTEXT.md (locked) says "Newsletter section" is part of home. Phase 2 `NewsletterSubscribe` component exists.
   - What's unclear: exact section positioning in page (after insight? after principles?).
   - Recommendation: Place newsletter as the last section before footer, following the insight/featured-memo section. This matches the mock-26 footer placement pattern (footer immediately follows the last content section).

2. **Home "team teaser" section**
   - What we know: CONTEXT.md section map includes "Team teaser" but mock-26/index.html does not have a team section.
   - What's unclear: Whether this is a desired addition or a documentation error.
   - Recommendation: Omit team teaser from Phase 3 home page. Follow mock-26 verbatim. Edgard can add it in a follow-up PR if desired.

3. **Radar `published: true` approval**
   - What we know: 6 radar entries exist, all `published: false`. CONT-04 requires at least 1 visible entry.
   - What's unclear: Which entries Edgard wants to make public in Phase 3.
   - Recommendation: Flip `2026-W20.md` to `published: true` as the most recent complete entry. Confirm with Edgard before Wave 2 executes.

4. **Contact form backend**
   - What we know: CONTEXT.md says "form posting to existing inquiry handler"; REQUIREMENTS.md says "posting to existing inquiry handler". CONCERNS.md and PROJECT.md don't mention an inquiry Cloud Function.
   - What's unclear: Does a CF for inquiries exist in `dcplatformcmp`? Or is `mailto:` the expected fallback?
   - Recommendation: Default to `mailto:info@cloudmindspartners.com` as the form action. If a CF endpoint exists, wire it in Wave 2. Verify with Edgard before implementing.

5. **People collection advisors vs partners split**
   - What we know: People collection loads from `../cmp-knowledge/people/**/*.md`. Partners are at `people/*.md`, advisors at `people/advisors/*.md`.
   - What's unclear: Whether this directory structure is confirmed in cmp-knowledge at this time.
   - Recommendation: Split using `entry.id.includes('advisors/')` filter in team.astro during Phase 3 implementation. Validate against actual cmp-knowledge structure before deploying.

---

## Sources

### Primary (HIGH confidence)
- Mock-26 HTML files read directly: `index.html`, `advisory.html`, `development.html`, `intelligence.html`, `platforms.html`, `team.html` — section structure, CSS classes, photo URLs, copy text
- `src/components/Hero.astro` — actual Props interface and variants (HIGH — read from source)
- `src/components/CapabilityCard.astro` — actual Props interface (HIGH — read from source)
- `src/components/SiteHeader.astro` — active state gap confirmed (HIGH — read from source)
- `src/components/SEO.astro` — hreflang implementation, JSON-LD slot (HIGH — read from source)
- `src/components/LangSwitcher.astro` — getRelativeLocaleUrl usage confirmed (HIGH — read from source)
- `src/layouts/{Base,MemoLayout,RadarLayout,RegwatchLayout}.astro` — current state confirmed (HIGH — read from source)
- `src/content.config.ts` — language field confirmed in all schemas (HIGH — read from source)
- `src/i18n/{en,pt,es}.json` — confirmed PT+ES are carbon copies of EN (HIGH — read from source)
- `astro.config.mjs` — i18n configuration confirmed: `fallbackType: 'rewrite'`, `prefixDefaultLocale: false` (HIGH — read from source)
- `src/assets/photos/INVENTORY.md` — photo filenames and roles confirmed (HIGH — read from source)
- `cmp-knowledge/knowledge/innovation-radar/2026-W20.md` — radar entry format and frontmatter confirmed (HIGH — read from source)

### Secondary (MEDIUM confidence)
- Astro 6 i18n docs (training knowledge, verified against astro.config.mjs in codebase): `fallbackType: 'rewrite'` preserves URL as-is, `Astro.currentLocale` reflects requested locale even on rewritten pages

### Tertiary (LOW confidence)
- None — all findings verified from source files

---

## Metadata

**Confidence breakdown:**
- Mock-26 section maps: HIGH — read directly from HTML source files
- Component prop interfaces: HIGH — read from actual .astro files
- i18n routing behavior: HIGH — config read from astro.config.mjs; behavior matches Astro 6 docs
- PT/ES translations: MEDIUM — first-pass machine translation, flagged for Edgard review
- Contact page design: MEDIUM — recommendation based on locked decision + no mock-26 source
- Radar published gate: HIGH — confirmed from schema default + actual file contents

**Research date:** 2026-05-17
**Valid until:** 2026-06-17 (stable stack — Astro 6, no fast-moving dependencies introduced in Phase 3)
