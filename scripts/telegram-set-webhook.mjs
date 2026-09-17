import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(join(root, ".env.local"));
loadEnvFile(join(root, ".env"));

const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim() ?? "";
const site = (process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "").replace(/\/$/, "");

if (!botToken || !secret || !site) {
  console.error(
    "Need TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, and NEXT_PUBLIC_SITE_URL.",
  );
  process.exit(1);
}

const api = `https://api.telegram.org/bot${botToken}`;

async function telegram(method, payload) {
  const response = await fetch(`${api}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json();
  if (!response.ok || !body.ok) {
    console.error(`${method} failed`, body);
    process.exit(1);
  }
}

const webhookUrl = `${site}/api/telegram/webhook`;
await telegram("setWebhook", {
  url: webhookUrl,
  secret_token: secret,
  allowed_updates: ["message", "callback_query"],
});
console.log("Webhook set:", webhookUrl);

await telegram("setMyCommands", {
  commands: [{ command: "start", description: "Открыть кабинет" }],
});
console.log("Bot command /start registered");

await telegram("setMyShortDescription", {
  short_description: "Кабинет цифровых приглашений: создать страницу, оплатить по СБП, открыть гостям.",
});
await telegram("setMyDescription", {
  description: [
    "Бот кабинета цифровых приглашений.",
    "",
    "Нажмите /start — придёт кнопка «Открыть кабинет» (действует 10 минут).",
    "Чек об оплате пришлите сюда после кнопки «Отправить чек в бот» в кабинете: фото или PDF.",
    "Комментарий в банковском переводе оставляйте пустым.",
  ].join("\n"),
});
console.log("Bot profile texts set (avatar still via BotFather /setuserpic)");
