import { GALLERY_MAX, TEMPLATE_IDS, type EventContent, type GalleryItem, type TemplateId } from "@/content/types";
import { parseEventContent } from "@/lib/event-content";
import { parseYandexMapPoint } from "@/lib/yandex-maps";

export { GALLERY_MAX };

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

export type GallerySlot = {
  src: string;
  file: File | null;
  alt: string;
  caption: string;
};

function formAllStrings(form: FormData, key: string) {
  return form.getAll(key).map((value) => String(value ?? "").trim());
}

export function gallerySlotsFromForm(form: FormData): GallerySlot[] {
  const srcs = formAllStrings(form, "gallerySrc");
  const files = form.getAll("galleryFile");
  const alts = formAllStrings(form, "galleryAlt");
  const captions = formAllStrings(form, "galleryCaption");
  const n = Math.min(GALLERY_MAX, Math.max(srcs.length, files.length, alts.length, captions.length));
  const slots: GallerySlot[] = [];
  for (let i = 0; i < n; i++) {
    const raw = files[i];
    const file = raw instanceof File && raw.size > 0 ? raw : null;
    const src = srcs[i] ?? "";
    const alt = alts[i] ?? "";
    const caption = captions[i] ?? "";
    if (!file && !src) continue;
    slots.push({ src, file, alt, caption });
  }
  return slots;
}

export function gallerySlotMissingCopy(slot: GallerySlot) {
  return Boolean((slot.src || slot.file) && (!slot.alt || !slot.caption));
}

export function eventFromForm(
  form: FormData,
  options?: { slug?: string; gallery?: GalleryItem[] },
): EventContent | undefined {
  const slug = (options?.slug ?? asFormString(form, "slug")).toLowerCase();
  const templateId = asFormString(form, "templateId");
  const isoRaw = asFormString(form, "iso");
  const iso = isoRaw.length === 16 ? `${isoRaw}:00+03:00` : isoRaw;
  const two = asFormString(form, "two");
  const point = parseYandexMapPoint(asFormString(form, "map"));
  if (!point) return undefined;
  if (!(TEMPLATE_IDS as readonly string[]).includes(templateId)) return undefined;

  const gallery =
    options?.gallery ??
    gallerySlotsFromForm(form)
      .filter((slot) => slot.src && slot.alt && slot.caption)
      .map((slot) => ({ src: slot.src, alt: slot.alt, caption: slot.caption }));

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
    gallery,
    galleryKicker: asFormString(form, "galleryKicker") || undefined,
    galleryHeading: asFormString(form, "galleryHeading") || undefined,
  });
}

export function defaultsFromEvent(content: EventContent) {
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
    gallery: content.gallery,
    galleryKicker: content.galleryKicker ?? "",
    galleryHeading: content.galleryHeading ?? "",
  };
}
