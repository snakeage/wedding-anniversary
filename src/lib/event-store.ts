import type { EventContent } from "@/content/types";
import { parseEventContent } from "@/lib/event-content";
import { getSql } from "@/lib/db";

export type StoredEvent = {
  id: string;
  organizerId: string;
  slug: string;
  content: EventContent;
};

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
  return {
    id: String(row.id),
    organizerId: String(row.organizer_id),
    slug: String(row.slug),
    content: { ...content, slug: String(row.slug) },
  };
}

export async function getDbEventBySlug(slug: string): Promise<StoredEvent | undefined> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, organizer_id, slug, content
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
    SELECT id, organizer_id, slug, content
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
    INSERT INTO events (organizer_id, slug, content)
    VALUES (${organizerId}, ${content.slug}, ${JSON.parse(JSON.stringify(content))})
  `;
}
