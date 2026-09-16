import { timingSafeEqual } from "node:crypto";

export const RSVP_ADMIN_COOKIE = "rsvp_admin";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

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

export function rsvpAdminCookieSetOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

export function rsvpAdminCookieClearOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
