import type { EventContent } from "@/content/types";
import { ivanMaria } from "@/events/ivan-maria";
import { kira } from "@/events/kira";
import { olgaNikita } from "@/events/olga-nikita";
import { sofia } from "@/events/sofia";

export const events: EventContent[] = [sofia, ivanMaria, kira, olgaNikita];

/** Fallback event when RSVP admin omits `slug`. */
export const demoEvent = sofia;

const slugRedirects: Record<string, string> = {
  "anna-dmitry": "sofia",
};

export function getSlugRedirect(slug: string): string | undefined {
  return slugRedirects[slug];
}

export function getRedirectSlugs() {
  return Object.keys(slugRedirects);
}

export function getDemoEvent() {
  return demoEvent;
}

export function getEventBySlug(slug: string | undefined | null): EventContent | undefined {
  const key = slug?.trim() ?? "";
  if (!key) return undefined;
  return events.find((event) => event.slug === key);
}

export function getEventSlugs() {
  return events.map((event) => event.slug);
}
