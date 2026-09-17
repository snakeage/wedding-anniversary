"use client";

import { useEffect, useState } from "react";
import type { EventContent } from "@/content/types";
import { eventPhase, getCountdown } from "@/lib/datetime";
import { GoldRule, Reveal } from "@/components/Reveal";

const labels = {
  days: "дней",
  hours: "часов",
  minutes: "минут",
  seconds: "секунд",
} as const;

export function Countdown({ event }: { event: EventContent }) {
  const iso = event.event.iso;
  const [parts, setParts] = useState(() => getCountdown(iso));
  const [phase, setPhase] = useState(() => eventPhase(iso));

  useEffect(() => {
    const tick = () => {
      setParts(getCountdown(iso));
      setPhase(eventPhase(iso));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [iso]);

  return (
    <section id="countdown" className="relative px-6 py-24 sm:py-32">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">До встречи</p>
        <GoldRule className="mt-6" />
        {phase === "happening" ? (
          <p className="font-serif mt-8 text-3xl text-ink sm:text-4xl">Мы уже празднуем</p>
        ) : phase === "ended" ? (
          <p className="font-serif mt-8 text-3xl text-ink sm:text-4xl">Событие состоялось</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {(
              [
                ["days", parts.days],
                ["hours", parts.hours],
                ["minutes", parts.minutes],
                ["seconds", parts.seconds],
              ] as const
            ).map(([key, value]) => (
              <div
                key={key}
                className="panel px-4 py-6 sm:py-8"
              >
                <div className="font-serif text-4xl text-ink tabular-nums sm:text-5xl">
                  {String(value).padStart(2, "0")}
                </div>
                <div className="mt-2 text-[10px] tracking-[0.28em] text-ink/50 uppercase">
                  {labels[key]}
                </div>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
