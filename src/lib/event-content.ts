import { TEMPLATE_IDS, type EventContent, type GalleryItem, type TemplateId } from "@/content/types";
import { getEventSlugs, getRedirectSlugs } from "@/events";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED_PATHS = ["login", "cabinet", "rsvp-list", "api", "icon", "terms"];

export function reservedSlugs() {
  return new Set([...RESERVED_PATHS, ...getEventSlugs(), ...getRedirectSlugs()]);
}

export function isValidSlug(slug: string) {
  return slug.length >= 2 && slug.length <= 80 && SLUG_RE.test(slug);
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value);
}

function parseGallery(value: unknown): GalleryItem[] {
  if (!Array.isArray(value)) return [];
  const items: GalleryItem[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const record = raw as Record<string, unknown>;
    const src = asString(record.src);
    const alt = asString(record.alt);
    const caption = asString(record.caption);
    if (!src.startsWith("/") || !alt || !caption) continue;
    items.push({ src, alt, caption });
  }
  return items;
}

export function parseEventContent(body: unknown): EventContent | undefined {
  if (!body || typeof body !== "object") return undefined;
  const record = body as Record<string, unknown>;
  const templateId = asString(record.templateId);
  if (!(TEMPLATE_IDS as readonly string[]).includes(templateId)) return undefined;
  const slug = asString(record.slug).toLowerCase();
  if (!isValidSlug(slug)) return undefined;

  const coupleRaw = record.couple;
  if (!coupleRaw || typeof coupleRaw !== "object") return undefined;
  const couple = coupleRaw as Record<string, unknown>;
  const one = asString(couple.one);
  if (!one) return undefined;
  const two = asString(couple.two) || undefined;

  const eventRaw = record.event;
  if (!eventRaw || typeof eventRaw !== "object") return undefined;
  const event = eventRaw as Record<string, unknown>;
  const iso = asString(event.iso);
  if (!Number.isFinite(Date.parse(iso))) return undefined;

  const venueRaw = record.venue;
  if (!venueRaw || typeof venueRaw !== "object") return undefined;
  const venue = venueRaw as Record<string, unknown>;
  const lat = asNumber(venue.lat);
  const lng = asNumber(venue.lng);
  const name = asString(venue.name);
  if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;

  return {
    templateId: templateId as TemplateId,
    slug,
    couple: two ? { one, two } : { one },
    kicker: asString(record.kicker) || "Приглашение",
    tagline: asString(record.tagline),
    inviteLead: asString(record.inviteLead),
    inviteBody: asString(record.inviteBody),
    event: {
      iso,
      gathering: asString(event.gathering),
      dressCode: asString(event.dressCode),
    },
    venue: {
      name,
      address: asString(venue.address),
      lat,
      lng,
      notes: asString(venue.notes),
    },
    gallery: parseGallery(record.gallery),
    galleryKicker: asString(record.galleryKicker) || undefined,
    galleryHeading: asString(record.galleryHeading) || undefined,
  };
}
