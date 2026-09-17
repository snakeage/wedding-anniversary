export const TEMPLATE_IDS = ["quiet-luxury", "paper-envelope"] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];

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
