import { NextResponse } from "next/server";
import { uploadGallerySlots } from "@/lib/blob-upload";
import { getCurrentOrganizer } from "@/lib/current-organizer";
import { asFormString, eventFromForm } from "@/lib/event-form";
import { getDbEventBySlug, updateEvent } from "@/lib/event-store";
import { parseYandexMapPoint } from "@/lib/yandex-maps";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const url = new URL(request.url);
  const { slug } = await context.params;
  const fail = (code: string) => {
    const next = new URL(`/cabinet/${encodeURIComponent(slug)}/edit`, url.origin);
    next.searchParams.set("error", code);
    return NextResponse.redirect(next, 303);
  };

  const organizer = await getCurrentOrganizer();
  if (!organizer) {
    return NextResponse.redirect(new URL("/login", url.origin), 303);
  }

  const stored = await getDbEventBySlug(slug);
  if (!stored || stored.organizerId !== organizer.id) {
    return NextResponse.redirect(new URL("/cabinet", url.origin), 303);
  }

  const form = await request.formData();
  if (!parseYandexMapPoint(asFormString(form, "map"))) {
    return fail("map");
  }

  const uploaded = await uploadGallerySlots(form);
  if (!uploaded.ok) return fail(uploaded.error);

  const content = eventFromForm(form, { slug: stored.slug, gallery: uploaded.gallery });
  if (!content) {
    return fail("content");
  }

  try {
    const ok = await updateEvent(organizer.id, stored.slug, content);
    if (!ok) return fail("save");
  } catch (error) {
    console.error("[cabinet] update event failed", error);
    return fail("save");
  }

  return NextResponse.redirect(new URL("/cabinet", url.origin), 303);
}
