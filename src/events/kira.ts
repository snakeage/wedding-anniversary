import type { EventContent } from "@/content/types";

export const kira: EventContent = {
  templateId: "dark-editorial",
  slug: "kira",
  couple: {
    one: "Кира",
  },
  kicker: "Вечерний гала",
  tagline: "Чёрный зал, слоновая кость, без лишнего",
  inviteLead:
    "Вечер для тех, кто любит тишину кадра и длинный стол. Без орнаментов и без детской милости — только свет, ткань и люди.",
  inviteBody:
    "Сбор в холле, ужин без ведущего, короткий сет. Приходите в чёрном или в слоновой кости — остальное оставьте дома.",
  event: {
    iso: "2026-12-05T19:00:00+03:00",
    gathering: "Сбор гостей с 18:30",
    dressCode: "Black tie optional — чёрное, слоновая кость, без блеска",
  },
  venue: {
    name: "Зал «Ночь»",
    address: "Москва, Большая Никитская ул., 23",
    lat: 55.7576,
    lng: 37.6018,
    notes: "Вход с Никитской. Если задерживаетесь — напишите, стол не двигаем.",
  },
  gallery: [
    {
      src: "/gallery/gallery-06-hall.jpg",
      alt: "Вечерний зал ресторана",
      caption: "Зал до гостей",
    },
    {
      src: "/gallery/gallery-01-champagne.jpg",
      alt: "Бокалы шампанского при свечах",
      caption: "Свет на стекле",
    },
    {
      src: "/gallery/gallery-04-table.jpg",
      alt: "Накрытый стол",
      caption: "Место у окна",
    },
    {
      src: "/gallery/gallery-05-rings.jpg",
      alt: "Золото на ткани",
      caption: "Деталь кадра",
    },
    {
      src: "/gallery/gallery-02-roses.jpg",
      alt: "Тёмные розы",
      caption: "Цветы без букета",
    },
  ],
  galleryKicker: "Стиллы",
  galleryHeading: "Кадры к вечеру",
};
