import type { ComponentType } from "react";
import type { EventContent, TemplateId } from "@/content/types";
import { DarkEditorial } from "@/templates/dark-editorial/DarkEditorial";
import { GardenDaylight } from "@/templates/garden-daylight/GardenDaylight";
import { GoldDeco } from "@/templates/gold-deco/GoldDeco";
import { MinimalSwiss } from "@/templates/minimal-swiss/MinimalSwiss";
import { PaperEnvelope } from "@/templates/paper-envelope/PaperEnvelope";
import { PolaroidStory } from "@/templates/polaroid-story/PolaroidStory";
import { QuietLuxury } from "@/templates/quiet-luxury/QuietLuxury";
import { Seaside } from "@/templates/seaside/Seaside";
import { WinterFrost } from "@/templates/winter-frost/WinterFrost";

type TemplateComponent = ComponentType<{ event: EventContent; preview?: boolean }>;

export const templates: Record<TemplateId, TemplateComponent> = {
  "quiet-luxury": QuietLuxury,
  "paper-envelope": PaperEnvelope,
  "dark-editorial": DarkEditorial,
  "garden-daylight": GardenDaylight,
  "polaroid-story": PolaroidStory,
  "winter-frost": WinterFrost,
  "minimal-swiss": MinimalSwiss,
  "gold-deco": GoldDeco,
  "seaside": Seaside,
};

export function resolveTemplate(templateId: TemplateId): TemplateComponent {
  const Template = templates[templateId];
  if (!Template) {
    throw new Error(`Unknown templateId: ${templateId}`);
  }
  return Template;
}
