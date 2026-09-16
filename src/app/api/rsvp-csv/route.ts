import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDatabaseUrl } from "@/lib/db";
import { getCurrentOrganizer } from "@/lib/current-organizer";
import { csvFilename, toCsv } from "@/lib/rsvp-csv";
import { isRsvpAdminSecret, RSVP_ADMIN_COOKIE } from "@/lib/rsvp-admin";
import { eventForRsvpAccess } from "@/lib/rsvp-access";
import { listRsvps } from "@/lib/rsvp-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cookieStore = await cookies();
  const isAdmin =
    isRsvpAdminSecret(url.searchParams.get("secret")) ||
    isRsvpAdminSecret(cookieStore.get(RSVP_ADMIN_COOKIE)?.value);
  const organizer = await getCurrentOrganizer();

  if (!isAdmin && !organizer) {
    return new NextResponse(null, { status: 404 });
  }

  const slug = url.searchParams.get("slug")?.trim();
  const event = await eventForRsvpAccess({ slug, isAdmin, organizer });
  if (!event) {
    return new NextResponse(null, { status: 404 });
  }

  if (!getDatabaseUrl()) {
    return new NextResponse("DATABASE_URL не задан", { status: 503 });
  }

  const rows = await listRsvps(event.slug);
  const body = toCsv(rows);
  const filename = csvFilename(event.slug);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
