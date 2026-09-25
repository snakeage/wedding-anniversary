import Image from "next/image";
import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { Footer } from "@/components/Footer";
import { RsvpForm } from "@/components/RsvpForm";
import { VenueMap } from "@/components/VenueMap";
import type { EventContent, GalleryItem } from "@/content/types";
import { partnerName } from "@/lib/names";
import "./gold.css";

const decoDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Moscow",
});

function formatDecoDate(iso: string) {
  return decoDateFormatter.format(new Date(iso));
}

function Sunburst() {
  const rays = Array.from({ length: 32 }, (_, index) => {
    const angle = (index * 11.25 * Math.PI) / 180;
    const x2 = 160 + Math.cos(angle) * 150;
    const y2 = 160 + Math.sin(angle) * 150;
    return <line key={index} x1="160" y1="160" x2={x2} y2={y2} />;
  });

  return (
    <div className="gold-sunburst-wrap" aria-hidden>
      <svg className="gold-sunburst" viewBox="0 0 320 320">
        <g className="gold-sunburst-metal">
          {rays}
          <circle cx="160" cy="160" r="64" />
          <circle cx="160" cy="160" r="98" />
          <circle cx="160" cy="160" r="132" />
        </g>
      </svg>
      <div className="gold-sunburst-sheen" />
    </div>
  );
}

function Sparks() {
  return (
    <div className="gold-sparks" aria-hidden>
      {Array.from({ length: 10 }, (_, index) => (
        <span key={index} className={`gold-spark gold-spark-${index + 1}`} />
      ))}
    </div>
  );
}

function GoldHero({ event, still }: { event: EventContent; still?: GalleryItem }) {
  const partner = partnerName(event);
  const metaLine = `${formatDecoDate(event.event.iso)}${event.venue.name ? ` · ${event.venue.name}` : ""}`;

  return (
    <section id="hero" className="gold-hero">
      <div className="gold-sheen" aria-hidden />

      <div className="gold-lockup">
        <Sunburst />
        <Sparks />
        <p className="gold-kicker">{event.kicker}</p>
        <h1 className="gold-names">
          <span className="gold-foil">{event.couple.one}</span>
          {partner ? (
            <>
              <span className="gold-amp">и</span>
              <span className="gold-foil">{partner}</span>
            </>
          ) : null}
        </h1>
        <div className="gold-rule" aria-hidden>
          <span className="gold-rule-shine" />
        </div>
        {event.tagline ? <p className="gold-tagline">{event.tagline}</p> : null}
      </div>

      {still ? (
        <figure className="gold-hero-figure">
          <div className="gold-arch">
            <div className="gold-arch-inner">
              <Image
                src={still.src}
                alt={still.alt}
                fill
                priority
                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 480px"
                className="object-cover"
              />
            </div>
          </div>
        </figure>
      ) : null}

      <p className="gold-meta" title={metaLine}>
        {metaLine}
      </p>
      <a href="#rsvp" className="gold-cta">
        Подтвердить участие
      </a>
    </section>
  );
}

function GoldGallery({ event, stills }: { event: EventContent; stills: GalleryItem[] }) {
  const kicker = event.galleryKicker?.trim() || "Зал";
  const heading = event.galleryHeading?.trim() || "Симметрия вечера";

  return (
    <section id="story" className="gold-gallery">
      <p className="gold-section-kicker">{kicker}</p>
      <h2 className="gold-section-title">{heading}</h2>
      {event.inviteLead ? <p className="gold-section-lead">{event.inviteLead}</p> : null}
      <div className="gold-gallery-grid">
        {stills.map((item) => (
          <figure key={item.src} className="gold-frame">
            <div className="gold-frame-plate">
              <span className="gold-tick gold-tick-tl" aria-hidden />
              <span className="gold-tick gold-tick-tr" aria-hidden />
              <span className="gold-tick gold-tick-bl" aria-hidden />
              <span className="gold-tick gold-tick-br" aria-hidden />
              <div className="gold-frame-inner">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 46vw, 280px"
                  className="object-cover"
                />
              </div>
            </div>
            <figcaption className="gold-frame-caption">{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function GoldDeco({ event, preview }: { event: EventContent; preview?: boolean }) {
  const heroStill = event.gallery[0];
  const stills = event.gallery.slice(heroStill ? 1 : 0);

  return (
    <div className="gold-deco">
      <main>
        <GoldHero event={event} still={heroStill} />
        <Countdown event={event} />
        {stills.length > 0 ? <GoldGallery event={event} stills={stills} /> : null}
        <Details event={event} />
        <VenueMap event={event} />
        <RsvpForm eventSlug={event.slug} preview={preview} />
        <Footer event={event} />
      </main>
    </div>
  );
}
