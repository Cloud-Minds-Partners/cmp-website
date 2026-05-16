# Technology Stack

**Analysis Date:** 2026-05-16

## Languages

**Primary:**
- TypeScript — Page routes, layouts, components, configuration
- Astro — Static site framework and template language

**Secondary:**
- CSS — Tailwind CSS v4 via `@tailwindcss/vite`

## Runtime

**Environment:**
- Node.js ≥22.12.0 (see `package.json` engines field)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Astro 6.1.7 — Static site generator with content collections
- React 19.2.6 — Interactive component library (via `@astrojs/react`)
- Tailwind CSS 4.2.2 — Utility-first CSS framework

**Build/Dev:**
- `@tailwindcss/vite` 4.2.2 — Tailwind CSS integration for Vite
- `@tailwindcss/typography` 0.5.19 — Prose styling plugin

## Key Dependencies

**Critical:**
- `@astrojs/react` 5.0.4 — React component integration for interactive elements
- React 19.2.6 — Used for interactive components (though site is mostly static)
- Tailwind CSS 4.2.2 — Core styling engine with design tokens

**Type Safety:**
- `@types/react` 19.2.14 — React type definitions
- `@types/react-dom` 19.2.3 — React DOM type definitions

## Configuration

**Build Configuration:**
- `astro.config.mjs` — Integrations (React), Vite plugins (Tailwind)
- `tsconfig.json` — TypeScript strict mode via `astro/tsconfigs/strict`
- `.firebaserc` — Firebase project targeting (`dcplatformcmp` as default project)

**Environment:**
- No `.env` file required for build (secrets handled via GitHub Actions)
- Optional `.env.production` for environment-specific overrides (gitignored)

**Design Tokens:**
- `src/styles/global.css` — Complete design system (colors, typography, spacing, glows, button styles)
- Colors defined via CSS custom properties: `--color-bg-base`, `--color-accent`, `--color-ink`, etc.
- Typography scales: `--font-display` (Space Grotesk), `--font-body` (Inter), `--font-mono` (JetBrains Mono)

## Content Configuration

**Content Collections:**
- `src/content.config.ts` — Zod schemas for memos, radar, regwatch, people
- Collections loaded from sibling `cmp-knowledge` repo via Astro glob loader
  - Memos: `../cmp-knowledge/knowledge/memos/published/**/*.md`
  - Innovation Radar: `../cmp-knowledge/knowledge/innovation-radar/**/*.md`
  - Regwatch: `../cmp-knowledge/knowledge/regwatch/**/*.md`
  - People: `../cmp-knowledge/people/**/*.md` (partners, advisors, photos)

**Photo Staging:**
- People photos copied from `cmp-knowledge/people/photos/` to `public/people/photos/` at build time

## Platform Requirements

**Development:**
- Node.js 22.12.0 or higher
- npm (included with Node)
- Optional: `cmp-knowledge` repo checked out as sibling directory (`../cmp-knowledge`)

**Production:**
- Firebase Hosting project `dcplatformcmp` (target: `cmp-website`)
- No backend services required — fully static site

## Deployment

**Hosting:**
- Firebase Hosting (`dcplatformcmp` project)
- Static files served from `dist/` directory
- Custom domain: pending (placeholder: `cmp-website.web.app`)

**Build Output:**
- `dist/` directory (gitignored)
- `.astro/` directory for type generation (gitignored)

---

*Stack analysis: 2026-05-16*
