import { NextResponse } from "next/server";
import {
  isRsvpAdminSecret,
  RSVP_ADMIN_COOKIE,
  rsvpAdminCookieSetOptions,
} from "@/lib/rsvp-admin";

function loginRedirect(requestUrl: URL, secret: string, slug: string | null) {
  const redirectUrl = new URL("/rsvp-list", requestUrl.origin);
  if (slug) {
    redirectUrl.searchParams.set("slug", slug);
  }
  const response = NextResponse.redirect(redirectUrl, 303);
  response.cookies.set(
    RSVP_ADMIN_COOKIE,
    secret,
    rsvpAdminCookieSetOptions(requestUrl.protocol === "https:"),
  );
  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret") ?? "";

  if (!isRsvpAdminSecret(secret)) {
    return new NextResponse(null, { status: 404 });
  }

  return loginRedirect(url, secret.trim(), url.searchParams.get("slug")?.trim() || null);
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const form = await request.formData();
  const secret = String(form.get("password") ?? "");
  const slug = String(form.get("slug") ?? "").trim();

  if (!isRsvpAdminSecret(secret)) {
    const fail = new URL("/login", url.origin);
    fail.searchParams.set("error", "1");
    if (slug) {
      fail.searchParams.set("slug", slug);
    }
    return NextResponse.redirect(fail, 303);
  }

  return loginRedirect(url, secret.trim(), slug || null);
}
