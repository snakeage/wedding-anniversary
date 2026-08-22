"use client";

import { useState, type FormEvent } from "react";
import { GoldRule, Reveal } from "@/components/Reveal";
import type { RsvpAttending, RsvpPayload } from "@/lib/rsvp";

type Status = "idle" | "submitting" | "success" | "error";

export function RsvpForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [attending, setAttending] = useState<RsvpAttending>("yes");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload: RsvpPayload = {
      name: String(form.get("name") ?? ""),
      guests: Number(form.get("guests") ?? 1),
      attending,
      comment: String(form.get("comment") ?? ""),
    };

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Не получилось отправить ответ. Попробуйте ещё раз.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Сеть недоступна. Проверьте соединение и отправьте снова.");
    }
  }

  return (
    <section id="rsvp" className="relative px-6 py-24 sm:py-32">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">RSVP</p>
        <h2 className="font-serif mt-4 text-4xl text-ink sm:text-5xl">Будете с нами?</h2>
        <GoldRule className="mt-6" />
        <p className="mt-5 text-ink/65">
          Нам важно знать, на сколько приборов накрывать стол. Ответ придёт нам на почту.
        </p>
      </Reveal>

      <Reveal delay={0.08} className="mx-auto mt-10 max-w-xl">
        {status === "success" ? (
          <div className="panel px-8 py-12 text-center">
            <p className="font-serif text-3xl text-ink">Спасибо</p>
            <p className="mt-4 text-ink/65">Мы получили ваш ответ и очень ждём этот вечер.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="panel space-y-6 px-6 py-8 sm:px-8">
            <label className="block text-left">
              <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Имя</span>
              <input
                required
                name="name"
                minLength={2}
                maxLength={80}
                placeholder="Как к вам обращаться"
                className="field mt-2"
              />
            </label>

            <fieldset>
              <legend className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">
                Сможете прийти?
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {(
                  [
                    ["yes", "Приду"],
                    ["no", "Не смогу"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAttending(value)}
                    className={`choice ${attending === value ? "choice-active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="block text-left">
              <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">
                Количество гостей
              </span>
              <input
                required
                name="guests"
                type="number"
                min={1}
                max={12}
                defaultValue={1}
                className="field mt-2"
              />
            </label>

            <label className="block text-left">
              <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">
                Комментарий
              </span>
              <textarea
                name="comment"
                rows={4}
                maxLength={500}
                placeholder="Аллергии, пожелания, с кем удобнее сидеть"
                className="field mt-2 resize-none"
              />
            </label>

            {status === "error" ? (
              <p className="text-sm text-burgundy">{message}</p>
            ) : null}

            <button type="submit" className="btn-gold w-full" disabled={status === "submitting"}>
              {status === "submitting" ? "Отправляем…" : "Отправить ответ"}
            </button>
          </form>
        )}
      </Reveal>
    </section>
  );
}
