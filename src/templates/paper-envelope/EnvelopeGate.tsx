"use client";

import { useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { EventContent } from "@/content/types";
import { eventInitials, partnerName } from "@/lib/names";
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
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const initials = eventInitials(event);
  const partner = partnerName(event);

  const handleOpen = useCallback(() => {
    if (reduce) {
      setPhase("open");
      return;
    }
    setPhase("opening");
    window.setTimeout(() => setPhase("open"), 1900);
  }, [reduce]);

  useEffect(() => {
    const refresh = () => {
      lenis?.resize();
    };
    refresh();
    const frame = window.requestAnimationFrame(refresh);
    const delays = [160, 500, 1200].map((ms) => window.setTimeout(refresh, ms));
    const root = document.querySelector(".paper-envelope");
    const observer = root ? new ResizeObserver(refresh) : null;
    if (root) observer?.observe(root);
    return () => {
      window.cancelAnimationFrame(frame);
      delays.forEach((id) => window.clearTimeout(id));
      observer?.disconnect();
    };
  }, [phase, lenis]);

  if (phase === "open") {
    return children;
  }

  return (
    <div className="envelope-shell">
      <div className="envelope-stage">
        <EnvelopeArt initials={initials} opening={phase === "opening"} />
        <div className="envelope-copy">
          <p className="text-[10px] tracking-[0.32em] text-burgundy/80 uppercase">
            {event.kicker}
          </p>
          <p className="font-serif mt-3 text-3xl leading-tight text-ink sm:text-4xl">
            {event.couple.one}
            {partner ? (
              <>
                <span className="mt-1 block font-serif text-xl italic text-gold">и</span>
                {partner}
              </>
            ) : null}
          </p>
          <p className="mt-3 text-sm leading-6 text-ink/65">{event.tagline}</p>
          <button
            type="button"
            className="btn-gold mt-6"
            onClick={handleOpen}
            disabled={phase === "opening"}
          >
            Открыть приглашение
          </button>
        </div>
      </div>
    </div>
  );
}
