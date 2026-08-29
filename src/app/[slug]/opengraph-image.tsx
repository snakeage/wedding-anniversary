import { notFound } from "next/navigation";
import { getEventBySlug } from "@/events";
import { invitationOgImage, invitationOgSize } from "@/lib/invitation-og";

export const size = invitationOgSize;
export const contentType = "image/png";
export const alt = "Приглашение";

export default async function EventOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) {
    notFound();
  }
  return invitationOgImage(event);
}
