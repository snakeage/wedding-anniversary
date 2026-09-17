import { EVENT_PRICE_RUB } from "@/lib/sbp";

const PAY_START_RE = /^\/start(?:@\S+)?\s+pay_([a-z0-9]+(?:-[a-z0-9]+)*)$/i;
const PAY_CALLBACK_RE = /^pay_(ok|no):([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export function parsePayStart(text: string): string | undefined {
  const match = text.trim().match(PAY_START_RE);
  return match?.[1]?.toLowerCase();
}

export function parsePayCallback(data: string): { action: "ok" | "no"; slug: string } | undefined {
  const match = data.trim().match(PAY_CALLBACK_RE);
  if (!match) return undefined;
  return { action: match[1] === "ok" ? "ok" : "no", slug: match[2].toLowerCase() };
}

export function payCallbackData(action: "ok" | "no", slug: string) {
  return `pay_${action}:${slug}`;
}

export function isAdminChat(chatId: number, adminChatId: string) {
  const expected = adminChatId.trim();
  if (!expected || !Number.isFinite(chatId)) return false;
  return String(chatId) === expected;
}

export function siteEventUrl(siteUrl: string, slug: string) {
  const base = siteUrl.trim().replace(/\/+$/, "") || "https://wedding-anniversary-seven-tau.vercel.app";
  return `${base}/${slug}`;
}

export function askForReceiptText(slug: string) {
  return `Вы оформляете активацию события /${slug}. Пришлите сюда фото чека или PDF-файл квитанции из банка.`;
}

export function noPendingSlugText() {
  return "Сначала нажмите «Отправить чек в бот» в кабинете — так мы поймём, за какое событие платёж.";
}

export function unknownPayEventText() {
  return "Это событие не найдено или принадлежит другому организатору. Откройте кабинет и нажмите «Отправить чек в бот».";
}

export function adminChatMissingText() {
  return "Чек принят, но администратор ещё не настроен. Напишите в поддержку из кабинета.";
}

export function clientReceiptAckText() {
  return "Чек получен и передан администратору на проверку. Обычно проверка занимает 1–2 часа (до 24 часов). Мы пришлём сообщение, как только сайт откроется.";
}

export function adminReceiptCaption(input: {
  slug: string;
  firstName: string;
  username?: string | null;
}) {
  const who = input.username ? `${input.firstName} (@${input.username})` : input.firstName;
  return [
    `Чек на оплату события: /${input.slug}`,
    `Организатор: ${who}`,
    `Сумма: ${EVENT_PRICE_RUB.toLocaleString("ru-RU")} ₽`,
  ].join("\n");
}

export function clientActivatedText(siteUrl: string, slug: string) {
  return `Оплата подтверждена. Ваше приглашение опубликовано и готово к отправке гостям:\n${siteEventUrl(siteUrl, slug)}`;
}

export function clientRejectedText(slug: string) {
  return `Оплата события /${slug} не подтверждена. Проверьте квитанцию или напишите администратору.`;
}

export function adminConfirmedCaption(previous: string) {
  return `${previous}\n\nОплата подтверждена.`;
}

export function adminRejectedCaption(previous: string) {
  return `${previous}\n\nОтклонено.`;
}
