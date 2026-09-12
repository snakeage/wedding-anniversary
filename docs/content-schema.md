# Content schema

Contract for every template. Types: [`src/content/types.ts`](../src/content/types.ts). Demo event: [`src/events/anna-dmitry.ts`](../src/events/anna-dmitry.ts). RSVP payload: [`src/lib/rsvp.ts`](../src/lib/rsvp.ts).

A skin may **omit rendering** a block (e.g. no countdown). It should not require extra required fields that other skins cannot store, unless this file is updated first.

## Event content

| Field | Type | Used by |
| --- | --- | --- |
| `templateId` | string, catalog **Id** | Which skin to render (`quiet-luxury`, `paper-envelope`) |
| `slug` | string | Public path `/anna-dmitry` |
| `couple.one` | string | Hero, header, footer, OG, RSVP email subject |
| `couple.two` | string | same |
| `kicker` | string | Small label above names (event type) |
| `tagline` | string | Hero subtitle |
| `inviteLead` | string | Short lead (gallery intro) |
| `inviteBody` | string | Longer note (details) |
| `event.iso` | ISO datetime | Countdown, formatted date/time |
| `event.timeLabel` | string | Display time if needed besides `iso` |
| `event.gathering` | string | Doors / arrival note |
| `event.dressCode` | string | Dress code |
| `venue.name` | string | Details + map heading |
| `venue.address` | string | Details + map |
| `venue.lat` | number | Map pin / navigator |
| `venue.lng` | number | Map pin / navigator |
| `venue.notes` | string | Parking, late arrival |
| `gallery[]` | list | Story photos |
| `gallery[].src` | path | Image under `public/` |
| `gallery[].alt` | string | Accessibility |
| `gallery[].caption` | string | Year / story line |

## Page blocks (same set)

1. Hero — names, kicker, tagline, date, CTA to RSVP
2. Countdown — from `event.iso`
3. Gallery / story — `gallery`
4. Details — date, venue, dress code, `inviteBody`
5. Map — embed + navigator from lat/lng
6. RSVP — form
7. Footer — names

`/` is the template catalog. Public guest URLs are `/[slug]` via [`src/app/[slug]/page.tsx`](../src/app/[slug]/page.tsx). Skins live in [`src/templates/`](../src/templates/): Quiet luxury and Paper envelope. A template may hide a block (Paper envelope has no countdown).

## RSVP (one form for all skins)

| Field | Type |
| --- | --- |
| `name` | string, 2–80 chars |
| `attending` | `"yes"` \| `"no"` |
| `guests` | integer 1–12 |
| `comment` | string, max 500 |

POST `/api/rsvp` with `slug` of the event. Persistence is Neon Postgres (`rsvps`), product-wide, not per template. Resend email is optional notify. Organizer list: `/rsvp-list?slug=` behind `RSVP_ADMIN_SECRET`.

## Later (not in code yet)

- Optional flags: `showCountdown`, `showMap`, etc.
