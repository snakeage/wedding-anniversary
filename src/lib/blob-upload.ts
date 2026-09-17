import { put } from "@vercel/blob";
import type { GalleryItem } from "@/content/types";
import { gallerySlotMissingCopy, gallerySlotsFromForm } from "@/lib/event-form";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 4 * 1024 * 1024;

export type GalleryUploadResult =
  | { ok: true; src?: string }
  | { ok: false; error: "photo_size" | "blob" };

export type GallerySlotsUploadResult =
  | { ok: true; gallery: GalleryItem[] }
  | { ok: false; error: "photo" | "photo_size" | "blob" };

function extensionForType(type: string) {
  if (type === "image/png") return ".png";
  if (type === "image/webp") return ".webp";
  return ".jpg";
}

export async function uploadGalleryFile(
  file: File | null,
  existingSrc: string,
): Promise<GalleryUploadResult> {
  if (!file || file.size === 0) {
    return { ok: true, src: existingSrc || undefined };
  }
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_BYTES) {
    return { ok: false, error: "photo_size" };
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return { ok: false, error: "blob" };
  }

  try {
    const blob = await put(`events/${crypto.randomUUID()}${extensionForType(file.type)}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return { ok: true, src: blob.url };
  } catch (error) {
    console.error("[blob] gallery upload failed", error);
    return { ok: false, error: "blob" };
  }
}

export async function uploadGallerySlots(form: FormData): Promise<GallerySlotsUploadResult> {
  const slots = gallerySlotsFromForm(form);
  const gallery: GalleryItem[] = [];
  for (const slot of slots) {
    if (gallerySlotMissingCopy(slot)) {
      return { ok: false, error: "photo" };
    }
    const uploaded = await uploadGalleryFile(slot.file, slot.src);
    if (!uploaded.ok) return uploaded;
    if (uploaded.src) {
      gallery.push({ src: uploaded.src, alt: slot.alt, caption: slot.caption });
    }
  }
  return { ok: true, gallery };
}
