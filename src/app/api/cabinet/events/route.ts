import { NextResponse } from "next/server";
import type { TemplateId } from "@/content/types";
import { uploadGallerySlots } from "@/lib/blob-upload";
import { getCurrentOrganizer } from "@/lib/current-organizer";
import { isValidSlug, reservedSlugs } from "@/lib/event-content";
import { asFormString, eventFromForm } from "@/lib/event-form";
import { insertEvent } from "@/lib/event-store";
import { parseYandexMapPoint } from "@/lib/yandex-maps";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const fail = (code: string) => {
    const next = new URL("/cabinet/new", url.origin);
    next.searchParams.set("error", code);
    return NextResponse.redirect(next, 303);
  };

  const organizer = await getCurrentOrganizer();
  if (!organizer) {
    return NextResponse.redirect(new URL("/login", url.origin), 303);
  }

  const form = await request.formData();
  const slug = asFormString(form, "slug").toLowerCase();
  if (!isValidSlug(slug) || reservedSlugs().has(slug)) {
    return fail("slug");
  }
  if (!parseYandexMapPoint(asFormString(form, "map"))) {
    return fail("map");
  }

  const uploaded = await uploadGallerySlots(form);
  if (!uploaded.ok) return fail(uploaded.error);

  const content = eventFromForm(form, { gallery: uploaded.gallery });
  if (!content) {
    return fail("content");
  }

  try {
    await insertEvent(organizer.id, { ...content, templateId: content.templateId as TemplateId });
  } catch (error) {
    console.error("[cabinet] insert event failed", error);
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    return fail(code === "23505" ? "slug" : "save");
  }

  return NextResponse.redirect(new URL("/cabinet", url.origin), 303);
}
