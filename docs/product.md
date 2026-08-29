# Product

Digital invitations as a **catalog of looks**, not as twenty separate websites.

## How it is sold

1. Portfolio: organizer picks a template (skin).
2. We fill in their event: names, date, place, photos, short copy.
3. Guests open one link on **this** app. Same RSVP form for every skin.

We do not hand the client a git repo or a private Vercel project per order.

## Deploy

One GitHub repository, one Vercel project. Push to `main` rebuilds the product for every live event.

A new client is new **data** (and later `/slug`), not `npx vercel` for a second app. Custom domains can alias the same project later.

## Git branches

`main` is the live demo (Vercel production). The agent should **say when to branch** before starting risky or large work.

**Use a feature branch** (e.g. `feature/paper-envelope`) when:

- Adding or building a new template skin from the catalog
- Refactoring into `templates/` or changing routing (`/slug`)
- Large RSVP, database, or infra changes
- Risky experiments (WebGL, deploy, env) where prod should stay stable
- You need a Vercel preview URL to show a draft

**Stay on `main`** when:

- Editing `src/content.ts`, photos, copy, docs
- Small bugfixes and styling on the current live template
- You explicitly ask to ship straight to production

Before non-trivial code, the agent should ask: branch or `main`? Default to branch if the live site could break.

**Do not** require separate `docs/`, `feature/`, and `refactor/` branches. Prefixes are optional habit (`feature/extract-quiet-luxury`), not a process. Name the branch after the **goal of the task**, not the file type.

If one task mixes docs, refactor, and new code (the usual next step: extract `quiet-luxury` + update schema docs + maybe a second skin), that is **one branch**. Split **commits** inside it if useful; do not split into three PRs by file kind. Cut a second PR only when it is a **second delivery** (extract already useful on `main`, new skin can ship later).

```text
app (one deploy)
  templates/     visual skins
  events/        names, photos, date  (today: src/content.ts)
  guests → /anna-dmitry  (later)
```

## What is shared vs what differs

| Shared | Per template | Per client |
| --- | --- | --- |
| Content field list | Layout, type, motion, background | Actual names, photos, texts |
| RSVP fields and API | Which blocks are shown | Venue and date |
| Deploy and domain model | Color, paper vs WebGL vs dark | Language of copy |

Templates are not “twenty button colors.” They can change composition and mood. They still fill the **same questionnaire** so one admin/RSVP can serve all skins.

## Now vs next

The live demo is Quiet luxury (`src/content.ts`). What to build next is **not** this paragraph — it is the issue labeled `now`: [GitHub Issues](https://github.com/snakeage/wedding-anniversary/issues) and [how we work](./backlog.md).

See [content-schema.md](./content-schema.md) and [templates-catalog.md](./templates-catalog.md).
