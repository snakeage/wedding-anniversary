import { getEventBySlug } from "@/events";
import type { EventContent } from "@/content/types";
import { getDatabaseUrl } from "@/lib/db";
import { getDbEventBySlug } from "@/lib/event-store";

export async function resolveEvent(slug: string | undefined | null): Promise<EventContent | undefined> {
  const key = slug?.trim() ?? "";
  if (!key) return undefined;
  if (getDatabaseUrl()) {
    try {
      const stored = await getDbEventBySlug(key);
      if (stored) return stored.content;
    } catch (error) {
      console.error("[events] db lookup failed", error);
    }
  }
  return getEventBySlug(key);
}
