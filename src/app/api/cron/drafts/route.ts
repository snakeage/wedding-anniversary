import { NextResponse } from "next/server";
import { deleteOrphanBlobs } from "@/lib/blob-upload";
import { getDatabaseUrl } from "@/lib/db";
import { draftLifetimeAction } from "@/lib/draft-lifetime";
import {
  clearPendingPaymentSlug,
  deleteDraftById,
  listDraftsForLifetime,
  markDraftReminded,
  markDraftWarned,
} from "@/lib/event-store";
import { webhookSecretMatches } from "@/lib/telegram-auth";
import { sendTelegramMessage } from "@/lib/telegram-bot";
import { draftRemindText, draftWarnText } from "@/lib/telegram-payment";

export const dynamic = "force-dynamic";

function cronAuthorized(request: Request) {
  const expected = process.env.CRON_SECRET?.trim() ?? "";
  if (!expected) return false;
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : (header ?? "");
  return webhookSecretMatches(token, expected);
}

export async function GET(request: Request) {
  if (!cronAuthorized(request)) {
    return new NextResponse(null, { status: 404 });
  }
  if (!getDatabaseUrl()) {
    return NextResponse.json({ ok: false, error: "database" }, { status: 500 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  const now = new Date();
  const drafts = await listDraftsForLifetime();
  let reminded = 0;
  let warned = 0;
  let dropped = 0;

  for (const draft of drafts) {
    const action = draftLifetimeAction({
      updatedAt: draft.updatedAt,
      remindedAt: draft.remindedAt,
      warnedAt: draft.warnedAt,
      now,
    });
    if (action === "remind") {
      if (!botToken) continue;
      const ok = await sendTelegramMessage(botToken, draft.organizerTelegramId, draftRemindText(site, draft.slug));
      if (!ok) {
        console.error("[cron] draft remind failed", draft.slug);
        continue;
      }
      await markDraftReminded(draft.id);
      reminded += 1;
    } else if (action === "warn") {
      if (!botToken) continue;
      const ok = await sendTelegramMessage(botToken, draft.organizerTelegramId, draftWarnText(site, draft.slug));
      if (!ok) {
        console.error("[cron] draft warn failed", draft.slug);
        continue;
      }
      await markDraftWarned(draft.id);
      warned += 1;
    } else if (action === "drop") {
      await deleteOrphanBlobs(draft.content.gallery, []);
      await clearPendingPaymentSlug(draft.slug);
      const deleted = await deleteDraftById(draft.id);
      if (deleted) dropped += 1;
    }
  }

  return NextResponse.json({ ok: true, reminded, warned, dropped });
}
