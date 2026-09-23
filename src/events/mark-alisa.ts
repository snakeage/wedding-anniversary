import type { EventContent } from "@/content/types";

export const markAlisa: EventContent = {
  templateId: "minimal-swiss",
  slug: "mark-alisa",
  couple: {
    one: "Марк",
    two: "Алиса",
  },
  kicker: "Городская свадьба",
  tagline: "Архитектура, чистые линии и близкие люди",
  inviteLead:
    "Сначала распишемся в Грибоедовском ЗАГСе, затем соберёмся на ужин и вино в «Рихтере».",
  inviteBody:
    "Без пышных церемоний, ведущих и длинных тостов. Только хорошая кухня, любимая музыка и спокойный разговор за длинным столом.",
  event: {
    iso: "2027-05-15T14:00:00+03:00",
    gathering: "14:00 — роспись в ЗАГСе, 16:30 — сбор в «Рихтере»",
    dressCode: "Архитектурный минимализм — чёрный, белый, графит, строгие силуэты",
  },
  venue: {
    name: "Особняк и ресторан «Рихтер»",
    address: "Москва, ул. Пятницкая, 42",
    lat: 55.7381,
    lng: 37.6288,
    notes: "Вход через ворота во внутренний двор. Парковка на Климентовском или в Ордынском тупике.",
  },
  galleryKicker: "Хроника дня",
  galleryHeading: "Кадры нашего города",
  gallery: [
    {
      src: "/gallery/minimal-swiss/swiss-hero-couple.jpg",
      alt: "Марк и Алиса у современного архитектурного фасада",
      caption: "Вместе",
    },
    {
      src: "/gallery/minimal-swiss/swiss-01-registry.jpg",
      alt: "Подписание свидетельства о браке в зале регистрации",
      caption: "14:00 · Роспись",
    },
    {
      src: "/gallery/minimal-swiss/swiss-02-bouquet.jpg",
      alt: "Скульптурный букет из белых калл на бетонном постаменте",
      caption: "Детали",
    },
    {
      src: "/gallery/minimal-swiss/swiss-03-city.jpg",
      alt: "Марк и Алиса идут по весенней Москве",
      caption: "Прогулка по городу",
    },
    {
      src: "/gallery/minimal-swiss/swiss-04-rings.jpg",
      alt: "Матовые обручальные кольца на архитектурном бетоне",
      caption: "Кольца",
    },
    {
      src: "/gallery/minimal-swiss/swiss-05-dinner.jpg",
      alt: "Сервировка стола со свечами и бокалами в залах Рихтера",
      caption: "16:30 · Ужин",
    },
  ],
};
