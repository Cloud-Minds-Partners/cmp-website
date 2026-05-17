# Phase 3: Pages — Context

**Gathered:** 2026-05-17
**Status:** Ready for planning
**Source:** Synthesized from PROJECT.md + REQUIREMENTS.md + mock-26 HTML + Phase 1/2 substrate

<domain>
## Phase Boundary

Phase 3 composes the Phase 2 component library into pages. It does NOT build new components, refactor schemas, or change deploy infra. Deliverables:

1. **7 canonical pages** (home, advisory, development, intelligence, platforms, team, contact) — pixel-faithful composition of mock-26 using Phase 2 components
2. **6 content collection routes** (memos index+detail, radar index+detail, regwatch index+detail) — handle empty collections gracefully
3. **i18n routing depth** — locale-aware LangSwitcher works on every page, hreflang emitted via SEO component, home page has PT + ES translated copy; other pages fall back to EN with subtle banner
4. **Replace v4 Crusoe pages** — current `src/pages/*` content gets replaced by mock-26 composition

When Phase 3 closes, the site visually matches mock-26 at every URL.

</domain>

<decisions>
## Implementation Decisions (Locked)

### Page composition strategy

- **Each page = Astro `.astro` file in `src/pages/`**, imports Phase 2 components, passes props
- **Page-level `<SEO>` invocation** — every page renders `<SEO slot="head" ... />` with page-specific title/description/og/canonical
- **Hero variant per page**:
  - home: `<Hero variant="home" />` (3-slide rotation SP/Santiago/CDMX, slideShow 24s)
  - all others: `<Hero variant="page" slug="<page>" />` (single bg with Ken Burns 18s)
- **CapabilityCard grids** — composed inline per page; props from i18n string keys
- **Content lives in `src/i18n/{en,pt,es}.json`** — page copy keys per page (e.g., `home.hero.headline`, `advisory.section.farms.title`)
- **Photo imports** — explicit `import` statements from `src/assets/photos/`, filenames validated against `src/assets/photos/INVENTORY.md`

### Content collection routes (CONT-02..07)

- **Index pages render from collection content**:
  - `src/pages/intelligence/memos/index.astro` → list memos sorted by `pubDate` desc, filter by `language === currentLocale` with EN fallback
  - Same pattern for radar + regwatch
- **Empty state**: when filter returns 0 entries, render `i18n.intelligence.<type>.empty-state` (key: e.g., "Memo library expanding — first publication coming soon.") inside a styled empty card. NO "Coming soon" string hardcoded.
- **Detail pages** at `[slug].astro`:
  - `src/pages/intelligence/memos/[slug].astro` uses `MemoLayout` (existing from v4, may need update)
  - Similarly for radar + regwatch
  - Detail pages emit Article JSON-LD via SEO component
- **Locale-prefixed routes** auto-handled by Astro i18n: PT memo at `/pt/intelligence/memos/<slug>` falls back to EN content (per fallbackType: 'rewrite')

### i18n routing depth (I18N-03, I18N-04, I18N-05)

