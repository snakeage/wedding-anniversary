import { put } from "@vercel/blob";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 4 * 1024 * 1024;

export type GalleryUploadResult =
  | { ok: true; src?: string }
  | { ok: false; error: "photo_size" | "blob" };

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

export function galleryFileFromForm(form: FormData) {
  const value = form.get("galleryFile");
  return value instanceof File ? value : null;
}
