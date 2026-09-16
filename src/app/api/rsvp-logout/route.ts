import { NextResponse } from "next/server";
import { RSVP_ADMIN_COOKIE, rsvpAdminCookieClearOptions } from "@/lib/rsvp-admin";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const response = NextResponse.redirect(new URL("/login", url.origin), 303);
  response.cookies.set(RSVP_ADMIN_COOKIE, "", rsvpAdminCookieClearOptions());
  return response;
}
