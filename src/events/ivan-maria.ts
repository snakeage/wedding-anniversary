import type { EventContent } from "@/content/types";

export const ivanMaria: EventContent = {
  templateId: "paper-envelope",
  slug: "ivan-maria",
  couple: {
    one: "Иван",
    two: "Мария",
  },
  kicker: "Свадьба",
  tagline: "Будем рады видеть вас в этот день",
  inviteLead:
    "В этот день нам важно быть рядом с теми, кто шёл с нами все эти годы.",
  inviteBody:
    "Без строгого регламента: ужин, разговоры и тёплый вечер. Приходите такими, какие вы есть.",
  event: {
    iso: "2026-11-21T15:00:00+03:00",
    timeLabel: "15:00",
    gathering: "Сбор гостей с 14:30",
    dressCode: "Smart casual",
  },
  venue: {
    name: "Зал «Свет»",
    address: "Москва, Пятницкая ул., 10",
    lat: 55.7432,
    lng: 37.6285,
    notes: "Парковка у здания. Если задерживаетесь — напишите нам.",
  },
  gallery: [
    {
      src: "/gallery/gallery-01-champagne.jpg",
      alt: "Бокалы шампанского при свечах",
      caption: "Начало нашей истории",
    },
    {
      src: "/gallery/gallery-02-roses.jpg",
      alt: "Кремовые и бордовые розы",
      caption: "Дом, который собираем вместе",
    },
    {
      src: "/gallery/gallery-03-envelope.jpg",
      alt: "Конверт с сургучной печатью",
      caption: "Письма и поездки",
    },
    {
      src: "/gallery/gallery-04-table.jpg",
      alt: "Накрытый стол на двоих",
      caption: "Ужины как традиция",
    },
    {
      src: "/gallery/gallery-05-rings.jpg",
      alt: "Обручальные кольца на шёлке",
      caption: "Выбираем друг друга",
    },
    {
      src: "/gallery/gallery-06-hall.jpg",
      alt: "Вечерний зал ресторана",
      caption: "Празднуем с вами",
    },
  ],
};
