import assert from "node:assert/strict";
import { test } from "node:test";
import { CSV_BOM, CSV_HEADERS, csvFilename, toCsv, type CsvRsvpRow } from "./rsvp-csv.ts";

const row = (overrides: Partial<CsvRsvpRow> = {}): CsvRsvpRow => ({
  name: "Анна",
  attending: "yes",
  guests: 2,
  comment: "",
  createdAt: "2026-09-15T12:00:00.000Z",
  ...overrides,
});

test("toCsv writes a UTF-8 BOM and Cyrillic headers", () => {
  const csv = toCsv([]);
  assert.equal(csv.startsWith(CSV_BOM), true);
  assert.equal(csv.slice(CSV_BOM.length), `${CSV_HEADERS.join(",")}\r\n`);
});

test("toCsv maps attending to Russian labels", () => {
  const csv = toCsv([row(), row({ name: "Иван", attending: "no", guests: 1 })]);
  assert.match(csv, /Анна,Придёт,2,,2026-09-15T12:00:00.000Z/);
  assert.match(csv, /Иван,Не сможет,1,,2026-09-15T12:00:00.000Z/);
});

test("toCsv quotes commas, quotes, and newlines", () => {
  const csv = toCsv([
    row({ name: "Анна, Пётр", comment: 'Скажет "да"\nи привезёт торт' }),
  ]);
  const body = csv.slice(CSV_BOM.length);
  assert.match(body, /"Анна, Пётр"/);
  assert.match(body, /"Скажет ""да""\nи привезёт торт"/);
});

test("csvFilename uses the event slug", () => {
  assert.equal(csvFilename("sofia"), "sofia.csv");
  assert.equal(csvFilename("ivan-maria"), "ivan-maria.csv");
});
