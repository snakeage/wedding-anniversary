import Link from "next/link";
import type { EventStatus } from "@/lib/event-store";
import { botPayUrl, type SbpDetails } from "@/lib/sbp";

type Props = {
  slug: string;
  status: EventStatus;
  sbp?: SbpDetails;
  botUsername: string;
};

export function CabinetPayPanel({ slug, status, sbp, botUsername }: Props) {
  if (status === "active") return null;

  if (status === "pending_approval") {
    return (
      <div className="mt-4 border-t border-gold/25 pt-4 text-sm leading-6 text-ink/65">
        <p>
          Чек отправлен на проверку. Обычно активация занимает 1–2 часа (максимум до 24 часов ночью
          или при сбоях связи). Как только оплата подтвердится, бот пришлёт уведомление, а ссылка
          станет доступна гостям.
        </p>
        {sbp?.contact ? (
          <p className="mt-2">
            Если бот долго не отвечает, напишите напрямую:{" "}
            <a
              className="underline decoration-gold/60 underline-offset-4"
              href={`https://t.me/${sbp.contact}`}
              target="_blank"
              rel="noreferrer"
            >
              @{sbp.contact}
            </a>
          </p>
        ) : null}
      </div>
    );
  }

  if (!sbp) {
    return (
      <p className="mt-4 border-t border-gold/25 pt-4 text-sm text-ink/50">
        Реквизиты для оплаты ещё не настроены.
      </p>
    );
  }

  const payUrl = botPayUrl(botUsername, slug);
  const price = sbp.priceRub.toLocaleString("ru-RU");

  return (
    <div className="mt-4 space-y-3 border-t border-gold/25 pt-4 text-sm leading-6 text-ink/70">
      <p className="text-[10px] tracking-[0.22em] text-burgundy/75 uppercase">Опубликовать приглашение</p>
      <p>
        <span className="font-serif text-2xl text-ink">{price} ₽</span>
        <span className="mt-1 block text-ink/55">
          Разовый платёж. Страница и сбор ответов — до даты события и ещё 10 дней после неё.
        </span>
      </p>
      <dl className="space-y-1">
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-ink/45">Банк</dt>
          <dd>{sbp.bank}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-ink/45">СБП</dt>
          <dd>{sbp.phone}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-ink/45">Получатель</dt>
          <dd>{sbp.recipient}</dd>
        </div>
      </dl>
      <p className="text-ink/55">
        Пожалуйста, оставляйте поле комментария к переводу пустым. Подтверждение оплаты — по чеку в
        боте.
      </p>
      <p className="text-ink/55">
        Оплачивая, вы соглашаетесь с{" "}
        <Link className="underline decoration-gold/60 underline-offset-4" href="/terms">
          условиями сервиса
        </Link>
        .
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {payUrl ? (
          <a className="btn-gold" href={payUrl} target="_blank" rel="noreferrer">
            Отправить чек в бот
          </a>
        ) : (
          <p className="text-ink/50">Бот ещё не настроен. Чек можно отправить позже.</p>
        )}
        <form action="/api/cabinet/receipt" method="post">
          <input type="hidden" name="slug" value={slug} />
          <button type="submit" className="underline decoration-gold/60 underline-offset-4">
            Я отправил(а) чек
          </button>
        </form>
      </div>
    </div>
  );
}
