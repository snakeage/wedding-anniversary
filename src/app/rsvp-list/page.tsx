import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { formatEventDate, formatEventTime } from "@/lib/datetime";
import { getDatabaseUrl } from "@/lib/db";
import { getCurrentOrganizer } from "@/lib/current-organizer";
import { eventNames } from "@/lib/names";
import { isRsvpAdminSecret, RSVP_ADMIN_COOKIE } from "@/lib/rsvp-admin";
import { eventForRsvpAccess } from "@/lib/rsvp-access";
import { listRsvps } from "@/lib/rsvp-store";

type PageProps = {
  searchParams: Promise<{ secret?: string; slug?: string }>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Ответы гостей",
};

export default async function RsvpListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const isAdmin =
    isRsvpAdminSecret(params.secret) || isRsvpAdminSecret(cookieStore.get(RSVP_ADMIN_COOKIE)?.value);
  const organizer = await getCurrentOrganizer();

  if (!isAdmin && !organizer) {
    notFound();
  }

  if (!isAdmin && !params.slug) {
    redirect("/cabinet");
  }

  const event = await eventForRsvpAccess({
    slug: params.slug,
    isAdmin,
    organizer,
  });
  if (!event) {
    notFound();
  }

  if (!getDatabaseUrl()) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl text-ink">Ответы гостей</h1>
        <p className="mt-4 text-ink/70">DATABASE_URL не задан — список недоступен.</p>
      </main>
    );
  }

  const rows = await listRsvps(event.slug);
  const csvQuery = new URLSearchParams({ slug: event.slug });
  if (params.secret) {
    csvQuery.set("secret", params.secret);
  }
  const csvHref = `/api/rsvp-csv?${csvQuery.toString()}`;
  const rememberHref = params.secret
    ? `/api/rsvp-auth?secret=${encodeURIComponent(params.secret)}&slug=${encodeURIComponent(event.slug)}`
    : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">Организатор</p>
      <h1 className="font-serif mt-3 text-4xl text-ink">Ответы гостей</h1>
      <p className="mt-3 text-ink/65">
        {eventNames(event)} · {event.slug}
      </p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/50">
        {organizer ? (
          <Link className="underline decoration-gold/60 underline-offset-4" href="/cabinet">
            Кабинет
          </Link>
        ) : null}
        <a className="underline decoration-gold/60 underline-offset-4" href={csvHref}>
          Скачать CSV
        </a>
        {rememberHref ? (
          <a className="underline decoration-gold/60 underline-offset-4" href={rememberHref}>
            Запомнить доступ (убрать секрет из ссылки)
          </a>
        ) : null}
        <form action={organizer ? "/api/organizer-logout" : "/api/rsvp-logout"} method="post">
          <button type="submit" className="underline decoration-gold/60 underline-offset-4">
            Выйти
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <p className="panel mt-10 px-6 py-8 text-ink/65">Пока нет ответов.</p>
      ) : (
        <ul className="mt-10 space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="panel px-5 py-5">
              <p className="font-serif text-xl text-ink">{row.name}</p>
              <p className="mt-1 text-sm text-ink/70">
                {row.attending === "yes" ? "Придёт" : "Не сможет"} · гостей: {row.guests}
              </p>
              {row.comment ? <p className="mt-2 text-sm text-ink/60">{row.comment}</p> : null}
              <p className="mt-3 text-[10px] tracking-[0.2em] text-ink/40 uppercase">
                {formatEventDate(row.createdAt)} · {formatEventTime(row.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
