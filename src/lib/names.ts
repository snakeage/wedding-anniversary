import type { EventContent } from "@/content/types";

export function partnerName(event: EventContent): string | undefined {
  const two = event.couple.two?.trim();
  return two || undefined;
}

/** Inline label: "Анна & Дмитрий" or "София". */
export function eventNames(event: EventContent, and = "&"): string {
  const two = partnerName(event);
  return two ? `${event.couple.one} ${and} ${two}` : event.couple.one;
}

export function eventInitials(event: EventContent): string {
  const two = partnerName(event);
  const first = event.couple.one.charAt(0);
  return two ? `${first}${two.charAt(0)}` : first;
}
