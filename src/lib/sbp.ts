export const EVENT_PRICE_RUB = 5000;

export type SbpDetails = {
  phone: string;
  bank: string;
  recipient: string;
  contact?: string;
  priceRub: number;
};

function stripAt(value: string) {
  return value.replace(/^@/, "").trim();
}

export function getSbpDetails(): SbpDetails | undefined {
  const phone = process.env.SBP_PHONE?.trim() ?? "";
  if (!phone) return undefined;
  const contact = stripAt(process.env.SBP_CONTACT?.trim() ?? "");
  return {
    phone,
    bank: process.env.SBP_BANK?.trim() || "Т-Банк",
    recipient: process.env.SBP_RECIPIENT?.trim() || "Александр С.",
    contact: contact || undefined,
    priceRub: EVENT_PRICE_RUB,
  };
}

export function botPayUrl(botUsername: string, slug: string) {
  const bot = stripAt(botUsername);
  if (!bot || !slug) return "";
  return `https://t.me/${bot}?start=pay_${encodeURIComponent(slug)}`;
}
