import assert from "node:assert/strict";
import { test } from "node:test";
import { TEMPLATE_IDS } from "../content/types.ts";
import { templateStarters } from "./template-starters.ts";

test("every live template has starter copy and gallery", () => {
  for (const id of TEMPLATE_IDS) {
    const starter = templateStarters(id);
    assert.ok(starter.kicker.trim());
    assert.ok(starter.gallery.length > 0);
    for (const item of starter.gallery) {
      assert.ok(item.src.startsWith("/gallery/"));
      assert.ok(item.alt.trim());
      assert.ok(item.caption.trim());
    }
  }
});

test("garden starter keeps the orchard photos and captions", () => {
  const starter = templateStarters("garden-daylight");
  assert.equal(starter.kicker, "Свадьба в саду");
  assert.equal(starter.gallery[0]?.src, "/gallery/garden/garden-01-morning.jpg");
  assert.equal(starter.gallery[0]?.caption, "Утренний сад");
  assert.equal(starter.galleryKicker, "Сад");
  assert.equal(starter.galleryHeading, "Свет и зелень");
});

test("live skins do not share the old restaurant gallery files", () => {
  const srcs = TEMPLATE_IDS.flatMap((id) =>
    templateStarters(id).gallery.map((item) => item.src),
  );
  assert.equal(templateStarters("quiet-luxury").gallery[0]?.src, "/gallery/quiet-luxury/ql-01-candles.jpg");
  assert.equal(templateStarters("paper-envelope").gallery[0]?.src, "/gallery/paper-envelope/pe-01-envelope.jpg");
  assert.equal(templateStarters("dark-editorial").gallery[0]?.src, "/gallery/dark-editorial/de-01-hall.jpg");
  assert.equal(templateStarters("polaroid-story").gallery[0]?.src, "/gallery/polaroid-story/ps-01-park.jpg");
  assert.equal(templateStarters("winter-frost").gallery[0]?.src, "/gallery/winter-frost/wf-hero-snow.jpg?v=3");
  assert.equal(templateStarters("winter-frost").gallery[1]?.src, "/gallery/winter-frost/wf-01-glass.jpg?v=3");
  assert.equal(templateStarters("minimal-swiss").gallery[0]?.src, "/gallery/minimal-swiss/swiss-hero-couple.jpg");
  assert.equal(templateStarters("gold-deco").gallery[0]?.src, "/gallery/gold-deco/gd-hero-hall.jpg");
  assert.equal(templateStarters("seaside").gallery[0]?.src, "/gallery/seaside/sea-hero-horizon.jpg");
  assert.equal(templateStarters("kids-birthday").gallery[0]?.src, "/gallery/kids-birthday/kids-hero-party.jpg");
  assert.equal(new Set(srcs).size, srcs.length);
  for (const src of srcs) {
    assert.equal(src.includes("/gallery/gallery-0"), false);
  }
});

test("gold-deco starter keeps dedicated formal banquet photos and captions", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const starter = templateStarters("gold-deco");
  assert.equal(starter.kicker, "Ночной банкет");
  assert.equal(starter.galleryKicker, "Зал");
  assert.equal(starter.galleryHeading, "Симметрия вечера");
  assert.equal(starter.gallery.length, 6);
  for (const item of starter.gallery) {
    const cleanSrc = item.src.replace(/\?.*$/, "");
    const filePath = path.join(process.cwd(), "public", cleanSrc);
    assert.ok(fs.existsSync(filePath), `file ${filePath} must exist`);
  }
});

test("seaside starter keeps dedicated coastal photos and captions", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const starter = templateStarters("seaside");
  assert.equal(starter.kicker, "Свадьба на побережье");
  assert.equal(starter.galleryKicker, "Побережье");
  assert.equal(starter.galleryHeading, "Горизонт и прибой");
  assert.equal(starter.gallery.length, 6);

  const expectedSrcs = [
    "/gallery/seaside/sea-hero-horizon.jpg",
    "/gallery/seaside/sea-01-couple.jpg",
    "/gallery/seaside/sea-02-rings.jpg",
    "/gallery/seaside/sea-03-table.jpg",
    "/gallery/seaside/sea-04-lighthouse.jpg",
    "/gallery/seaside/sea-05-waves.jpg",
  ];
  assert.deepEqual(
    starter.gallery.map((i) => i.src),
    expectedSrcs,
  );
  assert.equal(new Set(starter.gallery.map((i) => i.src)).size, 6);

  for (const item of starter.gallery) {
    const cleanSrc = item.src.replace(/\?.*$/, "");
    const filePath = path.join(process.cwd(), "public", cleanSrc);
    assert.ok(fs.existsSync(filePath), `file ${filePath} must exist`);
  }
});

test("kids-birthday starter keeps dedicated children's party photos and captions", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const starter = templateStarters("kids-birthday");
  assert.equal(starter.kicker, "Детский праздник · 7 лет");
  assert.equal(starter.galleryKicker, "Веселье");
  assert.equal(starter.galleryHeading, "Кадры праздника");
  assert.equal(starter.gallery.length, 6);

  const expectedSrcs = [
    "/gallery/kids-birthday/kids-hero-party.jpg",
    "/gallery/kids-birthday/kids-01-cake.jpg",
    "/gallery/kids-birthday/kids-02-balloons.jpg",
    "/gallery/kids-birthday/kids-03-presents.jpg",
    "/gallery/kids-birthday/kids-04-table.jpg",
    "/gallery/kids-birthday/kids-05-pinata.jpg",
  ];
  assert.deepEqual(
    starter.gallery.map((i) => i.src),
    expectedSrcs,
  );
  assert.equal(new Set(starter.gallery.map((i) => i.src)).size, 6);

  for (const item of starter.gallery) {
    const cleanSrc = item.src.replace(/\?.*$/, "");
    const filePath = path.join(process.cwd(), "public", cleanSrc);
    assert.ok(fs.existsSync(filePath), `file ${filePath} must exist`);
  }
});

