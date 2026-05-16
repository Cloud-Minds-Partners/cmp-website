# Coding Conventions

**Analysis Date:** 2026-05-16

## Naming Patterns

**Files:**
- Astro components: PascalCase (e.g., `SiteHeader.astro`, `NewsletterSubscribe.astro`)
- TypeScript data files: camelCase (e.g., `social.ts`, `platforms.ts`)
- Layout files: PascalCase with "Layout" suffix (e.g., `MemoLayout.astro`, `RadarLayout.astro`)
- Style files: kebab-case (e.g., `global.css`)

**Functions:**
- Lowercase with descriptive names (e.g., `findPlatform()`, `whatsappLink()`)
- Event handlers: `addEventListener`, `toggle`, `show`, `submit`
- Utility functions: plain camelCase (e.g., `fmtDate()`)

**Variables:**
- camelCase for constants and variables (e.g., `latest`, `colSpan`, `linkCls`)
- UPPERCASE for configuration constants (e.g., `KNOWLEDGE_ROOT`, `PEOPLE_ROOT`)
- Prefixed IDs with component context (e.g., `uid` for unique IDs in forms: `nl-${random}`)

**Types:**
- PascalCase for interfaces and type names (e.g., `Platform`, `Props`, `PulseEntry`)
- Union types and literals in lowercase (e.g., `"live" | "beta" | "in-development"`)
- Optional fields with `?` notation (e.g., `email?: string`)

**CSS Classes:**
- kebab-case with BEM-like structure (e.g., `surface-card`, `surface-card-link`)
- Utility-first via Tailwind (e.g., `flex flex-col gap-4`)
- Custom semantic classes for patterns (e.g., `.display-lg`, `.eyebrow`, `.lede`)

## Code Style

**Formatting:**
- No automated formatter (Prettier not configured)
- Indentation: 2 spaces (observed in all files)
- Line length: reasonable, no strict rule enforced
- Semicolons: always included

**Linting:**
- ESLint not configured
- TypeScript strict mode enabled (`"extends": "astro/tsconfigs/strict"`)
- Type annotations required for component Props

**Astro Component Structure:**
All Astro components follow a consistent structure:

```astro
---
// Imports at top
import SomeComponent from "./path";

// Interface definition
interface Props {
  propName: string;
  optionalProp?: boolean;
}

// Destructure with defaults
const { propName, optionalProp = false } = Astro.props;

// Computed values
const derived = computed();
---

<html structure here>
<inline-script if needed>
```

**Inline Scripts:**
- Prefer `<script is:inline>` for form handlers and DOM toggles
- Use `define:vars` to pass server-side values to client JavaScript
- Event listeners attached via `addEventListener()` on element selectors
- No framework runtime (pure DOM manipulation)

## Import Organization

**Order:**
1. Astro layout/component imports (e.g., `import Base from "./Base.astro"`)
2. Local component imports (e.g., `import Logo from "./Logo.astro"`)
3. Data/config imports (e.g., `import { platforms } from "../data/platforms"`)
4. Type-only imports (via destructuring from `.ts` files)

**Path Aliases:**
No aliases configured. All imports use relative paths (e.g., `../layouts/`, `../components/`, `../data/`).

**Pattern:**
- Content collections: import from `astro:content` (e.g., `import { collections } from "astro:content"`)
- Schema definitions: import Zod (e.g., `import { z } from "astro:content"`)
- Environment: no `.env` secrets in public paths; use GitHub secrets for CI

## Error Handling

**Patterns:**
- Try-catch for async operations (form submission, fetch)
- Graceful fallbacks for missing data (e.g., `latest?.videoUrl` with optional chaining)
- User-facing error messages in plain language:
  - "Please enter a valid email."
  - "Something went wrong. Try again in a minute."
  - "Couldn't reach the server. Try again in a minute."

**HTTP Errors:**
- Check both response status (`r.ok`) and JSON response data (`data.status`, `data.error`)
- Catch generic errors with `.catch(() => ({}))` to prevent parsing errors on non-JSON responses

**Validation:**
- Email validation: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- String trimming and lowercasing before submission (e.g., `String(email).trim().toLowerCase()`)
- Button state management: disable during submission, restore on completion

## Logging

**Framework:** Console only (no logging library)

**Patterns:**
- No explicit logging in production code
- Debugging via browser DevTools only
- Status feedback via UI (color-coded messages: error `#E05252`, success `#00B8A9`)

## Comments

**When to Comment:**
- Clarify business logic (e.g., `// CMP logo — official SVG from J.A Design brand kit`)
- Explain non-obvious CSS patterns (e.g., `/* Grid background — used on hero sections */`)
- Document data source (e.g., `// Source: ../cmp-knowledge/knowledge/memos/published/`)
- Link to external reference (e.g., `// See README.md § "Content sync"`)

