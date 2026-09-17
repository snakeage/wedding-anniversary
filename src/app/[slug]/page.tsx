import type { Metadata } from "next";
import { createElement } from "react";
import { notFound, redirect } from "next/navigation";
import { DraftPreviewChrome } from "@/components/DraftPreviewChrome";
import { getEventSlugs, getRedirectSlugs, getSlugRedirect } from "@/events";
import { getCurrentOrganizer } from "@/lib/current-organizer";
import { eventNames } from "@/lib/names";
import { resolveEventWithAccess } from "@/lib/resolve-event";
import { resolveTemplate } from "@/templates/registry";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return [...getEventSlugs(), ...getRedirectSlugs()].map((slug) => ({ slug }));
}

async function loadAccess(slug: string) {
  return resolveEventWithAccess(slug, {
    loadOrganizerId: async () => (await getCurrentOrganizer())?.id,
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dest = getSlugRedirect(slug);
  if (dest) {
    redirect(`/${dest}`);
  }
  const access = await loadAccess(slug);
  if (access.mode === "not_found") {
    return { title: "Приглашение", robots: { index: false, follow: false } };
  }

  const title = `${eventNames(access.event)} — ${access.event.kicker}`;
  return {
    title,
    description: access.event.inviteLead,
    robots: access.mode === "preview" ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description: access.event.inviteLead,
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: access.event.inviteLead,
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const dest = getSlugRedirect(slug);
  if (dest) {
    redirect(`/${dest}`);
  }
  const access = await loadAccess(slug);
  if (access.mode === "not_found") {
    notFound();
  }

  const preview = access.mode === "preview";
  return (
    <>
      {preview ? <DraftPreviewChrome /> : null}
      {createElement(resolveTemplate(access.event.templateId), {
        event: access.event,
        preview,
      })}
    </>
  );
}
