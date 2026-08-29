import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { demoEvent, getEventBySlug } from "@/events";
import { formatEventDate, formatEventTime } from "@/lib/datetime";
import { getDatabaseUrl } from "@/lib/db";
import { isRsvpAdminSecret, RSVP_ADMIN_COOKIE } from "@/lib/rsvp-admin";
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
  const allowed =
    isRsvpAdminSecret(params.secret) || isRsvpAdminSecret(cookieStore.get(RSVP_ADMIN_COOKIE)?.value);

  if (!allowed) {
    notFound();
  }

  const event = params.slug ? getEventBySlug(params.slug) : demoEvent;
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
  const rememberHref = params.secret
    ? `/api/rsvp-auth?secret=${encodeURIComponent(params.secret)}&slug=${encodeURIComponent(event.slug)}`
    : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">Организатор</p>
      <h1 className="font-serif mt-3 text-4xl text-ink">Ответы гостей</h1>
      <p className="mt-3 text-ink/65">
        {event.couple.one} & {event.couple.two} · {event.slug}
      </p>
      {rememberHref ? (
        <p className="mt-4 text-sm text-ink/50">
          <a className="underline decoration-gold/60 underline-offset-4" href={rememberHref}>
            Запомнить доступ (убрать секрет из ссылки)
          </a>
        </p>
      ) : null}

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
