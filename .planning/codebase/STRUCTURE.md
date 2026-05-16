# Codebase Structure

**Analysis Date:** 2026-05-16

## Directory Layout

```
cmp-website/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD — clone cmp-knowledge, build, deploy to Firebase
├── .planning/
│   └── codebase/                   # GSD documentation (this file, ARCHITECTURE.md, etc.)
├── src/
│   ├── components/                 # Reusable Astro components
│   ├── config/                     # Static configuration (social links, etc.)
│   ├── data/                       # Canonical data objects (platforms, etc.)
│   ├── layouts/                    # Page-level layout templates
│   ├── pages/                      # File-based routing (Astro convention)
│   │   ├── intelligence/           # Intelligence hub + collections routes
│   │   │   ├── memos/
│   │   │   ├── radar/
│   │   │   └── regwatch/
│   │   └── platforms/              # Platform detail pages
│   ├── styles/                     # Global CSS (Tailwind theme)
│   └── content.config.ts           # Astro content collections schema + loaders
├── public/                         # Static assets (images, favicons)
│   ├── brand/                      # Logo, brand assets
│   ├── people/                     # Team photos (populated at build time from cmp-knowledge)
│   ├── favicon.ico
│   └── favicon.svg
├── .firebaserc                     # Firebase project config (hosting site mapping)
├── firebase.json                   # Firebase deploy config
├── astro.config.mjs                # Astro + Vite config
├── tsconfig.json                   # TypeScript strict mode (Astro preset)
├── package.json                    # Node.js deps (Astro, Tailwind, React)
└── README.md                       # Project setup + content publishing flow
```

## Directory Purposes

**`src/components/`:**
- Purpose: Reusable Astro components — layout primitives and feature modules
- Contains: `.astro` files only (no client-side React components)
- Key files:
  - `SiteHeader.astro` — sticky nav with primary menu + subnav context support
  - `SiteFooter.astro` — footer with sitemap links, copyright, social icons
  - `Section.astro` — semantic wrapper for editorial sections (eyebrow/title/lede/content)
  - `NewsletterSubscribe.astro` — email capture form + Brevo API call (inline script)
  - `WhatsAppFab.astro` — floating action button (WhatsApp link from social.ts)
  - `WeeklyPulseSection.astro` — video embed placeholder (latest video data null)
  - `LatamPulseMap.astro` — SVG or interactive map of LatAm (hero section)
  - `VideoEmbed.astro`, `CarouselEmbed.astro` — placeholders for rich media

**`src/config/`:**
- Purpose: Static configuration objects (not environment variables)
- Contains: TypeScript files exporting canonical constants
- Key files:
  - `social.ts` — LinkedIn URL, WhatsApp number, email, newsletter subscribe endpoint

**`src/data/`:**
- Purpose: Data-driven page content — platforms, team bios, etc.
- Contains: TypeScript objects and types
- Key files:
  - `platforms.ts` — `Platform` type definition + `platforms[]` array + `findPlatform()` helper
    - Each platform object: slug, name, tagline, status (live/beta/in-dev), highlights, body sections, URLs

**`src/layouts/`:**
- Purpose: Page-level HTML shells and templates
- Contains: `.astro` files with consistent structure (header/footer/slot)
- Key files:
  - `Base.astro` — root HTML template (meta tags, fonts, WhatsApp FAB)
  - `MemoLayout.astro` — wrapper for memo detail pages (metadata header, prose body)
  - `RadarLayout.astro` — wrapper for innovation radar entries (week header)
  - `RegwatchLayout.astro` — wrapper for regulatory watch entries (month header)

