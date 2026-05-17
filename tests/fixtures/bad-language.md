---
title: Bad Language Fixture
slug: bad-language-fixture
type: memo
status: draft
publish: false
topic: test
jurisdiction:
  country: BR
  scope: federal
author: test
created: 2026-01-01
updated: 2026-01-01
audit_status: pending
language: fr
---
This fixture exists to verify CONT-01: a `language: fr` value should cause astro build to fail
with a Zod validation error once the language field is added to the memos schema.
Do NOT add this file to the memos glob (it lives in tests/fixtures/, not cmp-knowledge/).

CONT-01 negative test procedure (manual — cannot be fully automated without build-time side effects):
1. Temporarily copy this file to `../cmp-knowledge/knowledge/memos/published/bad-language-fixture.md`
2. Run `npx astro build`
3. Confirm build exits non-zero with a Zod validation error mentioning "language" and "fr"
4. Remove the file: `rm ../cmp-knowledge/knowledge/memos/published/bad-language-fixture.md`
5. Confirm `npx astro build` exits 0 again
