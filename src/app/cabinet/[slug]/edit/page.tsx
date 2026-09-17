import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EventForm } from "@/components/EventForm";
import { getCurrentOrganizer } from "@/lib/current-organizer";
import { getDatabaseUrl } from "@/lib/db";
import { defaultsFromEvent } from "@/lib/event-form";
import { getDbEventBySlug } from "@/lib/event-store";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Редактировать приглашение",
};

export default async function EditEventPage({ params, searchParams }: PageProps) {
  const organizer = await getCurrentOrganizer();
  if (!organizer) {
    redirect("/login");
  }
  if (!getDatabaseUrl()) {
    notFound();
  }

  const { slug } = await params;
  const { error } = await searchParams;
  const event = await getDbEventBySlug(slug);
  if (!event || event.organizerId !== organizer.id) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">Кабинет</p>
      <h1 className="font-serif mt-3 text-4xl text-ink">Редактировать</h1>
      <p className="mt-3 text-sm text-ink/50">
        <Link className="underline decoration-gold/60 underline-offset-4" href="/cabinet">
          Назад
        </Link>
      </p>
      <EventForm
        action={`/api/cabinet/events/${encodeURIComponent(event.slug)}`}
        mode="edit"
        error={error}
        values={defaultsFromEvent(event.content)}
      />
    </main>
  );
}
