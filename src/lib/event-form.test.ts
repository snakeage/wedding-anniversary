import assert from "node:assert/strict";
import { test } from "node:test";
import {
  defaultsFromEvent,
  eventFromForm,
  gallerySlotMissingCopy,
  gallerySlotsFromForm,
  isoToDatetimeLocal,
  mapUrlFromPoint,
} from "./event-form.ts";

const blobA = "https://abc.public.blob.vercel-storage.com/a.jpg";
const blobB = "https://abc.public.blob.vercel-storage.com/b.jpg";

function baseForm() {
  const form = new FormData();
  form.set("slug", "anna-dr");
  form.set("templateId", "quiet-luxury");
  form.set("one", "Анна");
  form.set("kicker", "День рождения");
  form.set("iso", "2026-10-17T16:00");
  form.set("venueName", "Сад");
  form.set("map", "https://yandex.ru/maps/?ll=37.62,55.75");
  return form;
}

test("isoToDatetimeLocal keeps Moscow wall time for datetime-local", () => {
  assert.equal(isoToDatetimeLocal("2026-10-17T16:00:00+03:00"), "2026-10-17T16:00");
});

test("mapUrlFromPoint writes Yandex ll as lng,lat", () => {
  assert.equal(mapUrlFromPoint(55.75, 37.62), "https://yandex.ru/maps/?ll=37.62,55.75");
});

test("eventFromForm accepts dark-editorial", () => {
  const form = baseForm();
  form.set("templateId", "dark-editorial");
  const content = eventFromForm(form);
  assert.ok(content);
  assert.equal(content.templateId, "dark-editorial");
});

test("eventFromForm accepts garden-daylight", () => {
  const form = baseForm();
  form.set("templateId", "garden-daylight");
  const content = eventFromForm(form);
  assert.ok(content);
  assert.equal(content.templateId, "garden-daylight");
});

test("eventFromForm keeps two gallery items", () => {
  const form = baseForm();
  form.append("gallerySrc", blobA);
  form.append("galleryAlt", "Бокалы");
  form.append("galleryCaption", "Тост");
  form.append("gallerySrc", blobB);
  form.append("galleryAlt", "Торт");
  form.append("galleryCaption", "Сладости");
  const content = eventFromForm(form);
  assert.ok(content);
  assert.equal(content.gallery.length, 2);
  assert.deepEqual(content.gallery, [
    { src: blobA, alt: "Бокалы", caption: "Тост" },
    { src: blobB, alt: "Торт", caption: "Сладости" },
  ]);
});

test("gallery slot without alt is a photo error", () => {
  const form = baseForm();
  form.append("gallerySrc", blobA);
  form.append("galleryAlt", "");
  form.append("galleryCaption", "Тост");
  const slots = gallerySlotsFromForm(form);
  assert.equal(slots.length, 1);
  assert.equal(gallerySlotMissingCopy(slots[0]), true);
  const content = eventFromForm(form);
  assert.ok(content);
  assert.equal(content.gallery.length, 0);
});

test("defaultsFromEvent keeps the full gallery array", () => {
  const form = baseForm();
  form.append("gallerySrc", blobA);
  form.append("galleryAlt", "Бокалы");
  form.append("galleryCaption", "Тост");
  form.append("gallerySrc", blobB);
  form.append("galleryAlt", "Торт");
  form.append("galleryCaption", "Сладости");
  const content = eventFromForm(form);
  assert.ok(content);
  assert.deepEqual(defaultsFromEvent(content).gallery, content.gallery);
});
