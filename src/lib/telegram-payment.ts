import { EVENT_PRICE_RUB } from "@/lib/sbp";

const PAY_START_RE = /^\/start(?:@\S+)?\s+pay_([a-z0-9]+(?:-[a-z0-9]+)*)$/i;
const PAY_CALLBACK_RE = /^pay_(ok|no):([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const COMMAND_RE = /^\/([a-z]+)(?:@\S+)?(?:\s|$)/i;

export type EventListItem = {
  slug: string;
  status: "draft" | "pending_approval" | "active";
  title: string;
};

export type MenuAction = "events" | "help";

export function parsePayStart(text: string): string | undefined {
  const match = text.trim().match(PAY_START_RE);
  return match?.[1]?.toLowerCase();
}

export function parseBotCommand(text: string): string | undefined {
  if (parsePayStart(text)) return undefined;
  const match = text.trim().match(COMMAND_RE);
  return match?.[1]?.toLowerCase();
}

export function parsePayCallback(data: string): { action: "ok" | "no"; slug: string } | undefined {
  const match = data.trim().match(PAY_CALLBACK_RE);
  if (!match) return undefined;
  return { action: match[1] === "ok" ? "ok" : "no", slug: match[2].toLowerCase() };
}

export function parseMenuCallback(data: string): MenuAction | undefined {
  if (data === "menu_events" || data === "menu_help") {
    return data === "menu_events" ? "events" : "help";
  }
  return undefined;
}

export function payCallbackData(action: "ok" | "no", slug: string) {
  return `pay_${action}:${slug}`;
}

export function menuCallbackData(action: MenuAction) {
  return `menu_${action}`;
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

export function welcomeMessageText() {
  return [
    "Кабинет цифровых приглашений.",
    "",
    "Откройте кабинет, чтобы создать страницу. Чек об оплате пришлите сюда фотографией или PDF — после кнопки «Отправить чек в бот» в кабинете.",
  ].join("\n");
}

export function helpMessageText(supportContact?: string) {
  const lines = [
    "Как пользоваться ботом:",
    "",
    "/start — главное меню и вход в кабинет",
    "/events — ваши приглашения и статусы",
    "/cancel — отменить ожидание чека",
    "/help — это сообщение",
    "",
    "Черновик виден только вам. После оплаты по СБП пришлите чек сюда. Комментарий в банковском переводе оставляйте пустым.",
  ];
  if (supportContact) {
    lines.push("", `Поддержка: @${supportContact.replace(/^@/, "")}`);
  }
  return lines.join("\n");
}

export function unknownTextReply() {
  return "Не понял сообщение. Напишите /help — список команд. Чек — фото или PDF после кнопки «Отправить чек в бот» в кабинете.";
}

export function formatEventsListText(events: EventListItem[], siteUrl: string) {
  if (events.length === 0) {
    return "Пока нет приглашений. Откройте кабинет и создайте первое.";
  }
  const lines = ["Ваши приглашения:", ""];
  for (const event of events) {
    const status =
      event.status === "active"
        ? "Опубликовано"
        : event.status === "pending_approval"
          ? "На проверке"
          : "Черновик";
    lines.push(`${status} · ${event.title} · /${event.slug}`);
    if (event.status === "active") {
      lines.push(siteEventUrl(siteUrl, event.slug));
    }
  }
  return lines.join("\n");
}

export function noEventsAccountText() {
  return "Сначала откройте кабинет через /start — тогда здесь появятся ваши приглашения.";
}

export function receiptCancelledText(slug: string) {
  return `Ожидание чека для /${slug} отменено. Чтобы отправить квитанцию снова, нажмите «Отправить чек в бот» в кабинете.`;
}

export function nothingToCancelText() {
  return "Сейчас бот не ждёт чек. Чтобы прислать квитанцию, нажмите «Отправить чек в бот» в кабинете.";
}

export function askForReceiptText(slug: string) {
  return `Вы оформляете активацию события /${slug}. Пришлите сюда фото чека или PDF-файл квитанции из банка. Чтобы отменить — /cancel.`;
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

export function rsvpOrganizerNoticeText(payload: {
  slug: string;
  name: string;
  attending: "yes" | "no";
  guests: number;
}) {
  const who =
    payload.attending === "yes"
      ? `${payload.name} — придёт, гостей: ${payload.guests}`
      : `${payload.name} — не сможет`;
  return `Ответ гостя · /${payload.slug}\n\n${who}`;
}
