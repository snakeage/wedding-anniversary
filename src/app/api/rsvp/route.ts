import { Resend } from "resend";
import { NextResponse } from "next/server";
import { demoEvent } from "@/events";
import { formatRsvpEmail, parseRsvp } from "@/lib/rsvp";

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

  const payload = parsed.data;
  const to = process.env.RSVP_TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !to) {
    console.info("[rsvp] email skipped — add RESEND_API_KEY and RSVP_TO_EMAIL", payload);
    return NextResponse.json({ ok: true, delivered: false });
  }

  const attending = payload.attending === "yes" ? "Придёт" : "Не сможет";
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Invitation <onboarding@resend.dev>",
    to,
    subject: `RSVP: ${payload.name} — ${attending} · ${demoEvent.couple.one} & ${demoEvent.couple.two}`,
    text: formatRsvpEmail(payload),
  });

  if (error) {
    console.error("[rsvp] resend error", error);
    return NextResponse.json({ error: "Не удалось отправить ответ" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
