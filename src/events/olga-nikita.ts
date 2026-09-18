import type { EventContent } from "@/content/types";

export const olgaNikita: EventContent = {
  templateId: "garden-daylight",
  slug: "olga-nikita",
  couple: {
    one: "Ольга",
    two: "Никита",
  },
  kicker: "Выездная церемония",
  tagline: "Ждём вас в саду — при дневном свете, без зала и без позолоты",
  inviteLead:
    "Церемония под открытым небом, короткий ужин в тени и много воздуха. Приходите лёгкими, в натуральных тканях.",
  inviteBody:
    "Без ведущего и без строгого тайминга: сад, слова друг другу, стол на траве. Если будет солнце — тем лучше.",
  event: {
    iso: "2027-07-17T16:00:00+03:00",
    gathering: "Сбор гостей с 15:30 у входа в парк",
    dressCode: "Garden formal — лён, хлопок, светлые и зелёные оттенки",
  },
  venue: {
    name: "Парк «Коломенское»",
    address: "Москва, проспект Андропова, 39",
    lat: 55.667,
    lng: 37.671,
    notes: "Вход со стороны набережной. Если задерживаетесь — напишите, церемонию не сдвигаем.",
  },
  gallery: [
    {
      src: "/gallery/gallery-02-roses.jpg",
      alt: "Цветы в дневном свете",
      caption: "Перед церемонией",
    },
    {
      src: "/gallery/gallery-06-hall.jpg",
      alt: "Светлый зал у окон",
      caption: "Тень после сада",
    },
    {
      src: "/gallery/gallery-04-table.jpg",
      alt: "Накрытый стол",
      caption: "Стол на воздухе",
    },
    {
      src: "/gallery/gallery-01-champagne.jpg",
      alt: "Бокалы при свете",
      caption: "Тост в саду",
    },
    {
      src: "/gallery/gallery-05-rings.jpg",
      alt: "Кольца на ткани",
      caption: "Без блеска",
    },
  ],
  galleryKicker: "Сад",
  galleryHeading: "Свет и зелень",
};
