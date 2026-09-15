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
      caption: "За столом, без спешки",
    },
    {
      src: "/gallery/gallery-02-roses.jpg",
      alt: "Кремовые и бордовые розы",
      caption: "Цветы к вечеру",
    },
    {
      src: "/gallery/gallery-03-envelope.jpg",
      alt: "Конверт с сургучной печатью",
      caption: "Письмо вместо открытки",
    },
    {
      src: "/gallery/gallery-04-table.jpg",
      alt: "Накрытый стол",
      caption: "Ужин для своих",
    },
    {
      src: "/gallery/gallery-05-rings.jpg",
      alt: "Золото на шёлке",
      caption: "Немного блеска",
    },
    {
      src: "/gallery/gallery-06-hall.jpg",
      alt: "Вечерний зал ресторана",
      caption: "Празднуем вместе",
    },
  ],
  galleryKicker: "Вечер",
  galleryHeading: "Кадры к празднику",
};
