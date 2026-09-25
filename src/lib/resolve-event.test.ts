import assert from "node:assert/strict";
import { test } from "node:test";
import { accessModeForStoredEvent, resolveEvent, resolveEventWithAccess } from "./resolve-event.ts";

test("resolveEvent falls back to git demos when DATABASE_URL is unset", async () => {
  const prev = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    const birthday = await resolveEvent("sofia");
    const wedding = await resolveEvent("ivan-maria");
    const gala = await resolveEvent("kira");
    const garden = await resolveEvent("olga-nikita");
    const polaroid = await resolveEvent("lera-max");
    const winter = await resolveEvent("dasha-ilya");
    const swiss = await resolveEvent("mark-alisa");
    const goldDeco = await resolveEvent("lev-vera");
    assert.equal(birthday?.slug, "sofia");
    assert.equal(wedding?.slug, "ivan-maria");
    assert.equal(gala?.slug, "kira");
    assert.equal(garden?.slug, "olga-nikita");
    assert.equal(polaroid?.slug, "lera-max");
    assert.equal(winter?.slug, "dasha-ilya");
    assert.equal(swiss?.slug, "mark-alisa");
    assert.equal(goldDeco?.slug, "lev-vera");
    assert.equal(await resolveEvent("not-a-real-event"), undefined);
  } finally {
    if (prev !== undefined) process.env.DATABASE_URL = prev;
  }
});

test("resolveEventWithAccess treats git demos as public when DATABASE_URL is unset", async () => {
  const prev = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    const access = await resolveEventWithAccess("sofia");
    assert.equal(access.mode, "active");
    if (access.mode !== "not_found") {
      assert.equal(access.event.slug, "sofia");
    }
    assert.equal((await resolveEventWithAccess("not-a-real-event")).mode, "not_found");
  } finally {
    if (prev !== undefined) process.env.DATABASE_URL = prev;
  }
});

test("accessModeForStoredEvent hides drafts from guests and allows owner preview", () => {
  const draft = {
    status: "draft" as const,
    organizerId: "org-1",
  };
  assert.equal(accessModeForStoredEvent(draft), "not_found");
  assert.equal(accessModeForStoredEvent({ ...draft, viewerOrganizerId: "other" }), "not_found");
  assert.equal(accessModeForStoredEvent({ ...draft, viewerOrganizerId: "org-1" }), "preview");
  assert.equal(
    accessModeForStoredEvent({ status: "pending_approval", organizerId: "org-1", viewerOrganizerId: "org-1" }),
    "preview",
  );
  assert.equal(accessModeForStoredEvent({ status: "active", organizerId: "org-1" }), "active");
});
