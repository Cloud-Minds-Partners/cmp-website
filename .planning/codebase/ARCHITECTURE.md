# Architecture

**Analysis Date:** 2026-05-16

## Pattern Overview

**Overall:** Static Site Generation (SSG) with Dynamic Content Collections

**Key Characteristics:**
- Astro 6 framework — zero JavaScript runtime by default, pure HTML/CSS delivery
- Content-driven: memos, innovation radar, regulatory watch sourced from external `cmp-knowledge` repo (glob loader)
- Hybrid rendering: static pages + dynamic route generation from content collections via `getStaticPaths()`
- Tailwind CSS 4 with typography plugin — single theme with dark/light tone variants
- Minimal client-side interactivity — form submission (newsletter subscribe), mobile nav toggle

## Layers

**Presentation (Pages & Layouts):**
- Purpose: Render branded editorial content across fixed and dynamic routes
- Location: `src/pages/`, `src/layouts/`
- Contains: Astro `.astro` files — HTML templates with embedded styling and logic
- Depends on: Layouts, components, content collections, static data
- Used by: Astro build pipeline → static HTML output

**Components (Reusable UI):**
- Purpose: Modular presentation units — headers, footers, cards, forms, embeds
- Location: `src/components/`
- Contains: Astro components (SiteHeader, SiteFooter, Section, NewsletterSubscribe, etc.)
- Depends on: Config (social.ts), data (platforms.ts), styles (global.css)
- Used by: Pages and layouts

**Data & Configuration:**
- Purpose: Canonical data sources — platforms, social links, people metadata
- Location: `src/data/platforms.ts`, `src/config/social.ts`
- Contains: Exported TypeScript objects and constants
- Depends on: None
- Used by: Components and pages

**Content Collections:**
- Purpose: Load external markdown content into typed collections with Zod validation
- Location: `src/content.config.ts` + Astro `getCollection()` API
- Contains: Memos, Innovation Radar, Regulatory Watch, People — sourced from `../cmp-knowledge/`
- Depends on: External repo (`cmp-knowledge`) via relative path glob
- Used by: Dynamic route generators (`[slug].astro`, `[week].astro`, `[month].astro`)

**Styling:**
- Purpose: Design tokens, typography scale, utility classes
- Location: `src/styles/global.css` (Tailwind 4 theme + plugins)
- Contains: CSS `@theme` variables, typography utilities (`.display`, `.lede`, `.eyebrow`), layout classes
- Depends on: Tailwind CSS 4
- Used by: All pages and components

## Data Flow

**Content Publishing (External → Site):**

1. Author writes memo in `cmp-knowledge/knowledge/memos/drafts/<slug>.md`
2. Audit passes via `uv run cmp-memo audit`
3. Peer review (ops@), then status→ `approved`
4. Publish via `uv run cmp-memo publish` — moves to `published/`, sets `publish: true`
5. Commit pushed to `cmp-knowledge/main`
6. GitHub Actions in this repo triggers:
   - Clones `cmp-knowledge` as sibling dir
   - `src/content.config.ts` loads `../cmp-knowledge/knowledge/memos/published/**/*.md`
   - Zod schema validates frontmatter (title, slug, jurisdiction, author, audit_status, etc.)
   - Build generates `[slug].astro` routes via `getStaticPaths()`
   - Deploy to Firebase Hosting

**State Management:**

- **No runtime state** — all content baked into static HTML at build time
- **Form submissions** — newsletter subscribe posts to Cloud Function endpoint (external)
- **Client-side interactivity** — mobile nav toggle stored in DOM classList, form validation inline

**Content Availability Gates:**

- Memos: `publish: true` filter in `getCollection()`
- Radar: `published: true` filter  
- Regwatch: `published: true` filter
- Build succeeds even with zero content — empty lists render "No X published yet"

## Key Abstractions

**Section Component (Semantic Layout):**
- Purpose: Standardized editorial section wrapper with tone variants
- Examples: `src/components/Section.astro`
- Pattern: Props control background (default/subtle/dark) and typography, slot for content
- Usage: Wrap major content blocks on homepage, platforms detail pages
- Benefits: Consistent spacing (`py-24 md:py-28`), semantic headings (eyebrow/title/lede)

**Layout Hierarchy:**
- Purpose: Inheritance chain for page-level structure
- Base → (MemoLayout | RadarLayout | RegwatchLayout)
- Pattern: Each specialized layout wraps Base for meta/fonts, adds header/footer with context-aware subnav
- Usage: Ensures consistent HTML shell and branding across all pages

