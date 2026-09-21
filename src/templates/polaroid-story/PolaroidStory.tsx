"use client";

import Image from "next/image";
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

function PolaroidFrame({
  item,
  caption,
  className = "",
  priority = false,
  decorative = false,
}: {
  item: GalleryItem;
  caption: string;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  return (
    <figure className={`polaroid-frame ${className}`} aria-hidden={decorative || undefined}>
      <div className="polaroid-photo">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          priority={priority}
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

function PolaroidHero({
  event,
  front,
  back,
}: {
  event: EventContent;
  front?: GalleryItem;
  back?: GalleryItem;
}) {
  const partner = partnerName(event);
  const nameLine = partner ? `${event.couple.one} + ${partner}` : event.couple.one;
  const showLead = event.gallery.length <= 1 && Boolean(event.inviteLead.trim());

  return (
    <section id="hero" className="polaroid-hero">
      <div className="polaroid-stack">
        {back ? (
          <PolaroidFrame item={back} caption={back.caption} className="polaroid-back" decorative />
        ) : null}
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
      </div>

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
  return (
    <section id="story" className="polaroid-story-section">
      <div className="polaroid-story-head">
        <p className="polaroid-kicker">{event.galleryKicker ?? "Снимки"}</p>
        <h2 className="polaroid-heading">{event.galleryHeading ?? "Как мы"}</h2>
        {event.inviteLead ? <p className="polaroid-lead">{event.inviteLead}</p> : null}
      </div>
      <div className="polaroid-strip">
        {stills.map((item, index) => (
          <PolaroidFrame
            key={item.src}
            item={item}
            caption={item.caption}
            className={index % 2 === 0 ? "polaroid-tilt-left" : "polaroid-tilt-right"}
          />
        ))}
      </div>
    </section>
  );
}

export function PolaroidStory({ event, preview }: { event: EventContent; preview?: boolean }) {
  const front = event.gallery[0];
  const back = event.gallery[1];
  const stills = event.gallery.slice(back ? 2 : front ? 1 : 0);

  return (
    <div className="polaroid-story">
      <div className="polaroid-kraft" aria-hidden />
      <PolaroidHeader />
      <main className="relative z-10">
        <PolaroidHero event={event} front={front} back={back} />
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