**JSDoc/TSDoc:**
Not used. Comments are inline and minimal.

## Function Design

**Size:**
- Prefer small, single-purpose functions (e.g., `show()`, `fmtDate()`)
- Components may span 30-50 lines with clear sections (imports, interface, destructure, render)

**Parameters:**
- Destructured Props via interface (standard Astro pattern)
- Optional props with default values (e.g., `const { showHeadline = true } = Astro.props`)
- No positional arguments; always use object destructuring

**Return Values:**
- Functions return primitives (strings, booleans) or DOM elements
- Astro components return JSX-like template syntax
- Optional chaining prevents null errors (e.g., `latest?.videoUrl ?? null`)

## Module Design

**Exports:**
- Named exports for functions and types (e.g., `export const platforms: Platform[]`)
- Default export for layouts and pages (Astro convention)
- One export per data file (e.g., `export const findPlatform()` in `platforms.ts`)

**Barrel Files:**
Not used. Each component/data file is standalone and imported by path.

## Color & Design Tokens

**CSS Custom Properties:**
All design tokens live in `src/styles/global.css` via `@theme` block:

```css
@theme {
  --color-bg-base: #050E1D;
  --color-ink: #F8FAFC;
  --color-accent: #2D6BE4;
  --glow-blue: 0 0 40px rgba(45, 107, 228, 0.25);
}
```

**Typography Tokens:**
```css
--font-display: "Space Grotesk"
--font-body: "Inter"
--font-mono: "JetBrains Mono"
```

**Semantic Classes:**
- `.display`, `.display-lg`: hero headings
- `.eyebrow`: small uppercase captions
- `.caption`: mono, small, for metadata
- `.lede`: larger body text for intros
- `.prose`: article typography overrides
- `.surface-card`: elevated card with hover effects
- `.btn-primary`, `.btn-ghost`: button styles
- `.link-slide`: animated underline on hover

**Colors:**
Always reference CSS custom properties in inline styles and Tailwind:
```astro
class="bg-[var(--color-bg-elevated)] text-[var(--color-ink)]"
```

## Tailwind 4 Usage

**Configuration:**
- Tailwind 4.2.2 with `@tailwindcss/vite` plugin
- `@tailwindcss/typography` for article prose styling
- No custom config file; all customization in `global.css` via `@theme`

**Patterns:**
- Utility-first layout (e.g., `flex flex-col gap-4`, `grid grid-cols-1 md:grid-cols-3`)
- Responsive prefixes: `sm:`, `md:`, `lg:` (mobile-first)
- Inline Tailwind for one-off styles
- Complex values in `[...]` brackets (e.g., `text-[1.875rem]`, `max-w-[720px]`)
- Color mix via `color-mix()` in Tailwind (e.g., `bg-[color:color-mix(in_srgb,var(--color-accent)_20%,transparent)]`)

**CSS Layering:**
- `@layer base`: global styles (html, body, a, focus-visible)
- `@layer utilities`: semantic classes (`.display`, `.eyebrow`, `.surface-card`, `.btn-*`)
- No component layer; components are Astro files

## Frontmatter Conventions

**Memo Frontmatter** (`src/content.config.ts`):
```yaml
title: string (8-120 chars)
slug: string (kebab-case, a-z0-9+hyphens only)
type: "memo"
status: "draft" | "review" | "approved" | "published"
publish: boolean
topic: string
jurisdiction:
  country: "BR" | "MX" | "CL" | "AR" | "CO" | "PE" | "UY"
  scope: "federal" | "state" | "municipal" | "sectoral"
  region: string (optional)
author: string
reviewer: string (optional)
created: date (coerced to Date)
updated: date (coerced to Date)
word_count: number (optional)
sources_count: number (optional)
audit_status: "pending" | "passed" | "blocked"
audit_notes: string (optional)
tags: array of strings (optional)
carousel_data: string (optional, path to carousel JSON)
```

**Radar Frontmatter:**
```yaml
week: string (format: YYYY-W## or YYYY-##)
period_start: date (optional)
period_end: date (optional)
author: string (default: "intel@")
reviewer: string (optional)
published: boolean (default: false)
sources_scanned: record of "source" → boolean (optional)
tags: array (optional)
```

**Regwatch Frontmatter:**
```yaml
month: string (format: YYYY-MM)
author: string (default: "intel@")
reviewer: string (optional)
published: boolean (default: false)
jurisdictions_scanned: record of country code → boolean (optional)
tags: array (optional)
```

---

*Convention analysis: 2026-05-16*
