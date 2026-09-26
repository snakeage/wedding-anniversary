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
  const seaside = getEventBySlug("arseniy-maya");
  const kidsBirthday = getEventBySlug("misha");
  assert.ok(birthday);
  assert.ok(wedding);
  assert.ok(gala);
  assert.ok(garden);
  assert.ok(polaroid);
  assert.ok(winter);
  assert.ok(swiss);
  assert.ok(goldDeco);
  assert.ok(seaside);
  assert.ok(kidsBirthday);
  assert.equal(birthday.couple.two, undefined);
  assert.equal(gala.couple.two, undefined);
  assert.equal(kidsBirthday.couple.two, undefined);
  assert.ok(wedding.couple.two && wedding.couple.two.trim().length > 0);
  assert.ok(garden.couple.two && garden.couple.two.trim().length > 0);
  assert.ok(polaroid.couple.two && polaroid.couple.two.trim().length > 0);
  assert.ok(winter.couple.two && winter.couple.two.trim().length > 0);
  assert.ok(swiss.couple.two && swiss.couple.two.trim().length > 0);
  assert.ok(goldDeco.couple.two && goldDeco.couple.two.trim().length > 0);
  assert.ok(seaside.couple.two && seaside.couple.two.trim().length > 0);
});

test("kids birthday demo event has valid party details", () => {
  const kids = getEventBySlug("misha");
  assert.ok(kids);
  assert.equal(kids.templateId, "kids-birthday");
  assert.equal(kids.couple.one, "Миша");
  assert.equal(kids.couple.two, undefined);
  assert.ok(kids.kicker.includes("7 лет"));
  assert.ok(kids.venue.name.length > 0);
  assert.ok(kids.venue.address.length > 0);
  assert.equal(kids.gallery.length, 6);
  assert.ok(kids.gallery.every((g) => g.src.startsWith("/gallery/kids-birthday/")));
  assert.ok(kids.gallery.every((g) => g.alt.length > 0 && g.caption.length > 0));
});

test("live catalog demoSlug resolves to the matching template", () => {
  assert.ok(liveSkins.length > 0);
  for (const skin of liveSkins) {
    const event = getEventBySlug(skin.demoSlug);
    assert.ok(event, `missing demo ${skin.demoSlug}`);
    assert.equal(event.templateId, skin.id);
  }
});

test("seaside demo event has valid coastal coordinates", () => {
  const seaside = getEventBySlug("arseniy-maya");
  assert.ok(seaside);
  assert.ok(seaside.venue.lat > 0 && seaside.venue.lat <= 90);
  assert.ok(seaside.venue.lng > 0 && seaside.venue.lng <= 180);
});
