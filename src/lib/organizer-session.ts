import { createHmac, timingSafeEqual } from "node:crypto";
import {
  rsvpAdminCookieClearOptions,
  rsvpAdminCookieSetOptions,
} from "@/lib/rsvp-admin";

export const ORGANIZER_COOKIE = "organizer";

export function getOrganizerSessionSecret() {
  return (
    process.env.TELEGRAM_BOT_TOKEN?.trim() ||
    process.env.RSVP_ADMIN_SECRET?.trim() ||
    ""
  );
}

export function signOrganizerId(id: string, secret: string) {
  const mac = createHmac("sha256", secret).update(id).digest("hex");
  return `${id}.${mac}`;
}

export function readOrganizerId(value: string | undefined | null, secret: string) {
  if (!value || !secret) return null;
  const dot = value.indexOf(".");
  if (dot < 1) return null;
  const id = value.slice(0, dot);
  const mac = value.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(id).digest("hex");
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return null;
  if (!timingSafeEqual(left, right)) return null;
  return id;
}

export function organizerCookieSetOptions(secure: boolean) {
  return rsvpAdminCookieSetOptions(secure);
}

export function organizerCookieClearOptions() {
  return rsvpAdminCookieClearOptions();
}
