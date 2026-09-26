import assert from "node:assert/strict";
import { test } from "node:test";
import { liveSkins } from "../catalog.ts";
import { TEMPLATE_IDS } from "./types.ts";
import { events, getEventBySlug } from "../events/index.ts";

test("every event matches the documented content contract", () => {
  assert.ok(events.length >= 2);

  for (const event of events) {
    assert.ok(
      (TEMPLATE_IDS as readonly string[]).includes(event.templateId),
      `unknown templateId ${event.templateId}`,
    );
    assert.ok(event.slug.trim().length > 0);
    assert.ok(event.couple.one.trim().length > 0);
    assert.ok(event.kicker.trim().length > 0);
    assert.ok(Number.isFinite(Date.parse(event.event.iso)), event.event.iso);
    assert.ok(event.venue.name.trim().length > 0);
    assert.equal(typeof event.venue.lat, "number");
    assert.equal(typeof event.venue.lng, "number");
    assert.ok(event.gallery.length > 0);
    for (const item of event.gallery) {
      assert.ok(item.src.startsWith("/"));
      assert.ok(item.alt.trim().length > 0);
      assert.ok(item.caption.trim().length > 0);
    }
  }
});

test("couple.two is optional: birthday and gala have one name, weddings have two", () => {
  const birthday = getEventBySlug("sofia");
  const wedding = getEventBySlug("ivan-maria");
  const gala = getEventBySlug("kira");
  const garden = getEventBySlug("nikita-olga");
  const polaroid = getEventBySlug("max-lera");
  const winter = getEventBySlug("ilya-dasha");
  const swiss = getEventBySlug("mark-alisa");
  const goldDeco = getEventBySlug("lev-vera");
  assert.ok(birthday);
  assert.ok(wedding);
  assert.ok(gala);
  assert.ok(garden);
  assert.ok(polaroid);
  assert.ok(winter);
  assert.ok(swiss);
  assert.ok(goldDeco);
  assert.equal(birthday.couple.two, undefined);
  assert.equal(gala.couple.two, undefined);
  assert.ok(wedding.couple.two && wedding.couple.two.trim().length > 0);
  assert.ok(garden.couple.two && garden.couple.two.trim().length > 0);
  assert.ok(polaroid.couple.two && polaroid.couple.two.trim().length > 0);
  assert.ok(winter.couple.two && winter.couple.two.trim().length > 0);
  assert.ok(swiss.couple.two && swiss.couple.two.trim().length > 0);
  assert.ok(goldDeco.couple.two && goldDeco.couple.two.trim().length > 0);
});

test("live catalog demoSlug resolves to the matching template", () => {
  assert.ok(liveSkins.length > 0);
  for (const skin of liveSkins) {
    const event = getEventBySlug(skin.demoSlug);
    assert.ok(event, `missing demo ${skin.demoSlug}`);
    assert.equal(event.templateId, skin.id);
  }
});
