import type { EventContent } from "@/content/types";

export const levVera: EventContent = {
  templateId: "gold-deco",
  slug: "lev-vera",
  couple: {
    one: "Лев",
    two: "Вера",
  },
  kicker: "Ночной банкет",
  tagline: "Латунь, симметрия и один тост",
  inviteLead:
    "Зовём в Колонный зал, когда люстры уже зажжены, а зал ещё пуст.",
  inviteBody:
    "Чёрный и латунь. Короткий ужин, один танец и тост без сцены. Если опоздаете — мы у колонн у входа.",
  event: {
    iso: "2027-11-20T19:00:00+03:00",
    gathering: "Сбор с 18:30 у парадного входа",
    dressCode: "Чёрный и латунь — длинный силуэт, без блёсток на ткани",
  },
  venue: {
    name: "Колонный зал Дома Союзов",
    address: "Москва, ул. Большая Дмитровка, 1",
    lat: 55.7596,
    lng: 37.6176,
    notes: "Вход с Большой Дмитровки. Гардероб слева от колонн.",
  },
  galleryKicker: "Зал",
  galleryHeading: "Симметрия вечера",
  gallery: [
    {
      src: "/gallery/gold-deco/gd-hero-hall.jpg",
      alt: "Колонный зал с зажжённой хрустальной люстрой до прихода гостей",
      caption: "Зал ещё пуст",
    },
    {
      src: "/gallery/gold-deco/gd-00-couple.jpg",
      alt: "Лев и Вера по центру под люстрой в банкетном зале",
      caption: "Лев и Вера",
    },
    {
      src: "/gallery/gold-deco/gd-01-rings.jpg",
      alt: "Два обручальных кольца на чёрном лаке, блик латуни",
      caption: "На чёрном лаке",
    },
    {
      src: "/gallery/gold-deco/gd-02-table.jpg",
      alt: "Банкетный стол сверху: приборы стоят зеркально",
      caption: "Стол зеркалом",
    },
    {
      src: "/gallery/gold-deco/gd-03-stairs.jpg",
      alt: "Мраморная лестница и геометрический пол в латунном свете",
      caption: "Мрамор и латунь",
    },
    {
      src: "/gallery/gold-deco/gd-04-guests.jpg",
      alt: "Гости вечера в смокингах и платьях поднимают бокалы с шампанским",
      caption: "Один тост",
    },
  ],
};
