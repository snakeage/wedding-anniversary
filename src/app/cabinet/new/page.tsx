import Link from "next/link";
import { redirect } from "next/navigation";
import { TEMPLATE_IDS } from "@/content/types";
import { getCurrentOrganizer } from "@/lib/current-organizer";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Новое приглашение",
};

const errors: Record<string, string> = {
  slug: "Этот адрес занят или не подходит. Используйте латиницу и дефис, например anna-dr.",
  template: "Выберите шаблон.",
  content: "Проверьте имена, дату и площадку.",
  save: "Не получилось сохранить. Попробуйте ещё раз.",
};

const templateLabels: Record<(typeof TEMPLATE_IDS)[number], string> = {
  "quiet-luxury": "Quiet luxury",
  "paper-envelope": "Paper envelope",
};

export default async function NewEventPage({ searchParams }: PageProps) {
  const organizer = await getCurrentOrganizer();
  if (!organizer) {
    redirect("/login");
  }
  const { error } = await searchParams;

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <p className="text-xs tracking-[0.36em] text-burgundy/75 uppercase">Кабинет</p>
      <h1 className="font-serif mt-3 text-4xl text-ink">Новое приглашение</h1>
      <p className="mt-3 text-sm text-ink/50">
        <Link className="underline decoration-gold/60 underline-offset-4" href="/cabinet">
          Назад
        </Link>
      </p>

      {error ? (
        <p className="panel mt-6 px-5 py-4 text-sm text-burgundy">{errors[error] ?? "Не получилось сохранить."}</p>
      ) : null}

      <form action="/api/cabinet/events" method="post" className="panel mt-8 space-y-5 px-6 py-8">
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Адрес ссылки</span>
          <input required name="slug" placeholder="anna-dr" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Шаблон</span>
          <select name="templateId" className="field mt-2" defaultValue={TEMPLATE_IDS[0]}>
            {TEMPLATE_IDS.map((id) => (
              <option key={id} value={id}>
                {templateLabels[id]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Имя</span>
          <input required name="one" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Второе имя (если есть)</span>
          <input name="two" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Тип события</span>
          <input required name="kicker" defaultValue="Праздник" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Короткий слоган</span>
          <input name="tagline" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Приглашение — лид</span>
          <textarea name="inviteLead" rows={3} className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Приглашение — текст</span>
          <textarea name="inviteBody" rows={4} className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Дата и время</span>
          <input required type="datetime-local" name="iso" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Время на карточке</span>
          <input name="timeLabel" placeholder="16:00" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Сбор гостей</span>
          <input name="gathering" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Дресс-код</span>
          <input name="dressCode" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Площадка</span>
          <input required name="venueName" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Адрес</span>
          <input name="venueAddress" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Широта</span>
          <input name="lat" defaultValue="55.75" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Долгота</span>
          <input name="lng" defaultValue="37.62" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Заметка к месту</span>
          <input name="venueNotes" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Фото (путь, необязательно)</span>
          <input name="gallerySrc" placeholder="/gallery/gallery-01-champagne.jpg" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Alt фото</span>
          <input name="galleryAlt" className="field mt-2" />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Подпись фото</span>
          <input name="galleryCaption" className="field mt-2" />
        </label>
        <button type="submit" className="btn-gold w-full">
          Создать
        </button>
      </form>
    </main>
  );
}
