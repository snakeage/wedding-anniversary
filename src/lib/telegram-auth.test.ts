import assert from "node:assert/strict";
import { test } from "node:test";
import { telegramLoginHash, verifyTelegramLogin, signBotLogin, verifyBotLogin, webhookSecretMatches } from "./telegram-auth.ts";
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

test("signBotLogin round-trips within TTL", () => {
  const token = signBotLogin({ id: 42, firstName: "Анна", username: "anna" }, "bot-secret");
  const payload = verifyBotLogin(token, "bot-secret");
  assert.ok(payload);
  assert.equal(payload.id, 42);
  assert.equal(payload.firstName, "Анна");
  assert.equal(payload.username, "anna");
});

test("verifyBotLogin rejects a tampered payload", () => {
  const token = signBotLogin({ id: 42, firstName: "Анна" }, "bot-secret");
  const [body, mac] = [token.slice(0, token.lastIndexOf(".")), token.slice(token.lastIndexOf(".") + 1)];
  const tampered = Buffer.from(
    JSON.stringify({ id: 99, exp: JSON.parse(Buffer.from(body, "base64url").toString("utf8")).exp, firstName: "Анна" }),
  ).toString("base64url");
  assert.equal(verifyBotLogin(`${tampered}.${mac}`, "bot-secret"), null);
});

test("verifyBotLogin rejects an expired token", () => {
  const now = Date.now();
  const token = signBotLogin({ id: 1, firstName: "Анна" }, "bot-secret", now);
  assert.equal(verifyBotLogin(token, "bot-secret", now + 11 * 60 * 1000), null);
});

test("webhookSecretMatches is timing-safe on equal lengths", () => {
  assert.equal(webhookSecretMatches("abc", "abc"), true);
  assert.equal(webhookSecretMatches("abc", "abd"), false);
  assert.equal(webhookSecretMatches("ab", "abc"), false);
});
