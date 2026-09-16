import { NextResponse } from "next/server";
import { getDatabaseUrl } from "@/lib/db";
import {
  getOrganizerSessionSecret,
  ORGANIZER_COOKIE,
  organizerCookieSetOptions,
  signOrganizerId,
} from "@/lib/organizer-session";
import { upsertOrganizer } from "@/lib/organizer-store";
import { telegramAuthFromSearch, verifyTelegramLogin } from "@/lib/telegram-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fail = new URL("/login", url.origin);
  fail.searchParams.set("error", "telegram");

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
  const data = telegramAuthFromSearch(url.searchParams);
  if (!botToken || !verifyTelegramLogin(data, botToken) || !getDatabaseUrl()) {
    return NextResponse.redirect(fail, 303);
  }

  const telegramId = Number(data.id);
  if (!Number.isFinite(telegramId)) {
    return NextResponse.redirect(fail, 303);
  }

  let organizer;
  try {
    organizer = await upsertOrganizer({
      telegramId,
      firstName: data.first_name?.trim() || "Организатор",
      username: data.username?.trim() || undefined,
    });
  } catch (error) {
    console.error("[telegram] upsert failed", error);
    return NextResponse.redirect(fail, 303);
  }

  const secret = getOrganizerSessionSecret();
  if (!secret) {
    return NextResponse.redirect(fail, 303);
  }

  const response = NextResponse.redirect(new URL("/cabinet", url.origin), 303);
  response.cookies.set(
    ORGANIZER_COOKIE,
    signOrganizerId(organizer.id, secret),
    organizerCookieSetOptions(url.protocol === "https:"),
  );
  return response;
}
