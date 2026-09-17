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

export async function insertEvent(organizerId: string, content: EventContent) {
  const sql = getSql();
  await sql`
    INSERT INTO events (organizer_id, slug, content, status)
    VALUES (${organizerId}, ${content.slug}, ${JSON.parse(JSON.stringify(content))}, 'draft')
  `;
}

export async function markEventPendingApproval(organizerId: string, slug: string) {
  const sql = getSql();
  const rows = await sql`
    UPDATE events
    SET status = 'pending_approval'
    WHERE organizer_id = ${organizerId}
      AND slug = ${slug}
      AND status = 'draft'
    RETURNING id
  `;
  return rows.length > 0;
}
