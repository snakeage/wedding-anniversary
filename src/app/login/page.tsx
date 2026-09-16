import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { events } from "@/events";
import { eventNames } from "@/lib/names";
import { isRsvpAdminSecret, RSVP_ADMIN_COOKIE } from "@/lib/rsvp-admin";

type PageProps = {
  searchParams: Promise<{ error?: string; slug?: string }>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Вход организатора",
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  if (isRsvpAdminSecret(cookieStore.get(RSVP_ADMIN_COOKIE)?.value)) {
    const next = new URLSearchParams();
    if (params.slug) {
      next.set("slug", params.slug);
    }
    redirect(next.size ? `/rsvp-list?${next}` : "/rsvp-list");
  }

  const selected = params.slug?.trim() ?? "";

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">Организатор</p>
      <h1 className="font-serif mt-3 text-4xl text-ink">Вход</h1>
      <p className="mt-3 text-ink/65">
        Пароль из настроек сайта. После входа его не будет в адресной строке.
      </p>

      {params.error ? (
        <p className="panel mt-6 px-5 py-4 text-sm text-burgundy">Неверный пароль. Попробуйте ещё раз.</p>
      ) : null}

      <form action="/api/rsvp-auth" method="post" className="panel mt-8 space-y-6 px-6 py-8">
        <label className="block text-left">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Событие</span>
          <select
            name="slug"
            defaultValue={
              events.some((event) => event.slug === selected) ? selected : events[0]?.slug
            }
            className="field mt-2"
          >
            {events.map((event) => (
              <option key={event.slug} value={event.slug}>
                {eventNames(event)} · {event.slug}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-left">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Пароль</span>
          <input
            required
            type="password"
            name="password"
            autoComplete="current-password"
            className="field mt-2"
          />
        </label>

        <button type="submit" className="btn-gold w-full">
          Войти
        </button>
      </form>
    </main>
  );
}
