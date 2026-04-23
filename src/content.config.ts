import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Content sources live in the cmp-knowledge repo (sibling directory).
// - Local dev: cmp-knowledge must be checked out at ../cmp-knowledge
// - CI build:  workflow clones cmp-knowledge before `astro build`
// See README.md § "Content sync".

const KNOWLEDGE_ROOT = "../cmp-knowledge/knowledge";
const PEOPLE_ROOT = "../cmp-knowledge/people";

// ——— Memos ——————————————————————————————————————
// Only memos with `publish: true` are rendered. Draft/review/approved-but-
// not-published are excluded in the route pages, not here.
const memos = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: `${KNOWLEDGE_ROOT}/memos/published`,
  }),
  schema: z.object({
    title: z.string().min(8).max(120),
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    type: z.literal("memo"),
    status: z.enum(["draft", "review", "approved", "published"]),
    publish: z.boolean(),
    topic: z.string(),
    jurisdiction: z.object({
      country: z.enum(["BR", "MX", "CL", "AR", "CO", "PE", "UY"]),
      scope: z.enum(["federal", "state", "municipal", "sectoral"]),
      region: z.string().optional().default(""),
    }),
    author: z.string(),
    reviewer: z.string().optional().default(""),
    created: z.coerce.date(),
    updated: z.coerce.date(),
    word_count: z.number().int().min(0).optional(),
    sources_count: z.number().int().min(0).optional(),
    audit_status: z.enum(["pending", "passed", "blocked"]),
    audit_notes: z.string().optional().default(""),
    tags: z.array(z.string()).optional().default([]),
    carousel_data: z.string().optional().default(""),
  }),
});

// ——— Innovation Radar —————————————————————————————
// Fields are optional on purpose: entries authored before the template landed
// (2026-W16 and earlier) have no frontmatter. `published: false` is the gate —
// entries without it never render. New entries use the template with all fields.
const radar = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: `${KNOWLEDGE_ROOT}/innovation-radar`,
  }),
  schema: z.object({
    week: z.string().regex(/^\d{4}-W?\d{2}$/i).optional(),
    period_start: z.coerce.date().optional(),
    period_end: z.coerce.date().optional(),
    author: z.string().default("intel@"),
    reviewer: z.string().optional().default(""),
    published: z.boolean().default(false),
    sources_scanned: z.record(z.string(), z.boolean()).optional(),
    tags: z.array(z.string()).optional().default([]),
  }),
});

// ——— Regulatory Watch —————————————————————————————
const regwatch = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: `${KNOWLEDGE_ROOT}/regwatch`,
  }),
  schema: z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    author: z.string().default("intel@"),
    reviewer: z.string().optional().default(""),
    published: z.boolean().default(false),
    jurisdictions_scanned: z.record(z.string(), z.boolean()).optional(),
    tags: z.array(z.string()).optional().default([]),
  }),
});

// ——— People ———————————————————————————————————————
// Partners live at people/*.md, advisors at people/advisors/*.md.
// Photos are copied from cmp-knowledge/people/photos/ into public/people/ at
// build time (see .github/workflows/deploy.yml).
const people = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: PEOPLE_ROOT,
  }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    linkedin: z.union([z.string(), z.boolean()]).optional(),
    photo: z.string().optional(),           // path relative to people/
    photo_position: z.string().optional(),  // CSS object-position override (e.g. "center 20%")
    source: z.string().optional(),
  }),
});

export const collections = { memos, radar, regwatch, people };
