import { getSql } from "@/lib/db";

export type Organizer = {
  id: string;
  telegramId: string;
  firstName: string;
  username: string | null;
  pendingPaymentSlug: string | null;
};

function mapOrganizer(row: Record<string, unknown>): Organizer {
  return {
    id: String(row.id),
    telegramId: String(row.telegram_id),
    firstName: String(row.first_name ?? ""),
    username: row.username ? String(row.username) : null,
    pendingPaymentSlug: row.pending_payment_slug ? String(row.pending_payment_slug) : null,
  };
}

export async function upsertOrganizer(input: {
  telegramId: number;
  firstName: string;
  username?: string;
}): Promise<Organizer> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO organizers (telegram_id, first_name, username)
    VALUES (${input.telegramId}, ${input.firstName}, ${input.username ?? null})
    ON CONFLICT (telegram_id) DO UPDATE
    SET first_name = EXCLUDED.first_name,
        username = EXCLUDED.username
    RETURNING id, telegram_id, first_name, username, pending_payment_slug
  `;
  return mapOrganizer(rows[0] as Record<string, unknown>);
}

export async function getOrganizerById(id: string): Promise<Organizer | undefined> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, telegram_id, first_name, username, pending_payment_slug
    FROM organizers
    WHERE id = ${id}
    LIMIT 1
  `;
  const row = rows[0];
  return row ? mapOrganizer(row as Record<string, unknown>) : undefined;
}

export async function getOrganizerByTelegramId(telegramId: number): Promise<Organizer | undefined> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, telegram_id, first_name, username, pending_payment_slug
    FROM organizers
    WHERE telegram_id = ${telegramId}
    LIMIT 1
  `;
  const row = rows[0];
  return row ? mapOrganizer(row as Record<string, unknown>) : undefined;
}

export async function setOrganizerPendingSlug(telegramId: number, slug: string | null) {
  const sql = getSql();
  await sql`
    UPDATE organizers
    SET pending_payment_slug = ${slug}
    WHERE telegram_id = ${telegramId}
  `;
}
