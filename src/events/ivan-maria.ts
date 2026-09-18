import type { EventContent } from "@/content/types";

export const ivanMaria: EventContent = {
  templateId: "paper-envelope",
  slug: "ivan-maria",
  couple: {
    one: "Иван",
    two: "Мария",
  },
  kicker: "Свадьба",
  tagline: "Ждём вас в этот день — письмо и стол для своих",
  inviteLead:
    "В этот день нам важно быть рядом с теми, кто шёл с нами все эти годы.",
  inviteBody:
    "Тёплый вечер: ужин, разговоры и тост за то, что мы выбираем друг друга. Приходите такими, какие вы есть.",
  event: {
    iso: "2026-11-21T15:00:00+03:00",
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
      src: "/gallery/paper-envelope/pe-01-envelope.jpg",
      alt: "Кремовый конверт с бордовой сургучной печатью",
      caption: "Письмо вместо открытки",
    },
    {
      src: "/gallery/paper-envelope/pe-02-rings.jpg",
      alt: "Обручальные кольца на шёлке",
      caption: "Выбираем друг друга",
    },
    {
      src: "/gallery/paper-envelope/pe-03-table.jpg",
      alt: "Стол на двоих со свечами и розами",
      caption: "Ужины как традиция",
    },
    {
      src: "/gallery/paper-envelope/pe-04-bouquet.jpg",
      alt: "Букет кремовых и розовых роз на стуле",
      caption: "Дом, который собираем вместе",
    },
    {
      src: "/gallery/paper-envelope/pe-05-hall.jpg",
      alt: "Небольшой свадебный зал с круглым столом",
      caption: "Празднуем с вами",
    },
  ],
  galleryKicker: "Письмо",
  galleryHeading: "Наша история",
};
