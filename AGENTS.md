<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Product (invitation templates)

This repo is **one product**: digital event invitations sold as visual templates, not 20 separate Next.js apps or Vercel projects.

- One Next.js app, one Vercel project, many skins. A client order is **content** (names, date, photos, copy) plus a **template id**, not a git fork.
- Do not copy the whole repository per client. Do not hardcode event names, dates, or venues inside layout/components; read from event data ([`src/events/`](src/events/) for demos, Neon `events` for cabinet-created invites; types in [`src/content/types.ts`](src/content/types.ts)). Resolve a guest slug with [`resolveEvent`](src/lib/resolve-event.ts) (DB first, then git).
- Shared page blocks: hero, countdown, gallery/story, details, map, RSVP. **Countdown is required on every skin** (must render [`Countdown`](src/components/Countdown.tsx) from `event.iso`; look/placement may change). Other blocks may be restyled or reordered. Do not invent an incompatible content schema without updating [`docs/content-schema.md`](docs/content-schema.md).
- One RSVP form and API for all templates. Persist RSVP in one store for every skin when that work is `now`; do not add a new email/sheet/db per template.
- Deploy is the product. New events should become URLs like `/slug` on the same deployment. Do not create a new Vercel project per design.
- Template ideas live in [`docs/templates-catalog.md`](docs/templates-catalog.md). Do not implement the full catalog; follow the `now` issue.
- Product notes: [`docs/product.md`](docs/product.md). How we pick work: [`docs/backlog.md`](docs/backlog.md).
- **Work queue:** GitHub Issues = backlog ([docs/backlog.md](docs/backlog.md)). Do **only** the single open issue labeled `now` ([list](https://github.com/snakeage/wedding-anniversary/issues?q=is%3Aissue+is%3Aopen+label%3Anow)). **Never** create an issue or start a new task until the user explicitly agrees to add it. After merge, offer to close it and move `now` to the next `p0`, then `p1`. If a sales blocker is not `now`, **propose** reprioritizing — do not start extra templates from the catalog.
- **Branches:** `main` = live demo. Before new templates, architecture refactors, or risky changes, suggest a feature branch and ask the user — see [Git branches](./docs/product.md#git-branches) in product.md. Content/docs-only edits can stay on `main`. One task = one branch even if it mixes docs, refactor, and new code; do not invent required `docs/` vs `feature/` vs `refactor/` prefixes.
