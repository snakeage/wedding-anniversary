import { productOgImage, invitationOgSize } from "@/lib/invitation-og";

export const alt = "Шаблоны приглашений";
export const size = invitationOgSize;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return productOgImage();
}
