import type { ReactNode } from "react";
import Link from "next/link";
import { TEMPLATE_IDS, type TemplateId } from "@/content/types";

const templateLabels: Record<TemplateId, string> = {
  "quiet-luxury": "Quiet luxury",
  "paper-envelope": "Paper envelope",
};

export const EVENT_FORM_ERRORS: Record<string, string> = {
  slug: "Этот адрес занят или не подходит. Используйте латиницу и дефис, например anna-dr.",
  template: "Выберите шаблон.",
  content: "Проверьте имена, дату и площадку.",
  map: "Не получилось прочитать точку. Вставьте ссылку из Яндекс.Карт или координаты.",
  save: "Не получилось сохранить. Попробуйте ещё раз.",
  photo: "Если есть фото — заполните alt и подпись.",
  photo_size: "Фото — JPEG, PNG или WebP, до 4 МБ.",
  blob: "Не получилось загрузить фото. Попробуйте ещё раз.",
};

export type EventFormValues = {
  slug: string;
  templateId: TemplateId;
  one: string;
  two: string;
  kicker: string;
  tagline: string;
  inviteLead: string;
  inviteBody: string;
  iso: string;
  gathering: string;
  dressCode: string;
  venueName: string;
  venueAddress: string;
  map: string;
  venueNotes: string;
  gallerySrc: string;
  galleryAlt: string;
  galleryCaption: string;
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

export function EventForm({
  action,
  mode,
  error,
  values,
}: {
  action: string;
  mode: "create" | "edit";
  error?: string;
  values?: Partial<EventFormValues>;
}) {
  const templateId = values?.templateId ?? TEMPLATE_IDS[0];

  return (
    <>
      {error ? (
        <p className="panel mt-6 px-5 py-4 text-sm text-burgundy">
          {EVENT_FORM_ERRORS[error] ?? "Не получилось сохранить."}
        </p>
      ) : null}

      <form action={action} method="post" encType="multipart/form-data" className="panel mt-8 space-y-5 px-6 py-8">
        <Field
          label="Адрес ссылки"
          hint={
            mode === "edit"
              ? "Адрес нельзя сменить после создания."
              : "Латиница и дефис. Гости откроют site.ru/этот-адрес. Демо sofia и ivan-maria занять нельзя."
          }
        >
          <input
            required
            name="slug"
            placeholder="anna-dr"
            className="field mt-2"
            defaultValue={values?.slug}
            readOnly={mode === "edit"}
          />
        </Field>
        <Field label="Шаблон" hint="Как выглядит страница. Quiet luxury — день рождения, Paper envelope — свадьба.">
          <select name="templateId" className="field mt-2" defaultValue={templateId}>
            {TEMPLATE_IDS.map((id) => (
              <option key={id} value={id}>
                {templateLabels[id]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Имя" hint="Именинник или первый из пары.">
          <input required name="one" placeholder="Анна" className="field mt-2" defaultValue={values?.one} />
        </Field>
        <Field label="Второе имя" hint="Для свадьбы. Для дня рождения оставьте пустым.">
          <input name="two" placeholder="Дмитрий" className="field mt-2" defaultValue={values?.two} />
        </Field>
        <Field
          label="Тип события"
          hint="Над именами. Quiet luxury — «День рождения», Paper envelope — «Свадьба»."
        >
          <input
            required
            name="kicker"
            placeholder="День рождения"
            className="field mt-2"
            defaultValue={values?.kicker}
          />
        </Field>
        <Field label="Короткий слоган" hint="Одна строка под заголовком.">
          <input
            name="tagline"
            placeholder="Приходите такими, какие вы есть"
            className="field mt-2"
            defaultValue={values?.tagline}
          />
        </Field>
        <Field
          label="Слова к истории / фото"
          hint="Текст над галереей. Если фото нет, этот блок на странице не появится."
        >
          <textarea
            name="inviteLead"
            rows={3}
            placeholder="В этот вечер хочу быть рядом с теми, кто делает жизнь теплее."
            className="field mt-2"
            defaultValue={values?.inviteLead}
          />
        </Field>
        <Field label="О вечере и атмосфере" hint="Текст в блоке «Дата, место, настроение».">
          <textarea
            name="inviteBody"
            rows={4}
            placeholder="Ужин, разговоры и немного золота в воздухе. Без строгого регламента."
            className="field mt-2"
            defaultValue={values?.inviteBody}
          />
        </Field>
        <Field
          label="Дата и время начала"
          hint="Официальный старт события, московское время. По нему идёт обратный отсчёт."
        >
          <input required type="datetime-local" name="iso" className="field mt-2" defaultValue={values?.iso} />
        </Field>
        <Field
          label="Сбор гостей (необязательно)"
          hint="Если ждёте гостей раньше начала программы (welcome-коктейль). Например: С 15:30."
        >
          <input name="gathering" placeholder="С 15:30" className="field mt-2" defaultValue={values?.gathering} />
        </Field>
        <Field label="Дресс-код" hint="Коротко: Smart casual, чёрный галстук, как удобно.">
          <input name="dressCode" placeholder="Smart casual" className="field mt-2" defaultValue={values?.dressCode} />
        </Field>
        <Field label="Площадка" hint="Название ресторана, дома или усадьбы.">
          <input
            required
            name="venueName"
            placeholder="Сад «Эрмитаж»"
            className="field mt-2"
            defaultValue={values?.venueName}
          />
        </Field>
        <Field label="Адрес" hint="Улица и город — текстом под картой.">
          <input
            name="venueAddress"
            placeholder="Москва, Каретный Ряд, 3"
            className="field mt-2"
            defaultValue={values?.venueAddress}
          />
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
            defaultValue={values?.map}
          />
        </Field>
        <Field label="Заметка к месту" hint="Парковка, второй вход, «поздно не звонить».">
          <input
            name="venueNotes"
            placeholder="Парковка у северных ворот"
            className="field mt-2"
            defaultValue={values?.venueNotes}
          />
        </Field>
        <Field
          label="Фото (необязательно)"
          hint={
            values?.gallerySrc
              ? "Новый файл заменит текущее. JPEG, PNG или WebP, до 4 МБ. Можно не выбирать файл — останется текущее фото."
              : "JPEG, PNG или WebP, до 4 МБ. Можно не прикладывать — блок фото на странице не появится."
          }
        >
          {values?.gallerySrc ? <input type="hidden" name="gallerySrc" value={values.gallerySrc} /> : null}
          <input
            name="galleryFile"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="field mt-2"
          />
        </Field>
        <Field label="Alt фото" hint="Для скринридеров. Нужен, если указали фото.">
          <input
            name="galleryAlt"
            placeholder="Бокалы шампанского"
            className="field mt-2"
            defaultValue={values?.galleryAlt}
          />
        </Field>
        <Field label="Подпись фото" hint="Текст под снимком. Нужна, если указали фото.">
          <input
            name="galleryCaption"
            placeholder="Встречаемся здесь"
            className="field mt-2"
            defaultValue={values?.galleryCaption}
          />
        </Field>
        <button type="submit" className="btn-gold w-full">
          {mode === "edit" ? "Сохранить" : "Создать"}
        </button>
        <p className="text-center text-xs leading-5 text-ink/45">
          {mode === "edit" ? "Сохраняя приглашение, вы принимаете " : "Создавая приглашение, вы принимаете "}
          <Link className="underline decoration-gold/60 underline-offset-4" href="/terms">
            условия сервиса
          </Link>
          . Страница и сбор ответов доступны до даты события и ещё 10 дней после неё.
        </p>
      </form>
    </>
  );
}
