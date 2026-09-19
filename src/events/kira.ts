import type { EventContent } from "@/content/types";

export const kira: EventContent = {
  templateId: "dark-editorial",
  slug: "kira",
  couple: {
    one: "Кира",
  },
  kicker: "Вечерний гала",
  tagline: "Свечи, шампань, длинный стол",
  inviteLead:
    "Вечер для тех, кто любит тишину кадра: тёплый свет, ткань и длинный стол.",
  inviteBody:
    "Сбор в холле, ужин и короткий сет. Приходите в чёрном, слоновой кости или золоте.",
  event: {
    iso: "2026-12-05T19:00:00+03:00",
    gathering: "Сбор гостей с 18:30",
    dressCode: "Black tie optional — чёрное, слоновая кость, золото",
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
      alt: "Длинный стол со свечами до прихода гостей",
      caption: "Стол к вечеру",
    },
    {
      src: "/gallery/dark-editorial/de-02-glass.jpg",
      alt: "Бокал шампанского на тёмном фоне",
      caption: "Свет на стекле",
    },
    {
      src: "/gallery/dark-editorial/de-03-place.jpg",
      alt: "Прибор со свечой и бокалом на тёмном столе",
      caption: "Место у окна",
    },
    {
      src: "/gallery/dark-editorial/de-04-detail.jpg",
      alt: "Золотая деталь на ткани слоновой кости",
      caption: "Деталь кадра",
    },
    {
      src: "/gallery/dark-editorial/de-05-roses.jpg",
      alt: "Кремовые розы в стекле при свечах",
      caption: "Цветы к вечеру",
    },
  ],
  galleryKicker: "Стиллы",
  galleryHeading: "Кадры к вечеру",
};
