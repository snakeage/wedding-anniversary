import assert from "node:assert/strict";
import { test } from "node:test";
import { isValidSlug, parseEventContent, reservedSlugs } from "./event-content.ts";

const valid = {
  templateId: "quiet-luxury",
  slug: "anna-party",
  couple: { one: "Анна" },
  kicker: "День рождения",
  tagline: "Приходите",
  inviteLead: "Ждём вас",
  inviteBody: "Ужин",
  event: {
    iso: "2026-10-17T16:00:00+03:00",
    timeLabel: "16:00",
    gathering: "С 15:30",
    dressCode: "Smart",
  },
  venue: {
    name: "Сад",
    address: "Москва",
    lat: 55.7,
    lng: 37.6,
    notes: "",
  },
  gallery: [],
};

test("parseEventContent accepts a valid payload", () => {
  const parsed = parseEventContent(valid);
  assert.ok(parsed);
  assert.equal(parsed.slug, "anna-party");
  assert.equal(parsed.couple.two, undefined);
});

test("parseEventContent rejects an unknown template", () => {
  assert.equal(parseEventContent({ ...valid, templateId: "nope" }), undefined);
});

test("isValidSlug and reserved demo slugs", () => {
  assert.equal(isValidSlug("sofia"), true);
  assert.equal(isValidSlug("AB"), false);
  assert.ok(reservedSlugs().has("sofia"));
  assert.ok(reservedSlugs().has("login"));
  assert.ok(reservedSlugs().has("cabinet"));
  assert.ok(reservedSlugs().has("terms"));
});
