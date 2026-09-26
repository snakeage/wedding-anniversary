"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { GalleryFields } from "@/components/GalleryFields";
import { TEMPLATE_IDS, type GalleryItem, type TemplateId } from "@/content/types";
import { templateStarters } from "@/lib/template-starters";

const templateLabels: Record<TemplateId, string> = {
  "quiet-luxury": "Quiet luxury",
  "paper-envelope": "Paper envelope",
  "dark-editorial": "Dark editorial",
  "garden-daylight": "Garden daylight",
  "polaroid-story": "Polaroid story",
  "winter-frost": "Winter frost",
  "minimal-swiss": "Minimal Swiss",
  "gold-deco": "Gold deco",
  "seaside": "Seaside",
  "kids-birthday": "Kids birthday",
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
  gallery: GalleryItem[];
  galleryKicker: string;
  galleryHeading: string;
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
  const initialTemplate = values?.templateId ?? TEMPLATE_IDS[0];
  const createStarter = templateStarters(initialTemplate);
  const [templateId, setTemplateId] = useState<TemplateId>(initialTemplate);
  const [fileDirty, setFileDirty] = useState(false);
  const [galleryKey, setGalleryKey] = useState(mode === "edit" ? "saved" : initialTemplate);
  const [kicker, setKicker] = useState(values?.kicker ?? createStarter.kicker);
  const [tagline, setTagline] = useState(values?.tagline ?? createStarter.tagline);
  const [inviteLead, setInviteLead] = useState(values?.inviteLead ?? createStarter.inviteLead);
  const [inviteBody, setInviteBody] = useState(values?.inviteBody ?? createStarter.inviteBody);
  const [galleryKicker, setGalleryKicker] = useState(
    values?.galleryKicker ?? createStarter.galleryKicker,
  );
  const [galleryHeading, setGalleryHeading] = useState(
    values?.galleryHeading ?? createStarter.galleryHeading,
  );

  const starter = templateStarters(templateId);
  const galleryInitial = mode === "edit" ? values?.gallery : starter.gallery;

  function applyTemplate(next: TemplateId) {
    setTemplateId(next);
    if (mode === "edit" || fileDirty) return;
    const nextStarter = templateStarters(next);
    setKicker(nextStarter.kicker);
    setTagline(nextStarter.tagline);
    setInviteLead(nextStarter.inviteLead);
    setInviteBody(nextStarter.inviteBody);
    setGalleryKicker(nextStarter.galleryKicker);
    setGalleryHeading(nextStarter.galleryHeading);
    setGalleryKey(next);
  }

  return (
    <>
      {error ? (
        <p className="panel mt-6 px-5 py-4 text-sm text-burgundy">
          {EVENT_FORM_ERRORS[error] ?? "Не получилось сохранить."}
        </p>
      ) : null}

      <form action={action} method="post" encType="multipart/form-data" className="panel mt-8 space-y-5 px-6 py-8">
        <p className="text-xs leading-5 text-ink/45">
          Кадры и фразы шаблона можно оставить. Замените только те фото, которые хотите своими.
        </p>
        <Field
          label="Адрес ссылки"
          hint={
            mode === "edit"
              ? "Адрес нельзя сменить после создания."
              : "Латиница и дефис, например anna-dr. Гости откроют /этот-адрес."
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
        <Field label="Шаблон" hint="Как выглядит страница. Quiet luxury — день рождения, Paper envelope — свадьба, Dark editorial — вечерний гала, Garden daylight — свадьба в саду или за городом.">
          <select
            name="templateId"
            className="field mt-2"
            value={templateId}
            onChange={(event) => applyTemplate(event.target.value as TemplateId)}
          >
            {TEMPLATE_IDS.map((id) => (
              <option key={id} value={id}>
                {templateLabels[id]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Имя" hint="Для свадьбы — имя жениха. Для дня рождения — именинник.">
          <input required name="one" placeholder="Иван" className="field mt-2" defaultValue={values?.one} />
        </Field>
        <Field label="Второе имя" hint="Для свадьбы — имя невесты. Для дня рождения оставьте пустым.">
          <input name="two" placeholder="Мария" className="field mt-2" defaultValue={values?.two} />
        </Field>
        <Field
          label="Тип события"
          hint="Над именами. Quiet luxury — «День рождения», Paper envelope — «Свадьба», Dark editorial — «Вечерний гала», Garden daylight — «Свадьба в саду»."
        >
          <input
            required
            name="kicker"
            placeholder="День рождения"
            className="field mt-2"
            value={kicker}
            onChange={(event) => setKicker(event.target.value)}
          />
        </Field>
        <Field label="Короткий слоган" hint="Одна строка под заголовком.">
          <input
            name="tagline"
            placeholder="Приходите такими, какие вы есть"
            className="field mt-2"
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
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
            value={inviteLead}
            onChange={(event) => setInviteLead(event.target.value)}
          />
        </Field>
        <Field label="О вечере и атмосфере" hint="Текст в блоке «Дата, место, настроение».">
          <textarea
            name="inviteBody"
            rows={4}
            placeholder="Ужин, разговоры и немного золота в воздухе. Без строгого регламента."
            className="field mt-2"
            value={inviteBody}
            onChange={(event) => setInviteBody(event.target.value)}
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
          label="Надпись над фото"
          hint="Короткая строка над блоком. Если оставить пустым, шаблон подставит свою. Например: «Сад», «Моменты»."
        >
          <input
            name="galleryKicker"
            placeholder="Сад"
            className="field mt-2"
            value={galleryKicker}
            onChange={(event) => setGalleryKicker(event.target.value)}
          />
        </Field>
        <Field
          label="Заголовок блока фото"
          hint="Заголовок секции снимков. Если оставить пустым, шаблон подставит свой. Например: «Атмосфера дня», «Наша история»."
        >
          <input
            name="galleryHeading"
            placeholder="Свет и зелень"
            className="field mt-2"
            value={galleryHeading}
            onChange={(event) => setGalleryHeading(event.target.value)}
          />
        </Field>
        <GalleryFields
          key={galleryKey}
          initial={galleryInitial}
          onCustomFile={() => setFileDirty(true)}
        />
        <button type="submit" className="btn-gold w-full">
          {mode === "edit" ? "Сохранить" : "Создать"}
        </button>
        <p className="text-center text-xs leading-5 text-ink/45">
          {mode === "edit" ? "Сохраняя приглашение, вы принимаете " : "Создавая приглашение, вы принимаете "}
          <Link className="text-burgundy/80 transition-colors hover:text-burgundy" href="/terms">
            условия сервиса
          </Link>
          . Страница и сбор ответов доступны до даты события и ещё 10 дней после неё.
        </p>
      </form>
    </>
  );
}
