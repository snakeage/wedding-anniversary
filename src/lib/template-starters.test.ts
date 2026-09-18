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
