import { timingSafeEqual } from "node:crypto";

export const RSVP_ADMIN_COOKIE = "rsvp_admin";

export function getRsvpAdminSecret() {
  return process.env.RSVP_ADMIN_SECRET?.trim() ?? "";
}

export function isRsvpAdminSecret(value: string | undefined | null) {
  const expected = getRsvpAdminSecret();
  const provided = value?.trim() ?? "";
  if (!expected || !provided) return false;
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
