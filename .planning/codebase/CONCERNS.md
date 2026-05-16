# Codebase Concerns

**Analysis Date:** 2026-05-16

## Hardcoded English Language — i18n Migration Blocker

**Issue:** Site is fully hardcoded to English (`lang="en"` in `src/layouts/Base.astro:23`), with no i18n infrastructure.

**Files affected:**
- `src/layouts/Base.astro` (lang hardcoded)
- `src/pages/**` (all content in English)
- `src/components/**` (UI labels in English)
- `src/config/social.ts` (hardcoded messages)
- `src/styles/global.css` (typography labels)

**Impact:** Design v2 requires EN/PT/ES routing; current implementation will require complete refactor of:
- Route structure (Astro doesn't auto-detect `i18n/[lang]/` patterns without middleware)
- Content collection loaders (currently glob from single `cmp-knowledge` path)
- Component prop interfaces (many assume English strings)
- Social config defaults (Portuguese/Spanish variants needed)

**Fix approach:**
1. Implement Astro i18n middleware with `@astrojs/middleware` package
2. Restructure content collections to support language variants or separate collections per language
3. Extract UI strings into translation files (JSON or YAML in `src/i18n/`)
4. Migrate routes to `/en/**`, `/pt/**`, `/es/**` pattern with locale detection fallback
5. Update `cmp-knowledge` schema to include language field in memo/radar/regwatch frontmatter
6. Verify social URLs support Portuguese/Spanish contact messages

**Priority:** High — blocks design v2 port

---

## Missing SEO Infrastructure

**Issue:** Limited SEO/AEO setup for a corporate site targeting organic search.

**Gaps:**
- No sitemap.xml generation (Astro has `@astrojs/sitemap` but not integrated)
- No structured data (JSON-LD) for Organization, Article, or FAQPage
- No OG image metadata beyond title/description (no image URL in og:image)
- No Twitter Card tags
- No RSS feed for news/radar/regwatch (newsletter exists but no feed link in header)
- No meta viewport width/device scaling (present but minimal)

**Files:**
- `src/layouts/Base.astro:24-36` (base meta tags — missing og:image, twitter)
- No route at `/sitemap.xml` or `.xml` generation configured

**Impact:**
- Organic search ranking penalized (Google prefers structured data for entity pages)
- Social shares appear as plain text (no image preview)
- Newsletter discovery is email-first only (no RSS autodiscovery)

**Fix approach:**
1. Add `@astrojs/sitemap` to build pipeline and configure `site: "https://cloudmindspartners.com"` in `astro.config.ts`
2. Generate og:image via social card service (e.g., Satori for dynamic rendering, or Figma plugin)
3. Add Twitter Card tags in Base.astro (twitter:card, twitter:creator)
4. Create JSON-LD for Organization schema in Base.astro head
5. For article routes (memos/radar), add Article schema with author/datePublished/image
6. Optional: Create `/feeds/radar.xml` and `/feeds/memos.xml` RSS endpoints

**Priority:** Medium — not blocking, but reduces organic discoverability

---

## Content Collections Are Empty Scaffolds

**Issue:** Technical memos and regwatch collections have no published content; radar exists but not routed in nav.

**Current state:**
- `../cmp-knowledge/knowledge/memos/published/` contains only `.gitkeep`
- `../cmp-knowledge/knowledge/regwatch/` contains only `.gitkeep`
- `../cmp-knowledge/knowledge/innovation-radar/` has 6 radar entries (2026-W16 to W20b)

**Routes:**
- `/intelligence/memos/[slug].astro` renders but shows "No memos published yet"
- `/intelligence/radar/[week].astro` renders but shows "No radar entries published yet"
- `/intelligence/regwatch/[month].astro` renders but shows "No digests published yet"

**Schema enforcement:**
- Schemas in `src/content.config.ts` (lines 15–80) are strict: `publish: true` gate exists
- Radar entries default `published: false` (line 60)
- Regwatch entries default `published: false` (line 76)

**Files:**
- `src/content.config.ts:8-9, 42-43, 44` (conditional filters on `publish`/`published`)
- `src/pages/intelligence/memos/index.astro:44-45` (empty state message)
- `src/pages/intelligence/radar/index.astro:42-43` (empty state message)
- `src/pages/intelligence/regwatch/index.astro:42-43` (empty state message)

**Impact:** These sections appear in nav but are dead; users see "not published yet" which signals incomplete product. Radar content exists but won't render without `published: true` flip.

**Fix approach:**
1. Decide publishing gate: keep schema gate (safest) or move to URL structure (`published/` vs `drafts/` folders)
2. For radar: bulk-flip `published: true` on existing entries or re-render with gate disabled for staging
3. For memos: once first memo is authored in `cmp-knowledge`, flip publish gate
4. Consider hiding "Regulatory Watch" from nav in `/intelligence` subnav until first entry exists (or keep as empty state)
5. Update empty state messaging to differentiate between "coming soon" and "none published"

**Priority:** Low — not a bug, but UX signal of incomplete feature

---

## Firebase Deploy CI Fragility — Missing Token Handling

**Issue:** Deployment depends on two optional secrets; missing tokens silently skip steps rather than hard-failing.

**Current approach (`.github/workflows/deploy.yml`):**
- Lines 21-22: Feature flags `HAS_KNOWLEDGE_TOKEN`, `HAS_FIREBASE_TOKEN` check string equality
- Lines 30-35: If `CMP_KNOWLEDGE_READ_TOKEN` missing, creates empty `cmp-knowledge/` directory
- Lines 81-86: If `FIREBASE_TOKEN` missing, logs warning and skips deploy

**Problem:** Build appears "successful" but with silent skips:
- Build succeeds with empty content collections if knowledge token missing
- Deployment skips if Firebase token missing but build log shows "warning" not "failure"
- No explicit check that production build is actually deploying (deploy step could be silently skipped)

**Files:**
- `.github/workflows/deploy.yml:20-86`
- `firebase.json:5` (cleanUrls, trailingSlash settings OK)

**Risk scenario:**
1. Developer forgets to set FIREBASE_TOKEN after env rotation
2. Push to main → build succeeds, deploy warns then skips
3. Old version stays live; no alert to developer

**Fix approach:**
1. Make deploy step fail explicitly if FIREBASE_TOKEN missing: `if: env.HAS_FIREBASE_TOKEN != 'true'` should run `exit 1` not `echo warning`
2. Add post-build validation: check that `/dist/` contains expected routes (e.g., `/intelligence/`) and fail if collections are empty
3. Add workflow notification to Slack/email on deploy skip (optional but recommended)
4. Document in README that both secrets are required for production deploy
5. Consider pre-flight check: validate tokens exist before starting build

**Priority:** Medium — not immediate risk (both secrets are set), but silent skips are dangerous pattern

---

## Newsletter Signup Form — Missing Error Recovery UX

**Issue:** Form submission has basic error handling but no retry logic or fallback messaging.

**Current state (`src/components/NewsletterSubscribe.astro:38-78`):**
- Inline fetch to `https://us-central1-dcplatformcmp.cloudfunctions.net/subscribe`
- Error states: network failure, JSON parse failure, non-200 response
- Shows generic "Something went wrong. Try again in a minute." (line 63)
- No indication of rate-limiting, server maintenance, or retry backoff

**Constraints:**
- Endpoint is Cloud Function in `dcplatformcmp` (external to this repo)
- No visibility into whether failures are transient (server down) vs permanent (invalid email)
- Form disables button during request but doesn't prevent double-submit while disabled

**Files:**
- `src/components/NewsletterSubscribe.astro:38-78` (subscribe logic)
- `src/config/social.ts:15` (endpoint URL hardcoded)

**Risk:** Users may assume subscription failed and try multiple times, creating duplicate requests.

**Fix approach:**
1. Add exponential backoff retry: retry once after 2s if fetch fails (network error only, not 4xx)
2. Differentiate error messages:
   - "Email already subscribed" (status 400 + specific code)
   - "Server temporarily down" (500+) with "Try again in 2 minutes"
   - "Check your spam folder for confirmation" (success)
3. Add `disabled` attribute during request to prevent double-submit (already done via `btn.disabled`)
4. Log non-200 responses with error code to analytics for debugging (optional)
5. Consider adding "Subscribe via link" fallback if form fails (e.g., `/subscribe?email=...` URL that pre-fills email)

**Priority:** Low — fallback endpoint exists (`social.newsletterLanding` = dcinsights.web.app), but UX could be clearer

---

## WhatsApp FAB Configuration — Personal Number in Production

**Issue:** WhatsApp FAB hard-coded to Edgard's personal number pending CMP dedicated number setup.

**Current state (`src/config/social.ts:9-10`):**
- `whatsappNumber: "5511915788796"` (Edgard's personal +55 11 91578-8796)
- Comment notes "swap for dedicated CMP number when available"
- FAB shows only when number ≥10 digits (line 3 of WhatsAppFab.astro)

**Impact:** All users who scan/click WhatsApp link contact Edgard directly, not CMP general queue. May overwhelm personal inbox.

**Files:**
- `src/config/social.ts:9` (hardcoded number)
- `src/components/WhatsAppFab.astro:3, 6-19` (renders conditionally)

**Fix approach:**
1. Allocate dedicated WhatsApp Business number (via Meta Business API or standard +55 number)
2. Update `social.ts:9` with new number
3. Set up WhatsApp Business account with CMP branding / auto-responses if needed
4. Optional: Route messages to team inbox or ticketing system (Zendesk, etc.)

**Priority:** High-visibility low-urgency — works but exposes personal contact; should be deprioritized until CMP WhatsApp number is ready

---

## Social Links Hardcoded — No Environment Variable Isolation

**Issue:** Social URLs, email, and WhatsApp number live in source code; no runtime env var override.

**Current locations (`src/config/social.ts`):**
- `linkedin`: hardcoded URL (line 6)
- `whatsappNumber`: hardcoded (line 9)
- `whatsappDefaultMessage`: hardcoded English-only (line 10)
- `emailGeneral`: hardcoded (line 12)
- `subscribeEndpoint`: hardcoded Cloud Function URL (line 15)
- `newsletterLanding`: hardcoded dcinsights URL (line 16)

**Risk:** Changing any social link requires code push + re-deploy. No ability to swap in staging/preview without build change.

**Files:**
- `src/config/social.ts:5-17`
- `src/components/WhatsAppFab.astro:2` (imports social)
- `src/components/NewsletterSubscribe.astro:2` (imports social)
- `src/components/SocialLinks.astro:2` (imports social)

**Fix approach:**
1. Wrap social config in a function that reads from `import.meta.env` (Astro's env handling)
2. Create `.env` schema with defaults (optional):
   ```
   PUBLIC_SOCIAL_LINKEDIN=https://...
   PUBLIC_SOCIAL_EMAIL=info@...
   PUBLIC_WHATSAPP_NUMBER=5511915788796
   PUBLIC_SUBSCRIBE_ENDPOINT=https://us-central1-...
   ```
3. Update `src/config/social.ts` to read from env or fall back to defaults
4. Document required env vars in README § "Environment setup"
5. Deploy workflow can set vars via GitHub repo secrets

**Priority:** Low — not urgent (URLs won't change often), but good practice for multi-tenant or staging setup

---

## Astro React Integration — Unused Dependency

**Issue:** `@astrojs/react` is installed but only `astro` and `tailwindcss` are actively used; no React components exist.

**Current:**
- `package.json:15` declares `@astrojs/react@^5.0.4`
- No `.astro/config.mjs` (or it's missing) to configure React integration
- No React imports in any component
- README § "Design decisions" (line 11-13) explicitly says "no shadcn/ui" and "pure Astro + Tailwind"

**Impact:** Adds ~500KB to node_modules; increases build time minutely. Not a blocker but technical debt.

**Files:**
- `package.json:15`
- `src/**` (no React usage)

**Fix approach:**
1. If no React component needed, remove `@astrojs/react` from package.json
2. Update Astro config to remove React integration plugin (if it exists)
3. Keep React/React-DOM in devDeps only if needing to prototype (unlikely)
4. Run `npm ci` to rebuild lock file

**Priority:** Very low — cosmetic cleanup, zero functional impact

---

## Content Locales Not Future-Proofed — cmp-knowledge Sync

**Issue:** `src/content.config.ts` assumes single-language content from `cmp-knowledge/knowledge/`. Porting to multi-language will require schema changes in both repos.

**Current assumption:**
- Memos live at `../cmp-knowledge/knowledge/memos/published/*.md`
- No language field in frontmatter schema (lines 20-42)
- No locale routing in Astro (routes are `/intelligence/memos/[slug]` not `/en/intelligence/memos/[slug]`)

**Files:**
- `src/content.config.ts:9-10, 15-42` (content loaders)
- `src/pages/intelligence/memos/[slug].astro` (single-lang route)

**Design v2 assumption:** EN/PT/ES routing requires either:
- Separate collections per language (`memos-en`, `memos-pt`, `memos-es`)
- OR language field in memo frontmatter + filtered `getCollection()` calls

**Fix approach:**
1. Add `language: z.enum(["en", "pt", "es"])` field to memo/radar/regwatch schemas in `src/content.config.ts`
2. Update `cmp-knowledge` templates to include language field
3. Migrate existing radar entries to include language: "en" (default for now)
4. Update route structure: `/intelligence/memos/[lang]/[slug]` or keep flat but filter by `Astro.props.lang`
5. Update `getCollection()` calls to filter by language when requested

**Priority:** Medium — required before design v2 i18n work, but not blocking current state

---

## Image Optimization — No Next-Gen Codec Support

**Issue:** Public photos (people images) are JPG; no WebP/AVIF variants or lazy-loading hints.

**Current state:**
- `public/people/photos/*.jpg` (8 images, ~6-50KB each)
- No image optimization during CI copy (`.github/workflows/deploy.yml:50-55` raw `cp -R`)
- No `<picture>` elements or `srcset` in `src/pages/team.astro` or people display logic

**Files:**
- `.github/workflows/deploy.yml:50-55` (copy photos)
- `public/people/photos/*.jpg` (source images)
- `src/pages/team.astro` (displays team photos — need to check)

**Impact:** Minor — modern CDN (Firebase Hosting) auto-converts JPG to next-gen, but no explicit control or fallback strategy. Lighthouse may flag missing AVIF support.

**Fix approach:**
1. Optional: Convert JPGs to AVIF (e.g., `cwebp` or ImageMagick in CI)
2. Use Astro's `<Image>` component (not `<img>`) to auto-optimize
3. Add `loading="lazy"` to people photos
4. Test Lighthouse image optimization score

**Priority:** Very low — Firebase CDN handles this; cosmetic Lighthouse improvement only

---

## Design System v4 → v2 Migration Not Documented

**Issue:** README (line 4-6) describes "serif display (Source Serif 4) + warm paper canvas" which conflicts with actual dark theme in `global.css`.

**Conflicting documentation:**
- README says: "serif display, warm paper, CMP navy accents, light theme"
- Actual CSS: dark theme (`--color-bg-base: #050E1D`), sans display (Space Grotesk), blues/teals

**Context:** Design will be ported from `../cmp-design-system/mock-26/`. Current v4 (dark theme) is being replaced.

**Files:**
- `README.md:4-6` (outdated description)
- `src/styles/global.css:4-52` (actual current theme)

**Fix approach:**
1. Update README design section to match current CSS (dark theme, no serif)
2. OR update CSS to match intended v2 design if porting has started
3. Document design version and migration timeline

**Priority:** Low — documentation only, no functional impact

---

## Mobile Menu Toggle Lacks Keyboard Support

**Issue:** Mobile nav toggle button has no keyboard-accessible close mechanism; only mouse click works.

**Current (`src/components/SiteHeader.astro:47-91`):**
- Button with `id="mobile-toggle"` (line 48)
- Mobile nav with `id="mobile-nav"` (line 59)
- Click event toggles `.hidden` class (line 90)
- No keyboard escape handler; no focus trap

**WCAG impact:** Users navigating with keyboard cannot close mobile menu.

**Files:**
- `src/components/SiteHeader.astro:47-91` (mobile menu script)

**Fix approach:**
1. Add `keydown` event listener to mobile toggle: if `key === "Escape"`, toggle menu closed
2. Optional: Add focus trap (focus remains in nav when open, cycles back to nav on Tab from last item)
3. Set `aria-expanded` attribute on toggle button to reflect menu state

**Priority:** Low-medium — accessibility issue but non-critical (menu can be closed by clicking body)

---

## Summary of Block/Blocker Issues

| Category | Issue | Blocking? | Mitigation |
|----------|-------|-----------|-----------|
| **Hardcoded English** | No i18n infrastructure | ✅ Yes — blocks design v2 | Implement Astro i18n + migrate content schema |
| **Missing SEO** | No sitemap/structured data | ❌ No — nice-to-have | Add @astrojs/sitemap + JSON-LD |
| **Empty Content** | Memos/regwatch/radar unpublished | ❌ No — cosmetic UX | Flip `publish/published` gates as content ships |
| **Firebase CI** | Silent deploy skip on missing token | ❌ No — both tokens set | Add hard fail + validation |
| **WhatsApp Number** | Personal number in prod | ❌ No — works but exposed | Swap for dedicated CMP number when ready |
| **Social Hardcoded** | No env var override | ❌ No — rarely change | Extract to env vars (good practice) |
| **React Import** | Unused dependency | ❌ No — cosmetic | Remove from package.json |
| **Content i18n** | Schemas not language-aware | ⚠️ Medium — blocks design v2 | Add language field to schemas |
| **Mobile Keyboard** | Menu not Escape-closeable | ❌ No — low impact | Add keydown handler |

---

*Concerns audit: 2026-05-16*
