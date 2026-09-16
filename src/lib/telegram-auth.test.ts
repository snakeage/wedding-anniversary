import assert from "node:assert/strict";
import { test } from "node:test";
import { telegramLoginHash, verifyTelegramLogin } from "./telegram-auth.ts";
import { readOrganizerId, signOrganizerId } from "./organizer-session.ts";

test("verifyTelegramLogin accepts a matching hash", () => {
  const token = "test-bot-token";
  const data = {
    id: "1",
    first_name: "Анна",
    auth_date: String(Math.floor(Date.now() / 1000)),
  };
  const hash = telegramLoginHash(data, token);
  assert.equal(verifyTelegramLogin({ ...data, hash }, token), true);
});

test("verifyTelegramLogin rejects a tampered name", () => {
  const token = "test-bot-token";
  const data = {
    id: "1",
    first_name: "Анна",
    auth_date: String(Math.floor(Date.now() / 1000)),
  };
  const hash = telegramLoginHash(data, token);
  assert.equal(verifyTelegramLogin({ ...data, first_name: "Пётр", hash }, token), false);
});

test("verifyTelegramLogin rejects a stale auth_date", () => {
  const token = "test-bot-token";
  const data = {
    id: "1",
    first_name: "Анна",
    auth_date: String(Math.floor(Date.now() / 1000) - 60 * 60 * 25),
  };
  const hash = telegramLoginHash(data, token);
  assert.equal(verifyTelegramLogin({ ...data, hash }, token), false);
});

test("organizer session cookie round-trips", () => {
  const secret = "session-secret";
  const signed = signOrganizerId("org-1", secret);
  assert.equal(readOrganizerId(signed, secret), "org-1");
  assert.equal(readOrganizerId(signed, "other"), null);
});
