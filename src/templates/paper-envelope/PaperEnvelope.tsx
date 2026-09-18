import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { GuestReplyLink } from "@/components/SiteHeader";
import { RsvpForm } from "@/components/RsvpForm";
import { VenueMap } from "@/components/VenueMap";
import type { EventContent } from "@/content/types";
import { formatEventDate, formatEventTime } from "@/lib/datetime";
import { eventNames, partnerName } from "@/lib/names";
import { EnvelopeGate } from "@/templates/paper-envelope/EnvelopeGate";
import "./paper.css";

function Letterhead({ event }: { event: EventContent }) {
  return (
    <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
      <p className="font-serif text-lg text-ink/80 sm:text-xl">
        {eventNames(event)}
      </p>
      <GuestReplyLink />
    </header>
  );
}

function PaperFlourish() {
  return (
    <div className="paper-flourish" aria-hidden>
      <span className="paper-flourish-line" />
      <svg className="paper-flourish-seal" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1.1" />
        <path
          d="M12 7.8c1.4 1.2 2 2.6 2 4.2s-.6 3-2 4.2C10.6 15 10 13.6 10 12s.6-3 2-4.2Z"
          stroke="currentColor"
          strokeWidth="1.1"
        />
      </svg>
      <span className="paper-flourish-line" />
    </div>
  );
}

function PaperInk({
  src,
  className,
  width,
  height,
}: {
  src: string;
  className: string;
  width: number;
  height: number;
}) {
  return (
    <div className={className} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="paper-ink-img" src={src} alt="" width={width} height={height} />
    </div>
  );
}

function PaperHero({ event }: { event: EventContent }) {
  const partner = partnerName(event);
  return (
    <section className="paper-hero relative px-6 pb-10 pt-6 text-center sm:pt-10">
      <PaperInk
        className="paper-ink paper-ink-top"
        src="/letterpress/pen-swash.svg?v=1"
        width={280}
        height={96}
      />
      <div className="paper-letter px-6 py-12 sm:px-10 sm:py-16">
        <PaperFlourish />
        <p className="text-[10px] tracking-[0.36em] text-burgundy/80 uppercase">{event.kicker}</p>
        <h1 className="font-serif mt-5 text-[clamp(2.4rem,8vw,4.4rem)] leading-[0.95] text-ink">
          <span className="block">{event.couple.one}</span>
          {partner ? (
            <>
              <span className="mt-1 block font-serif text-[clamp(1.2rem,3vw,1.8rem)] italic text-gold">
                и
              </span>
              <span className="block">{partner}</span>
            </>
          ) : null}
        </h1>
        <p className="paper-tagline font-serif mx-auto mt-6 max-w-sm px-2 text-lg italic leading-relaxed text-ink/70 sm:max-w-md sm:text-xl">
          {event.tagline}
        </p>
        <p className="mt-6 text-sm tracking-[0.12em] text-ink/60 uppercase">
          {formatEventDate(event.event.iso)} · {formatEventTime(event.event.iso)}
        </p>
        <p className="mt-2 text-sm text-ink/50">{event.event.gathering}</p>
        <a href="#rsvp" className="btn-gold mt-8 inline-flex">
          Подтвердить участие
        </a>
      </div>
    </section>
  );
}

export function PaperEnvelope({ event, preview }: { event: EventContent; preview?: boolean }) {
  return (
    <div className="paper-envelope">
      <div className="paper-texture" aria-hidden />
      <EnvelopeGate event={event}>
        <div className="paper-open">
          <div className="paper-card">
            <Letterhead event={event} />
            <main>
              <PaperHero event={event} />
              <Countdown event={event} />
              <Gallery event={event} />
              <PaperInk
                className="paper-ink paper-ink-mid"
                src="/letterpress/pen-swash.svg?v=1"
                width={280}
                height={96}
              />
              <Details event={event} />
              <VenueMap event={event} />
              <RsvpForm eventSlug={event.slug} preview={preview} />
              <Footer event={event} />
              <PaperInk
                className="paper-ink paper-ink-stamp"
                src="/letterpress/postmark.svg?v=1"
                width={200}
                height={200}
              />
            </main>
          </div>
        </div>
      </EnvelopeGate>
    </div>
  );
}
