import type { EventContent } from "@/content/types";
import { annaDmitry } from "@/events/anna-dmitry";
import { ivanMaria } from "@/events/ivan-maria";

export const events: EventContent[] = [annaDmitry, ivanMaria];

/** Live demo guests should land on after `/`. */
export const demoEvent = annaDmitry;

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
