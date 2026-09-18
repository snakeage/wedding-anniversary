"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { Footer } from "@/components/Footer";
import { RsvpForm } from "@/components/RsvpForm";
import { GuestReplyLink } from "@/components/SiteHeader";
import { VenueMap } from "@/components/VenueMap";
import type { EventContent, GalleryItem } from "@/content/types";
import { formatEventDate, formatEventTime } from "@/lib/datetime";
import { partnerName } from "@/lib/names";
import "./garden.css";

function BotanicalDivider() {
  return (
    <div className="garden-divider" aria-hidden>
      <span className="garden-divider-line" />
      <svg className="garden-divider-leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 21V3M12 3C7 6 6 12 12 15M12 3C17 6 18 12 12 15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="garden-divider-line" />
    </div>
  );
}

function BotanicalAtmosphere() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const yTopLeft = useTransform(scrollY, [0, 2000], [0, 180]);
  const yTopRight = useTransform(scrollY, [0, 2000], [0, -140]);
  const yMidLeft = useTransform(scrollY, [800, 2800], [0, 160]);
  const yLowerRight = useTransform(scrollY, [1400, 3600], [0, -130]);

  return (
    <div className="garden-botanical-canvas" aria-hidden>
      {/* Top Left climbing olive/herbs branch */}
      <motion.div
        style={{ y: reduce ? 0 : yTopLeft }}
        className="garden-canvas-art garden-art-top-left"
      >
        <Image
          src="/botanical/garden-branch-left.png?v=3"
          alt=""
          width={360}
          height={640}
          unoptimized
          priority
          className="garden-engraving"
        />
      </motion.div>

      {/* Hero Right wild climbing rose branch */}
      <motion.div
        style={{ y: reduce ? 0 : yTopRight }}
        className="garden-canvas-art garden-art-top-right"
      >
        <Image
          src="/botanical/garden-branch-right.png?v=3"
          alt=""
          width={360}
          height={640}
          unoptimized
          priority
          className="garden-engraving"
        />
      </motion.div>

      {/* Mid-page meadow accent near Gallery & Details */}
      <motion.div
        style={{ y: reduce ? 0 : yMidLeft }}
        className="garden-canvas-art garden-art-mid-left"
      >
        <Image
          src="/botanical/garden-branch-left.png?v=3"
          alt=""
          width={320}
          height={560}
          unoptimized
          className="garden-engraving garden-art-flip"
        />
      </motion.div>

      {/* Lower accent near Venue and RSVP */}
      <motion.div
        style={{ y: reduce ? 0 : yLowerRight }}
        className="garden-canvas-art garden-art-lower-right"
      >
        <Image
          src="/botanical/garden-branch-right.png?v=3"
          alt=""
          width={320}
          height={560}
          unoptimized
          className="garden-engraving"
        />
      </motion.div>
    </div>
  );
}

function GardenHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-end px-5 py-4 sm:px-8">
      <GuestReplyLink />
    </header>
  );
}

function GardenHero({ event, still }: { event: EventContent; still?: GalleryItem }) {
  const partner = partnerName(event);
  const showLead = event.gallery.length <= 1 && Boolean(event.inviteLead.trim());

  return (
    <section id="hero" className="garden-hero">
      <div className="garden-hero-copy">
        <div className="garden-crest-wrap" aria-hidden>
          <Image
            src="/botanical/garden-crest.png?v=3"
            alt=""
            width={160}
            height={160}
            unoptimized
            priority
            className="garden-crest-img garden-engraving"
          />
        </div>

        <p className="garden-kicker">{event.kicker}</p>
        <BotanicalDivider />

        <h1 className="font-serif mt-6 text-[clamp(2.8rem,9vw,5.4rem)] leading-[0.92] text-ink">
          <span className="block">{event.couple.one}</span>
          {partner ? (
            <>
              <span className="mt-1 block font-serif text-[clamp(1.15rem,2.8vw,1.7rem)] font-normal italic text-ink/50">
                и
              </span>
              <span className="block">{partner}</span>
            </>
          ) : null}
        </h1>

        {event.tagline ? (
          <p className="font-serif mx-auto mt-6 max-w-md text-xl italic text-ink/75 sm:text-2xl">
            {event.tagline}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xs tracking-[0.22em] text-ink/60 uppercase">
            {formatEventDate(event.event.iso)} · {formatEventTime(event.event.iso)}
          </p>
          {event.event.gathering ? <p className="text-sm text-ink/45">{event.event.gathering}</p> : null}
        </div>

        {showLead ? <p className="mt-6 max-w-md text-sm leading-6 text-ink/60">{event.inviteLead}</p> : null}

        <div className="mt-8">
          <a href="#rsvp" className="btn-gold inline-flex">
            Подтвердить участие
          </a>
        </div>
      </div>

      {still ? (
        <div className="garden-hero-arch">
          <div className="garden-hero-arch-inner">
            <Image
              src={still.src}
              alt={still.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 28rem"
              className="garden-wash object-cover"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function GardenWindows({ event, stills }: { event: EventContent; stills: GalleryItem[] }) {
  return (
    <section id="story" className="relative">
      <div className="garden-story-head mx-auto max-w-3xl px-6">
        <p className="garden-kicker">{event.galleryKicker ?? "Сад"}</p>
        <h2 className="font-serif mt-4 text-4xl text-ink sm:text-5xl">
          {event.galleryHeading ?? "Свет и зелень"}
        </h2>
        {event.inviteLead ? (
          <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-ink/65">{event.inviteLead}</p>
        ) : null}
      </div>
      <div className="garden-windows">
        {stills.map((item) => (
          <figure key={item.src} className="garden-window">
            <div className="garden-window-arch">
              <div className="garden-window-inner">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 26rem"
                  className="garden-wash object-cover"
                />
              </div>
            </div>
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function GardenFooter({ event }: { event: EventContent }) {
  return (
    <div className="garden-footer-wrap relative z-10">
      <div className="garden-footer-seal" aria-hidden>
        <Image
          src="/botanical/garden-crest.png?v=3"
          alt=""
          width={80}
          height={80}
          unoptimized
          className="garden-footer-crest-img garden-engraving"
        />
      </div>
      <Footer event={event} />
    </div>
  );
}

export function GardenDaylight({ event, preview }: { event: EventContent; preview?: boolean }) {
  const heroStill = event.gallery[0];
  const stills = event.gallery.slice(heroStill ? 1 : 0);

  return (
    <div className="garden-daylight">
      <div className="garden-paper-texture" aria-hidden />
      <BotanicalAtmosphere />
      <GardenHeader />
      <main className="garden-stationery-sheet relative z-10">
        <GardenHero event={event} still={heroStill} />
        {stills.length > 0 ? <GardenWindows event={event} stills={stills} /> : null}
        <Countdown event={event} />
        <Details event={event} />
        <VenueMap event={event} />
        <RsvpForm eventSlug={event.slug} preview={preview} />
        <GardenFooter event={event} />
      </main>
    </div>
  );
}
