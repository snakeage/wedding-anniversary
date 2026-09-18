import { Resend } from "resend";
import { NextResponse } from "next/server";
import { getDatabaseUrl } from "@/lib/db";
import { getEventWithOrganizer } from "@/lib/event-store";
import { eventNames } from "@/lib/names";
import { formatRsvpEmail, parseRsvp, type RsvpPayload } from "@/lib/rsvp";
import { insertRsvp } from "@/lib/rsvp-store";
import { resolveEventWithAccess } from "@/lib/resolve-event";
import { sendTelegramMessage } from "@/lib/telegram-bot";
import { rsvpOrganizerNoticeText } from "@/lib/telegram-payment";

async function notifyOrganizerOfRsvp(payload: RsvpPayload) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
  if (!botToken) return;
  try {
    const stored = await getEventWithOrganizer(payload.slug);
    if (!stored) return;
    const ok = await sendTelegramMessage(
      botToken,
      stored.organizerTelegramId,
      rsvpOrganizerNoticeText(payload),
    );
    if (!ok) {
      console.error("[rsvp] telegram notice failed");
    }
  } catch (error) {
    console.error("[rsvp] telegram notice failed", error);
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const parsed = parseRsvp(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const access = await resolveEventWithAccess(parsed.data.slug);
  if (access.mode === "not_found") {
    return NextResponse.json({ error: "Некорректное приглашение" }, { status: 400 });
  }
  if (access.mode !== "active") {
    return NextResponse.json({ error: "Сбор ответов ещё не открыт." }, { status: 403 });
  }
  const event = access.event;

  if (!getDatabaseUrl()) {
    console.error("[rsvp] DATABASE_URL is not set");
    return NextResponse.json({ error: "Не удалось сохранить ответ. Попробуйте позже." }, { status: 500 });
  }

  const payload = parsed.data;

  try {
    await insertRsvp(event.slug, payload);
  } catch (error) {
    console.error("[rsvp] insert failed", error);
    return NextResponse.json({ error: "Не удалось сохранить ответ. Попробуйте позже." }, { status: 500 });
  }

  await notifyOrganizerOfRsvp(payload);

  const to = process.env.RSVP_TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !to) {
    return NextResponse.json({ ok: true, stored: true, delivered: false });
  }

  const attending = payload.attending === "yes" ? "Придёт" : "Не сможет";
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Invitation <onboarding@resend.dev>",
    to,
    subject: `RSVP: ${payload.name} — ${attending} · ${eventNames(event)}`,
    text: formatRsvpEmail(payload),
  });

  if (error) {
    console.error("[rsvp] resend error", error);
    return NextResponse.json({ ok: true, stored: true, delivered: false });
  }

  return NextResponse.json({ ok: true, stored: true, delivered: true });
}
