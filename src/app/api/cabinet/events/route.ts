import { NextResponse } from "next/server";
import { TEMPLATE_IDS, type EventContent, type TemplateId } from "@/content/types";
import { getCurrentOrganizer } from "@/lib/current-organizer";
import { isValidSlug, parseEventContent, reservedSlugs } from "@/lib/event-content";
import { insertEvent } from "@/lib/event-store";
import { parseYandexMapPoint } from "@/lib/yandex-maps";

function asString(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function eventFromForm(form: FormData): EventContent | undefined {
  const slug = asString(form, "slug").toLowerCase();
  const templateId = asString(form, "templateId");
  const isoRaw = asString(form, "iso");
  const iso = isoRaw.length === 16 ? `${isoRaw}:00+03:00` : isoRaw;
  const two = asString(form, "two");
  const gallerySrc = asString(form, "gallerySrc");
  const galleryAlt = asString(form, "galleryAlt");
  const galleryCaption = asString(form, "galleryCaption");
  const point = parseYandexMapPoint(asString(form, "map"));
  if (!point) return undefined;

  return parseEventContent({
    templateId,
    slug,
    couple: two ? { one: asString(form, "one"), two } : { one: asString(form, "one") },
    kicker: asString(form, "kicker"),
    tagline: asString(form, "tagline"),
    inviteLead: asString(form, "inviteLead"),
    inviteBody: asString(form, "inviteBody"),
    event: {
      iso,
      timeLabel: asString(form, "timeLabel"),
      gathering: asString(form, "gathering"),
      dressCode: asString(form, "dressCode"),
    },
    venue: {
      name: asString(form, "venueName"),
      address: asString(form, "venueAddress"),
      lat: point.lat,
      lng: point.lng,
      notes: asString(form, "venueNotes"),
    },
    gallery:
      gallerySrc && galleryAlt && galleryCaption
        ? [{ src: gallerySrc, alt: galleryAlt, caption: galleryCaption }]
        : [],
    galleryKicker: asString(form, "galleryKicker") || undefined,
    galleryHeading: asString(form, "galleryHeading") || undefined,
  });
}

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
  const slug = asString(form, "slug").toLowerCase();
  if (!isValidSlug(slug) || reservedSlugs().has(slug)) {
    return fail("slug");
  }
  if (!(TEMPLATE_IDS as readonly string[]).includes(asString(form, "templateId"))) {
    return fail("template");
  }
  if (!parseYandexMapPoint(asString(form, "map"))) {
    return fail("map");
  }

  const content = eventFromForm(form);
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
