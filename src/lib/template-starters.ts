import type { GalleryItem, TemplateId } from "@/content/types";
import { ilyaDasha } from "@/events/ilya-dasha";
import { ivanMaria } from "@/events/ivan-maria";
import { kira } from "@/events/kira";
import { maxLera } from "@/events/max-lera";
import { markAlisa } from "@/events/mark-alisa";
import { nikitaOlga } from "@/events/nikita-olga";
import { sofia } from "@/events/sofia";
import { levVera } from "@/events/lev-vera";

export type TemplateStarter = {
  kicker: string;
  tagline: string;
  inviteLead: string;
  inviteBody: string;
  galleryKicker: string;
  galleryHeading: string;
  gallery: GalleryItem[];
};

function fromDemo(event: {
  kicker: string;
  tagline: string;
  inviteLead: string;
  inviteBody: string;
  galleryKicker?: string;
  galleryHeading?: string;
  gallery: GalleryItem[];
}): TemplateStarter {
  return {
    kicker: event.kicker,
    tagline: event.tagline,
    inviteLead: event.inviteLead,
    inviteBody: event.inviteBody,
    galleryKicker: event.galleryKicker ?? "",
    galleryHeading: event.galleryHeading ?? "",
    gallery: event.gallery.map((item) => ({ ...item })),
  };
}

const STARTERS: Record<TemplateId, TemplateStarter> = {
  "quiet-luxury": fromDemo(sofia),
  "paper-envelope": fromDemo(ivanMaria),
  "dark-editorial": fromDemo(kira),
  "garden-daylight": fromDemo(nikitaOlga),
  "polaroid-story": fromDemo(maxLera),
  "winter-frost": fromDemo(ilyaDasha),
  "minimal-swiss": fromDemo(markAlisa),
  "gold-deco": fromDemo(levVera),
};

export function templateStarters(id: TemplateId): TemplateStarter {
  return STARTERS[id];
}
