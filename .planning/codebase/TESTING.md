# Testing Patterns

**Analysis Date:** 2026-05-16

## Test Framework

**Status:** No test framework configured.

This is a **marketing website** (Astro static site) with minimal dynamic functionality. No tests exist in the codebase, and no test runner is installed.

**Why no tests:**
- Mostly static content rendered at build time from Astro collections
- Minimal JavaScript (form submission, mobile nav toggle)
- Content validation handled by Zod schema at build time (not runtime)
- No backend logic, no APIs, no data mutations
- Astro's type-safe frontmatter validation provides some assurance

**When tests would be needed:**
- Interactive features become complex (more than toggle/form)
- API integrations are added
- Client-side state management is introduced
- Build-time data processing logic grows

## Testing Needs Analysis

### Currently Testable Without Framework

**1. Build Integrity**
- Astro build succeeds with all content loaded
- Collections parse frontmatter correctly (Zod validates at build time)
- No broken links in generated output
- Pages render without TypeScript errors

**Current approach:** Manual `npm run build` before commit.

**2. Form Submission**
- NewsletterSubscribe component at `src/components/NewsletterSubscribe.astro` (lines 38-78)
- Validates email format with regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Handles API response states (subscribed, already_subscribed, error)
- Updates UI with status messages (success in teal, error in red)

**Current approach:** Manual testing in browser (no automated tests).

**3. Content Collections**
- Zod schema in `src/content.config.ts` validates all frontmatter at build time
- Memos: 15 fields with type constraints (status, jurisdiction, dates, etc.)
- Radar: 7 optional fields, published boolean gates visibility
- Regwatch: 5 optional fields, published boolean gates visibility

**Current approach:** Validation by `astro build` — build fails if schema doesn't match.

### Not Testable Without Framework

**Navigation & Layout**
- Mobile nav toggle in `SiteHeader.astro` (lines 87-91)
- Subnav rendering logic
- Active state highlighting
- Responsive breakpoints

**Rendering & Templates**
- Component composition in pages (index.astro, platforms.astro, etc.)
- Conditional rendering (e.g., `latest?.videoUrl` in WeeklyPulseSection)
- Loop rendering (`{platforms.map()}` in index.astro)
- Inherited layout props flowing through MemoLayout, RadarLayout

**Styling & Visual Regressions**
- Tailwind utility application
- CSS custom property inheritance
- Responsive layout behavior at different breakpoints
- Hover/focus states on buttons and links

## Recommended Testing Strategy

### Phase 1: Build & Content Validation (Zero Friction)

Add a pre-commit hook to ensure:
1. `npm run build` succeeds
2. No TypeScript errors
3. All collections parse without Zod validation errors

```bash
#!/bin/bash
npm run build || exit 1
```

This catches schema violations and import errors before push.

### Phase 2: Visual Regression Testing (If Needed)

If interactive features grow beyond current toggle/form:
- Playwright for form submission tests (NewsletterSubscribe)
- Playwright for navigation tests (mobile nav toggle)
- Lighthouse CI for performance/accessibility audits

**Not recommended now:** The overhead of setting up Playwright for two simple interactions (form submit, nav toggle) exceeds the value.

### Phase 3: API Integration Tests (If External APIs Added)

If newsletter subscribe endpoint changes or new integrations are added:
- Mock the Cloud Function endpoint
- Test success/error response handling
- Validate request format (email lowercase, trimmed)

## Manual Testing Checklist

Use this checklist before deploying to production:

**Build & Deployment:**
- [ ] `npm run build` completes without errors
- [ ] `npm run preview` shows expected output
- [ ] No console errors in browser DevTools

