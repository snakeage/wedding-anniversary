"use client";

import { useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import type { EventContent } from "@/content/types";
import { EnvelopeArt } from "@/templates/paper-envelope/EnvelopeArt";

export function EnvelopeGate({
  event,
  children,
}: {
  event: EventContent;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const initials = `${event.couple.one.charAt(0)}${event.couple.two.charAt(0)}`;

  useEffect(() => {
    if (reduce) setOpen(true);
  }, [reduce]);

  useEffect(() => {
    if (!open) return;

    const refresh = () => {
      lenis?.resize();
      window.dispatchEvent(new Event("resize"));
    };

    refresh();
    const frame = window.requestAnimationFrame(refresh);
    const timeout = window.setTimeout(refresh, 160);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [open, lenis]);

  if (open) {
    return children;
  }

  return (
    <div className="envelope-shell">
      <div className="envelope-stage">
        <EnvelopeArt initials={initials} />
        <div className="envelope-copy">
          <p className="text-[10px] tracking-[0.32em] text-burgundy/80 uppercase">
            {event.kicker}
          </p>
          <p className="font-serif mt-3 text-3xl leading-tight text-ink sm:text-4xl">
            {event.couple.one}
            <span className="mt-1 block font-serif text-xl italic text-gold">и</span>
            {event.couple.two}
          </p>
          <p className="mt-3 text-sm leading-6 text-ink/65">{event.tagline}</p>
          <button type="button" className="btn-gold mt-6" onClick={() => setOpen(true)}>
            Открыть приглашение
          </button>
        </div>
      </div>
    </div>
  );
}
