"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { Footer } from "@/components/Footer";
import { RsvpForm } from "@/components/RsvpForm";
import { GuestReplyLink } from "@/components/SiteHeader";
import { VenueMap } from "@/components/VenueMap";
import type { EventContent, GalleryItem } from "@/content/types";
import { formatEventDate, formatEventTime } from "@/lib/datetime";
import { partnerName } from "@/lib/names";
import "./polaroid.css";

function PolaroidAtmosphere() {
  const { scrollY } = useScroll();
  const yLeak = useTransform(scrollY, [0, 1800], [0, 140]);
  const leakOpacity = useTransform(scrollY, [0, 1400], [0.9, 0.42]);
  const yTape = useTransform(scrollY, [0, 2000], [0, -100]);
  const yFrame = useTransform(scrollY, [0, 2200], [0, 120]);
  const ySprocket = useTransform(scrollY, [200, 2400], [0, -130]);
  const yLower = useTransform(scrollY, [900, 3000], [0, 110]);

  return (
    <div className="polaroid-atmosphere" aria-hidden>
      <div className="polaroid-kraft" />
      <motion.div className="polaroid-leak" style={{ y: yLeak, opacity: leakOpacity }} />
      <motion.div className="polaroid-deco polaroid-tape-tl" style={{ y: yTape }}>
        <TapeStrip />
      </motion.div>
      <motion.div className="polaroid-deco polaroid-empty-tr" style={{ y: yFrame }}>
        <EmptyPolaroid />
      </motion.div>
      <motion.div className="polaroid-deco polaroid-sprocket-l" style={{ y: ySprocket }}>
        <FilmSprocket />
      </motion.div>
      <motion.div className="polaroid-deco polaroid-empty-bl" style={{ y: yLower }}>
        <EmptyPolaroid />
      </motion.div>
      <motion.div className="polaroid-deco polaroid-tape-br" style={{ y: yTape }}>
        <TapeStrip />
      </motion.div>
    </div>
  );
}

function TapeStrip() {
  return (
    <svg viewBox="0 0 96 22" width="96" height="22" aria-hidden>
      <rect width="96" height="22" fill="rgba(236, 205, 130, 0.58)" />
      <rect x="0" y="0" width="96" height="3" fill="rgba(255, 255, 255, 0.18)" />
    </svg>
  );
}

function EmptyPolaroid() {
  return (
    <svg viewBox="0 0 120 148" width="120" height="148" aria-hidden>
      <rect x="3" y="3" width="114" height="142" rx="3" fill="#f6efe0" />
      <rect x="12" y="12" width="96" height="96" fill="#d7c4a4" />
      <rect x="12" y="12" width="96" height="96" fill="none" stroke="rgba(58, 47, 40, 0.12)" />
    </svg>
  );
}

function FilmSprocket() {
  return (
    <svg viewBox="0 0 28 220" width="28" height="220" fill="none" aria-hidden>
      {Array.from({ length: 9 }, (_, index) => (
        <rect
          key={index}
          x="6"
          y={8 + index * 24}
          width="16"
          height="10"
          rx="1.5"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

function PolaroidFrame({
  item,
  caption,
  className = "",
  priority = false,
}: {
  item: GalleryItem;
  caption: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={`polaroid-frame ${className}`}>
      <div className="polaroid-photo">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          priority={priority}
          unoptimized
          sizes="(max-width: 768px) 80vw, 20rem"
          className="object-cover"
        />
      </div>
      <figcaption className="polaroid-caption">{caption}</figcaption>
    </figure>
  );
}

function PolaroidHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-end px-5 py-4 sm:px-8">
      <GuestReplyLink />
    </header>
  );
}

function PolaroidHero({ event, front }: { event: EventContent; front?: GalleryItem }) {
  const partner = partnerName(event);
  const nameLine = partner ? `${event.couple.one} + ${partner}` : event.couple.one;
  const showLead = event.gallery.length <= 1 && Boolean(event.inviteLead.trim());
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 700], [0, 36]);
  const rotateHero = useTransform(scrollY, [0, 700], [-3.2, -7]);

  return (
    <section id="hero" className="polaroid-hero">
      <motion.div
        className="polaroid-stack"
        style={{ y: yHero, rotate: rotateHero }}
        whileHover={{ rotate: -1.2 }}
      >
        {front ? (
          <PolaroidFrame
            item={front}
            caption={`${event.kicker} · ${nameLine}`}
            className="polaroid-front"
            priority
          />
        ) : (
          <figure className="polaroid-frame polaroid-front polaroid-blank">
            <div className="polaroid-blank-body">
              <p className="polaroid-kicker">{event.kicker}</p>
              <p className="polaroid-names">{event.couple.one}</p>
              {partner ? <p className="polaroid-names polaroid-and">+ {partner}</p> : null}
            </div>
            <figcaption className="polaroid-caption">{nameLine}</figcaption>
          </figure>
        )}
      </motion.div>

      <div className="polaroid-hero-copy">
        <p className="polaroid-kicker">{event.kicker}</p>
        <h1 className="polaroid-names-block">
          <span className="block">{event.couple.one}</span>
          {partner ? (
            <>
              <span className="polaroid-and-line">+</span>
              <span className="block">{partner}</span>
            </>
          ) : null}
        </h1>
        {event.tagline ? <p className="polaroid-tagline">{event.tagline}</p> : null}
        <p className="polaroid-when">
          {formatEventDate(event.event.iso)} · {formatEventTime(event.event.iso)}
        </p>
        {event.event.gathering ? <p className="polaroid-gathering">{event.event.gathering}</p> : null}
        {showLead ? <p className="polaroid-lead">{event.inviteLead}</p> : null}
        <a href="#rsvp" className="btn-gold polaroid-cta">
          Подтвердить участие
        </a>
      </div>
    </section>
  );
}

function PolaroidStrip({ event, stills }: { event: EventContent; stills: GalleryItem[] }) {
  const { scrollY } = useScroll();
  const yStrip = useTransform(scrollY, [200, 1400], [12, -24]);

  return (
    <section id="story" className="polaroid-story-section">
      <div className="polaroid-story-head">
        <p className="polaroid-kicker">{event.galleryKicker ?? "Снимки"}</p>
        <h2 className="polaroid-heading">{event.galleryHeading ?? "Как мы"}</h2>
        {event.inviteLead ? <p className="polaroid-lead">{event.inviteLead}</p> : null}
      </div>
      <motion.div className="polaroid-strip" style={{ y: yStrip }}>
        {stills.map((item, index) => (
          <PolaroidFrame
            key={item.src}
            item={item}
            caption={item.caption}
            className={index % 2 === 0 ? "polaroid-tilt-left" : "polaroid-tilt-right"}
          />
        ))}
      </motion.div>
    </section>
  );
}

export function PolaroidStory({ event, preview }: { event: EventContent; preview?: boolean }) {
  const front = event.gallery[0];
  const stills = event.gallery.slice(front ? 1 : 0);

  return (
    <div className="polaroid-story">
      <PolaroidAtmosphere />
      <PolaroidHeader />
      <main className="relative z-10">
        <PolaroidHero event={event} front={front} />
        {stills.length > 0 ? <PolaroidStrip event={event} stills={stills} /> : null}
        <Countdown event={event} />
        <Details event={event} />
        <VenueMap event={event} />
        <RsvpForm eventSlug={event.slug} preview={preview} />
        <Footer event={event} />
      </main>
    </div>
  );
}
