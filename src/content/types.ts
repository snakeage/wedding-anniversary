export const TEMPLATE_IDS = [
  "quiet-luxury",
  "paper-envelope",
  "dark-editorial",
  "garden-daylight",
  "polaroid-story",
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];

export const GALLERY_MAX = 6;

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
};

export type EventContent = {
  templateId: TemplateId;
  slug: string;
  couple: {
    one: string;
    two?: string;
  };
  kicker: string;
  tagline: string;
  inviteLead: string;
  inviteBody: string;
  event: {
    iso: string;
    gathering: string;
    dressCode: string;
  };
  venue: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    notes: string;
  };
  gallery: GalleryItem[];
  galleryKicker?: string;
  galleryHeading?: string;
};
