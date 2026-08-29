<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Product (invitation templates)

This repo is **one product**: digital event invitations sold as visual templates, not 20 separate Next.js apps or Vercel projects.

- One Next.js app, one Vercel project, many skins. A client order is **content** (names, date, photos, copy) plus a **template id**, not a git fork.
- Do not copy the whole repository per client. Do not hardcode event names, dates, or venues inside layout/components; read from the event content module (today [`src/content.ts`](src/content.ts)).
- Shared page blocks: hero, countdown, gallery/story, details, map, RSVP. A template may hide a block or change order/look; it must not invent an incompatible content schema without updating [`docs/content-schema.md`](docs/content-schema.md).
- One RSVP form and API for all templates. Storage (email, sheet, database) is a later product decision — do not wire a new provider per template.
- Deploy is the product. New events should become URLs like `/slug` on the same deployment. Do not create a new Vercel project per design.
- Template ideas live in [`docs/templates-catalog.md`](docs/templates-catalog.md). Do not implement all catalog rows at once; extract `templates/` only after the catalog is agreed.
- Product notes: [`docs/product.md`](docs/product.md).
