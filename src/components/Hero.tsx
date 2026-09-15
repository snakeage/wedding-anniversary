"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { EventContent } from "@/content/types";
import { formatEventDate } from "@/lib/datetime";
import { partnerName } from "@/lib/names";
import { GoldRule } from "@/components/Reveal";

export function Hero({ event }: { event: EventContent }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 480], [0, reduce ? 0 : 72]);
  const opacity = useTransform(scrollY, [0, 380], [1, 0.15]);
  const partner = partnerName(event);

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh flex-col items-center justify-center px-6 pb-24 pt-28 text-center"
    >
      <motion.div style={{ y }} className="mx-auto max-w-3xl">
        <motion.div style={{ opacity }}>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xs tracking-[0.42em] text-burgundy/80 uppercase"
          >
            {event.kicker}
          </motion.p>

          <GoldRule className="mt-8" />

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif mt-7 text-[clamp(3.2rem,12vw,7.5rem)] leading-[0.92] text-ink"
          >
            <span className="block">{event.couple.one}</span>
            {partner ? (
              <>
                <span className="mt-2 block font-serif text-[clamp(1.4rem,4vw,2.2rem)] font-normal italic text-gold">
                  и
                </span>
                <span className="block">{partner}</span>
              </>
            ) : null}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="mx-auto mt-8 max-w-md font-serif text-xl text-ink/75 italic sm:text-2xl"
          >
            {event.tagline}
          </motion.p>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mt-5 text-sm tracking-[0.18em] text-ink/60 uppercase"
          >
            {formatEventDate(event.event.iso)}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-10"
          >
            <a href="#rsvp" className="btn-gold">
              Подтвердить участие
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      <a
        href="#countdown"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.32em] text-ink/45 uppercase"
      >
        <span>Листать</span>
        <span className="scroll-cue h-8 w-px bg-gold/70" />
      </a>
    </section>
  );
}
