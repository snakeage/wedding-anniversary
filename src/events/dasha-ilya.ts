import type { EventContent } from "@/content/types";

export const dashaIlya: EventContent = {
  templateId: "winter-frost",
  slug: "dasha-ilya",
  couple: {
    one: "Илья",
    two: "Даша",
  },
  kicker: "Зимняя свадьба",
  tagline: "Иней на стекле и свечи внутри",
  inviteLead:
    "Зовём в оранжерею, когда за окном уже темно, а внутри ещё держат тепло.",
  inviteBody:
    "Пальто можно оставить у входа. Будет короткий ужин, тихая музыка и тост без сцены. Если опоздаете — мы всё равно за столом.",
  event: {
    iso: "2027-01-23T17:00:00+03:00",
    gathering: "Сбор с 16:30 у главного входа",
    dressCode: "Тёплое и спокойное — шерсть, шёлк, без блёсток",
  },
  venue: {
    name: "Оранжерея в Кусково",
    address: "Москва, ул. Юности, 2",
    lat: 55.7355,
    lng: 37.8078,
    notes: "Если идёт снег, идите по освещённой аллее. Опоздание не страшно.",
  },
  gallery: [
    {
      src: "/gallery/winter-frost/wf-hero-snow.jpg?v=3",
      alt: "Илья и Даша в снегу у оранжереи, стёкла горят свечами, на рамах иней",
      caption: "Встретим вас в снегу",
    },
    {
      src: "/gallery/winter-frost/wf-01-glass.jpg?v=3",
      alt: "Илья и Даша за свечным столом, за стеклом снег и иней",
      caption: "Скажем да при свечах",
    },
    {
      src: "/gallery/winter-frost/wf-02-alley.jpg?v=2",
      alt: "Пара идёт по снежной аллее к горящей оранжерее",
      caption: "Идите к нам по снегу",
    },
    {
      src: "/gallery/winter-frost/wf-03-hands.jpg",
      alt: "Две руки в шерстяных рукавах рядом со свечой",
      caption: "Держим друг друга",
    },
    {
      src: "/gallery/winter-frost/wf-04-frost.jpg?v=2",
      alt: "Иней на стекле, за ним тёплый зал со свечами и белыми цветами",
      caption: "За стеклом уже праздник",
    },
    {
      src: "/gallery/winter-frost/wf-05-supper.jpg?v=2",
      alt: "Стол на двоих изнутри: приборы, свечи и белые цветы, за окном снег",
      caption: "Стол накрыт для вас",
    },
  ],
};
