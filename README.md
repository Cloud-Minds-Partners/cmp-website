# cmp-website

Cloud Minds Partners corporate website. **Astro 6 + Tailwind 4** + `@tailwindcss/typography`.

Editorial aesthetic: serif display (Source Serif 4) + Inter body + JetBrains Mono
captions. Warm paper canvas (`#FAF8F5`), CMP navy accents, minimal chrome.

## Design decisions

- **No shadcn/ui** — the site is mostly static editorial content, so the
  React runtime + component library would be dead weight. Pure Astro + Tailwind
  covers every need here. Add shadcn (and `@astrojs/react`) only if a specific
  interactive component demands it later.
- **No content lives in this repo.** Memos, radar, and regwatch come from the
  private `cmp-knowledge` repo (see "Content source" below).
- **Light theme only.** Dark inverted sections appear where editorial contrast
  helps, but the site is fundamentally a light reading surface.

## Structure

```
src/
├── components/
│   ├── SiteHeader.astro         # sticky top nav + optional subnav
│   ├── SiteFooter.astro         # sitemap + legal
│   └── Section.astro            # semantic section wrapper (eyebrow/title/lede)
├── content.config.ts            # Astro content collections (memos/radar/regwatch)
├── layouts/
│   ├── Base.astro               # HTML shell (fonts, meta, og)
│   ├── MemoLayout.astro         # /intelligence/memos/[slug]
│   ├── RadarLayout.astro        # /intelligence/radar/[week]
│   └── RegwatchLayout.astro     # /intelligence/regwatch/[month]
├── pages/
│   ├── index.astro              # homepage (editorial hero, 3 pillars, platforms, contact)
│   ├── advisory.astro           # 01 / Advisory
│   ├── development.astro        # 02 / Project Development
│   ├── platforms.astro          # SST, Land Intel, TestFit, DC Insights, Atlas
│   ├── team.astro               # Edgard + Gustavo + advisor domains (bios forthcoming)
│   ├── contact.astro            # email + markets + response SLA
│   └── intelligence/
│       ├── index.astro          # intelligence hub — lists 3 streams
│       ├── memos/
│       │   ├── index.astro      # list of published memos
│       │   └── [slug].astro     # memo detail (via MemoLayout)
│       ├── radar/
│       │   ├── index.astro
│       │   └── [week].astro
│       └── regwatch/
│           ├── index.astro
│           └── [month].astro
└── styles/global.css            # Tailwind 4 tokens + typography utilities
```

## Content source

Content lives in the `cmp-knowledge` repository (private), not here.
`src/content.config.ts` uses Astro's `glob` loader to read from
`../cmp-knowledge/knowledge/`:

| Collection | Source path (relative to this repo) |
|---|---|
| memos | `../cmp-knowledge/knowledge/memos/published/**/*.md` |
| radar | `../cmp-knowledge/knowledge/innovation-radar/**/*.md` |
| regwatch | `../cmp-knowledge/knowledge/regwatch/**/*.md` |

### Local dev

Clone `cmp-knowledge` as a sibling directory:

```
Projects/CODE/
├── cmp-knowledge/    (private, required for content)
└── cmp-website/      (this repo)
```

Then:

```bash
npm install
npm run dev            # serves localhost:4321
```

### Production build + deploy (CI)

Workflow at `.github/workflows/deploy.yml` triggers on push to `main` (paths
default, README-only changes skipped) and on `workflow_dispatch`.

It clones `cmp-knowledge` as a sibling, builds Astro, and deploys to the
`cmp-website` Firebase Hosting site in project `dcplatformcmp`.

**Hosting target:** `https://cmp-website.web.app` (custom domain later).

**Required repository secrets:**

| Secret | Purpose |
|---|---|
| `CMP_KNOWLEDGE_READ_TOKEN` | Fine-grained PAT with read access on `Cloud-Minds-Partners/cmp-knowledge`. |
| `FIREBASE_TOKEN` | Firebase CI token (`firebase login:ci`). Same value used in SST repo. |

First-time setup (already done 2026-04-23):
```bash
firebase hosting:sites:create cmp-website --project dcplatformcmp
# Target mapping is in .firebaserc
```

### Publishing flow

1. Author memo in `cmp-knowledge/knowledge/memos/drafts/<slug>.md`.
2. `uv run cmp-memo audit <slug>` → PASS.
3. Peer review by ops@, then `status: approved`.
4. `uv run cmp-memo publish <slug>` → moves file to `knowledge/memos/published/`
   and flips `publish: true`.
5. Push to `cmp-knowledge/main` → CI here rebuilds and deploys.

Radar and regwatch entries follow the same pattern but flip `published: true`
manually (no CLI — see `cmp-knowledge/operations/runbooks/innovation-radar.md`
and `regulatory-watch.md`).

## Frontmatter schemas

Canonical schemas live in `cmp-knowledge`:

- `_templates/content/memo-frontmatter.schema.yaml`
- `_templates/content/technical-memo.md`
- `_templates/content/radar-entry.md`
- `_templates/content/regwatch-digest.md`

`src/content.config.ts` mirrors these via Zod. If you edit the source schema,
update both.

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Static build to `./dist/` |
| `npm run preview` | Preview built site |

Build succeeds even with zero published content — empty lists render as
"No X published yet" and the `[slug]` / `[week]` / `[month]` routes skip.
