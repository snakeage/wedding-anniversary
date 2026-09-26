import Image from "next/image";
import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { Footer } from "@/components/Footer";
import { RsvpForm } from "@/components/RsvpForm";
import { VenueMap } from "@/components/VenueMap";
import type { EventContent, GalleryItem } from "@/content/types";
import { partnerName } from "@/lib/names";
import "./seaside.css";

const seasideDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Moscow",
});

function formatSeasideDate(iso: string) {
  return seasideDateFormatter.format(new Date(iso));
}

function formatCoordinates(lat: number, lng: number) {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latDir} · ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

function HorizonCompass() {
  return (
    <div className="seaside-compass" aria-hidden>
      <svg viewBox="0 0 48 48" className="seaside-compass-svg" fill="none">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
        <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="0.5" />
        <path d="M24 4V44M4 24H44" stroke="currentColor" strokeWidth="0.75" />
        <polygon points="24,10 27,24 24,22 21,24" fill="currentColor" opacity="0.8" />
        <polygon points="24,38 27,24 24,26 21,24" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
  );
}

function SeasideHero({ event, still }: { event: EventContent; still?: GalleryItem }) {
  const partner = partnerName(event);
  const formattedDate = formatSeasideDate(event.event.iso);
  const hasCoords =
    (event.venue.lat !== 0 || event.venue.lng !== 0) &&
    Number.isFinite(event.venue.lat) &&
    Number.isFinite(event.venue.lng);
  const coords = hasCoords ? formatCoordinates(event.venue.lat, event.venue.lng) : null;

  return (
    <section id="hero" className="seaside-hero">
      <div className="seaside-horizon-wash" aria-hidden />

      <div className="seaside-hero-lockup">
        <HorizonCompass />
        {event.kicker ? <p className="seaside-kicker">{event.kicker}</p> : null}
        <h1 className="seaside-names">
          <span className="seaside-name-part">{event.couple.one}</span>
          {partner ? (
            <>
              <span className="seaside-amp">&amp;</span>
              <span className="seaside-name-part">{partner}</span>
            </>
          ) : null}
        </h1>

        <div className="seaside-horizon-divider" aria-hidden>
          <span className="seaside-horizon-line" />
          <span className="seaside-horizon-marker">◆</span>
          <span className="seaside-horizon-line" />
        </div>

        {event.tagline ? <p className="seaside-tagline">{event.tagline}</p> : null}

        {coords ? (
          <p className="seaside-coords" aria-label={`Координаты: ${coords}`}>
            {coords}
          </p>
        ) : null}
      </div>

      {still ? (
        <figure className="seaside-hero-figure">
          <div className="seaside-hero-frame">
            <Image
              src={still.src}
              alt={still.alt}
              fill
              priority
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 960px"
              className="object-cover"
            />
            <div className="seaside-hero-overlay" aria-hidden />
          </div>
          <figcaption className="seaside-hero-caption">{still.caption}</figcaption>
        </figure>
      ) : null}

      <div className="seaside-hero-meta">
        <span className="seaside-meta-date">{formattedDate}</span>
        {event.venue.name ? <span className="seaside-meta-venue">{event.venue.name}</span> : null}
      </div>

      <a href="#rsvp" className="seaside-cta">
        Подтвердить участие
      </a>
    </section>
  );
}

function SeasideGallery({ event, stills }: { event: EventContent; stills: GalleryItem[] }) {
  const kicker = event.galleryKicker?.trim() || "Побережье";
  const heading = event.galleryHeading?.trim() || "Горизонт и прибой";
  const [leadStill, ...restStills] = stills;

  return (
    <section id="story" className="seaside-gallery">
      <div className="seaside-section-head">
        <p className="seaside-section-kicker">{kicker}</p>
        <h2 className="seaside-section-title">{heading}</h2>
        {event.inviteLead ? <p className="seaside-section-lead">{event.inviteLead}</p> : null}
      </div>

      {leadStill ? (
        <figure className="seaside-lead-figure">
          <div className="seaside-lead-frame">
            <Image
              src={leadStill.src}
              alt={leadStill.alt}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 76vw, 840px"
              className="object-cover"
            />
          </div>
          <figcaption className="seaside-frame-caption">{leadStill.caption}</figcaption>
        </figure>
      ) : null}

      {restStills.length > 0 ? (
        <div className="seaside-gallery-grid">
          {restStills.map((item) => (
            <figure key={item.src} className="seaside-frame">
              <div className="seaside-frame-box">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 42vw, 400px"
                  className="object-cover"
                />
              </div>
              <figcaption className="seaside-frame-caption">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function Seaside({ event, preview }: { event: EventContent; preview?: boolean }) {
  const heroStill = event.gallery[0];
  const stills = event.gallery.slice(heroStill ? 1 : 0);

  return (
    <div className="seaside">
      <main>
        <SeasideHero event={event} still={heroStill} />
        <Countdown event={event} />
        {stills.length > 0 ? <SeasideGallery event={event} stills={stills} /> : null}
        <Details event={event} />
        <VenueMap event={event} />
        <RsvpForm eventSlug={event.slug} preview={preview} />
        <Footer event={event} />
      </main>
    </div>
  );
}
