import { cookies } from "next/headers";
import { getDatabaseUrl } from "@/lib/db";
import {
  getOrganizerSessionSecret,
  ORGANIZER_COOKIE,
  readOrganizerId,
} from "@/lib/organizer-session";
import { getOrganizerById } from "@/lib/organizer-store";

export async function getCurrentOrganizer() {
  const secret = getOrganizerSessionSecret();
  if (!secret || !getDatabaseUrl()) return undefined;
  const cookieStore = await cookies();
  const id = readOrganizerId(cookieStore.get(ORGANIZER_COOKIE)?.value, secret);
  if (!id) return undefined;
  try {
    return await getOrganizerById(id);
  } catch (error) {
    console.error("[organizer] lookup failed", error);
    return undefined;
  }
}
