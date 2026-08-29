import { NextResponse } from "next/server";
import { isRsvpAdminSecret, RSVP_ADMIN_COOKIE } from "@/lib/rsvp-admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret") ?? "";

  if (!isRsvpAdminSecret(secret)) {
    return new NextResponse(null, { status: 404 });
  }

  const redirectUrl = new URL("/rsvp-list", url.origin);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(RSVP_ADMIN_COOKIE, secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: url.protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
