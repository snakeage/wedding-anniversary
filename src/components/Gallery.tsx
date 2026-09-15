"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { EventContent } from "@/content/types";
import { GoldRule, Reveal } from "@/components/Reveal";

export function Gallery({ event }: { event: EventContent }) {
  const { gallery, inviteLead } = event;
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") setActive(null);
      if (keyboardEvent.key === "ArrowRight") {
        setActive((current) =>
          current === null ? current : (current + 1) % gallery.length,
        );
      }
      if (keyboardEvent.key === "ArrowLeft") {
        setActive((current) =>
          current === null
            ? current
            : (current - 1 + gallery.length) % gallery.length,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [active, gallery.length]);

  return (
    <section id="story" className="relative px-6 py-8 sm:py-16">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">
          {event.galleryKicker ?? "Наша история"}
        </p>
        <h2 className="font-serif mt-4 text-4xl text-ink sm:text-5xl">
          {event.galleryHeading ?? "Годы, которые мы бережём"}
        </h2>
        <GoldRule className="mt-6" />
        <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-ink/65">
          {inviteLead}
        </p>
      </Reveal>

      <div className="mx-auto mt-12 flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
        {gallery.map((item, index) => (
          <Reveal key={item.src} delay={index * 0.06} className="min-w-[78%] snap-center md:min-w-0">
            <button
              type="button"
              onClick={() => setActive(index)}
              className="group panel relative block w-full overflow-hidden text-left"
            >
              <div className="relative aspect-4/3">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 80vw, 30vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-4 py-4">
                <p className="font-serif text-lg text-ink">{item.caption}</p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active !== null ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр фотографии"
          >
            <motion.figure
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl"
              onClick={(clickEvent) => clickEvent.stopPropagation()}
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-sm bg-cream">
                <Image
                  src={gallery[active].src}
                  alt={gallery[active].alt}
                  fill
                  sizes="90vw"
                  className="object-cover"
                  priority
                />
              </div>
              <figcaption className="mt-4 text-center font-serif text-lg text-cream">
                {gallery[active].caption}
              </figcaption>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute -top-10 right-0 text-xs tracking-[0.24em] text-cream/80 uppercase"
              >
                Закрыть
              </button>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
