import assert from "node:assert/strict";
import { test } from "node:test";
import { botPayUrl, EVENT_PRICE_RUB, getSbpDetails } from "./sbp.ts";

test("getSbpDetails is undefined without a phone", () => {
  const prev = {
    phone: process.env.SBP_PHONE,
    bank: process.env.SBP_BANK,
    recipient: process.env.SBP_RECIPIENT,
    contact: process.env.SBP_CONTACT,
  };
  delete process.env.SBP_PHONE;
  try {
    assert.equal(getSbpDetails(), undefined);
  } finally {
    if (prev.phone !== undefined) process.env.SBP_PHONE = prev.phone;
    else delete process.env.SBP_PHONE;
  }
});

test("getSbpDetails reads env and fills bank defaults", () => {
  const prev = {
    phone: process.env.SBP_PHONE,
    bank: process.env.SBP_BANK,
    recipient: process.env.SBP_RECIPIENT,
    contact: process.env.SBP_CONTACT,
  };
  process.env.SBP_PHONE = "+79990000000";
  delete process.env.SBP_BANK;
  process.env.SBP_RECIPIENT = "Александр С.";
  process.env.SBP_CONTACT = "@snakeage";
  try {
    const details = getSbpDetails();
    assert.ok(details);
    assert.equal(details?.phone, "+79990000000");
    assert.equal(details?.bank, "Т-Банк");
    assert.equal(details?.recipient, "Александр С.");
    assert.equal(details?.contact, "snakeage");
    assert.equal(details?.priceRub, EVENT_PRICE_RUB);
  } finally {
    if (prev.phone !== undefined) process.env.SBP_PHONE = prev.phone;
    else delete process.env.SBP_PHONE;
    if (prev.bank !== undefined) process.env.SBP_BANK = prev.bank;
    else delete process.env.SBP_BANK;
    if (prev.recipient !== undefined) process.env.SBP_RECIPIENT = prev.recipient;
    else delete process.env.SBP_RECIPIENT;
    if (prev.contact !== undefined) process.env.SBP_CONTACT = prev.contact;
    else delete process.env.SBP_CONTACT;
  }
});

test("botPayUrl builds a start payload with the event slug", () => {
  assert.equal(botPayUrl("@invitation_cabinet_bot", "anna-dr"), "https://t.me/invitation_cabinet_bot?start=pay_anna-dr");
  assert.equal(botPayUrl("", "anna-dr"), "");
});
