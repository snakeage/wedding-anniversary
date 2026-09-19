"use client";

import { useState } from "react";
import { GALLERY_MAX, type GalleryItem } from "@/content/types";

type Slot = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  fileName: string;
};

let nextSlotId = 0;
function newSlot(item?: Pick<GalleryItem, "src" | "alt" | "caption">): Slot {
  nextSlotId += 1;
  return {
    id: `gallery-${nextSlotId}`,
    src: item?.src ?? "",
    alt: item?.alt ?? "",
    caption: item?.caption ?? "",
    fileName: "",
  };
}

function slotsFrom(initial?: GalleryItem[]) {
  return initial?.length ? initial.map((item) => newSlot(item)) : [newSlot()];
}

export function GalleryFields({
  initial,
  onCustomFile,
}: {
  initial?: GalleryItem[];
  onCustomFile?: () => void;
}) {
  const [slots, setSlots] = useState<Slot[]>(() => slotsFrom(initial));

  return (
    <div className="space-y-4">
      <p className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Фото (необязательно)</p>
      <p className="text-xs leading-5 text-ink/45">
        Кадры шаблона можно оставить. Замените только те, которые хотите своими — до {GALLERY_MAX}{" "}
        снимков, JPEG / PNG / WebP, до 4 МБ. Без снимков блок фото на странице не появится. Alt и
        подпись нужны у каждого выбранного кадра.
      </p>
      {slots.map((slot, index) => (
        <div key={slot.id} className="space-y-3 border border-gold/25 px-4 py-4">
          <p className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Фото {index + 1}</p>
          <input type="hidden" name="gallerySrc" value={slot.src} />
          {slot.src ? (
            // Starter and blob URLs are already public; a plain img is enough in the cabinet form.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slot.src} alt={slot.alt || ""} className="h-28 w-full object-cover" />
          ) : null}
          <div>
            <p className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">
              {slot.src ? "Заменить своим" : "Загрузить"}
            </p>
            <label className="btn-file mt-2">
              <input
                name="galleryFile"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => {
                  const fileName = event.target.files?.[0]?.name ?? "";
                  setSlots((current) =>
                    current.map((item, i) => (i === index ? { ...item, fileName } : item)),
                  );
                  onCustomFile?.();
                }}
              />
              <span className={slot.fileName ? "max-w-full truncate normal-case tracking-normal" : "truncate"}>
                {slot.fileName || "Выбрать файл"}
              </span>
            </label>
          </div>
          <label className="block">
            <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Alt</span>
            <input
              key={`${slot.id}-alt`}
              name="galleryAlt"
              placeholder="Бокалы шампанского"
              className="field mt-2"
              defaultValue={slot.alt}
            />
          </label>
          <label className="block">
            <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Подпись</span>
            <input
              key={`${slot.id}-caption`}
              name="galleryCaption"
              placeholder="Встречаемся здесь"
              className="field mt-2"
              defaultValue={slot.caption}
            />
          </label>
          {slots.length > 1 || slot.src ? (
            <button
              type="button"
              className="text-[10px] tracking-[0.28em] text-ink/40 uppercase transition-colors hover:text-burgundy/75"
              onClick={() =>
                setSlots((current) => {
                  const next = current.filter((_, i) => i !== index);
                  return next.length ? next : [newSlot()];
                })
              }
            >
              Убрать
            </button>
          ) : null}
        </div>
      ))}
      {slots.length < GALLERY_MAX ? (
        <button
          type="button"
          className="text-[10px] tracking-[0.28em] text-burgundy/80 uppercase transition-colors hover:text-burgundy"
          onClick={() => setSlots((current) => [...current, newSlot()])}
        >
          Добавить фото
        </button>
      ) : null}
    </div>
  );
}
