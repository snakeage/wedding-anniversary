import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export function telegramLoginHash(data: Record<string, string>, botToken: string) {
  const check = Object.keys(data)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");
  const secret = createHash("sha256").update(botToken).digest();
  return createHmac("sha256", secret).update(check).digest("hex");
}

export function verifyTelegramLogin(data: Record<string, string>, botToken: string) {
  const hash = data.hash ?? "";
  const authDate = Number(data.auth_date);
  if (!hash || !botToken || !Number.isFinite(authDate)) return false;
  if (Math.abs(Date.now() / 1000 - authDate) > 60 * 60 * 24) return false;
  const expected = telegramLoginHash(data, botToken);
  const left = Buffer.from(hash);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function telegramAuthFromSearch(search: URLSearchParams): Record<string, string> {
  const data: Record<string, string> = {};
  for (const [key, value] of search.entries()) {
    data[key] = value;
  }
  return data;
}

export const BOT_LOGIN_TTL_SEC = 10 * 60;

export type BotLoginPayload = {
  id: number;
  exp: number;
  firstName: string;
  username?: string;
};

export function signBotLogin(
  data: Omit<BotLoginPayload, "exp">,
  secret: string,
  nowMs = Date.now(),
) {
  const payload: BotLoginPayload = {
    id: data.id,
    exp: Math.floor(nowMs / 1000) + BOT_LOGIN_TTL_SEC,
    firstName: data.firstName,
    username: data.username,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const mac = createHmac("sha256", secret).update(body).digest("hex");
  return `${body}.${mac}`;
}

export function verifyBotLogin(
  token: string | undefined | null,
  secret: string,
  nowMs = Date.now(),
): BotLoginPayload | null {
  if (!token || !secret) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const body = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  let payload: BotLoginPayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as BotLoginPayload;
  } catch {
    return null;
  }
  if (!Number.isFinite(payload.id) || !Number.isFinite(payload.exp)) return null;
  if (payload.exp < Math.floor(nowMs / 1000)) return null;
  return payload;
}

export function webhookSecretMatches(header: string | null, expected: string) {
  if (!header || !expected) return false;
  const left = Buffer.from(header);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
