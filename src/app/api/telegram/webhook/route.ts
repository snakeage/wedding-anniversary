import { NextResponse } from "next/server";
import { signBotLogin, webhookSecretMatches } from "@/lib/telegram-auth";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

export async function POST(request: Request) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET?.trim() ?? "";
  const header = request.headers.get("x-telegram-bot-api-secret-token");
  if (!webhookSecretMatches(header, expected)) {
    return new NextResponse(null, { status: 401 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
  if (!botToken) {
    return new NextResponse(null, { status: 204 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const update = asRecord(body);
  const message = asRecord(update?.message);
  const text = typeof message?.text === "string" ? message.text : "";
  const from = asRecord(message?.from);
  const chat = asRecord(message?.chat);
  const chatId = typeof chat?.id === "number" ? chat.id : Number(chat?.id);
  const telegramId = typeof from?.id === "number" ? from.id : Number(from?.id);

  if (!text.startsWith("/start") || !Number.isFinite(chatId) || !Number.isFinite(telegramId)) {
    return new NextResponse(null, { status: 204 });
  }

  const firstName = typeof from?.first_name === "string" ? from.first_name.trim() : "Организатор";
  const username = typeof from?.username === "string" ? from.username.trim() : undefined;
  const origin = new URL(request.url).origin;
  const token = signBotLogin({ id: telegramId, firstName, username }, botToken);
  const complete = new URL("/api/auth/telegram/complete", origin);
  complete.searchParams.set("token", token);

  try {
    const sent = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Нажмите кнопку, чтобы открыть кабинет. Ссылка действует 10 минут.",
        reply_markup: {
          inline_keyboard: [[{ text: "Открыть кабинет", url: complete.toString() }]],
        },
      }),
    });
    if (!sent.ok) {
      console.error("[telegram] sendMessage failed", sent.status);
    }
  } catch (error) {
    console.error("[telegram] sendMessage error", error);
  }

  return new NextResponse(null, { status: 204 });
}
