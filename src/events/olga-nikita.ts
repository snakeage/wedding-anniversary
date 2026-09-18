import type { EventContent } from "@/content/types";

export const olgaNikita: EventContent = {
  templateId: "garden-daylight",
  slug: "olga-nikita",
  couple: {
    one: "Ольга",
    two: "Никита",
  },
  kicker: "Свадьба в саду",
  tagline: "Тёплый день среди яблонь, живая музыка и ужин под открытым небом",
  inviteLead:
    "Мы собираем самых близких людей в саду, чтобы разделить этот день на открытом воздухе. Приходите лёгкими, в натуральных тканях и светлых оттенках.",
  inviteBody:
    "Уютный вечер на природе: клятвы под кронами деревьев, длинный стол на траве и танцы при закатном свете.",
  event: {
    iso: "2027-07-17T16:00:00+03:00",
    gathering: "Сбор гостей с 15:30 в яблоневом саду",
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
      src: "/gallery/garden/garden-01-morning.jpg",
      alt: "Цветочная арка в утреннем яблоневом саду",
      caption: "Утренний сад",
    },
    {
      src: "/gallery/garden/garden-02-ceremony.jpg",
      alt: "Церемония под кронами деревьев",
      caption: "Церемония в зелени",
    },
    {
      src: "/gallery/garden/garden-03-table.jpg",
      alt: "Длинный стол на траве под деревьями",
      caption: "Стол на траве",
    },
    {
      src: "/gallery/garden/garden-04-toast.jpg",
      alt: "Бокалы на закате в саду",
      caption: "Закатный тост",
    },
    {
      src: "/gallery/garden/garden-05-rings.jpg",
      alt: "Обручальные кольца на мхе и льне",
      caption: "Кольца и клятвы",
    },
  ],
  galleryKicker: "Сад",
  galleryHeading: "Свет и зелень",
};
