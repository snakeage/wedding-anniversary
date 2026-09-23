import Image from "next/image";
import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { Footer } from "@/components/Footer";
import { RsvpForm } from "@/components/RsvpForm";
import { VenueMap } from "@/components/VenueMap";
import type { EventContent, GalleryItem } from "@/content/types";
import { formatEventDate, formatEventTime } from "@/lib/datetime";
import { partnerName } from "@/lib/names";
import "./minimal.css";

function SwissHeader({ event }: { event: EventContent }) {
  const partner = partnerName(event);
  const names = partner ? `${event.couple.one} × ${partner}` : event.couple.one;

  return (
    <header className="swiss-topbar">
      <div className="swiss-topbar-inner">
        <div className="swiss-topbar-left">
          <span className="swiss-accent-square" aria-hidden />
          <span className="swiss-label">ИНВИТАЦИОННЫЙ БЮЛЛЕТЕНЬ № 01</span>
        </div>
        <div className="swiss-topbar-center font-bold tracking-tight">
          {names}
        </div>
        <nav className="swiss-topbar-right">
          <a href="#story" className="swiss-nav-link">Галерея</a>
          <a href="#countdown" className="swiss-nav-link">Таймер</a>
          <a href="#details" className="swiss-nav-link">Детали</a>
          <a href="#map" className="swiss-nav-link">Локация</a>
          <a href="#rsvp" className="swiss-nav-btn">RSVP</a>
        </nav>
      </div>
    </header>
  );
}

function SwissHero({ event, still }: { event: EventContent; still?: GalleryItem }) {
  const partner = partnerName(event);

  return (
    <section id="hero" className="swiss-hero">
      <div className="swiss-hero-grid">
        {/* Left Column: Asymmetric typographic poster */}
        <div className="swiss-hero-meta">
          <div className="swiss-meta-top">
            <div className="swiss-badge">
              <span className="swiss-badge-index">[ 01 ]</span>
              <span className="swiss-badge-title">{event.kicker}</span>
            </div>

            <h1 className="swiss-headline">
              <span className="block">{event.couple.one}</span>
              {partner ? (
                <span className="block swiss-headline-partner">
                  <span className="swiss-amp">&amp;</span> {partner}
                </span>
              ) : null}
            </h1>

            {event.tagline ? (
              <p className="swiss-tagline">{event.tagline}</p>
            ) : null}

            {event.inviteLead ? (
              <div className="swiss-lead-box">
                <p className="swiss-lead">{event.inviteLead}</p>
              </div>
            ) : null}
          </div>

          <div className="swiss-meta-bottom">
            <div className="swiss-date-row">
              <div className="swiss-date-col">
                <span className="swiss-micro-label">ДАТА И ВРЕМЯ</span>
                <span className="swiss-date-value">
                  {formatEventDate(event.event.iso)}
                </span>
                <span className="swiss-time-value">
                  {formatEventTime(event.event.iso)}
                </span>
              </div>
              <div className="swiss-venue-col">
                <span className="swiss-micro-label">ЛОКАЦИЯ</span>
                <span className="swiss-venue-value">{event.venue.name}</span>
                <span className="swiss-venue-addr">{event.venue.address}</span>
              </div>
            </div>

            <div className="swiss-hero-actions">
              <a href="#rsvp" className="swiss-btn-primary">
                Подтвердить присутствие
                <span className="swiss-arrow" aria-hidden>→</span>
              </a>
              <a href="#details" className="swiss-btn-ghost">
                Программа дня
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: High-contrast architectural photograph */}
        <div className="swiss-hero-visual">
          {still ? (
            <div className="swiss-photo-container">
              <div className="swiss-crop swiss-crop-tl" aria-hidden />
              <div className="swiss-crop swiss-crop-tr" aria-hidden />
              <div className="swiss-crop swiss-crop-bl" aria-hidden />
              <div className="swiss-crop swiss-crop-br" aria-hidden />

              <div className="swiss-photo-frame">
                <Image
                  src={still.src}
                  alt={still.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="swiss-photo-caption">
                <span className="swiss-photo-num">[ ФИКСАЦИЯ 01 ]</span>
                <span className="swiss-photo-desc">{still.caption}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function SwissGallery({
  event,
  stills,
}: {
  event: EventContent;
  stills: GalleryItem[];
}) {
  const kicker = event.galleryKicker?.trim() || "ФОТОХРОНИКА";
  const heading = event.galleryHeading?.trim() || "Кадры города и деталей";

  return (
    <section id="story" className="swiss-section">
      <div className="swiss-section-header">
        <div className="swiss-header-meta">
          <span className="swiss-badge-index">[ 02 ]</span>
          <span className="swiss-badge-title">{kicker}</span>
        </div>
        <h2 className="swiss-section-title">{heading}</h2>
      </div>

      <div className="swiss-gallery-grid">
        {stills.map((item, index) => (
          <article key={item.src} className="swiss-gallery-item">
            <div className="swiss-gallery-item-head">
              <span className="swiss-gallery-index">
                INDEX 0{index + 2} / 0{stills.length + 1}
              </span>
            </div>
            <div className="swiss-gallery-photo-box">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="swiss-gallery-item-footer">
              <span className="swiss-accent-dot" aria-hidden />
              <p className="swiss-gallery-caption">{item.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MinimalSwiss({
  event,
  preview,
}: {
  event: EventContent;
  preview?: boolean;
}) {
  const heroStill = event.gallery[0];
  const restStills = event.gallery.slice(heroStill ? 1 : 0);

  return (
    <div className="minimal-swiss">
      <SwissHeader event={event} />
      <main className="swiss-main">
        <SwissHero event={event} still={heroStill} />
        {restStills.length > 0 ? (
          <SwissGallery event={event} stills={restStills} />
        ) : null}
        <Countdown event={event} />
        <Details event={event} />
        <VenueMap event={event} />
        <RsvpForm eventSlug={event.slug} preview={preview} />
        <Footer event={event} />
      </main>
    </div>
  );
}
