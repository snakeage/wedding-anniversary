import { NextResponse } from "next/server";
import { finishOrganizerLogin } from "@/lib/finish-organizer-login";
import { telegramAuthFromSearch, verifyTelegramLogin } from "@/lib/telegram-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fail = new URL("/login", url.origin);
  fail.searchParams.set("error", "telegram");

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
  const data = telegramAuthFromSearch(url.searchParams);
  if (!botToken || !verifyTelegramLogin(data, botToken)) {
    return NextResponse.redirect(fail, 303);
  }

  const telegramId = Number(data.id);
  if (!Number.isFinite(telegramId)) {
    return NextResponse.redirect(fail, 303);
  }

  return finishOrganizerLogin(url, {
    telegramId,
    firstName: data.first_name?.trim() || "Организатор",
    username: data.username?.trim() || undefined,
  });
}
