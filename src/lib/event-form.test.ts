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

test("eventFromForm accepts polaroid-story", () => {
  const form = baseForm();
  form.set("templateId", "polaroid-story");
  const content = eventFromForm(form);
  assert.ok(content);
  assert.equal(content.templateId, "polaroid-story");
});

test("eventFromForm accepts winter-frost", () => {
  const form = baseForm();
  form.set("templateId", "winter-frost");
  const content = eventFromForm(form);
  assert.ok(content);
  assert.equal(content.templateId, "winter-frost");
});

test("eventFromForm accepts minimal-swiss", () => {
  const form = baseForm();
  form.set("templateId", "minimal-swiss");
  const content = eventFromForm(form);
  assert.ok(content);
  assert.equal(content.templateId, "minimal-swiss");
});

test("eventFromForm accepts gold-deco", () => {
  const form = baseForm();
  form.set("templateId", "gold-deco");
  const content = eventFromForm(form);
  assert.ok(content);
  assert.equal(content.templateId, "gold-deco");
});

test("eventFromForm accepts seaside", () => {
  const form = baseForm();
  form.set("templateId", "seaside");
  const content = eventFromForm(form);
  assert.ok(content);
  assert.equal(content.templateId, "seaside");
});

test("eventFromForm accepts kids-birthday", () => {
  const form = baseForm();
  form.set("templateId", "kids-birthday");
  const content = eventFromForm(form);
  assert.ok(content);
  assert.equal(content.templateId, "kids-birthday");
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

test("eventFromForm keeps gallery kicker and heading", () => {
  const form = baseForm();
  form.set("galleryKicker", "Сад");
  form.set("galleryHeading", "Свет и зелень");
  const content = eventFromForm(form);
  assert.ok(content);
  assert.equal(content.galleryKicker, "Сад");
  assert.equal(content.galleryHeading, "Свет и зелень");
  const defaults = defaultsFromEvent(content);
  assert.equal(defaults.galleryKicker, "Сад");
  assert.equal(defaults.galleryHeading, "Свет и зелень");
});

test("eventFromForm keeps a public garden starter photo", () => {
  const form = baseForm();
  form.set("templateId", "garden-daylight");
  form.append("gallerySrc", "/gallery/garden/garden-01-morning.jpg");
  form.append("galleryAlt", "Цветочная арка в утреннем яблоневом саду");
  form.append("galleryCaption", "Утренний сад");
  const content = eventFromForm(form);
  assert.ok(content);
  assert.deepEqual(content.gallery, [
    {
      src: "/gallery/garden/garden-01-morning.jpg",
      alt: "Цветочная арка в утреннем яблоневом саду",
      caption: "Утренний сад",
    },
  ]);
});
