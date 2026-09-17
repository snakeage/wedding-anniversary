import { TEMPLATE_IDS, type EventContent, type TemplateId } from "@/content/types";
import { parseEventContent } from "@/lib/event-content";
import { parseYandexMapPoint } from "@/lib/yandex-maps";

export function asFormString(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

export function isoToDatetimeLocal(iso: string) {
  const match = iso.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  return match?.[1] ?? "";
}

export function mapUrlFromPoint(lat: number, lng: number) {
  return `https://yandex.ru/maps/?ll=${lng},${lat}`;
}

export function eventFromForm(
  form: FormData,
  options?: { slug?: string; gallerySrc?: string },
): EventContent | undefined {
  const slug = (options?.slug ?? asFormString(form, "slug")).toLowerCase();
  const templateId = asFormString(form, "templateId");
  const isoRaw = asFormString(form, "iso");
  const iso = isoRaw.length === 16 ? `${isoRaw}:00+03:00` : isoRaw;
  const two = asFormString(form, "two");
  const gallerySrc = options?.gallerySrc ?? asFormString(form, "gallerySrc");
  const galleryAlt = asFormString(form, "galleryAlt");
  const galleryCaption = asFormString(form, "galleryCaption");
  const point = parseYandexMapPoint(asFormString(form, "map"));
  if (!point) return undefined;
  if (!(TEMPLATE_IDS as readonly string[]).includes(templateId)) return undefined;

  return parseEventContent({
    templateId,
    slug,
    couple: two ? { one: asFormString(form, "one"), two } : { one: asFormString(form, "one") },
    kicker: asFormString(form, "kicker"),
    tagline: asFormString(form, "tagline"),
    inviteLead: asFormString(form, "inviteLead"),
    inviteBody: asFormString(form, "inviteBody"),
    event: {
      iso,
      gathering: asFormString(form, "gathering"),
      dressCode: asFormString(form, "dressCode"),
    },
    venue: {
      name: asFormString(form, "venueName"),
      address: asFormString(form, "venueAddress"),
      lat: point.lat,
      lng: point.lng,
      notes: asFormString(form, "venueNotes"),
    },
    gallery:
      gallerySrc && galleryAlt && galleryCaption
        ? [{ src: gallerySrc, alt: galleryAlt, caption: galleryCaption }]
        : [],
    galleryKicker: asFormString(form, "galleryKicker") || undefined,
    galleryHeading: asFormString(form, "galleryHeading") || undefined,
  });
}

export function defaultsFromEvent(content: EventContent) {
  const photo = content.gallery[0];
  return {
    slug: content.slug,
    templateId: content.templateId as TemplateId,
    one: content.couple.one,
    two: content.couple.two ?? "",
    kicker: content.kicker,
    tagline: content.tagline,
    inviteLead: content.inviteLead,
    inviteBody: content.inviteBody,
    iso: isoToDatetimeLocal(content.event.iso),
    gathering: content.event.gathering,
    dressCode: content.event.dressCode,
    venueName: content.venue.name,
    venueAddress: content.venue.address,
    map: mapUrlFromPoint(content.venue.lat, content.venue.lng),
    venueNotes: content.venue.notes,
    gallerySrc: photo?.src ?? "",
    galleryAlt: photo?.alt ?? "",
    galleryCaption: photo?.caption ?? "",
  };
}
