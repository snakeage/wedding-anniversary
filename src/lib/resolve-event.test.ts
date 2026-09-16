import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveEvent } from "./resolve-event.ts";

test("resolveEvent falls back to git demos when DATABASE_URL is unset", async () => {
  const prev = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    const birthday = await resolveEvent("sofia");
    const wedding = await resolveEvent("ivan-maria");
    assert.equal(birthday?.slug, "sofia");
    assert.equal(wedding?.slug, "ivan-maria");
    assert.equal(await resolveEvent("not-a-real-event"), undefined);
  } finally {
    if (prev !== undefined) process.env.DATABASE_URL = prev;
  }
});
