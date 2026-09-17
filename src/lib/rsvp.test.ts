import assert from "node:assert/strict";
import { test } from "node:test";
import { parseRsvp } from "./rsvp.ts";

const valid = {
  name: "Анна",
  guests: 2,
  attending: "yes",
  comment: "",
  slug: "sofia",
};

test("parseRsvp accepts a valid payload", () => {
  const result = parseRsvp(valid);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.data, valid);
  }
});

test("parseRsvp parses guests from a numeric string", () => {
  const result = parseRsvp({ ...valid, guests: "3" });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.guests, 3);
  }
});

test("parseRsvp rejects a non-object body", () => {
  const result = parseRsvp(null);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.error, "Некорректный запрос");
  }
});

test("parseRsvp rejects a short name", () => {
  const result = parseRsvp({ ...valid, name: "А" });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /имя/i);
  }
});

test("parseRsvp rejects an invalid attending value", () => {
  const result = parseRsvp({ ...valid, attending: "maybe" });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /прийти/i);
  }
});

test("parseRsvp rejects guests outside 1–12 when attending", () => {
  assert.equal(parseRsvp({ ...valid, guests: 0 }).ok, false);
  assert.equal(parseRsvp({ ...valid, guests: 13 }).ok, false);
  assert.equal(parseRsvp({ ...valid, guests: 1.5 }).ok, false);
});

test("parseRsvp stores zero guests when declining", () => {
  const result = parseRsvp({ ...valid, attending: "no", guests: 4 });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.guests, 0);
  }
});

test("parseRsvp rejects a comment over 500 characters", () => {
  const result = parseRsvp({ ...valid, comment: "x".repeat(501) });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /Комментарий/i);
  }
});

test("parseRsvp rejects an empty slug", () => {
  const result = parseRsvp({ ...valid, slug: "" });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /приглашение/i);
  }
});