**Navigation:**
- [ ] Desktop nav renders all menu items
- [ ] Mobile nav toggle shows/hides menu on click
- [ ] Subnav appears on /intelligence/* pages
- [ ] Active page highlighted in nav

**Content:**
- [ ] All published memos appear in /intelligence/memos
- [ ] Memo detail page renders frontmatter (author, date, tags, jurisdiction)
- [ ] All published radar entries appear in /intelligence/radar
- [ ] All published regwatch entries appear in /intelligence/regwatch

**Forms:**
- [ ] Newsletter subscribe form validates email format
- [ ] Empty email shows: "Please enter a valid email."
- [ ] Invalid email shows: "Please enter a valid email."
- [ ] Valid email submission shows: "Thanks — you're in. Check your inbox for confirmation." (or "already on list" if subscribed)
- [ ] Network error shows: "Couldn't reach the server. Try again in a minute."
- [ ] Server error shows: "Something went wrong. Try again in a minute."
- [ ] Button is disabled during submission
- [ ] Form resets after successful submission

**Responsive (mobile):**
- [ ] Layout works at 375px (iPhone SE)
- [ ] Layout works at 768px (iPad)
- [ ] Text is readable, no overflow
- [ ] Mobile nav toggle works (no width issues)
- [ ] Images scale appropriately

**Styling:**
- [ ] Dark sections (hero, contact CTA) render correctly
- [ ] Light sections render correctly
- [ ] Buttons have hover/focus states
- [ ] Links have underline slide animation on hover
- [ ] Card shadows appear on hover
- [ ] Color contrast passes accessibility standards

**Performance:**
- [ ] Page loads in <3s on slow 4G (Chrome DevTools throttle)
- [ ] Fonts load without layout shift (Preconnect links in place)
- [ ] Images lazy-load if present
- [ ] No console warnings

## Content Build Validation

The content pipeline is critical because content comes from `../cmp-knowledge/`:

**Before Deploy:**
1. Ensure `cmp-knowledge` is cloned as a sibling directory
2. Run `npm run build` — it will fail if:
   - Content files exist but don't match Zod schema
   - Glob loader can't find `knowledge/memos/published/`, `knowledge/innovation-radar/`, etc.
   - Date fields are malformed
   - Required enum values (country, status, scope) are invalid

3. Check `.github/workflows/deploy.yml` — it clones `cmp-knowledge` before build, so CI catches issues early

**No Schema Mismatch:**
If frontmatter was edited in `cmp-knowledge` and schema not updated in `content.config.ts`, build fails immediately with a clear Zod error.

## Coverage

**Requirements:** None enforced.

**What's covered by build-time validation:**
- Frontmatter schema (Zod) — ~95% of data entry errors caught at build
- TypeScript strict mode — type errors caught at build

**What's not covered:**
- Rendering output (HTML structure, CSS styles)
- User interactions (form submission, nav toggle)
- Cross-browser compatibility
- Accessibility compliance (beyond basic semantic HTML)

## Known Gaps

### No Regression Tests for Visual Changes

If a designer changes `.display-lg` font size or button padding, there's no automated check to catch unintended side effects.

**Mitigation:** Rely on manual visual inspection during code review and pre-deploy checklist above.

### No API Integration Tests

Newsletter subscribe endpoint is mocked in form submission (`define:vars`), but no test validates that the actual Cloud Function behavior matches expectations.

**Mitigation:** Test manually in dev, monitor Brevo + Cloud Function logs in production.

### No Accessibility Audits

No automated a11y checking (Lighthouse CI, axe, etc.).

**Mitigation:** Manual spot checks with browser DevTools, semantic HTML structure (h1/h2, nav, main, etc.), focus outlines in place.

### No Performance Budgets

No enforced Lighthouse scores or bundle size limits.

**Mitigation:** Manual Lighthouse audit before deploy. Monitor Core Web Vitals in production.

## Test Data & Fixtures

**None required.** All test data comes from `cmp-knowledge` content files at build time.

**For manual testing:**
- Use actual published memos/radar/regwatch from `cmp-knowledge`
- Test with real newsletter endpoint (`define:vars` in `social.config.ts`)
- Never hardcode fake data for testing; always use production content

---

*Testing analysis: 2026-05-16*
