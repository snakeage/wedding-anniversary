# Product

Digital invitations as a **catalog of looks**, not as twenty separate websites.

## How it is sold

1. Portfolio: organizer picks a template (skin).
2. We fill in their event: names, date, place, photos, short copy.
3. Guests open one link on **this** app. Same RSVP form for every skin.

We do not hand the client a git repo or a private Vercel project per order.

## Deploy

One GitHub repository, one Vercel project. Push to `main` rebuilds the product for every live event.

A new client is new **data** plus `/slug` on this app, not `npx vercel` for a second app. Custom domains can alias the same project later.

## Git branches

`main` is Vercel production. It is protected (`lint and build` required): **never push commits to `main`**. Always branch from a fresh `origin/main` and open a PR.

**When the user says merge / вливай / мердж** (after CI is green):

```bash
gh pr merge <n> --squash --delete-branch
git checkout main && git pull
git branch -d <branch>   # if the local branch still exists
```

Always use `--delete-branch` — squash alone leaves the remote branch. Do not merge without deleting the branch unless the user says to keep it.

**Prefix = why this PR exists**, not which files it touches. Name the rest in kebab-case after the goal (`feature/photo-upload`). Issue number is optional (`feature/44-photo-upload`); do not invent an issue just to put a number in the name.

| Prefix | When |
| --- | --- |
| `feature/` | New behavior guests or organizers can see (cabinet, skin, upload) |
| `fix/` | Something is broken |
| `docs/` | Instructions/schema only — production behavior unchanged |
| `chore/` | Scripts, env, CI, dependencies with no guest-facing feature |

Do **not** use `refactor/` (refactor-for-refactor is not a slice; if it ships inside #44 it stays `feature/…`). Do not use `hotfix/` or folder prefixes (`src/`, `api/`).

One `now` issue = one branch = one PR. Mixed docs + code in that slice stays on the **feature** (or **fix**) branch — not a second `docs/` PR. Split a second PR only for a **second delivery**.

Say the branch name before starting (`docs/how-to`, not “just main”).

```text
app (one deploy)
  templates/     visual skins
  events/        names, photos, date  (src/events/)
  guests → /sofia, /ivan-maria, /kira, /nikita-olga, /max-lera, /ilya-dasha, /mark-alisa, /lev-vera, /arseniy-maya, /misha
```

## What is shared vs what differs

| Shared | Per template | Per client |
| --- | --- | --- |
| Content field list | Layout, type, motion, background | Actual names, photos, texts |
| RSVP fields and API | Which blocks are shown | Venue and date |
| Deploy and domain model | Color, paper vs WebGL vs dark | Language of copy |

Templates are not “twenty button colors.” They can change composition and mood. They still fill the **same questionnaire** so one admin/RSVP can serve all skins.

## Now vs next

`/` is the sales catalog. Live demos: Quiet luxury (adult birthday) at `/sofia`, Paper envelope (wedding) at `/ivan-maria`, Dark editorial (evening gala) at `/kira`, Garden daylight (garden wedding) at `/nikita-olga`, Polaroid story (young couple) at `/max-lera`, Winter frost (winter wedding) at `/ilya-dasha`, Minimal Swiss (city hall wedding) at `/mark-alisa`, Gold deco (formal banquet) at `/lev-vera`, Seaside (destination wedding) at `/arseniy-maya`. What to build next is **not** this paragraph — it is the issue labeled `now`: [GitHub Issues](https://github.com/snakeage/wedding-anniversary/issues) and [how we work](./backlog.md).

How to use the live product (organizer + admin): [how-to.md](./how-to.md). Schema: [content-schema.md](./content-schema.md). Skins: [templates-catalog.md](./templates-catalog.md).
