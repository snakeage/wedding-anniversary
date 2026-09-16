export const CSV_BOM = "\uFEFF";

export const CSV_HEADERS = ["Имя", "Придёт", "Гостей", "Комментарий", "Дата"] as const;

export type CsvRsvpRow = {
  name: string;
  attending: "yes" | "no";
  guests: number;
  comment: string;
  createdAt: string;
};

function csvField(value: string) {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function attendingLabel(attending: CsvRsvpRow["attending"]) {
  return attending === "yes" ? "Придёт" : "Не сможет";
}

export function toCsv(rows: readonly CsvRsvpRow[]): string {
  const lines = [
    CSV_HEADERS.join(","),
    ...rows.map((row) =>
      [
        csvField(row.name),
        csvField(attendingLabel(row.attending)),
        csvField(String(row.guests)),
        csvField(row.comment),
        csvField(row.createdAt),
      ].join(","),
    ),
  ];
  return `${CSV_BOM}${lines.join("\r\n")}\r\n`;
}

export function csvFilename(slug: string) {
  const safe = slug.replace(/[^a-z0-9-]+/gi, "-").replace(/^-+|-+$/g, "") || "guests";
  return `${safe}.csv`;
}
