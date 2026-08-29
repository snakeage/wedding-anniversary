import type { RsvpPayload } from "@/lib/rsvp";
import { getSql } from "@/lib/db";

export type StoredRsvp = {
  id: string;
  eventSlug: string;
  name: string;
  attending: "yes" | "no";
  guests: number;
  comment: string;
  createdAt: string;
};

export async function insertRsvp(eventSlug: string, payload: RsvpPayload) {
  const sql = getSql();
  await sql`
    INSERT INTO rsvps (event_slug, name, attending, guests, comment)
    VALUES (${eventSlug}, ${payload.name}, ${payload.attending}, ${payload.guests}, ${payload.comment})
  `;
}

export async function listRsvps(eventSlug: string): Promise<StoredRsvp[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, event_slug, name, attending, guests, comment, created_at
    FROM rsvps
    WHERE event_slug = ${eventSlug}
    ORDER BY created_at DESC
  `;

  return rows.map((row) => ({
    id: String(row.id),
    eventSlug: String(row.event_slug),
    name: String(row.name),
    attending: row.attending === "no" ? "no" : "yes",
    guests: Number(row.guests),
    comment: String(row.comment ?? ""),
    createdAt: new Date(String(row.created_at)).toISOString(),
  }));
}
