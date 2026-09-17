import Link from "next/link";
import { redirect } from "next/navigation";
import { CabinetPayPanel } from "@/components/CabinetPayPanel";
import { getCurrentOrganizer } from "@/lib/current-organizer";
import { listEventsByOrganizer } from "@/lib/event-store";
import { eventNames } from "@/lib/names";
import { getDatabaseUrl } from "@/lib/db";
import { getSbpDetails } from "@/lib/sbp";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Кабинет",
};

export default async function CabinetPage({ searchParams }: PageProps) {
  const organizer = await getCurrentOrganizer();
  if (!organizer) {
    redirect("/login");
  }

  if (!getDatabaseUrl()) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl text-ink">Кабинет</h1>
        <p className="mt-4 text-ink/70">DATABASE_URL не задан.</p>
      </main>
    );
  }

  const { error } = await searchParams;
  const events = await listEventsByOrganizer(organizer.id);
  const sbp = getSbpDetails();
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim() ?? "";

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">Организатор</p>
      <h1 className="font-serif mt-3 text-4xl text-ink">Кабинет</h1>
      <p className="mt-3 text-ink/65">
        {organizer.firstName}
        {organizer.username ? ` · @${organizer.username}` : ""}
      </p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/50">
        <Link className="underline decoration-gold/60 underline-offset-4" href="/cabinet/new">
          Создать приглашение
        </Link>
        <form action="/api/organizer-logout" method="post">
          <button type="submit" className="underline decoration-gold/60 underline-offset-4">
            Выйти
          </button>
        </form>
      </div>

      {error === "receipt" ? (
        <p className="panel mt-6 px-5 py-4 text-sm text-burgundy">
          Не получилось отметить чек. Обновите страницу и попробуйте ещё раз.
        </p>
      ) : null}

      {events.length === 0 ? (
        <p className="panel mt-10 px-6 py-8 text-ink/65">Пока нет событий. Создайте первое приглашение.</p>
      ) : (
        <ul className="mt-10 space-y-3">
          {events.map((item) => (
            <li key={item.id} className="panel px-5 py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-serif text-xl text-ink">{eventNames(item.content)}</p>
                <span className="text-[10px] tracking-[0.22em] text-ink/45 uppercase">
                  {item.status === "active"
                    ? "Опубликовано"
                    : item.status === "pending_approval"
                      ? "На проверке"
                      : "Черновик"}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink/70">/{item.slug}</p>
              <p className="mt-3 flex flex-wrap gap-4 text-sm text-ink/50">
                <Link className="underline decoration-gold/60 underline-offset-4" href={`/${item.slug}`}>
                  {item.status === "active" ? "Открыть как гость" : "Предпросмотр (черновик)"}
                </Link>
                {item.status === "active" ? (
                  <Link
                    className="underline decoration-gold/60 underline-offset-4"
                    href={`/rsvp-list?slug=${encodeURIComponent(item.slug)}`}
                  >
                    Ответы гостей
                  </Link>
                ) : (
                  <span>Сбор ответов закрыт до публикации</span>
                )}
              </p>
              <CabinetPayPanel
                slug={item.slug}
                status={item.status}
                sbp={sbp}
                botUsername={botUsername}
              />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-16 text-sm text-ink/45">
        <Link className="underline decoration-gold/60 underline-offset-4" href="/terms">
          Условия сервиса
        </Link>
      </p>
    </main>
  );
}
