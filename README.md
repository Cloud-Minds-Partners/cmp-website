# cmp-website

Cloud Minds Partners corporate website. **Astro 6 + Tailwind 4.**

## Structure

```
src/
├── components/
│   └── IntelHeader.astro        # nav for /intelligence/** pages
├── content.config.ts            # Astro content collections (memos/radar/regwatch)
├── layouts/
│   ├── Base.astro               # HTML shell (title, fonts, body classes)
│   ├── MemoLayout.astro         # /intelligence/memos/[slug]
│   ├── RadarLayout.astro        # /intelligence/radar/[week]
│   └── RegwatchLayout.astro     # /intelligence/regwatch/[month]
├── pages/
│   ├── index.astro              # homepage (3 pillars, platforms, contact)
│   └── intelligence/
│       ├── index.astro          # intelligence hub — lists all 3 streams
│       ├── memos/
│       │   ├── index.astro      # list of published memos
│       │   └── [slug].astro     # memo detail page
│       ├── radar/
│       │   ├── index.astro
│       │   └── [week].astro
│       └── regwatch/
│           ├── index.astro
│           └── [month].astro
└── styles/global.css
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

### Production build (CI)

CI workflow must clone `cmp-knowledge` before `astro build`:

```yaml
- uses: actions/checkout@v4
  with:
    repository: Cloud-Minds-Partners/cmp-knowledge
    path: ../cmp-knowledge
    token: ${{ secrets.CMP_KNOWLEDGE_READ_TOKEN }}
- uses: actions/checkout@v4
  with:
    path: cmp-website
- run: npm ci
  working-directory: cmp-website
- run: npm run build
  working-directory: cmp-website
```

`CMP_KNOWLEDGE_READ_TOKEN` = fine-grained PAT with read access on
`Cloud-Minds-Partners/cmp-knowledge`.

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
