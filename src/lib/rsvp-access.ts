import type { EventContent } from "@/content/types";
import { demoEvent } from "@/events";
import type { Organizer } from "@/lib/organizer-store";
import { getDbEventBySlug } from "@/lib/event-store";
import { resolveEvent } from "@/lib/resolve-event";
import { getDatabaseUrl } from "@/lib/db";

export async function eventForRsvpAccess(input: {
  slug?: string;
  isAdmin: boolean;
  organizer?: Organizer;
}): Promise<EventContent | undefined> {
  if (input.isAdmin) {
    if (!input.slug) return demoEvent;
    return resolveEvent(input.slug);
  }

  if (!input.organizer || !getDatabaseUrl()) return undefined;
  if (!input.slug) return undefined;

  const stored = await getDbEventBySlug(input.slug);
  if (stored && stored.organizerId === input.organizer.id) {
    return stored.content;
  }

  return undefined;
}
