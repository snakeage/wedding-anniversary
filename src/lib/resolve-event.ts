import { getEventBySlug } from "@/events";
import type { EventContent } from "@/content/types";
import { getDatabaseUrl } from "@/lib/db";
import { getDbEventBySlug, type EventStatus } from "@/lib/event-store";

export type EventAccessMode = "active" | "preview" | "not_found";

export type EventAccess =
  | { mode: "active" | "preview"; event: EventContent }
  | { mode: "not_found" };

export function accessModeForStoredEvent(input: {
  status: EventStatus;
  organizerId: string;
  viewerOrganizerId?: string;
}): EventAccessMode {
  if (input.status === "active") return "active";
  if (input.viewerOrganizerId && input.viewerOrganizerId === input.organizerId) {
    return "preview";
  }
  return "not_found";
}

const DB_TIMEOUT_MS = 1200;

function withTimeout<T>(promise: Promise<T>, ms = DB_TIMEOUT_MS): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`[events] db timeout after ${ms}ms`)), ms);
    timer.unref?.();
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

export async function resolveEvent(slug: string | undefined | null): Promise<EventContent | undefined> {
  const key = slug?.trim() ?? "";
  if (!key) return undefined;
  if (getDatabaseUrl()) {
    try {
      const stored = await withTimeout(getDbEventBySlug(key));
      if (stored) return stored.content;
    } catch (error) {
      console.error("[events] db lookup failed", error);
    }
  }
  return getEventBySlug(key);
}

export async function resolveEventWithAccess(
  slug: string | undefined | null,
  options?: {
    organizerId?: string;
    loadOrganizerId?: () => Promise<string | undefined>;
  },
): Promise<EventAccess> {
  const key = slug?.trim() ?? "";
  if (!key) return { mode: "not_found" };

  if (getDatabaseUrl()) {
    try {
      const stored = await withTimeout(getDbEventBySlug(key));
      if (stored) {
        let viewerOrganizerId = options?.organizerId;
        if (!viewerOrganizerId && stored.status !== "active" && options?.loadOrganizerId) {
          viewerOrganizerId = await options.loadOrganizerId();
        }
        const mode = accessModeForStoredEvent({
          status: stored.status,
          organizerId: stored.organizerId,
          viewerOrganizerId,
        });
        if (mode === "not_found") return { mode: "not_found" };
        return { mode, event: stored.content };
      }
    } catch (error) {
      console.error("[events] db lookup failed", error);
    }
  }

  const demo = getEventBySlug(key);
  if (demo) return { mode: "active", event: demo };
  return { mode: "not_found" };
}
