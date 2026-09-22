"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { Footer } from "@/components/Footer";
import { RsvpForm } from "@/components/RsvpForm";
import { GuestReplyLink } from "@/components/SiteHeader";
import { VenueMap } from "@/components/VenueMap";
import type { EventContent, GalleryItem } from "@/content/types";
import { formatEventDate, formatEventTime } from "@/lib/datetime";
import { partnerName } from "@/lib/names";
import "./winter.css";

function BareBranch({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 180 320" fill="none" aria-hidden>
      <path
        d="M28 308C52 236 40 176 82 132C110 102 112 64 98 22"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M64 210C102 190 128 160 158 142"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M72 164C100 144 116 110 110 76"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
      />
      <path
        d="M90 116C116 104 140 108 164 90"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      <path
        d="M52 248C80 232 100 214 124 206"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WinterAtmosphere() {
  return (
    <>
      <div className="winter-plates" aria-hidden>
        <div className="winter-plate winter-plate-field">
          <Image
            src="/gallery/winter-frost/bg-field.jpg?v=2"
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="winter-plate winter-plate-glass">
          <Image
            src="/gallery/winter-frost/bg-glass.jpg?v=2"
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="winter-veil" aria-hidden />
      <div className="winter-grain" aria-hidden />
      <div className="winter-sheen" aria-hidden />
      <div className="winter-branches" aria-hidden>
        <BareBranch className="winter-branch winter-branch-tl" />
        <BareBranch className="winter-branch winter-branch-br" />
      </div>
    </>
  );
}

function WinterHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-end px-5 py-4 sm:px-8">
      <GuestReplyLink />
    </header>
  );
}

const THAW_FROM = [
  { x: "84%", y: "42%", sx: "92%", sy: "40%", fx: "62%", fy: "22%", fsx: "70%", fsy: "22%", gx: "96%", gy: "74%", gsx: "34%", gsy: "78%", turn: "-8deg" },
  { x: "50%", y: "48%", sx: "46%", sy: "88%", fx: "28%", fy: "32%", fsx: "78%", fsy: "24%", gx: "76%", gy: "72%", gsx: "28%", gsy: "70%", turn: "72deg" },
  { x: "46%", y: "90%", sx: "96%", sy: "36%", fx: "30%", fy: "58%", fsx: "30%", fsy: "80%", gx: "70%", gy: "70%", gsx: "72%", gsy: "26%", turn: "150deg" },
  { x: "70%", y: "74%", sx: "42%", sy: "86%", fx: "42%", fy: "46%", fsx: "84%", fsy: "22%", gx: "86%", gy: "34%", gsx: "26%", gsy: "64%", turn: "-46deg" },
  { x: "14%", y: "16%", sx: "98%", sy: "38%", fx: "36%", fy: "30%", fsx: "48%", fsy: "76%", gx: "24%", gy: "54%", gsx: "28%", gsy: "90%", turn: "118deg" },
  { x: "16%", y: "52%", sx: "40%", sy: "92%", fx: "40%", fy: "28%", fsx: "86%", fsy: "24%", gx: "30%", gy: "84%", gsx: "70%", gsy: "30%", turn: "28deg" },
] as const;

function WinterPane({
  item,
  priority = false,
  caption,
  thawIndex = 0,
  when = "scroll",
}: {
  item: GalleryItem;
  priority?: boolean;
  caption?: string;
  thawIndex?: number;
  when?: "now" | "scroll";
}) {
  const paneRef = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);
  const thaw = THAW_FROM[thawIndex % THAW_FROM.length];

  useEffect(() => {
    if (when === "now") {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setLit(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    const node = paneRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setLit(true);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [when]);

  return (
    <figure ref={paneRef} className={lit ? "winter-pane is-lit" : "winter-pane"}>
      <div className="winter-pane-glass">
        <div
          className="winter-pane-inner"
          style={
            {
              "--thaw-x": thaw.x,
              "--thaw-y": thaw.y,
              "--span-x": thaw.sx,
              "--span-y": thaw.sy,
              "--finger-x": thaw.fx,
              "--finger-y": thaw.fy,
              "--finger-span-x": thaw.fsx,
              "--finger-span-y": thaw.fsy,
              "--side-x": thaw.gx,
              "--side-y": thaw.gy,
              "--side-span-x": thaw.gsx,
              "--side-span-y": thaw.gsy,
              "--ice-turn": thaw.turn,
            } as React.CSSProperties
          }
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            unoptimized
            priority={priority}
            sizes="(max-width: 768px) 92vw, 36rem"
            className="object-cover"
          />
          <span className="winter-ice" aria-hidden>
            <span className="winter-ice-crystal" />
          </span>
        </div>
      </div>
      {caption ? <figcaption className="font-serif">{caption}</figcaption> : null}
    </figure>
  );
}

function WinterHero({ event, still }: { event: EventContent; still?: GalleryItem }) {
  const partner = partnerName(event);

  return (
    <section id="hero" className="winter-hero">
      {still ? <WinterPane item={still} priority when="now" thawIndex={0} /> : null}
      <div className="winter-hero-copy">
        <p className="winter-kicker">{event.kicker}</p>
        <h1 className="font-serif winter-names">
          <span className="block">{event.couple.one}</span>
          {partner ? (
            <>
              <span className="winter-and">и</span>
              <span className="block">{partner}</span>
            </>
          ) : null}
        </h1>
        <div className="winter-rule" aria-hidden />
        {event.tagline ? <p className="winter-tagline font-serif">{event.tagline}</p> : null}
        <p className="winter-when">
          {formatEventDate(event.event.iso)} · {formatEventTime(event.event.iso)}
        </p>
        {event.event.gathering ? <p className="winter-gathering">{event.event.gathering}</p> : null}
        {event.inviteLead ? <p className="winter-letter font-serif">{event.inviteLead}</p> : null}
      </div>
    </section>
  );
}

function WinterWindows({ event, stills }: { event: EventContent; stills: GalleryItem[] }) {
  const kicker = event.galleryKicker?.trim();
  const heading = event.galleryHeading?.trim();

  return (
    <section id="story" className="winter-story">
      {kicker || heading ? (
        <div className="winter-story-head">
          {kicker ? <p className="winter-kicker">{kicker}</p> : null}
          {heading ? <h2 className="font-serif winter-heading">{heading}</h2> : null}
        </div>
      ) : null}
      <div className="winter-windows">
        {stills.map((item, index) => (
          <WinterPane key={item.src} item={item} caption={item.caption} thawIndex={index + 1} />
        ))}
      </div>
    </section>
  );
}

export function WinterFrost({ event, preview }: { event: EventContent; preview?: boolean }) {
  const still = event.gallery[0];
  const rest = event.gallery.slice(still ? 1 : 0);

  return (
    <div className="winter-frost">
      <WinterAtmosphere />
      <WinterHeader />
      <main className="winter-sheet">
        <WinterHero event={event} still={still} />
        {rest.length > 0 ? <WinterWindows event={event} stills={rest} /> : null}
        <Countdown event={event} />
        <Details event={event} />
        <VenueMap event={event} />
        <RsvpForm eventSlug={event.slug} preview={preview} />
        <Footer event={event} />
      </main>
    </div>
  );
}
