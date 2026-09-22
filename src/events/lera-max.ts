import type { EventContent } from "@/content/types";

export const leraMax: EventContent = {
  templateId: "polaroid-story",
  slug: "lera-max",
  couple: {
    one: "Макс",
    two: "Лера",
  },
  kicker: "Свадьба",
  tagline: "Город, кроссовки и стопка снимков — без зала и без сценария",
  inviteLead:
    "Мы не снимаем площадку на весь вечер: гуляем по парку, пьём что попало и собираем тех, кто уже в наших полароидах.",
  inviteBody:
    "Приходите как есть. Будет двор, плед, громкая колонка и тост без микрофона. Если опоздаете — мы всё равно где-то рядом.",
  event: {
    iso: "2027-06-12T16:00:00+03:00",
    gathering: "Сбор с 15:30 у входа со стороны Крымского Вала",
    dressCode: "Как на свидание в городе — лён, джинсы, удобная обувь",
  },
  venue: {
    name: "Парк Горького",
    address: "Москва, ул. Крымский Вал, 9",
    lat: 55.7312,
    lng: 37.6013,
    notes: "Вход со стороны Крымского Вала. Если задерживаетесь — напишите, гуляем без рассадки.",
  },
  gallery: [
    {
      src: "/gallery/polaroid-story/ps-01-park.jpg",
      alt: "Макс и Лера на скамейке в парке летним днём",
      caption: "Скамейка наша",
    },
    {
      src: "/gallery/polaroid-story/ps-02-rings.jpg?v=4",
      alt: "Руки пары над столиком в городском кафе",
      caption: "Держим крепче",
    },
    {
      src: "/gallery/polaroid-story/ps-03-yard.jpg",
      alt: "Пара идёт по московскому двору в летней одежде",
      caption: "Двор без адреса",
    },
    {
      src: "/gallery/polaroid-story/ps-04-toast.jpg?v=2",
      alt: "Два бокала стоят на пледе в парке на закате",
      caption: "За нас",
    },
    {
      src: "/gallery/polaroid-story/ps-05-steps.jpg",
      alt: "Моментальная камера, ромашки и кеды на бетонных ступенях",
      caption: "Снимок на память",
    },
  ],
  galleryKicker: "Снимки",
  galleryHeading: "Как мы",
};
