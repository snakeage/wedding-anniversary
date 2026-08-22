export const content = {
  couple: {
    one: "Анна",
    two: "Дмитрий",
  },
  kicker: "Годовщина свадьбы",
  tagline: "Приглашаем разделить с нами этот вечер",
  inviteLead:
    "В этот вечер мы хотим быть рядом с теми, кто шёл с нами все эти годы — тихо, светло и по-настоящему.",
  inviteBody:
    "Без громких речей и строгого регламента: ужин, разговоры, музыка и немного золота в воздухе. Приходите такими, какие вы есть.",
  event: {
    iso: "2026-10-17T16:00:00+03:00",
    timeLabel: "16:00",
    gathering: "Сбор гостей с 15:30",
    dressCode: "Evening cocktail — кремовые, бордовые и золотистые оттенки",
  },
  venue: {
    name: "Ресторан «Сады»",
    address: "Москва, ул. Волхонка, 15",
    lat: 55.7446,
    lng: 37.6055,
    notes: "Парковка у здания. Если задерживаетесь — напишите нам, стол подождёт.",
  },
  gallery: [
    {
      src: "/gallery/gallery-01-champagne.jpg",
      alt: "Бокалы шампанского при свечах",
      caption: "2012 — день, с которого всё началось",
    },
    {
      src: "/gallery/gallery-02-roses.jpg",
      alt: "Кремовые и бордовые розы",
      caption: "2015 — дом, который мы собрали вместе",
    },
    {
      src: "/gallery/gallery-03-envelope.jpg",
      alt: "Конверт с сургучной печатью",
      caption: "2018 — письма, поездки и маленькие ритуалы",
    },
    {
      src: "/gallery/gallery-04-table.jpg",
      alt: "Накрытый стол на двоих",
      caption: "2021 — ужины, которые стали традицией",
    },
    {
      src: "/gallery/gallery-05-rings.jpg",
      alt: "Обручальные кольца на шёлке",
      caption: "2024 — всё ещё выбираем друг друга",
    },
    {
      src: "/gallery/gallery-06-hall.jpg",
      alt: "Вечерний зал ресторана",
      caption: "2026 — празднуем с вами",
    },
  ],
} as const;

export type Content = typeof content;
export type GalleryItem = (typeof content.gallery)[number];
