import assert from "node:assert/strict";
import { test } from "node:test";
import { isoToDatetimeLocal, mapUrlFromPoint } from "./event-form.ts";

test("isoToDatetimeLocal keeps Moscow wall time for datetime-local", () => {
  assert.equal(isoToDatetimeLocal("2026-10-17T16:00:00+03:00"), "2026-10-17T16:00");
});

test("mapUrlFromPoint writes Yandex ll as lng,lat", () => {
  assert.equal(mapUrlFromPoint(55.75, 37.62), "https://yandex.ru/maps/?ll=37.62,55.75");
});
