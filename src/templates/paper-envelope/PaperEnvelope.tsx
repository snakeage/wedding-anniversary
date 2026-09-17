import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
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
      <a href="#rsvp" className="text-[10px] tracking-[0.28em] text-burgundy uppercase">
        RSVP
      </a>
    </header>
  );
}

function PaperHero({ event }: { event: EventContent }) {
  const partner = partnerName(event);
  return (
    <section className="relative px-6 pb-10 pt-8 text-center sm:pt-12">
      <div className="paper-letter px-6 py-12 sm:px-10 sm:py-16">
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
        <p className="font-serif mx-auto mt-6 max-w-md text-xl italic text-ink/70">{event.tagline}</p>
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
        <div className="paper-card">
          <Letterhead event={event} />
          <main>
            <PaperHero event={event} />
            <Countdown event={event} />
            <Gallery event={event} />
            <Details event={event} />
            <VenueMap event={event} />
            <RsvpForm eventSlug={event.slug} preview={preview} />
            <Footer event={event} />
          </main>
        </div>
      </EnvelopeGate>
    </div>
  );
}
