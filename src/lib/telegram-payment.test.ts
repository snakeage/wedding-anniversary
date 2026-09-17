import assert from "node:assert/strict";
import { test } from "node:test";
import {
  adminReceiptCaption,
  askForReceiptText,
  clientActivatedText,
  isAdminChat,
  parsePayCallback,
  parsePayStart,
  payCallbackData,
  siteEventUrl,
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

test("receipt copy names the slug and published URL", () => {
  assert.match(askForReceiptText("anna-dr"), /\/anna-dr/);
  assert.equal(siteEventUrl("https://example.com/", "anna-dr"), "https://example.com/anna-dr");
  assert.match(clientActivatedText("https://example.com", "anna-dr"), /https:\/\/example.com\/anna-dr/);
  assert.match(adminReceiptCaption({ slug: "anna-dr", firstName: "Анна", username: "anna" }), /@anna/);
  assert.match(adminReceiptCaption({ slug: "anna-dr", firstName: "Анна", username: "anna" }), /5/);
});
