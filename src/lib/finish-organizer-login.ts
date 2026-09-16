import { NextResponse } from "next/server";
import { getDatabaseUrl } from "@/lib/db";
import {
  getOrganizerSessionSecret,
  ORGANIZER_COOKIE,
  organizerCookieSetOptions,
  signOrganizerId,
} from "@/lib/organizer-session";
import { upsertOrganizer } from "@/lib/organizer-store";

export async function finishOrganizerLogin(
  requestUrl: URL,
  input: { telegramId: number; firstName: string; username?: string },
) {
  const fail = new URL("/login", requestUrl.origin);
  fail.searchParams.set("error", "telegram");

  if (!getDatabaseUrl()) {
    return NextResponse.redirect(fail, 303);
  }

  let organizer;
  try {
    organizer = await upsertOrganizer(input);
  } catch (error) {
    console.error("[telegram] upsert failed", error);
    return NextResponse.redirect(fail, 303);
  }

  const secret = getOrganizerSessionSecret();
  if (!secret) {
    return NextResponse.redirect(fail, 303);
  }

  const response = NextResponse.redirect(new URL("/cabinet", requestUrl.origin), 303);
  response.cookies.set(
    ORGANIZER_COOKIE,
    signOrganizerId(organizer.id, secret),
    organizerCookieSetOptions(requestUrl.protocol === "https:"),
  );
  return response;
}
