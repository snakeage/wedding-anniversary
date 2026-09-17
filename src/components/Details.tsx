import type { EventContent } from "@/content/types";
import { formatEventDate, formatEventTime } from "@/lib/datetime";
import { GoldRule, Reveal } from "@/components/Reveal";

export function Details({ event }: { event: EventContent }) {
  const items = [
    {
      label: "Когда",
      value: `${formatEventDate(event.event.iso)} · ${formatEventTime(event.event.iso)}`,
      note: event.event.gathering,
    },
    {
      label: "Где",
      value: event.venue.name,
      note: event.venue.address,
    },
  ];
  if (event.event.dressCode) {
    items.push({
      label: "Дресс-код",
      value: event.event.dressCode,
      note: "",
    });
  }

  const gridClass =
    items.length === 3 ? "md:grid-cols-3" : items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1";

  return (
    <section id="details" className="relative px-6 py-24 sm:py-32">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">Вечер</p>
        <h2 className="font-serif mt-4 text-4xl text-ink sm:text-5xl">Дата, место, настроение</h2>
        <GoldRule className="mt-6" />
        <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-ink/65">
          {event.inviteBody}
        </p>
      </Reveal>

      <div className={`mx-auto mt-12 grid max-w-5xl gap-4 ${gridClass}`}>
        {items.map((item, index) => (
          <Reveal key={item.label} delay={index * 0.08}>
            <article className="panel h-full px-6 py-8 text-center">
              <p className="text-[10px] tracking-[0.32em] text-gold uppercase">{item.label}</p>
              <p className="font-serif mt-4 text-2xl leading-snug text-ink">{item.value}</p>
              {item.note ? <p className="mt-3 text-sm leading-6 text-ink/55">{item.note}</p> : null}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
