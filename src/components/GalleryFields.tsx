"use client";

import { useState } from "react";
import { GALLERY_MAX, type GalleryItem } from "@/content/types";

type Slot = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

let nextSlotId = 0;
function newSlot(item?: Pick<GalleryItem, "src" | "alt" | "caption">): Slot {
  nextSlotId += 1;
  return {
    id: `gallery-${nextSlotId}`,
    src: item?.src ?? "",
    alt: item?.alt ?? "",
    caption: item?.caption ?? "",
  };
}

export function GalleryFields({ initial }: { initial?: GalleryItem[] }) {
  const [slots, setSlots] = useState<Slot[]>(() =>
    initial?.length ? initial.map((item) => newSlot(item)) : [newSlot()],
  );

  return (
    <div className="space-y-4">
      <p className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Фото (необязательно)</p>
      <p className="text-xs leading-5 text-ink/45">
        До {GALLERY_MAX} снимков. JPEG, PNG или WebP, до 4 МБ каждый. Без файлов блок фото на странице не
        появится. Alt и подпись нужны у каждого выбранного снимка.
      </p>
      {slots.map((slot, index) => (
        <div key={slot.id} className="space-y-3 border border-gold/25 px-4 py-4">
          <input type="hidden" name="gallerySrc" value={slot.src} />
          {slot.src ? (
            <p className="truncate text-xs text-ink/55">Текущее: {slot.src}</p>
          ) : null}
          <label className="block">
            <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Файл</span>
            <input
              name="galleryFile"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="field mt-2"
            />
          </label>
          <label className="block">
            <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Alt</span>
            <input
              name="galleryAlt"
              placeholder="Бокалы шампанского"
              className="field mt-2"
              defaultValue={slot.alt}
            />
          </label>
          <label className="block">
            <span className="text-[10px] tracking-[0.28em] text-ink/50 uppercase">Подпись</span>
            <input
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
