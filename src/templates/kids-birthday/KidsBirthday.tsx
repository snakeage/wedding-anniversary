import Image from "next/image";
import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { Footer } from "@/components/Footer";
import { RsvpForm } from "@/components/RsvpForm";
import { VenueMap } from "@/components/VenueMap";
import type { EventContent, GalleryItem } from "@/content/types";
import { formatEventTime } from "@/lib/datetime";
import { partnerName } from "@/lib/names";
import "./kids-birthday.css";

function BuntingFlags() {
  return (
    <div className="kids-bunting" aria-hidden>
      <svg
        viewBox="0 0 800 60"
        fill="none"
        preserveAspectRatio="none"
        className="kids-bunting-svg"
      >
        <path
          d="M0,12 Q200,42 400,14 Q600,42 800,12"
          stroke="#fed7aa"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        {/* Flags */}
        <polygon points="50,18 75,48 100,23" fill="#ff4b72" />
        <polygon points="120,25 145,54 170,30" fill="#0284c7" />
        <polygon points="190,32 215,58 240,33" fill="#ffb800" />
        <polygon points="260,33 285,57 310,30" fill="#10b981" />
        <polygon points="330,28 355,54 380,24" fill="#8b5cf6" />
        <polygon points="420,18 445,48 470,24" fill="#ff4b72" />
        <polygon points="490,26 515,55 540,31" fill="#f97316" />
        <polygon points="560,32 585,58 610,33" fill="#0284c7" />
        <polygon points="630,31 655,56 680,27" fill="#10b981" />
        <polygon points="700,24 725,52 750,19" fill="#ffb800" />
      </svg>
    </div>
  );
}

function PartyCrownIcon() {
  return (
    <span className="kids-crown-icon" aria-hidden>
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
        <path
          d="M3 18L5 8L9.5 13L12 6L14.5 13L19 8L21 18H3Z"
          fill="#ffb800"
          stroke="#d97706"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="5" cy="7" r="1.5" fill="#ff4b72" />
        <circle cx="12" cy="5" r="1.5" fill="#0284c7" />
        <circle cx="19" cy="7" r="1.5" fill="#10b981" />
      </svg>
    </span>
  );
}

function ConfettiDecor() {
  return (
    <div className="kids-confetti-layer" aria-hidden>
      <span className="kids-confetti-dot dot-1" />
      <span className="kids-confetti-dot dot-2" />
      <span className="kids-confetti-dot dot-3" />
      <span className="kids-confetti-dot dot-4" />
      <span className="kids-confetti-dot dot-5" />
      <span className="kids-confetti-dot dot-6" />
      <span className="kids-confetti-star star-1">★</span>
      <span className="kids-confetti-star star-2">✦</span>
      <span className="kids-confetti-star star-3">★</span>
    </div>
  );
}

const kidsHeroDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Moscow",
});

function KidsHero({ event, still }: { event: EventContent; still?: GalleryItem }) {
  const partner = partnerName(event);
  const formattedDate = kidsHeroDateFormatter.format(new Date(event.event.iso));
  const formattedTime = formatEventTime(event.event.iso);

  return (
    <section id="hero" className="kids-hero">
      <BuntingFlags />
      <ConfettiDecor />

      <div className="kids-hero-lockup">
        {event.kicker ? (
          <div className="kids-kicker-wrap">
            <span className="kids-kicker">{event.kicker}</span>
          </div>
        ) : null}

        <div className="kids-crown-wrap">
          <PartyCrownIcon />
        </div>

        <h1 className="kids-names">
          <span className="kids-name-part">{event.couple.one}</span>
          {partner ? (
            <>
              <span className="kids-amp">&amp;</span>
              <span className="kids-name-part">{partner}</span>
            </>
          ) : null}
        </h1>

        {event.tagline ? <p className="kids-tagline">{event.tagline}</p> : null}

        <div className="kids-hero-meta">
          <span className="kids-meta-pill kids-meta-date">
            📅 {formattedDate} · {formattedTime}
          </span>
          {event.venue.name ? (
            <span className="kids-meta-pill kids-meta-venue">📍 {event.venue.name}</span>
          ) : null}
        </div>

        <a href="#rsvp" className="kids-cta">
          Я приду! 🎉
        </a>
      </div>

      {still ? (
        <figure className="kids-hero-figure">
          <div className="kids-hero-frame">
            <Image
              src={still.src}
              alt={still.alt}
              fill
              priority
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 84vw, 920px"
              className="object-cover"
            />
          </div>
          <figcaption className="kids-hero-caption">{still.caption}</figcaption>
        </figure>
      ) : null}
    </section>
  );
}

function KidsGallery({ event, stills }: { event: EventContent; stills: GalleryItem[] }) {
  const kicker = event.galleryKicker?.trim() || "Веселье";
  const heading = event.galleryHeading?.trim() || "Кадры праздника";
  const [leadStill, ...restStills] = stills;

  return (
    <section id="story" className="kids-gallery">
      <div className="kids-section-head">
        <p className="kids-section-kicker">{kicker}</p>
        <h2 className="kids-section-title">{heading}</h2>
        {event.inviteLead ? <p className="kids-section-lead">{event.inviteLead}</p> : null}
      </div>

      {leadStill ? (
        <figure className="kids-lead-figure">
          <div className="kids-lead-frame">
            <Image
              src={leadStill.src}
              alt={leadStill.alt}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 840px"
              className="object-cover"
            />
          </div>
          <figcaption className="kids-frame-caption">{leadStill.caption}</figcaption>
        </figure>
      ) : null}

      {restStills.length > 0 ? (
        <div className="kids-gallery-grid">
          {restStills.map((item) => (
            <figure key={item.src} className="kids-frame">
              <div className="kids-frame-box">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 42vw, 400px"
                  className="object-cover"
                />
              </div>
              <figcaption className="kids-frame-caption">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function KidsBirthday({ event, preview }: { event: EventContent; preview?: boolean }) {
  const heroStill = event.gallery[0];
  const stills = event.gallery.slice(heroStill ? 1 : 0);

  return (
    <div className="kids-birthday">
      <main>
        <KidsHero event={event} still={heroStill} />
        <Countdown event={event} />
        {stills.length > 0 ? <KidsGallery event={event} stills={stills} /> : null}
        <Details event={event} />
        <VenueMap event={event} />
        <RsvpForm eventSlug={event.slug} preview={preview} />
        <Footer event={event} />
      </main>
    </div>
  );
}
