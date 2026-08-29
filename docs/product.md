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

- **Now:** one live skin (Quiet luxury), content in `src/content.ts`.
- **Next code:** fold that page into `templates/quiet-luxury`, add a second skin, then a portfolio index.
- **Not yet:** organizer dashboard, database, Resend as source of truth, twenty implemented pages.

See [content-schema.md](./content-schema.md) and [templates-catalog.md](./templates-catalog.md).