**`src/pages/`:**
- Purpose: File-based routing — each `.astro` file = one route (Astro convention)
- Contains: Page components and dynamic route generators
- Structure:
  - `index.astro` → `/` (homepage)
  - `advisory.astro` → `/advisory`
  - `development.astro` → `/development`
  - `platforms.astro` → `/platforms` (index)
  - `platforms/[slug].astro` → `/platforms/{slug}` (detail via getStaticPaths)
  - `intelligence/index.astro` → `/intelligence` (hub)
  - `intelligence/memos/index.astro` → `/intelligence/memos`
  - `intelligence/memos/[slug].astro` → `/intelligence/memos/{slug}` (detail via getStaticPaths + content collection)
  - `intelligence/radar/index.astro` → `/intelligence/radar`
  - `intelligence/radar/[week].astro` → `/intelligence/radar/{week}` (detail via getStaticPaths + content collection)
  - `intelligence/regwatch/index.astro` → `/intelligence/regwatch`
  - `intelligence/regwatch/[month].astro` → `/intelligence/regwatch/{month}` (detail via getStaticPaths + content collection)
  - `team.astro` → `/team`
  - `contact.astro` → `/contact`
  - `newsletter.astro` → `/newsletter`

**`src/styles/`:**
- Purpose: Global styles and design tokens
- Contains: Single `global.css` file with Tailwind 4 `@theme` declarations
- Key elements:
  - Typography: --font-display (Space Grotesk), --font-body (Inter), --font-mono (JetBrains Mono)
  - Colors: --color-bg-base, --color-ink, --color-accent (brand blue #2D6BE4), status colors (teal, amber, green, red)
  - Utilities: `.display`, `.display-lg`, `.lede`, `.eyebrow`, `.caption`, `.prose`
  - Layout: flex/grid utilities via Tailwind

**`public/`:**
- Purpose: Static assets served at build time (images, icons, fonts)
- Contains: Favicons, brand logo files
- Note: `people/photos/` populated at CI build time from `cmp-knowledge/people/photos/`

**`.github/workflows/`:**
- Purpose: CI/CD automation
- Key file: `deploy.yml` — on push to main:
  1. Checkout cmp-website repo
  2. Checkout cmp-knowledge (private, PAT-protected)
  3. Copy people photos to `public/people/photos/`
  4. Install Node 22, npm ci
  5. `npm run build` (Astro static generation)
  6. Deploy to Firebase Hosting project `dcplatformcmp`

## Key File Locations

**Entry Points:**
- `src/pages/index.astro` — Homepage (`/`)
- `src/pages/intelligence/memos/[slug].astro` — Memo detail pages
- `src/pages/intelligence/radar/[week].astro` — Radar detail pages
- `src/pages/platforms/[slug].astro` — Platform detail pages

**Configuration:**
- `src/content.config.ts` — Content collection schemas (Zod)
- `src/config/social.ts` — Social/contact URLs
- `src/data/platforms.ts` — Platform definitions
- `astro.config.mjs` — Astro + Tailwind + React integration
- `tsconfig.json` — TypeScript strict mode
- `.firebaserc` — Firebase hosting site target

**Core Logic:**
- `src/components/Section.astro` — Semantic layout wrapper (tones: default/subtle/dark)
- `src/components/SiteHeader.astro` — Navigation (primary menu + subnav routing)
- `src/layouts/Base.astro` — HTML shell (meta, fonts, theme color)
- `src/styles/global.css` — Tailwind theme tokens

**Content Loading:**
- `src/content.config.ts` — Loads memos from `../cmp-knowledge/knowledge/memos/published/**/*.md`
- `src/content.config.ts` — Loads radar from `../cmp-knowledge/knowledge/innovation-radar/**/*.md`
- `src/content.config.ts` — Loads regwatch from `../cmp-knowledge/knowledge/regwatch/**/*.md`
- `src/content.config.ts` — Loads people from `../cmp-knowledge/people/**/*.md`

## Naming Conventions

**Files:**
- `.astro` files: PascalCase for components (`SiteHeader.astro`, `NewsletterSubscribe.astro`)
- `.astro` files: lowercase for pages (`index.astro`, `advisory.astro`)
- `.astro` files: bracketed for dynamic routes (`[slug].astro`, `[week].astro`, `[month].astro`)
- `.ts` files: camelCase (`platforms.ts`, `social.ts`, `content.config.ts`)
- `.css` files: lowercase (`global.css`)

**Directories:**
- PascalCase for feature areas: `Intelligence`, `Advisory`, `Platforms` (semantic routes)
- lowercase for utility dirs: `components`, `layouts`, `pages`, `styles`, `data`, `config`

**Types & Functions:**
- Type exports: PascalCase (`Platform`, `Props`)
- Function/constant exports: camelCase (`platforms`, `findPlatform`, `social`, `whatsappLink`)
- Props interfaces: `interface Props { ... }`

**CSS Classes:**
- Tailwind utilities: lowercase (`flex`, `gap-6`, `text-[var(--color-ink)]`)
- Semantic classes: lowercase with hyphens (`.glass-badge`, `.link-slide`, `.dot-grid-dark`, `.hero-glow-dark`)
- Prefixed utilities: `.display`, `.display-lg`, `.lede`, `.eyebrow`, `.eyebrow-dark`, `.caption`

## Where to Add New Code

**New Page (Static):**
- Create `src/pages/[pagename].astro`
- Import `Base` layout, wrap content
- Import `SiteHeader` + `SiteFooter`, pass active route
- Use `Section` component for major blocks
- No database/API — all data inline or from `src/data/`

**New Dynamic Content Route (From Collection):**
- Add collection definition to `src/content.config.ts` with Zod schema
- Create content files in `../cmp-knowledge/knowledge/[collection]/...`
- Create `src/pages/[collection]/[param].astro` with:
  ```astro
  export async function getStaticPaths() {
    const entries = await getCollection("collection-name");
    return entries.map(entry => ({ params: { param: entry.data.field }, props: { entry } }));
  }
  ```
- Render via `const { Content } = await render(entry);` then `<Content />`

**New Component:**
- Create `src/components/ComponentName.astro`
- Define TypeScript `interface Props { ... }` at top (between `---`)
- Use `Astro.props` to destructure
- Include `<slot />` if composable
- Import and use in pages/layouts

**New Data Source:**
- Create `src/data/[name].ts`
- Export TypeScript type and constant array/object
- Reference from components via `import { data } from "../data/[name]"`

**New Configuration:**
- Create `src/config/[name].ts` (if external APIs/URLs)
- Or add to existing `social.ts` if contact/platform-related
- Export object with canonical values
- All components read from this single source

**Newsletter Form:**
- Modify `src/components/NewsletterSubscribe.astro`
- Form action is inline `fetch()` to endpoint in `src/config/social.ts`
- No form framework — vanilla HTML + inline script with error handling

**Styling Changes:**
- Update `src/styles/global.css` — add/modify `@theme` variables or utility classes
- No separate component CSS files — all styling inline via Tailwind classes in HTML
- Color/font tokens centralized in `global.css` @theme block

## Special Directories

**`.planning/codebase/`:**
- Purpose: GSD documentation (generated by mapper agents)
- Generated: Yes (by `/gsd:map-codebase`)
- Committed: Yes (part of repository)
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md (as applicable)

**`node_modules/`:**
- Purpose: npm package cache
- Generated: Yes (by `npm ci`)
- Committed: No (in .gitignore)
- Note: lockfile `package-lock.json` IS committed

**`dist/`:**
- Purpose: Static build output (HTML, CSS, JS)
- Generated: Yes (by `npm run build`)
- Committed: No (in .gitignore)
- Note: Built at CI before Firebase deploy

**`.astro/`:**
- Purpose: Astro build cache and type definitions
- Generated: Yes (by `npm run dev` and `npm run build`)
- Committed: No (in .gitignore)
- Contents: `content.d.ts` (generated collection types), `settings.json` (build metadata)

**`public/people/photos/`:**
- Purpose: Team and advisor photos (used in `team.astro` via people collection)
- Generated: Populated at CI build time from `cmp-knowledge/people/photos/`
- Committed: No (dynamically staged via GitHub Actions)
- Served: As static assets at build time

**`.firebase/`:**
- Purpose: Firebase local cache (hosting history, etc.)
- Generated: Yes (by `firebase deploy`)
- Committed: No (in .gitignore)

---

*Structure analysis: 2026-05-16*
