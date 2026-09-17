import { notFound } from "next/navigation";
import { getSlugRedirect } from "@/events";
import { invitationOgImage, invitationOgSize } from "@/lib/invitation-og";
import { resolveEventWithAccess } from "@/lib/resolve-event";

export const size = invitationOgSize;
export const contentType = "image/png";
export const alt = "Приглашение";

export default async function EventOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const access = await resolveEventWithAccess(getSlugRedirect(slug) ?? slug);
  if (access.mode !== "active") {
    notFound();
  }
  return invitationOgImage(access.event);
}
