import type { GalleryItem, TemplateId } from "@/content/types";
import { ivanMaria } from "@/events/ivan-maria";
import { kira } from "@/events/kira";
import { olgaNikita } from "@/events/olga-nikita";
import { sofia } from "@/events/sofia";

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
  "garden-daylight": fromDemo(olgaNikita),
};

export function templateStarters(id: TemplateId): TemplateStarter {
  return STARTERS[id];
}
