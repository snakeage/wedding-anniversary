import type { EventContent } from "@/content/types";

export const sofia: EventContent = {
  templateId: "quiet-luxury",
  slug: "sofia",
  couple: {
    one: "София",
  },
  kicker: "День рождения",
  tagline: "Приглашаю разделить со мной этот вечер",
  inviteLead:
    "В этот вечер хочу быть рядом с теми, кто делает жизнь теплее — тихо, светло и по-настоящему.",
  inviteBody:
    "Ужин, разговоры, музыка и немного золота в воздухе. Приходите такими, какие вы есть.",
  event: {
    iso: "2026-10-17T16:00:00+03:00",
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
      src: "/gallery/quiet-luxury/ql-01-candles.jpg",
      alt: "Бокалы и свечи на кремовом льне",
      caption: "Свечи к вечеру",
    },
    {
      src: "/gallery/quiet-luxury/ql-02-cake.jpg",
      alt: "Кремовый торт с одной свечой",
      caption: "Тихий торт",
    },
    {
      src: "/gallery/quiet-luxury/ql-03-roses.jpg",
      alt: "Кремовые и бордовые розы",
      caption: "Цветы к празднику",
    },
    {
      src: "/gallery/quiet-luxury/ql-04-table.jpg",
      alt: "Камерный стол на двоих в свете свечей",
      caption: "Ужин для своих",
    },
    {
      src: "/gallery/quiet-luxury/ql-05-room.jpg",
      alt: "Тёплый зал с люстрами и бордовыми шторами",
      caption: "Празднуем вместе",
    },
  ],
  galleryKicker: "Вечер",
  galleryHeading: "Кадры к празднику",
};
