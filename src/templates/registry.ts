import type { ComponentType } from "react";
import type { EventContent, TemplateId } from "@/content/types";
import { DarkEditorial } from "@/templates/dark-editorial/DarkEditorial";
import { GardenDaylight } from "@/templates/garden-daylight/GardenDaylight";
import { PaperEnvelope } from "@/templates/paper-envelope/PaperEnvelope";
import { PolaroidStory } from "@/templates/polaroid-story/PolaroidStory";
import { QuietLuxury } from "@/templates/quiet-luxury/QuietLuxury";

type TemplateComponent = ComponentType<{ event: EventContent; preview?: boolean }>;

export const templates: Record<TemplateId, TemplateComponent> = {
  "quiet-luxury": QuietLuxury,
  "paper-envelope": PaperEnvelope,
  "dark-editorial": DarkEditorial,
  "garden-daylight": GardenDaylight,
  "polaroid-story": PolaroidStory,
};

export function resolveTemplate(templateId: TemplateId): TemplateComponent {
  const Template = templates[templateId];
  if (!Template) {
    throw new Error(`Unknown templateId: ${templateId}`);
  }
  return Template;
}
