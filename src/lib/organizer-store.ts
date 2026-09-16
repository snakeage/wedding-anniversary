import { getSql } from "@/lib/db";

export type Organizer = {
  id: string;
  telegramId: string;
  firstName: string;
  username: string | null;
};

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
    RETURNING id, telegram_id, first_name, username
  `;
  const row = rows[0];
  return {
    id: String(row.id),
    telegramId: String(row.telegram_id),
    firstName: String(row.first_name ?? ""),
    username: row.username ? String(row.username) : null,
  };
}

export async function getOrganizerById(id: string): Promise<Organizer | undefined> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, telegram_id, first_name, username
    FROM organizers
    WHERE id = ${id}
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return undefined;
  return {
    id: String(row.id),
    telegramId: String(row.telegram_id),
    firstName: String(row.first_name ?? ""),
    username: row.username ? String(row.username) : null,
  };
}
