import type { Metadata } from "next";
import { createElement } from "react";
import { notFound } from "next/navigation";
import { getEventBySlug, getEventSlugs } from "@/events";
import { resolveTemplate } from "@/templates/registry";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getEventSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) {
    return { title: "Приглашение" };
  }

  const title = `${event.couple.one} & ${event.couple.two} — ${event.kicker}`;
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
  const event = getEventBySlug(slug);
  if (!event) {
    notFound();
  }

  return createElement(resolveTemplate(event.templateId), { event });
}
