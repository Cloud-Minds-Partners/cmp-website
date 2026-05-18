---
phase: 05-deploy
plan: 05-00
subsystem: ci-cd
tags: [deploy, ci, lighthouse, firebase, preview-channels]
dependency_graph:
  requires: [04-00]
  provides: [DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04]
  affects: [.github/workflows/deploy.yml, firebase.json]
tech_stack:
  added: [FirebaseExtended/action-hosting-deploy@v0, "@lhci/cli"]
  patterns: [pre-flight-hard-fail, preview-channels, artifact-validation]
key_files:
  created:
    - .lighthouserc.json
    - src/pages/404.astro
    - tests/phase5-deploy.spec.ts
  modified:
    - .github/workflows/deploy.yml
decisions:
  - Migrated from legacy FIREBASE_TOKEN (CI token) to FIREBASE_SERVICE_ACCOUNT_DCPLATFORMCMP (service account JSON) — service account is the current recommended approach; action-hosting-deploy@v0 posts preview URL comment on PRs automatically
  - Pre-flight step exits 1 before build starts if deploy secret absent — prevents wasted build minutes on non-deployable runs
  - CMP_KNOWLEDGE_READ_TOKEN remains optional (content-only secret, not deploy gate) — site builds correctly with empty collections; this is acceptable for staging/dev branches
  - Post-build artifact validation hard-fails if dist/ missing index.html, sitemap-index.xml, robots.txt, or 404.html — catches Astro config regressions before deploy
  - Lighthouse CI uses static dist/ (lhci autorun with staticDistDir) — avoids needing a background server in CI; no-pwa preset since PWA is out of scope
metrics:
  duration: 8m
  completed: "2026-05-18"
  tasks_completed: 4
  files_changed: 4
---

# Phase 05 Plan 00: Deploy Phase Consolidated Summary

CI/CD pipeline hardened with pre-flight secret gate (hard fail, no silent skip), Firebase preview channels per branch, Lighthouse CI (perf ≥0.9, a11y ≥0.95, seo ≥0.95), production cutover documented, and 404 page added.

## What Was Built

### Task 1: Workflow audit + hardening

