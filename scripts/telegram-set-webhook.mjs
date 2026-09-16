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

const webhookUrl = `${site}/api/telegram/webhook`;
const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: webhookUrl,
    secret_token: secret,
    allowed_updates: ["message"],
  }),
});

const body = await response.json();
if (!response.ok || !body.ok) {
  console.error("setWebhook failed", body);
  process.exit(1);
}

console.log("Webhook set:", webhookUrl);