- **I18N-03 (LangSwitcher correctness)** — verified via Playwright test on multiple paths: home, team, intelligence/memos. Click PT → URL becomes `/pt/<path>` → page renders 200 (with EN fallback if no PT-specific content).
- **I18N-04 (hreflang)** — already emitted by SEO component (Phase 2). Verify on all 7 pages + collection index pages. Wave 0 spec: `comp-09-seo.spec.ts` already covers this; extend with per-page-type assertions.
- **I18N-05 (home PT+ES copy)** — home page (`/`, `/pt/`, `/es/`) renders fully localized copy from i18n JSON keys. Other pages may fall back to EN.
  - **Fallback banner**: when a page renders EN content under a PT/ES URL (because the page hasn't been translated yet), a subtle banner appears at top: "Translated version coming soon" (localized). Implemented via a `<LocaleBanner />` component (NEW for this phase, small) OR via existing layout slot.

### Replace v4 Crusoe pages

- **Current src/pages/ inventory** (v4-era):
  - `index.astro`, `team.astro`, `advisory.astro`, `development.astro`, `newsletter.astro`, `platforms.astro`, `contact.astro`
  - `intelligence/index.astro`, `intelligence/memos/index.astro`, `intelligence/regwatch/index.astro`, `intelligence/radar/index.astro`
  - `platforms/[slug].astro`
  - Stub PT/ES (Phase 1): `pt/index.astro`, `es/index.astro`
  - Scaffolding (Phase 1): `image-pipeline-test.astro` — DELETE in Phase 3 (real pages now import photos)
  - Dev preview (Phase 2): `dev/components.astro` — KEEP (env-guarded)
- **Approach**: REPLACE content of each existing page (not delete + recreate, to preserve git diff continuity). `newsletter.astro` becomes a section within home (per CONTEXT — newsletter is inline embed). Convert `newsletter.astro` to a redirect to `/#newsletter` anchor on home OR delete entirely (cleaner).
- **`platforms/[slug].astro`**: keep dynamic route, but redirect to home's platforms section anchors OR build out 4 sub-pages per mock-26's platforms section structure (NOT in mock-26 — defer to v2). Phase 3 strategy: `platforms/[slug].astro` redirects to `/#platforms-<slug>` anchor.

### Image pipeline scaffolding removal

- `src/pages/image-pipeline-test.astro` — was Phase 1 scaffolding. Phase 3 deletes it because real pages now import the photos directly (FOUND-01 WebP/srcset gates remain green via the real pages).
- Update `scripts/validate-phase-1.sh` if any check references this file (likely not — checks operate on `dist/`).
- INVENTORY.md stays.

### Translated copy scope

- **EN (default):** all 7 pages + 3 collection indexes fully populated
- **PT (Portuguese-BR):** home page only (per I18N-05 — minimum bar). All other pages render EN with fallback banner.
- **ES (Spanish LatAm):** home page only. Same fallback for others.
- **Translation source:** Edgard authors the PT/ES home copy. For Phase 3 planning, assume initial PT/ES copy comes from a glossary in `cmp-knowledge` OR I write a first-pass translation that Edgard can edit. Default: I write first-pass translation, flag for review. (User confirmation expected in plan-checker iteration.)

### Page-level photos

Per mock-26 CURRENT.md:
- Home heros (3-rotation): hero-sp-marginal · hero-santiago · hero-cdmx
- Advisory hero: hero-advisory
- Development hero: hero-development
- Intelligence hero: hero-intelligence
- Platforms hero: hero-platforms
- Team hero: hero-team

Card grid photos: per CapabilityCard role mapping in INVENTORY.md.

### Claude's Discretion

- Internal section composition order on each page (follow mock-26 HTML structure verbatim — confirmed in research)
- Exact i18n key naming (suggest `<page>.<section>.<element>`)
- Component prop signatures finalized in Phase 2 — Phase 3 only consumes
- Mobile breakpoints inherit from Phase 2 components
- Whether `newsletter.astro` redirects to home anchor or is deleted — recommend delete (cleanest)
- Whether to break Phase 3 into multiple waves: probably yes (Wave 0 spec stubs → Wave 1 EN pages parallel → Wave 2 collection routes + LocaleBanner → Wave 3 PT+ES home + cleanup)
</decisions>

<specifics>
## Specific References

- **mock-26 page HTMLs:** `../cmp-design-system/mock-26/index.html`, `advisory.html`, `development.html`, `intelligence.html`, `platforms.html`, `team.html` (no contact page in mock-26 — contact may be inline section or new page)
- **Phase 2 components:** `src/components/{SiteHeader,SiteFooter,Hero,CapabilityCard,NewsletterSubscribe,WhatsAppFab,LangSwitcher,SocialLinks,SEO,Logo}.astro`
- **i18n utils:** `src/i18n/utils.ts` (Phase 1: getLangFromUrl, useTranslations)
- **i18n strings:** `src/i18n/{en,pt,es}.json` (extend with page-level keys in this phase)
- **Photos:** `src/assets/photos/` (27 photos + INVENTORY.md from Phase 1)
- **Content collections:** `src/content/memos/`, `src/content/radar/`, `src/content/regwatch/` — only radar has 1 real entry; memos and regwatch are empty scaffolds
- **Existing layouts:** `src/layouts/{Base,MemoLayout,RadarLayout,RegwatchLayout}.astro` — verify they work with Phase 2 SEO component slot
- **Mock-26 CURRENT.md:** design system reference (palette, type, radii, photos inventory) — already in @theme block

## Mock-26 Section Map (canonical — per CURRENT.md)

**Home (index):**
1. Hero (3-rotation)
2. Capabilities (4 cards: Site Selection / Grid Intelligence / DC Financial / Test Fit Pro)
3. Stats section
4. Insight memo highlight (1 featured)
5. Team teaser
6. Newsletter section

**Advisory:**
1. Hero (industrial campus A01)
2. 6 capability cards: farms / power tower / coast water / blueprints / stock chart / SP skyline

**Development:**
1. Hero (modern aerial)
2. 3 roles section: modern office / blueprint / trading screens

**Intelligence:**
1. Hero (AI06 circuit brain)
2. Featured memo highlight
3. Three subsection links (memos / radar / regwatch)

**Platforms:**
1. Hero (D09 blue circuit abstract)
2. 4 product cards (Site Selection / Grid Intel / DC Financial / TestFit Pro — same as home capabilities but as platforms not capabilities)

**Team:**
1. Hero (T02 SP traffic)
2. Real bios from `cmp-knowledge/people/`

**Contact:**
- Not in mock-26 — Phase 3 designs minimally: hero + email + WhatsApp + LinkedIn + simple form. Or merge into home Newsletter section. Decision: minimal standalone contact page.

</specifics>

<deferred>
## Deferred Ideas (out of Phase 3)

- **PT/ES translated copy beyond home** — V2-CONT-03. Phase 3 ships EN + locale banner for non-home pages.
- **Real memo/radar/regwatch publishing** — V2-CONT-01 / V2-CONT-02. Phase 3 wires the routes; content is Phase 2-onward responsibility of CMP plan D3/D4/D5/D6.
- **OG image PNGs generated per page** — Phase 4 (SEO-02). Phase 3 ships pages with default OG reference.
- **Lighthouse audits** — Phase 4 (PERF, A11Y, SEO scores).
- **Sitemap generation** — Phase 4 (SEO-05).
- **Accessibility audit** — Phase 4 (A11Y-*).
- **Image-pipeline-test.astro removal** — done in Phase 3 (this phase).
- **Contact form backend** — out of scope. Phase 3 ships form posting to existing inquiry CF if one exists; otherwise mailto:.
- **Active nav state in SiteHeader** — flagged by visual fidelity diff. Phase 3 implements via prop or auto-detection (`Astro.url.pathname` match against nav link href).
</deferred>

---

*Phase: 03-pages*
*Context gathered: 2026-05-17 via synthesis from PROJECT.md / REQUIREMENTS.md / mock-26 / Phase 1+2 substrate*
