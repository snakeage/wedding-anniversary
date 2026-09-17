import { NextResponse } from "next/server";
import { getCurrentOrganizer } from "@/lib/current-organizer";
import { markEventPendingApproval } from "@/lib/event-store";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const cabinet = new URL("/cabinet", url.origin);
  const organizer = await getCurrentOrganizer();
  if (!organizer) {
    return NextResponse.redirect(new URL("/login", url.origin), 303);
  }

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim().toLowerCase();
  if (!slug) {
    cabinet.searchParams.set("error", "receipt");
    return NextResponse.redirect(cabinet, 303);
  }

  try {
    const ok = await markEventPendingApproval(organizer.id, slug);
    if (!ok) {
      cabinet.searchParams.set("error", "receipt");
    }
  } catch (error) {
    console.error("[cabinet] mark receipt failed", error);
    cabinet.searchParams.set("error", "receipt");
  }

  return NextResponse.redirect(cabinet, 303);
}
