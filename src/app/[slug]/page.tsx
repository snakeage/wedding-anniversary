import type { Metadata } from "next";
import { createElement } from "react";
import { notFound, redirect } from "next/navigation";
import { getEventBySlug, getEventSlugs, getRedirectSlugs, getSlugRedirect } from "@/events";
import { eventNames } from "@/lib/names";
import { resolveTemplate } from "@/templates/registry";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [...getEventSlugs(), ...getRedirectSlugs()].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dest = getSlugRedirect(slug);
  if (dest) {
    redirect(`/${dest}`);
  }
  const event = getEventBySlug(slug);
  if (!event) {
    return { title: "Приглашение" };
  }

  const title = `${eventNames(event)} — ${event.kicker}`;
  return {
    title,
    description: event.inviteLead,
    openGraph: {
      title,
      description: event.inviteLead,
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: event.inviteLead,
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const dest = getSlugRedirect(slug);
  if (dest) {
    redirect(`/${dest}`);
  }
  const event = getEventBySlug(slug);
  if (!event) {
    notFound();
  }

  return createElement(resolveTemplate(event.templateId), { event });
}
