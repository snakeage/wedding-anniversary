import assert from "node:assert/strict";
import { test } from "node:test";
import { orphanBlobUrls } from "./blob-upload.ts";

const blobA = "https://abc.public.blob.vercel-storage.com/a.jpg";
const blobB = "https://abc.public.blob.vercel-storage.com/b.jpg";
const blobC = "https://abc.public.blob.vercel-storage.com/c.jpg";
const item = (src: string) => ({ src, alt: "Alt", caption: "Подпись" });

test("orphanBlobUrls keeps only the removed blob url", () => {
  assert.deepEqual(orphanBlobUrls([item(blobA), item(blobB)], [item(blobA)]), [blobB]);
});

test("orphanBlobUrls treats a replacement as an orphan", () => {
  assert.deepEqual(orphanBlobUrls([item(blobA)], [item(blobC)]), [blobA]);
});

test("orphanBlobUrls ignores public gallery paths", () => {
  assert.deepEqual(
    orphanBlobUrls([item("/gallery/gallery-01-champagne.jpg"), item(blobA)], []),
    [blobA],
  );
});
