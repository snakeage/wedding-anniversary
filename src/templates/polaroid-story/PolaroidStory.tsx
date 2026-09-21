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
  const leakOpacity = useTransform(scrollY, [0, 1400], [0.85, 0.4]);
  const yDump = useTransform(scrollY, [0, 2200], [0, 90]);
  const yLower = useTransform(scrollY, [900, 3000], [0, 110]);
  const yPack = useTransform(scrollY, [400, 2200], [0, 56]);

  return (
    <div className="polaroid-atmosphere" aria-hidden>
      <div className="polaroid-linen" />
      <div className="polaroid-kraft" />
      <motion.div className="polaroid-leak" style={{ y: yLeak, opacity: leakOpacity }} />
      <motion.div className="polaroid-deco polaroid-film-pack" style={{ y: yPack }}>
        <InstantFilmPack />
      </motion.div>
      <motion.div className="polaroid-deco polaroid-empty polaroid-empty-tr-back" style={{ y: yDump }}>
        <EmptyPolaroid developing mark="12.06" />
      </motion.div>
      <motion.div className="polaroid-deco polaroid-empty polaroid-empty-tr" style={{ y: yDump }}>
        <EmptyPolaroid mark="кадр 01" />
      </motion.div>
      <motion.div className="polaroid-deco polaroid-empty polaroid-empty-ml" style={{ y: yLower }}>
        <EmptyPolaroid developing mark="проявляется…" />
      </motion.div>
      <motion.div className="polaroid-deco polaroid-empty polaroid-empty-bl-back" style={{ y: yLower }}>
        <EmptyPolaroid mark="лето · 27" />
      </motion.div>
      <motion.div className="polaroid-deco polaroid-empty polaroid-empty-bl" style={{ y: yLower }}>
        <EmptyPolaroid developing mark="ещё один" />
      </motion.div>
    </div>
  );
}

function InstantFilmPack() {
  const bands = ["#c56a5a", "#d4a06a", "#d4c47a", "#7aa06e", "#6a88b4"];
  return (
    <svg viewBox="0 0 188 122" width="188" height="122" aria-hidden>
      <rect x="3" y="3" width="182" height="116" rx="5" fill="#5a4a3c" />
      <rect x="13" y="13" width="162" height="96" rx="2" fill="#efe4d0" />
      {bands.map((color, index) => (
        <rect key={color} x={24 + index * 22} y="42" width="22" height="8" fill={color} />
      ))}
      <text
        x="24"
        y="86"
        fill="#756b5e"
        fontSize="13"
        fontFamily="var(--font-hand), Caveat, cursive"
      >
        color · 8
      </text>
    </svg>
  );
}

function EmptyPolaroid({
  developing = false,
  mark,
}: {
  developing?: boolean;
  mark: string;
}) {
  return (
    <svg viewBox="0 0 120 152" width="120" height="152" aria-hidden>
      <rect x="2" y="2" width="116" height="148" rx="3" fill="#f7f1e4" />
      <rect x="10" y="10" width="100" height="100" fill={developing ? "#b7bdb2" : "#d4c2a2"} />
      {developing ? (
        <>
          <path d="M10 77C31 50 46 96 68 63C82 42 96 49 110 35V110H10Z" fill="#766d5d" opacity="0.46" />
          <circle cx="83" cy="34" r="23" fill="#f5e6ba" opacity="0.48" />
          <rect x="10" y="10" width="100" height="100" fill="#738f9d" opacity="0.22" />
        </>
      ) : null}
      <text
        x="60"
        y="134"
        fill="#554a40"
        fontSize="11"
        fontFamily="var(--font-hand), Caveat, cursive"
        textAnchor="middle"
      >
        {mark}
      </text>
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
