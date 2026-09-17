import Link from "next/link";
import { redirect } from "next/navigation";
import { EventForm } from "@/components/EventForm";
import { ServiceFooter, ServiceNav } from "@/components/ServiceNav";
import { getCurrentOrganizer } from "@/lib/current-organizer";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Новое приглашение",
};

export default async function NewEventPage({ searchParams }: PageProps) {
  const organizer = await getCurrentOrganizer();
  if (!organizer) {
    redirect("/login");
  }
  const { error } = await searchParams;

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <ServiceNav loggedIn />
      <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">Кабинет</p>
      <h1 className="font-serif mt-3 text-4xl text-ink">Новое приглашение</h1>
      <p className="mt-3">
        <Link
          className="text-[10px] tracking-[0.28em] text-ink/40 uppercase transition-colors hover:text-burgundy/75"
          href="/cabinet"
        >
          Назад
        </Link>
      </p>
      <EventForm action="/api/cabinet/events" mode="create" error={error} />
      <ServiceFooter />
    </main>
  );
}
