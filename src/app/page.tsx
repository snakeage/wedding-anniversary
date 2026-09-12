import Link from "next/link";
import { liveSkins, soonSkins } from "@/catalog";

export default function Home() {
  return (
    <main className="relative mx-auto min-h-dvh max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="text-[10px] tracking-[0.32em] text-burgundy uppercase">
        Каталог
      </p>
      <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-6xl">
        Шаблоны приглашений
      </h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-ink/70 sm:text-lg">
        Один продукт, разные образы. Выберите скин, мы заполним имена, дату и
        фото. Гости открывают свою ссылку — не этот каталог.
      </p>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        {liveSkins.map((skin) => (
          <article key={skin.id} className="panel flex flex-col p-7 sm:p-8">
            <p className="text-[10px] tracking-[0.28em] text-burgundy uppercase">
              {skin.audience}
            </p>
            <h2 className="mt-3 font-serif text-3xl text-ink">{skin.name}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-ink/65">
              {skin.difference}
            </p>
            <Link href={`/${skin.demoSlug}`} className="btn-gold mt-8 self-start">
              Смотреть демо
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-20">
        <h2 className="font-serif text-2xl text-ink">Скоро</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-ink/60">
          Идеи из каталога, ещё не в вёрстке. Следующий скин — один ряд, не вся
          таблица.
        </p>
        <ul className="mt-8 divide-y divide-gold/25 border-y border-gold/25">
          {soonSkins.map((skin) => (
            <li
              key={skin.id}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <span className="font-serif text-lg text-ink">{skin.name}</span>
              <span className="text-sm text-ink/55 sm:text-right">
                {skin.audience}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
