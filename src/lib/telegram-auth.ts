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
