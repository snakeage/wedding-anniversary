export const DRAFT_REMIND_AFTER_MS = 14 * 24 * 60 * 60 * 1000;
export const DRAFT_WARN_AFTER_MS = 28 * 24 * 60 * 60 * 1000;
export const DRAFT_DROP_AFTER_WARN_MS = 2 * 24 * 60 * 60 * 1000;

export type DraftLifetimeAction = "none" | "remind" | "warn" | "drop";

export function draftLifetimeAction(input: {
  updatedAt: Date;
  remindedAt: Date | null;
  warnedAt: Date | null;
  now: Date;
}): DraftLifetimeAction {
  const now = input.now.getTime();
  const idle = now - input.updatedAt.getTime();
  if (input.warnedAt && now - input.warnedAt.getTime() >= DRAFT_DROP_AFTER_WARN_MS) {
    return "drop";
  }
  if (idle >= DRAFT_WARN_AFTER_MS && !input.warnedAt) {
    return "warn";
  }
  if (idle >= DRAFT_REMIND_AFTER_MS && !input.remindedAt) {
    return "remind";
  }
  return "none";
}
