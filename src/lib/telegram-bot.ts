const TELEGRAM_API = "https://api.telegram.org/bot";

type InlineButton = { text: string; callback_data?: string; url?: string };

async function telegramCall(botToken: string, method: string, body: Record<string, unknown>) {
  const sent = await fetch(`${TELEGRAM_API}${botToken}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!sent.ok) {
    console.error(`[telegram] ${method} failed`, sent.status);
  }
  return sent.ok;
}

export async function sendTelegramMessage(
  botToken: string,
  chatId: number | string,
  text: string,
  extra?: Record<string, unknown>,
) {
  return telegramCall(botToken, "sendMessage", { chat_id: chatId, text, ...extra });
}

export async function sendTelegramPhoto(
  botToken: string,
  chatId: number | string,
  fileId: string,
  caption: string,
  buttons?: InlineButton[][],
) {
  return telegramCall(botToken, "sendPhoto", {
    chat_id: chatId,
    photo: fileId,
    caption,
    reply_markup: buttons ? { inline_keyboard: buttons } : undefined,
  });
}

export async function sendTelegramDocument(
  botToken: string,
  chatId: number | string,
  fileId: string,
  caption: string,
  buttons?: InlineButton[][],
) {
  return telegramCall(botToken, "sendDocument", {
    chat_id: chatId,
    document: fileId,
    caption,
    reply_markup: buttons ? { inline_keyboard: buttons } : undefined,
  });
}

export async function answerTelegramCallback(botToken: string, callbackId: string, text?: string) {
  return telegramCall(botToken, "answerCallbackQuery", {
    callback_query_id: callbackId,
    text,
  });
}

export async function editTelegramCaption(
  botToken: string,
  chatId: number | string,
  messageId: number,
  caption: string,
) {
  return telegramCall(botToken, "editMessageCaption", {
    chat_id: chatId,
    message_id: messageId,
    caption,
    reply_markup: { inline_keyboard: [] },
  });
}
