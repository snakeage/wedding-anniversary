"use client";

import { content } from "@/content";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-linear-to-b from-cream/80 to-transparent px-5 py-4 sm:px-8">
      <a href="#hero" className="font-serif text-lg text-ink/80 sm:text-xl">
        {content.couple.one} & {content.couple.two}
      </a>
      <a href="#rsvp" className="text-[10px] tracking-[0.28em] text-burgundy uppercase">
        RSVP
      </a>
    </header>
  );
}
