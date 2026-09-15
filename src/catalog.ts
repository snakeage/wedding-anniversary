import { TEMPLATE_IDS, type TemplateId } from "@/content/types";
import { getEventBySlug } from "@/events";

export type LiveSkin = {
  id: TemplateId;
  name: string;
  audience: string;
  difference: string;
  demoSlug: string;
};

export type SoonSkin = {
  id: string;
  name: string;
  audience: string;
};

function liveSkin(skin: LiveSkin): LiveSkin {
  if (!TEMPLATE_IDS.includes(skin.id)) {
    throw new Error(`catalog: unknown templateId ${skin.id}`);
  }
  const event = getEventBySlug(skin.demoSlug);
  if (!event) {
    throw new Error(`catalog: missing demo event ${skin.demoSlug}`);
  }
  if (event.templateId !== skin.id) {
    throw new Error(
      `catalog: ${skin.id} demo ${skin.demoSlug} is ${event.templateId}`,
    );
  }
  return skin;
}

export const liveSkins: LiveSkin[] = [
  liveSkin({
    id: "quiet-luxury",
    name: "Quiet luxury",
    audience: "День рождения",
    difference: "Крем, бордо, золото; WebGL-шёлк и зерно; editorial-скролл",
    demoSlug: "sofia",
  }),
  liveSkin({
    id: "paper-envelope",
    name: "Paper envelope",
    audience: "Классическая свадьба",
    difference: "Конверт с сургучом открывается в бумажную карточку; мало motion",
    demoSlug: "ivan-maria",
  }),
];

export const soonSkins: SoonSkin[] = [
  { id: "dark-editorial", name: "Dark editorial", audience: "Вечерний гала, fashion" },
  { id: "garden-daylight", name: "Garden daylight", audience: "Выездная церемония" },
  { id: "minimal-swiss", name: "Minimal Swiss", audience: "ЗАГС, design-аудитория" },
  { id: "polaroid-story", name: "Polaroid story", audience: "Молодая пара" },
  { id: "gold-deco", name: "Gold deco", audience: "Формальный банкет" },
  { id: "winter-frost", name: "Winter frost", audience: "Новый год, зимняя свадьба" },
  { id: "seaside", name: "Seaside", audience: "Destination, море" },
  { id: "kids-birthday", name: "Kids birthday", audience: "Детский праздник" },
  { id: "corporate-evening", name: "Corporate evening", audience: "Корпоративный ужин" },
  { id: "folk-linen", name: "Folk linen", audience: "Деревня, традиция" },
  { id: "neon-night", name: "Neon night", audience: "Клуб, afterparty" },
  { id: "watercolor", name: "Watercolor", audience: "Мягкий романтический тон" },
  { id: "newspaper", name: "Newspaper", audience: "Город, с иронией" },
  { id: "zen-stone", name: "Zen stone", audience: "Камерный вечер" },
  { id: "vintage-film", name: "Vintage film", audience: "Ностальгия" },
  { id: "tropical", name: "Tropical", audience: "Летняя вилла" },
  { id: "sacred-minimal", name: "Sacred minimal", audience: "Церковь / храм" },
  { id: "afterparty-ticket", name: "Afterparty ticket", audience: "Второе событие, клуб" },
];
