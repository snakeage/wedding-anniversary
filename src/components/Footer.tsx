import type { EventContent } from "@/content/types";
import { eventNames } from "@/lib/names";

export function Footer({ event }: { event: EventContent }) {
  return (
    <footer className="relative px-6 pb-16 pt-4 text-center">
      <p className="font-serif text-2xl text-ink/70">
        {eventNames(event)}
      </p>
      <p className="mt-3 text-[10px] tracking-[0.28em] text-ink/40 uppercase">
        С любовью · ждём вас
      </p>
    </footer>
  );
}
