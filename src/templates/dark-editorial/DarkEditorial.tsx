import Image from "next/image";
import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { Footer } from "@/components/Footer";
import { RsvpForm } from "@/components/RsvpForm";
import { SiteHeader } from "@/components/SiteHeader";
import { VenueMap } from "@/components/VenueMap";
import type { EventContent, GalleryItem } from "@/content/types";
import { GoldRule } from "@/components/Reveal";
import { formatEventDate, formatEventTime } from "@/lib/datetime";
import { partnerName } from "@/lib/names";
import "./dark.css";

function FilmHero({ event, still }: { event: EventContent; still?: GalleryItem }) {
  const partner = partnerName(event);
  const showLead = event.gallery.length <= 1 && Boolean(event.inviteLead.trim());

  return (
    <section id="hero" className="dark-hero">
      {still ? (
        <div className="dark-hero-still">
          <Image
            src={still.src}
            alt={still.alt}
            fill
            priority
            sizes="100vw"
            className="dark-ken object-cover"
          />
        </div>
      ) : null}
      <div className="dark-hero-veil" aria-hidden />
      <div className="dark-hero-copy">
        <p className="dark-credit">{event.kicker}</p>
        <div className="dark-hero-rule">
          <GoldRule className="dark-foil mt-5" />
        </div>
        <h1 className="font-serif mt-5 text-[clamp(3rem,12vw,7rem)] leading-[0.9] text-ink">
          <span className="block">{event.couple.one}</span>
          {partner ? (
            <>
              <span className="mt-2 block font-serif text-[clamp(1.1rem,3vw,1.7rem)] font-normal italic text-gold">
                и
              </span>
              <span className="block">{partner}</span>
            </>
          ) : null}
        </h1>
        {event.tagline ? (
          <p className="dark-tagline font-serif mt-6 max-w-sm text-lg italic leading-relaxed text-ink/80 sm:max-w-md sm:text-2xl">
            {event.tagline}
          </p>
        ) : null}
        <p className="mt-6 text-sm tracking-[0.16em] text-ink/55 uppercase">
          {formatEventDate(event.event.iso)} · {formatEventTime(event.event.iso)}
        </p>
        {event.event.gathering ? <p className="mt-2 text-sm text-ink/55">{event.event.gathering}</p> : null}
        {showLead ? <p className="mt-6 max-w-md text-sm leading-6 text-ink/60">{event.inviteLead}</p> : null}
        <a href="#rsvp" className="btn-gold mt-8 inline-flex">
          Подтвердить участие
        </a>
      </div>
    </section>
  );
}

function FilmStills({ event, stills }: { event: EventContent; stills: GalleryItem[] }) {
  return (
    <section id="story" className="relative">
      <div className="mx-auto max-w-3xl px-6 text-left sm:text-center">
        <p className="dark-credit">{event.galleryKicker ?? "Кадры"}</p>
        <h2 className="font-serif mt-4 text-4xl text-ink sm:text-5xl">
          {event.galleryHeading ?? "Стиллы вечера"}
        </h2>
        {event.inviteLead ? (
          <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-ink/60">{event.inviteLead}</p>
        ) : null}
      </div>
      <div className="dark-stills">
        {stills.map((item) => (
          <figure key={item.src} className="dark-still">
            <div className="dark-still-frame">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 56rem"
                className="dark-ken object-cover"
              />
            </div>
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function DarkEditorial({ event, preview }: { event: EventContent; preview?: boolean }) {
  const heroStill = event.gallery[0];
  const stills = event.gallery.slice(heroStill ? 1 : 0);

  return (
    <div className="dark-editorial">
      <SiteHeader event={event} />
      <main className="relative z-10">
        <FilmHero event={event} still={heroStill} />
        {stills.length > 0 ? <FilmStills event={event} stills={stills} /> : null}
        <div className="dark-foil-gap" aria-hidden>
          <GoldRule className="dark-foil" />
        </div>
        <Countdown event={event} />
        <Details event={event} />
        <VenueMap event={event} />
        <RsvpForm eventSlug={event.slug} preview={preview} />
        <Footer event={event} />
      </main>
    </div>
  );
}
