import type { EventContent } from "@/content/types";
import { GoldRule, Reveal } from "@/components/Reveal";

export function VenueMap({ event }: { event: EventContent }) {
  const mapSrc = `https://yandex.ru/map-widget/v1/?ll=${event.venue.lng},${event.venue.lat}&z=16&l=map&pt=${event.venue.lng},${event.venue.lat},pm2rdm`;
  const mapsLink = `https://yandex.ru/maps/?rtext=~${event.venue.lat},${event.venue.lng}&rtt=auto`;

  return (
    <section id="map" className="relative px-6 py-16 sm:py-24">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">Как добраться</p>
        <h2 className="font-serif mt-4 text-4xl text-ink sm:text-5xl">{event.venue.name}</h2>
        <GoldRule className="mt-6" />
        <p className="mt-5 text-ink/65">{event.venue.address}</p>
        <p className="mt-2 text-sm text-ink/50">{event.venue.notes}</p>
        <a
          href={mapsLink}
          target="_blank"
          rel="noreferrer"
          className="btn-gold mt-8 inline-flex"
        >
          Открыть в навигаторе
        </a>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-10 max-w-5xl">
        <div className="panel overflow-hidden">
          <iframe
            title={`Карта: ${event.venue.name}`}
            src={mapSrc}
            className="h-[320px] w-full border-0 sm:h-[420px]"
            loading="lazy"
          />
        </div>
      </Reveal>
    </section>
  );
}
