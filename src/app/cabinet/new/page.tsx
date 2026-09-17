import type { ReactNode } from "react";
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
  map: "Не получилось прочитать точку. Вставьте ссылку из Яндекс.Карт или координаты.",
  save: "Не получилось сохранить. Попробуйте ещё раз.",
};

const templateLabels: Record<(typeof TEMPLATE_IDS)[number], string> = {
  "quiet-luxury": "Quiet luxury",
  "paper-envelope": "Paper envelope",
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs leading-5 text-ink/45">{hint}</span> : null}
    </label>
  );
}

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
        <Field
          label="Адрес ссылки"
          hint="Латиница и дефис. Гости откроют site.ru/этот-адрес. Демо sofia и ivan-maria занять нельзя."
        >
          <input required name="slug" placeholder="anna-dr" className="field mt-2" />
        </Field>
        <Field label="Шаблон" hint="Как выглядит страница. Quiet luxury — день рождения, Paper envelope — свадьба.">
          <select name="templateId" className="field mt-2" defaultValue={TEMPLATE_IDS[0]}>
            {TEMPLATE_IDS.map((id) => (
              <option key={id} value={id}>
                {templateLabels[id]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Имя" hint="Именинник или первый из пары.">
          <input required name="one" placeholder="Анна" className="field mt-2" />
        </Field>
        <Field label="Второе имя" hint="Для свадьбы. Для дня рождения оставьте пустым.">
          <input name="two" placeholder="Дмитрий" className="field mt-2" />
        </Field>
        <Field label="Тип события" hint="Короткая подпись над именами: «День рождения», «Свадьба».">
          <input required name="kicker" defaultValue="Праздник" className="field mt-2" />
        </Field>
        <Field label="Короткий слоган" hint="Одна строка под заголовком.">
          <input name="tagline" placeholder="Приходите такими, какие вы есть" className="field mt-2" />
        </Field>
        <Field label="Приглашение — лид" hint="Первый абзац: зачем вы собираете людей.">
          <textarea
            name="inviteLead"
            rows={3}
            placeholder="В этот вечер хочу быть рядом с теми, кто делает жизнь теплее."
            className="field mt-2"
          />
        </Field>
        <Field label="Приглашение — текст" hint="Второй абзац: что будет на площадке.">
          <textarea
            name="inviteBody"
            rows={4}
            placeholder="Ужин, разговоры и немного золота в воздухе. Без строгого регламента."
            className="field mt-2"
          />
        </Field>
        <Field label="Дата и время" hint="Московское время. По нему идёт обратный отсчёт.">
          <input required type="datetime-local" name="iso" className="field mt-2" />
        </Field>
        <Field label="Время на карточке" hint="Как показать часы в блоке деталей, например 16:00.">
          <input name="timeLabel" placeholder="16:00" className="field mt-2" />
        </Field>
        <Field label="Сбор гостей" hint="Когда ждать у входа.">
          <input name="gathering" placeholder="С 15:30" className="field mt-2" />
        </Field>
        <Field label="Дресс-код" hint="Коротко: Smart casual, чёрный галстук, как удобно.">
          <input name="dressCode" placeholder="Smart casual" className="field mt-2" />
        </Field>
        <Field label="Площадка" hint="Название ресторана, дома или усадьбы.">
          <input required name="venueName" placeholder="Сад «Эрмитаж»" className="field mt-2" />
        </Field>
        <Field label="Адрес" hint="Улица и город — текстом под картой.">
          <input name="venueAddress" placeholder="Москва, Каретный Ряд, 3" className="field mt-2" />
        </Field>
        <Field
          label="Точка на карте"
          hint="Откройте Яндекс.Карты, найдите место, скопируйте ссылку из адресной строки. Или ПКМ по точке → «Скопировать координаты»."
        >
          <input
            required
            name="map"
            placeholder="https://yandex.ru/maps/?ll=37.62,55.75"
            className="field mt-2"
          />
        </Field>
        <Field label="Заметка к месту" hint="Парковка, второй вход, «поздно не звонить».">
          <input name="venueNotes" placeholder="Парковка у северных ворот" className="field mt-2" />
        </Field>
        <Field
          label="Фото (необязательно)"
          hint="Пока без загрузки файлов: путь к картинке из сайта, например /gallery/gallery-01-champagne.jpg. Пусто — галерея пустая."
        >
          <input name="gallerySrc" placeholder="/gallery/gallery-01-champagne.jpg" className="field mt-2" />
        </Field>
        <Field label="Alt фото" hint="Для скринридеров. Нужен, если указали фото.">
          <input name="galleryAlt" placeholder="Бокалы шампанского" className="field mt-2" />
        </Field>
        <Field label="Подпись фото" hint="Текст под снимком. Нужна, если указали фото.">
          <input name="galleryCaption" placeholder="Встречаемся здесь" className="field mt-2" />
        </Field>
        <button type="submit" className="btn-gold w-full">
          Создать
        </button>
        <p className="text-center text-xs leading-5 text-ink/45">
          Создавая приглашение, вы принимаете{" "}
          <Link className="underline decoration-gold/60 underline-offset-4" href="/terms">
            условия сервиса
          </Link>
          . Страница и сбор ответов доступны до даты события и ещё 10 дней после неё.
        </p>
      </form>
    </main>
  );
}