**Platform Definition Object:**
- Purpose: Single source of truth for product/platform metadata
- Examples: `src/data/platforms.ts` exports `Platform` type and `platforms[]` array
- Pattern: Type-safe object with status, access levels, highlights, body sections
- Usage: Drives both index list (`/platforms`) and detail pages (`/platforms/[slug]`)
- Benefit: Edit once, renders everywhere

**Content Schema Validation:**
- Purpose: Enforce metadata consistency for published content
- Examples: Zod schemas in `src/content.config.ts`
- Pattern: `defineCollection()` with `z.object()` schema per content type
- Usage: Memos require `publish: true`, jurisdiction object, word_count; radar/regwatch require `published: true`
- Benefit: Build fails if frontmatter missing/invalid — catch errors before deploy

**Social Configuration:**
- Purpose: Centralize external contact/platform URLs
- Examples: `src/config/social.ts` exports `social` object
- Pattern: Canonical URLs and IDs (LinkedIn org, WhatsApp, email, newsletter endpoint)
- Usage: All components (header, footer, FAB, subscribe form) read from this file
- Benefit: Change once → updates everywhere

## Entry Points

**Homepage (`src/pages/index.astro`):**
- Location: `/`
- Triggers: Direct navigation, or platform-agnostic SEO redirect
- Responsibilities: 
  - Render hero section (dark background, CMP value prop)
  - Display 3 pillars (Advisory, Development, Intelligence)
  - Bento grid of platforms with status badges
  - Weekly Pulse section (video placeholder)
  - Newsletter subscribe form
  - Contact CTA footer (mirrors hero tone)

**Dynamic Memo Route (`src/pages/intelligence/memos/[slug].astro`):**
- Location: `/intelligence/memos/[slug]`
- Triggers: `getStaticPaths()` called at build time, generates one route per published memo
- Responsibilities:
  - Fetch memo by slug from `getCollection("memos")`
  - Render title, jurisdiction, author, metadata (word count, sources, tags)
  - Render markdown body via `render(memo)` → `<Content />`
  - Apply MemoLayout wrapper (header, footer, typography)

**Platform Detail Page (`src/pages/platforms/[slug].astro`):**
- Location: `/platforms/[slug]`
- Triggers: `getStaticPaths()` generates one route per platform in `platforms.ts` array
- Responsibilities:
  - Fetch platform from `platforms` data
  - Render header (name, tagline, status badge, link to live URL)
  - Display overview, highlights, demo video embed placeholder, carousel embed placeholder
  - Render long-form body sections (Why it exists, What's inside, How clients use it)
  - Contact CTA section

**Intelligence Hub (`src/pages/intelligence/index.astro`):**
- Location: `/intelligence`
- Triggers: Direct navigation
- Responsibilities:
  - Overview of 3 intelligence streams (Memos, Radar, Regwatch)
  - List links to detail pages
  - Newsletter subscribe section

## Error Handling

**Strategy:** Fail-safe static builds with graceful degradation

**Patterns:**

- **Missing content collections:** If `cmp-knowledge` not cloned during CI, placeholder directories created (`_warn_` step) — pages render empty lists with "No X published yet"
- **Invalid frontmatter:** Zod schema validation at build time — if frontmatter fails, build stops with error (catches before deploy)
- **Dynamic route generation:** If collection empty, no routes generated; `getStaticPaths()` returns empty array, pages skip rendering
- **External dependencies:** Newsletter subscribe endpoint externalized (Cloud Function); form gracefully handles fetch failures with error message
- **Missing media:** Video/carousel embeds show "Coming soon" placeholder if URL null; no broken media tags
- **Mobile nav:** Inline script with DOM listeners; if JavaScript disabled, nav hidden but header still works (graceful degradation)

## Cross-Cutting Concerns

**Logging:** No runtime logging — build-time output via Astro CLI and GitHub Actions logs. Errors surfaced via build failures.

**Validation:** Zod schemas for content frontmatter (compile-time). Form validation for newsletter subscribe (client-side regex + server-side).

**Authentication:** None required for public site. Newsletter subscribe uses external Cloud Function with no auth token.

**Internationalization:** Site default English (per CMP convention). Language switching not implemented — hardcoded country names in MemoLayout (Brazil, Mexico, Chile, etc.).

**Accessibility:** Semantic HTML (sections, headers, nav), ARIA labels on interactive elements (mobile toggle, play buttons), color contrast maintained, focus-visible outlines on links.

---

*Architecture analysis: 2026-05-16*
