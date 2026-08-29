export type RsvpAttending = "yes" | "no";

export type RsvpPayload = {
  name: string;
  guests: number;
  attending: RsvpAttending;
  comment: string;
  slug: string;
};

export type RsvpParseResult =
  | { ok: true; data: RsvpPayload }
  | { ok: false; error: string };

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function parseRsvp(body: unknown): RsvpParseResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Некорректный запрос" };
  }

  const record = body as Record<string, unknown>;
  const name = asString(record.name).trim();
  const comment = asString(record.comment).trim();
  const attending = asString(record.attending);
  const slug = asString(record.slug).trim();
  const guestsRaw = record.guests;
  const guests =
    typeof guestsRaw === "number" ? guestsRaw : Number.parseInt(asString(guestsRaw), 10);

  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "Укажите имя — от 2 до 80 символов" };
  }

  if (attending !== "yes" && attending !== "no") {
    return { ok: false, error: "Выберите, сможете ли вы прийти" };
  }

  if (!Number.isInteger(guests) || guests < 1 || guests > 12) {
    return { ok: false, error: "Количество гостей — от 1 до 12" };
  }

  if (comment.length > 500) {
    return { ok: false, error: "Комментарий слишком длинный" };
  }

  if (!slug || slug.length > 80) {
    return { ok: false, error: "Некорректное приглашение" };
  }

  return {
    ok: true,
    data: { name, guests, attending, comment, slug },
  };
}

export function formatRsvpEmail(payload: RsvpPayload) {
  const attending = payload.attending === "yes" ? "Придёт" : "Не сможет";
  return [
    `Имя: ${payload.name}`,
    `Ответ: ${attending}`,
    `Гостей: ${payload.guests}`,
    payload.comment ? `Комментарий: ${payload.comment}` : "Комментарий: —",
  ].join("\n");
}
