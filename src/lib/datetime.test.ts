import assert from "node:assert/strict";
import { test } from "node:test";
import { eventPhase } from "./datetime.ts";

test("eventPhase is upcoming before start, happening for 24 hours, then ended", () => {
  const iso = "2026-10-17T16:00:00+03:00";
  const start = Date.parse(iso);
  assert.equal(eventPhase(iso, start - 1), "upcoming");
  assert.equal(eventPhase(iso, start), "happening");
  assert.equal(eventPhase(iso, start + 23 * 60 * 60 * 1000), "happening");
  assert.equal(eventPhase(iso, start + 24 * 60 * 60 * 1000), "ended");
});
