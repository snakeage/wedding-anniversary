import { demoEvent } from "@/events";
import { invitationOgImage, invitationOgSize } from "@/lib/invitation-og";

export const alt = `${demoEvent.couple.one} и ${demoEvent.couple.two} — приглашение`;
export const size = invitationOgSize;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return invitationOgImage(demoEvent);
}
