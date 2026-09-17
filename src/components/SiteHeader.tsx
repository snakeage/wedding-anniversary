"use client";

import type { EventContent } from "@/content/types";
import { eventNames } from "@/lib/names";

export function GuestReplyLink() {
  return (
    <a
      href="#rsvp"
      className="text-[10px] tracking-[0.28em] text-burgundy uppercase decoration-gold/60 underline-offset-4 transition-colors hover:underline hover:text-burgundy/75"
    >
      Ответить
    </a>
  );
}

export function SiteHeader({ event }: { event: EventContent }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-linear-to-b from-cream/80 to-transparent px-5 py-4 sm:px-8">
      <a href="#hero" className="font-serif text-lg text-ink/80 sm:text-xl">
        {eventNames(event)}
      </a>
      <GuestReplyLink />
    </header>
  );
}
