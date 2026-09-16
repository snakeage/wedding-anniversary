import assert from "node:assert/strict";
import { test } from "node:test";
import { parseYandexMapPoint } from "./yandex-maps.ts";

test("parseYandexMapPoint reads ll as lng,lat", () => {
  const point = parseYandexMapPoint("https://yandex.ru/maps/?ll=37.6055,55.7446&z=16");
  assert.ok(point);
  assert.equal(point.lng, 37.6055);
  assert.equal(point.lat, 55.7446);
});

test("parseYandexMapPoint reads pt pin as lng,lat", () => {
  const point = parseYandexMapPoint(
    "https://yandex.ru/map-widget/v1/?ll=37.62,55.75&pt=37.6055,55.7446,pm2rdm",
  );
  assert.ok(point);
  assert.equal(point.lng, 37.6055);
  assert.equal(point.lat, 55.7446);
});

test("parseYandexMapPoint reads copied lat,lng coordinates", () => {
  const point = parseYandexMapPoint("55.7446, 37.6055");
  assert.ok(point);
  assert.equal(point.lat, 55.7446);
  assert.equal(point.lng, 37.6055);
});

test("parseYandexMapPoint rejects empty and junk", () => {
  assert.equal(parseYandexMapPoint(""), undefined);
  assert.equal(parseYandexMapPoint("москва"), undefined);
});
