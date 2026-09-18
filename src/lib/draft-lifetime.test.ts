import assert from "node:assert/strict";
import { test } from "node:test";
import { draftLifetimeAction } from "./draft-lifetime.ts";

const day = 24 * 60 * 60 * 1000;
const now = new Date("2026-09-18T08:00:00.000Z");

function at(daysAgo: number) {
  return new Date(now.getTime() - daysAgo * day);
}

test("draftLifetimeAction reminds after 14 idle days", () => {
  assert.equal(draftLifetimeAction({ updatedAt: at(14), remindedAt: null, warnedAt: null, now }), "remind");
  assert.equal(draftLifetimeAction({ updatedAt: at(13.9), remindedAt: null, warnedAt: null, now }), "none");
  assert.equal(draftLifetimeAction({ updatedAt: at(20), remindedAt: at(5), warnedAt: null, now }), "none");
});

test("draftLifetimeAction warns after 28 idle days even if never reminded", () => {
  assert.equal(draftLifetimeAction({ updatedAt: at(28), remindedAt: null, warnedAt: null, now }), "warn");
  assert.equal(draftLifetimeAction({ updatedAt: at(90), remindedAt: null, warnedAt: null, now }), "warn");
});

test("draftLifetimeAction drops only after warning plus 2 days", () => {
  assert.equal(draftLifetimeAction({ updatedAt: at(30), remindedAt: at(16), warnedAt: at(1), now }), "none");
  assert.equal(draftLifetimeAction({ updatedAt: at(30), remindedAt: at(16), warnedAt: at(2), now }), "drop");
  assert.equal(draftLifetimeAction({ updatedAt: at(90), remindedAt: null, warnedAt: null, now }), "warn");
});

test("draftLifetimeAction is none after a fresh edit", () => {
  assert.equal(draftLifetimeAction({ updatedAt: now, remindedAt: null, warnedAt: null, now }), "none");
});