Current workflow had two silent-skip patterns (CMP rule #8b violation):

1. `FIREBASE_TOKEN` missing → log warning + skip deploy silently (lines 82-86)
2. `CMP_KNOWLEDGE_READ_TOKEN` missing → warn + continue with empty dirs

Fixed by:
- Added **pre-flight step** at top of job: asserts `FIREBASE_SERVICE_ACCOUNT_DCPLATFORMCMP` is set; if empty, `exit 1` with clear error message before any build work begins
- Migrated from legacy `FIREBASE_TOKEN` + `firebase deploy --token` CLI pattern to `FirebaseExtended/action-hosting-deploy@v0` (service account JSON secret)
- `CMP_KNOWLEDGE_READ_TOKEN` kept as soft gate (warn + empty dirs) — content is optional, deploy is not
- Added **post-build artifact validation** step: hard-fails if `index.html`, `sitemap-index.xml`, `robots.txt`, or `404.html` are missing from `dist/`
- Removed all `continue-on-error: true` patterns (none existed, confirmed)

### Task 2: Lighthouse CI

Added `.lighthouserc.json` with thresholds:
- Performance: ≥ 0.90 (error)
- Accessibility: ≥ 0.95 (error)
- SEO: ≥ 0.95 (error)

Workflow installs `@lhci/cli` globally and calls `lhci autorun` against static `./dist` (no server needed, uses `staticDistDir` collect config). Desktop preset, no-pwa preset since PWA is out of scope.

### Task 3: Preview channels per branch

- `on: push: branches: "**"` — all branches now trigger the workflow
- `if: github.ref != 'refs/heads/main'` → deploy to `preview-{branch-name}` channel, expires 7d, auto-posts PR comment with preview URL
- `if: github.ref == 'refs/heads/main'` → deploy to `live` channel
- `concurrency.group` scoped per `${{ github.ref }}` — multiple branches can run in parallel without cancelling each other

### Task 4 (deviation): 404.astro created

**Rule 1 auto-fix (Bug):** `firebase.json` rewrites `**` to `/404.html`, but no `src/pages/404.astro` existed. The artifact validation step in the workflow would fail on every push. Created minimal on-brand 404 page matching site design (dark theme, teal accent, back-to-home link).

### Task 4: Playwright smoke tests

`tests/phase5-deploy.spec.ts` — 11 tests, all passing, no browser required:
- dist/ artifacts exist (index.html, sitemap-index.xml, robots.txt, 404.html, og/*.png)
- workflow has no `continue-on-error: true`
- workflow references `FIREBASE_SERVICE_ACCOUNT_DCPLATFORMCMP` (not legacy token)
- workflow has pre-flight `exit 1`
- workflow configures preview channel + live channel
- `.lighthouserc.json` present with correct threshold values

## Cutover Plan

### Pre-cutover state
Current `dcplatformcmp.web.app` serves the v4 Crusoe design (commit `8e4b045`, deployed from `main` branch before this work started). The new design (mock-26, dark tech theme) is on branch `design/v2-tech-dark`.

### Cutover steps

1. **Final validation on branch** — run `npm run build` locally, spot-check in `npx astro preview`
2. **Push branch to GitHub** — triggers preview channel deploy to `preview-design-v2-tech-dark.dcplatformcmp.web.app`
3. **QA preview URL** — verify home, team, intelligence, contact, 404 render correctly
4. **Merge PR: `design/v2-tech-dark` → `main`** — triggers live channel deploy automatically
5. **Verify live** — visit `dcplatformcmp.web.app`, confirm mock-26 design is serving

### Rollback path

**Option A — Firebase rollback (fastest, ~30s):**
```bash
firebase hosting:rollback --site cmp-website --project dcplatformcmp
```
Reverts to the previous release in Firebase Hosting history. No git changes needed.

**Option B — Git revert (auditable):**
```bash
git revert -m 1 <merge-commit-hash>
git push origin main
```
Triggers new deploy of reverted state.

**Option C — Direct channel promote (if available):**
```bash
firebase hosting:channel:deploy live --site cmp-website --project dcplatformcmp
```
Promote a known-good preview channel to live.

## GitHub Actions Secret Requirements

Before merging to main, ensure these secrets are set in repo settings:

| Secret | Required | Purpose |
|--------|----------|---------|
| `FIREBASE_SERVICE_ACCOUNT_DCPLATFORMCMP` | YES — hard fail if missing | Service account JSON for Firebase Hosting deploy |
| `CMP_KNOWLEDGE_READ_TOKEN` | Optional | PAT to checkout `cmp-knowledge` content repo |
| `LHCI_GITHUB_APP_TOKEN` | Optional | Lighthouse CI status annotations on PRs (works without it) |

To generate `FIREBASE_SERVICE_ACCOUNT_DCPLATFORMCMP`:
1. Firebase Console → `dcplatformcmp` project → Settings → Service Accounts
2. "Generate new private key" → download JSON
3. Add full JSON content as repo secret

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Missing 404.astro page**
- **Found during:** Task 4 (artifact validation step would fail in CI)
- **Issue:** `firebase.json` rewrites all unmatched routes to `/404.html`, but no `src/pages/404.astro` existed. Post-build validation check added in this phase would hard-fail on every push.
- **Fix:** Created `src/pages/404.astro` with on-brand design (dark theme, teal accent, monospace 404 label, back-to-home CTA)
- **Files modified:** `src/pages/404.astro` (new)
- **Commit:** `602f8bb`

## Self-Check: PASSED

All claimed files exist on disk. Both commits (`602f8bb` feat, `a779dca` docs) confirmed in git log. PLAN.md verification block passes (no silent-skip, live channel, lighthouse, firebase.json). 11/11 Playwright smoke tests pass.
