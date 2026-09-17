import { NextResponse } from "next/server";
import {
  activateEventBySlug,
  getEventWithOrganizer,
  markEventPendingApproval,
  rejectEventBySlug,
} from "@/lib/event-store";
import { getDatabaseUrl } from "@/lib/db";
import {
  getOrganizerByTelegramId,
  setOrganizerPendingSlug,
  upsertOrganizer,
} from "@/lib/organizer-store";
import { signBotLogin, webhookSecretMatches } from "@/lib/telegram-auth";
import {
  answerTelegramCallback,
  editTelegramCaption,
  sendTelegramDocument,
  sendTelegramMessage,
  sendTelegramPhoto,
} from "@/lib/telegram-bot";
import {
  adminChatMissingText,
  adminConfirmedCaption,
  adminReceiptCaption,
  adminRejectedCaption,
  askForReceiptText,
  clientActivatedText,
  clientReceiptAckText,
  clientRejectedText,
  isAdminChat,
  noPendingSlugText,
  parsePayCallback,
  parsePayStart,
  payCallbackData,
  unknownPayEventText,
} from "@/lib/telegram-payment";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function asId(value: unknown): number | undefined {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function largestPhotoId(value: unknown): string | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  const last = asRecord(value[value.length - 1]);
  return typeof last?.file_id === "string" ? last.file_id : undefined;
}

function adminButtons(slug: string) {
  return [
    [
      { text: "Подтвердить (5 000 ₽)", callback_data: payCallbackData("ok", slug) },
      { text: "Отклонить", callback_data: payCallbackData("no", slug) },
    ],
  ];
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
  if (!update) return new NextResponse(null, { status: 204 });

  const callback = asRecord(update.callback_query);
  if (callback) {
    await handleCallback(botToken, callback);
    return new NextResponse(null, { status: 204 });
  }

  const message = asRecord(update.message);
  if (!message) return new NextResponse(null, { status: 204 });

  const text = typeof message.text === "string" ? message.text : "";
  const from = asRecord(message.from);
  const chat = asRecord(message.chat);
  const chatId = asId(chat?.id);
  const telegramId = asId(from?.id);
  if (!Number.isFinite(chatId) || !Number.isFinite(telegramId) || chatId === undefined || telegramId === undefined) {
    return new NextResponse(null, { status: 204 });
  }

  const firstName = typeof from?.first_name === "string" ? from.first_name.trim() : "Организатор";
  const username = typeof from?.username === "string" ? from.username.trim() : undefined;

  const paySlug = text ? parsePayStart(text) : undefined;
  if (paySlug) {
    await handlePayStart(botToken, { chatId, telegramId, firstName, username, slug: paySlug });
    return new NextResponse(null, { status: 204 });
  }

  if (text.startsWith("/start")) {
    await handleLoginStart(botToken, request, { chatId, telegramId, firstName, username });
    return new NextResponse(null, { status: 204 });
  }

  const photoId = largestPhotoId(message.photo);
  const document = asRecord(message.document);
  const documentId = typeof document?.file_id === "string" ? document.file_id : undefined;
  const mime = typeof document?.mime_type === "string" ? document.mime_type : "";
  const isReceiptDoc = Boolean(documentId && (mime === "application/pdf" || mime.startsWith("image/")));

  if (photoId || isReceiptDoc) {
    await handleReceipt(botToken, {
      chatId,
      telegramId,
      firstName,
      username,
      photoId,
      documentId: isReceiptDoc ? documentId : undefined,
    });
  }

  return new NextResponse(null, { status: 204 });
}

async function handleLoginStart(
  botToken: string,
  request: Request,
  input: { chatId: number; telegramId: number; firstName: string; username?: string },
) {
  const origin = new URL(request.url).origin;
  const token = signBotLogin(
    { id: input.telegramId, firstName: input.firstName, username: input.username },
    botToken,
  );
  const complete = new URL("/api/auth/telegram/complete", origin);
  complete.searchParams.set("token", token);
  await sendTelegramMessage(botToken, input.chatId, "Нажмите кнопку, чтобы открыть кабинет. Ссылка действует 10 минут.", {
    reply_markup: {
      inline_keyboard: [[{ text: "Открыть кабинет", url: complete.toString() }]],
    },
  });
}

