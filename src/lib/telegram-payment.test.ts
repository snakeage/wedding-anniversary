import assert from "node:assert/strict";
import { test } from "node:test";
import {
  adminReceiptCaption,
  askForReceiptText,
  clientActivatedText,
  draftRemindText,
  draftWarnText,
  formatEventsListText,
  helpMessageText,
  isAdminChat,
  menuCallbackData,
  noEventsAccountText,
  nothingToCancelText,
  parseBotCommand,
  parseMenuCallback,
  parsePayCallback,
  parsePayStart,
  payCallbackData,
  receiptCancelledText,
  rsvpOrganizerNoticeText,
  siteCabinetUrl,
  siteEventUrl,
  unknownTextReply,
  welcomeMessageText,
} from "./telegram-payment.ts";

test("parsePayStart reads pay_<slug> and ignores login /start", () => {
  assert.equal(parsePayStart("/start pay_anna-dr"), "anna-dr");
  assert.equal(parsePayStart("/start@invitation_cabinet_bot pay_anna-dr"), "anna-dr");
  assert.equal(parsePayStart("/start"), undefined);
  assert.equal(parsePayStart("/start cabinet"), undefined);
  assert.equal(parsePayStart("/start pay_"), undefined);
});

test("parsePayCallback and payCallbackData round-trip", () => {
  assert.deepEqual(parsePayCallback(payCallbackData("ok", "anna-dr")), { action: "ok", slug: "anna-dr" });
  assert.deepEqual(parsePayCallback("pay_no:ivan-maria"), { action: "no", slug: "ivan-maria" });
  assert.equal(parsePayCallback("pay_ok:"), undefined);
  assert.equal(parsePayCallback("other"), undefined);
});

test("isAdminChat matches the configured numeric id", () => {
  assert.equal(isAdminChat(123, "123"), true);
  assert.equal(isAdminChat(123, " 123 "), true);
  assert.equal(isAdminChat(123, "999"), false);
  assert.equal(isAdminChat(123, ""), false);
});

test("parseBotCommand ignores pay payload and reads menu commands", () => {
  assert.equal(parseBotCommand("/start"), "start");
  assert.equal(parseBotCommand("/start@invitation_cabinet_bot"), "start");
  assert.equal(parseBotCommand("/events"), "events");
  assert.equal(parseBotCommand("/cancel extra"), "cancel");
  assert.equal(parseBotCommand("/help"), "help");
  assert.equal(parseBotCommand("/start pay_anna-dr"), undefined);
  assert.equal(parseBotCommand("привет"), undefined);
});

test("parseMenuCallback reads start-menu buttons", () => {
  assert.equal(parseMenuCallback(menuCallbackData("events")), "events");
  assert.equal(parseMenuCallback(menuCallbackData("help")), "help");
  assert.equal(parseMenuCallback("pay_ok:anna-dr"), undefined);
});

test("welcome, help and events copy", () => {
  assert.match(welcomeMessageText(), /кабинет/i);
  assert.match(helpMessageText("support"), /@support/);
  assert.match(helpMessageText(), /\/events/);
  assert.match(unknownTextReply(), /\/help/);
  assert.match(nothingToCancelText(), /чек/i);
  assert.match(receiptCancelledText("anna-dr"), /\/anna-dr/);
  assert.match(noEventsAccountText(), /\/start/);
  assert.match(
    formatEventsListText(
      [
        { slug: "anna-dr", status: "draft", title: "Анна" },
        { slug: "ivan-maria", status: "active", title: "Иван & Мария" },
        { slug: "wait", status: "pending_approval", title: "Ожидание" },
      ],
      "https://example.com",
    ),
    /Черновик · Анна · \/anna-dr/,
  );
  assert.match(
    formatEventsListText([{ slug: "ivan-maria", status: "active", title: "Иван & Мария" }], "https://example.com"),
    /https:\/\/example.com\/ivan-maria/,
  );
  assert.match(formatEventsListText([], "https://example.com"), /нет приглашений/);
});

test("receipt copy names the slug and published URL", () => {
  assert.match(askForReceiptText("anna-dr"), /\/anna-dr/);
  assert.match(askForReceiptText("anna-dr"), /\/cancel/);
  assert.equal(siteEventUrl("https://example.com/", "anna-dr"), "https://example.com/anna-dr");
  assert.equal(siteCabinetUrl("https://example.com/"), "https://example.com/cabinet");
  assert.match(clientActivatedText("https://example.com", "anna-dr"), /https:\/\/example.com\/anna-dr/);
  assert.match(adminReceiptCaption({ slug: "anna-dr", firstName: "Анна", username: "anna" }), /@anna/);
  assert.match(adminReceiptCaption({ slug: "anna-dr", firstName: "Анна", username: "anna" }), /5/);
});

test("draft remind and warn copy name the slug and cabinet", () => {
  assert.match(draftRemindText("https://example.com", "anna-dr"), /\/anna-dr/);
  assert.match(draftRemindText("https://example.com", "anna-dr"), /https:\/\/example.com\/cabinet/);
  assert.match(draftWarnText("https://example.com", "anna-dr"), /Через 2 дня/);
  assert.match(draftWarnText("https://example.com", "anna-dr"), /оплатите/i);
});

test("rsvpOrganizerNoticeText names guest, reply, and slug", () => {
  assert.equal(
    rsvpOrganizerNoticeText({ slug: "anna-dr", name: "Анна", attending: "yes", guests: 2 }),
    "Ответ гостя · /anna-dr\n\nАнна — придёт, гостей: 2",
  );
  assert.equal(
    rsvpOrganizerNoticeText({ slug: "anna-dr", name: "Пётр", attending: "no", guests: 0 }),
    "Ответ гостя · /anna-dr\n\nПётр — не сможет",
  );
});
