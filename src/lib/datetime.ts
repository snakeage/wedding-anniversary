const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Moscow",
});

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Moscow",
});

export function formatEventDate(iso: string) {
  const formatted = dateFormatter.format(new Date(iso));
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatEventTime(iso: string) {
  return timeFormatter.format(new Date(iso));
}

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

export function getCountdown(iso: string, now = Date.now()): CountdownParts {
  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

export type EventPhase = "upcoming" | "happening" | "ended";

export function eventPhase(iso: string, now = Date.now()): EventPhase {
  const elapsed = now - new Date(iso).getTime();
  if (elapsed < 0) return "upcoming";
  if (elapsed < DAY_MS) return "happening";
  return "ended";
}
