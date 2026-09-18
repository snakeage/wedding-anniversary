import type { EventContent } from "@/content/types";

export const kira: EventContent = {
  templateId: "dark-editorial",
  slug: "kira",
  couple: {
    one: "Кира",
  },
  kicker: "Вечерний гала",
  tagline: "Чёрный зал, слоновая кость, длинный стол",
  inviteLead:
    "Вечер для тех, кто любит тишину кадра: свет, ткань и длинный стол.",
  inviteBody:
    "Сбор в холле, ужин и короткий сет. Приходите в чёрном или в слоновой кости.",
  event: {
    iso: "2026-12-05T19:00:00+03:00",
    gathering: "Сбор гостей с 18:30",
    dressCode: "Black tie optional — чёрное и слоновая кость",
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
      src: "/gallery/dark-editorial/de-01-hall.jpg",
      alt: "Тёмный зал с длинным столом и одним светом",
      caption: "Зал до гостей",
    },
    {
      src: "/gallery/dark-editorial/de-02-glass.jpg",
      alt: "Бокал слоновой кости на чёрном фоне",
      caption: "Свет на стекле",
    },
    {
      src: "/gallery/dark-editorial/de-03-place.jpg",
      alt: "Чёрный стол, тарелка и одна тёмная роза",
      caption: "Место у окна",
    },
    {
      src: "/gallery/dark-editorial/de-04-detail.jpg",
      alt: "Золотая деталь на ткани слоновой кости",
      caption: "Деталь кадра",
    },
    {
      src: "/gallery/dark-editorial/de-05-roses.jpg",
      alt: "Тёмные розы в стекле на чёрной стене",
      caption: "Цветы к вечеру",
    },
  ],
  galleryKicker: "Стиллы",
  galleryHeading: "Кадры к вечеру",
};
