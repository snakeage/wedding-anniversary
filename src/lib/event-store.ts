import type { EventContent } from "@/content/types";
import { parseEventContent } from "@/lib/event-content";
import { getSql } from "@/lib/db";

export const EVENT_STATUSES = ["draft", "pending_approval", "active"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export type StoredEvent = {
  id: string;
  organizerId: string;
  slug: string;
  content: EventContent;
  status: EventStatus;
  paidAt?: string;
};

function parseStatus(value: unknown): EventStatus {
  if (value === "active" || value === "pending_approval" || value === "draft") {
    return value;
  }
  return "draft";
}

function mapRow(row: Record<string, unknown>): StoredEvent | undefined {
  const raw = row.content;
  let parsedJson: unknown = raw;
  if (typeof raw === "string") {
    try {
      parsedJson = JSON.parse(raw) as unknown;
    } catch {
      return undefined;
    }
  }
  const content = parseEventContent(parsedJson);
  if (!content) return undefined;
  const paidAt = row.paid_at;
  return {
    id: String(row.id),
    organizerId: String(row.organizer_id),
    slug: String(row.slug),
    content: { ...content, slug: String(row.slug) },
    status: parseStatus(row.status),
    paidAt: paidAt instanceof Date ? paidAt.toISOString() : typeof paidAt === "string" ? paidAt : undefined,
  };
}

export async function getDbEventBySlug(slug: string): Promise<StoredEvent | undefined> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, organizer_id, slug, content, status, paid_at
    FROM events
    WHERE slug = ${slug}
    LIMIT 1
  `;
  const row = rows[0];
  return row ? mapRow(row as Record<string, unknown>) : undefined;
}

export async function listEventsByOrganizer(organizerId: string): Promise<StoredEvent[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, organizer_id, slug, content, status, paid_at
    FROM events
    WHERE organizer_id = ${organizerId}
    ORDER BY created_at DESC
  `;
  return rows
    .map((row) => mapRow(row as Record<string, unknown>))
    .filter((row): row is StoredEvent => Boolean(row));
}

function asDate(value: unknown): Date | undefined {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (Number.isFinite(date.getTime())) return date;
  }
  return undefined;
}

export async function insertEvent(organizerId: string, content: EventContent) {
  const sql = getSql();
  await sql`
    INSERT INTO events (organizer_id, slug, content, status, updated_at)
    VALUES (${organizerId}, ${content.slug}, ${JSON.parse(JSON.stringify(content))}, 'draft', now())
  `;
}

export async function updateEvent(organizerId: string, slug: string, content: EventContent) {
  const sql = getSql();
  const payload = { ...content, slug };
  const rows = await sql`
    UPDATE events
    SET content = ${JSON.parse(JSON.stringify(payload))},
        updated_at = now(),
        draft_reminded_at = NULL,
        draft_warned_at = NULL
    WHERE organizer_id = ${organizerId}
      AND slug = ${slug}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function markEventPendingApproval(organizerId: string, slug: string) {
  const sql = getSql();
  const rows = await sql`
    UPDATE events
    SET status = 'pending_approval',
        updated_at = now(),
        draft_reminded_at = NULL,
        draft_warned_at = NULL
    WHERE organizer_id = ${organizerId}
      AND slug = ${slug}
      AND status = 'draft'
    RETURNING id
  `;
  return rows.length > 0;
}

export type EventWithOrganizer = StoredEvent & {
  organizerTelegramId: string;
  organizerFirstName: string;
  organizerUsername: string | null;
};

export async function getEventWithOrganizer(slug: string): Promise<EventWithOrganizer | undefined> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      e.id,
      e.organizer_id,
      e.slug,
      e.content,
      e.status,
      e.paid_at,
      o.telegram_id,
      o.first_name,
      o.username
    FROM events e
    JOIN organizers o ON o.id = e.organizer_id
    WHERE e.slug = ${slug}
    LIMIT 1
  `;
  const row = rows[0] as Record<string, unknown> | undefined;
  if (!row) return undefined;
  const event = mapRow(row);
  if (!event) return undefined;
  return {
    ...event,
    organizerTelegramId: String(row.telegram_id),
    organizerFirstName: String(row.first_name ?? ""),
    organizerUsername: row.username ? String(row.username) : null,
  };
}

export async function activateEventBySlug(slug: string) {
  const sql = getSql();
  const rows = await sql`
    UPDATE events
    SET status = 'active',
        paid_at = now(),
        updated_at = now(),
        draft_reminded_at = NULL,
        draft_warned_at = NULL
    WHERE slug = ${slug}
      AND status IN ('draft', 'pending_approval')
    RETURNING id
  `;
  return rows.length > 0;
}

export async function rejectEventBySlug(slug: string) {
  const sql = getSql();
  const rows = await sql`
    UPDATE events
    SET status = 'draft',
        paid_at = NULL,
        updated_at = now(),
        draft_reminded_at = NULL,
        draft_warned_at = NULL
    WHERE slug = ${slug}
      AND status IN ('draft', 'pending_approval')
    RETURNING id
  `;
  return rows.length > 0;
}

export type DraftLifetimeRow = {
  id: string;
  slug: string;
  content: EventContent;
  updatedAt: Date;
  remindedAt: Date | null;
  warnedAt: Date | null;
  organizerTelegramId: string;
};

export async function listDraftsForLifetime(): Promise<DraftLifetimeRow[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      e.id,
      e.organizer_id,
      e.slug,
      e.content,
      e.status,
      e.paid_at,
      e.updated_at,
      e.created_at,
      e.draft_reminded_at,
      e.draft_warned_at,
      o.telegram_id
    FROM events e
    JOIN organizers o ON o.id = e.organizer_id
    WHERE e.status = 'draft'
  `;
  const drafts: DraftLifetimeRow[] = [];
  for (const raw of rows) {
    const row = raw as Record<string, unknown>;
    const event = mapRow(row);
    if (!event) continue;
    const updatedAt = asDate(row.updated_at) ?? asDate(row.created_at);
    if (!updatedAt) continue;
    drafts.push({
      id: event.id,
      slug: event.slug,
      content: event.content,
      updatedAt,
      remindedAt: asDate(row.draft_reminded_at) ?? null,
      warnedAt: asDate(row.draft_warned_at) ?? null,
      organizerTelegramId: String(row.telegram_id),
    });
  }
  return drafts;
}

export async function markDraftReminded(id: string) {
  const sql = getSql();
  await sql`
    UPDATE events
    SET draft_reminded_at = now()
    WHERE id = ${id}
      AND status = 'draft'
  `;
}

export async function markDraftWarned(id: string) {
  const sql = getSql();
  await sql`
    UPDATE events
    SET draft_warned_at = now()
    WHERE id = ${id}
      AND status = 'draft'
  `;
}

export async function deleteDraftById(id: string) {
  const sql = getSql();
  const rows = await sql`
    DELETE FROM events
    WHERE id = ${id}
      AND status = 'draft'
    RETURNING slug
  `;
  return rows[0] ? String((rows[0] as Record<string, unknown>).slug) : undefined;
}

export async function clearPendingPaymentSlug(slug: string) {
  const sql = getSql();
  await sql`
    UPDATE organizers
    SET pending_payment_slug = NULL
    WHERE pending_payment_slug = ${slug}
  `;
}
