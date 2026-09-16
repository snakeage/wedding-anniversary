import { NextResponse } from "next/server";
import { finishOrganizerLogin } from "@/lib/finish-organizer-login";
import { verifyBotLogin } from "@/lib/telegram-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fail = new URL("/login", url.origin);
  fail.searchParams.set("error", "telegram");

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
  const payload = verifyBotLogin(url.searchParams.get("token"), botToken);
  if (!payload) {
    return NextResponse.redirect(fail, 303);
  }

  return finishOrganizerLogin(url, {
    telegramId: payload.id,
    firstName: payload.firstName?.trim() || "Организатор",
    username: payload.username?.trim() || undefined,
  });
}
