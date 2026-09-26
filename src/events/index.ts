import type { EventContent } from "@/content/types";
import { ilyaDasha } from "@/events/ilya-dasha";
import { ivanMaria } from "@/events/ivan-maria";
import { kira } from "@/events/kira";
import { maxLera } from "@/events/max-lera";
import { markAlisa } from "@/events/mark-alisa";
import { nikitaOlga } from "@/events/nikita-olga";
import { sofia } from "@/events/sofia";
import { levVera } from "@/events/lev-vera";
import { arseniyMaya } from "@/events/arseniy-maya";

export const events: EventContent[] = [
  sofia,
  ivanMaria,
  kira,
  nikitaOlga,
  maxLera,
  ilyaDasha,
  markAlisa,
  levVera,
  arseniyMaya,
];

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