async function handlePayStart(
  botToken: string,
  input: { chatId: number; telegramId: number; firstName: string; username?: string; slug: string },
) {
  if (!getDatabaseUrl()) {
    await sendTelegramMessage(botToken, input.chatId, unknownPayEventText());
    return;
  }

  try {
    const organizer = await upsertOrganizer({
      telegramId: input.telegramId,
      firstName: input.firstName,
      username: input.username,
    });
    const event = await getEventWithOrganizer(input.slug);
    if (!event || event.organizerId !== organizer.id) {
      await sendTelegramMessage(botToken, input.chatId, unknownPayEventText());
      return;
    }
    if (event.status === "active") {
      const site = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
      await sendTelegramMessage(botToken, input.chatId, clientActivatedText(site, event.slug));
      return;
    }
    await setOrganizerPendingSlug(input.telegramId, event.slug);
    await markEventPendingApproval(organizer.id, event.slug);
    await sendTelegramMessage(botToken, input.chatId, askForReceiptText(event.slug));
  } catch (error) {
    console.error("[telegram] pay start failed", error);
  }
}

async function handleReceipt(
  botToken: string,
  input: {
    chatId: number;
    telegramId: number;
    firstName: string;
    username?: string;
    photoId?: string;
    documentId?: string;
  },
) {
  if (!getDatabaseUrl()) {
    await sendTelegramMessage(botToken, input.chatId, noPendingSlugText());
    return;
  }

  try {
    const organizer = await getOrganizerByTelegramId(input.telegramId);
    const slug = organizer?.pendingPaymentSlug;
    if (!organizer || !slug) {
      await sendTelegramMessage(botToken, input.chatId, noPendingSlugText());
      return;
    }
    const event = await getEventWithOrganizer(slug);
    if (!event || event.organizerId !== organizer.id || event.status === "active") {
      await sendTelegramMessage(botToken, input.chatId, unknownPayEventText());
      return;
    }

    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID?.trim() ?? "";
    if (!adminChatId) {
      await sendTelegramMessage(botToken, input.chatId, adminChatMissingText());
      return;
    }

    await markEventPendingApproval(organizer.id, slug);
    const caption = adminReceiptCaption({
      slug,
      firstName: input.firstName,
      username: input.username ?? organizer.username,
    });
    const buttons = adminButtons(slug);
    if (input.photoId) {
      await sendTelegramPhoto(botToken, adminChatId, input.photoId, caption, buttons);
    } else if (input.documentId) {
      await sendTelegramDocument(botToken, adminChatId, input.documentId, caption, buttons);
    }
    await sendTelegramMessage(botToken, input.chatId, clientReceiptAckText());
  } catch (error) {
    console.error("[telegram] receipt failed", error);
  }
}

async function handleCallback(botToken: string, callback: Record<string, unknown>) {
  const callbackId = typeof callback.id === "string" ? callback.id : "";
  const from = asRecord(callback.from);
  const fromId = asId(from?.id);
  const data = typeof callback.data === "string" ? callback.data : "";
  const parsed = parsePayCallback(data);
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID?.trim() ?? "";

  if (!callbackId || fromId === undefined || !parsed) {
    if (callbackId) await answerTelegramCallback(botToken, callbackId);
    return;
  }

  if (!isAdminChat(fromId, adminChatId)) {
    await answerTelegramCallback(botToken, callbackId, "Недостаточно прав");
    return;
  }

  if (!getDatabaseUrl()) {
    await answerTelegramCallback(botToken, callbackId, "База не настроена");
    return;
  }

  const message = asRecord(callback.message);
  const chat = asRecord(message?.chat);
  const chatId = asId(chat?.id);
  const messageId = asId(message?.message_id);
  const previous = typeof message?.caption === "string" ? message.caption : adminReceiptCaption({ slug: parsed.slug, firstName: "Организатор" });

  try {
    const event = await getEventWithOrganizer(parsed.slug);
    if (parsed.action === "ok") {
      await activateEventBySlug(parsed.slug);
      if (event) {
        await setOrganizerPendingSlug(Number(event.organizerTelegramId), null);
        const site = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
        await sendTelegramMessage(botToken, event.organizerTelegramId, clientActivatedText(site, parsed.slug));
      }
      if (chatId !== undefined && messageId !== undefined) {
        await editTelegramCaption(botToken, chatId, messageId, adminConfirmedCaption(previous));
      }
      await answerTelegramCallback(botToken, callbackId, "Опубликовано");
      return;
    }

    await rejectEventBySlug(parsed.slug);
    if (event) {
      await sendTelegramMessage(botToken, event.organizerTelegramId, clientRejectedText(parsed.slug));
    }
    if (chatId !== undefined && messageId !== undefined) {
      await editTelegramCaption(botToken, chatId, messageId, adminRejectedCaption(previous));
    }
    await answerTelegramCallback(botToken, callbackId, "Отклонено");
  } catch (error) {
    console.error("[telegram] callback failed", error);
    await answerTelegramCallback(botToken, callbackId, "Ошибка");
  }
}
