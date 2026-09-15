import { Resend } from "resend";
import { NextResponse } from "next/server";
import { getEventBySlug } from "@/events";
import { getDatabaseUrl } from "@/lib/db";
import { eventNames } from "@/lib/names";
import { formatRsvpEmail, parseRsvp } from "@/lib/rsvp";
import { insertRsvp } from "@/lib/rsvp-store";

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

  const event = getEventBySlug(parsed.data.slug);
  if (!event) {
    return NextResponse.json({ error: "Некорректное приглашение" }, { status: 400 });
  }

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
