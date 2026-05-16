# External Integrations

**Analysis Date:** 2026-05-16

## APIs & External Services

**Newsletter Subscription:**
- Cloud Function at `us-central1-dcplatformcmp.cloudfunctions.net/subscribe`
  - Method: POST
  - Payload: `{ email: string }`
  - Response: `{ status: "subscribed" | "already_subscribed", error?: string }`
  - Backend: Brevo email list management
  - Called from: `src/components/NewsletterSubscribe.astro` (client-side fetch)

**Video Hosting:**
- YouTube — Embedded via iframe from `youtube.com/embed/{videoId}`
- Vimeo — Embedded via iframe from `player.vimeo.com/video/{videoId}`

**Maps & Geolocation:**
- Not detected (LatamPulseMap component present but backend TBD)

## Data Storage

**Content Sources:**
- `cmp-knowledge` repository (private, GitHub) — Single source of truth for memos, radar, regwatch, people
  - Memos: markdown with audit status, topic, jurisdiction metadata
  - Radar: innovation entries by week
  - Regwatch: regulatory updates by month
  - People: partner/advisor profiles with photos

**File Storage:**
- Static assets in `public/` (served by Firebase Hosting)
  - People photos staged from `cmp-knowledge/people/photos/` at build time
  - Favicon at `public/favicon.svg`

**Databases:**
- Not used — fully static site with no runtime state

**Caching:**
- Firebase Hosting cache rules configured in `firebase.json`:
  - Immutable assets (JS, CSS, fonts, images): `max-age=31536000` (1 year)
  - HTML: `max-age=0, must-revalidate` (no caching)

## Authentication & Identity

**Auth Provider:**
- None required — site is public
- Newsletter subscribe endpoint handles Brevo auth server-side

## Monitoring & Observability

**Error Tracking:**
- Not detected

**Logs:**
- GitHub Actions workflow logs available at `.github/workflows/deploy.yml`
- Build/deploy warnings logged to GHA console

## CI/CD & Deployment

**Hosting:**
- Firebase Hosting (`dcplatformcmp` project, target: `cmp-website`)

**CI Pipeline:**
- GitHub Actions (`.github/workflows/deploy.yml`)
- Trigger: Push to `main` branch (README/gitignore changes excluded) or manual `workflow_dispatch`
- Steps:
  1. Checkout `cmp-website` repo
  2. Checkout `cmp-knowledge` repo (if `CMP_KNOWLEDGE_READ_TOKEN` set)
  3. Stage people photos (`cmp-knowledge/people/photos/` → `public/people/photos/`)
  4. Setup Node 22 with npm cache
  5. `npm ci` (clean install)
  6. `npm run build` (Astro static build)
  7. Firebase deploy to `dcplatformcmp:hosting:cmp-website` (if `FIREBASE_TOKEN` set)

**Build Fallback:**
- If `CMP_KNOWLEDGE_READ_TOKEN` missing: Builds with empty content collections (directories stubbed)
- If `FIREBASE_TOKEN` missing: Build succeeds but deploy skipped with warning

## Environment Configuration

**Required env vars (GitHub Actions secrets):**
- `CMP_KNOWLEDGE_READ_TOKEN` — Fine-grained PAT with read access to `Cloud-Minds-Partners/cmp-knowledge`
  - Used by workflow step: "Checkout cmp-knowledge (content source)"
  - Without it: Content collections empty, build succeeds
- `FIREBASE_TOKEN` — Firebase CI token from `firebase login:ci`
  - Used by workflow step: "Deploy to Firebase Hosting"
  - Without it: Build succeeds, deploy skipped

**Local Development:**
- No required env vars
- Optional: `.env.production` for environment-specific config (gitignored)

**Social Config:**
- `src/config/social.ts` — Hardcoded URLs for LinkedIn, WhatsApp, email, newsletter endpoint
  - LinkedIn: `https://www.linkedin.com/company/cloud-minds-partners`
  - WhatsApp: `5511915788796` (Edgard's number, swap when CMP number available)
  - Email: `info@cloudmindspartners.com`
  - Newsletter landing: `https://dcinsights.web.app`

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Newsletter subscribe POST to Cloud Function (user-initiated via form submit)

## External Dependencies

**CDN (Google Fonts):**
- Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`
- Loaded fonts: Inter, Space Grotesk, JetBrains Mono (see `src/layouts/Base.astro`)

**Related Services (not directly integrated):**
- `dcplatformcmp.web.app` — Site Selection Tool (SST)
- `land-price-dashboard.web.app` — Land Intel
- `dc-testfit-pro.web.app` — TestFit Pro
- `dcinsights.web.app` — DC Insights newsletter landing (separate Firebase Hosting project)
- `atlas-dc-pipeline-cmp.web.app` — Atlas DC Dashboard (separate Firebase project)

---

*Integration audit: 2026-05-16*
